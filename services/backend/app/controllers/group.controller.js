const Group = require('../models/group.model');
const Result = require('../models/result.model');
const Event = require('../models/event.model');
const AcademicYearRef = require("../models/academic_year_ref.model");

exports.getGroup = async (req, res) => { // Action for geting single group 
    let group = await Group.findById(req.params.groupId, ['trainees'])
        .populate({path: "trainees", select: ['name', 'surname'], options: { sort: { 'name': 1 } } })
    if (!group) res.status(404).send({ message: "Not found." });
    else res.status(200).json(group);
};

exports.getTraineesSubjectsAverages = async (req, res) => {
    const groupId = req.params.groupId;
    const periodId = req.params.periodId||req.selectedPeriod
    let academicYear = await AcademicYearRef.findOne({"periods._id": periodId}, ['periods']).exec();
    let period = academicYear.periods.id(periodId)
    
    let group = await Group.findById(groupId)
        .populate([
            { path: "trainees", select: ['name', 'surname'] },
            { path: "program.duplicatedTrainingPath" }
        ])
    if (!group) res.status(404).send({ message: "Group Not found" });
    else {
        let program = group.program.find(x=>x.period==periodId);
        let subjectIds = (group.classManager.equals(req.userId) || group.trainees.filter(x=>x._id.equals(req.userId)) )? 
                            program.assignment.map(z=>z.trainingModule).flat():
                            program.assignment.filter(z=>z.trainers.find(t=>t.equals(req.userId))).map(a=>a.trainingModule).flat()
        let events = await Event.find({
                assignedGroup: groupId,
                assignedSubject: subjectIds,
                eventType: 'Exam', 
                date: { $gte: period.startDate, $lte: period.endDate }
            })
        let event_subject_network = subjectIds.map(x=>{
            let sub = program.duplicatedTrainingPath.trainingModules.find(tm=>tm.originalTrainingModule.equals(x))
            return {
                subject: {_id: sub?.originalTrainingModule||x , name: sub?.newName||"subject not found"},
                events: events.filter(e=>e.assignedSubject.equals(x)).map(y=>y._id)
            }
        })
        let grades = await Result.find({
                user: group.trainees.map(x=>x._id),
                event: events.map(x=>x._id)
            })
        let data = {
            subjects: event_subject_network.map(s=>s.subject),
            trainees: group.trainees.map(trainee=>{
                return {
                    _id: trainee._id,
                    name: trainee.name,
                    surname: trainee.surname,
                    subjectsAverages: event_subject_network.map(esn=>{
                        let subjectGrades = grades.filter(g=>(!!esn.events.find(e=>e.equals(g.event)) && g.user.equals(trainee._id)))
                        subjectGrades = JSON.parse(JSON.stringify(subjectGrades))
                        subjectGrades = subjectGrades.map(r=>({...r, coefficient: (events.find(e=>e._id.equals(r.event)))?.examCoefficient||1})).filter(x=>(x.published||!!!x.content)&&x.grade!='-')
                        return {
                            subjectId: esn.subject._id,
                            average: subjectGrades?.length>0? Number(subjectGrades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)*i.coefficient+s),0)/(subjectGrades.reduce((s2,i2)=>(i2.coefficient+s2),0))).toFixed(2): 0
                        }
                    })
                }
            })
        }
        res.status(200).json(data);
    }    
};