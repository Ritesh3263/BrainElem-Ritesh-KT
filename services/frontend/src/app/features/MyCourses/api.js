import {eliaAPI} from "services/axiosSettings/axiosSettings";
import {now} from "moment";
import EventService from "services/event.service";

const API_ROUTE = 'subject_session';

const getAll = async (offset=0, limit=10) => {
    // offset and limit for query
    try{
        const {data} = await eliaAPI.get(`${API_ROUTE}/readAll`);
        return data;
    }catch(error){
        return error.message;
    }
};

const getItem = async (itemId) => {
    const subjectSession = (await eliaAPI.get(`${API_ROUTE}/read/${itemId}`)).data;
    let program = subjectSession.group.program.find(p => p.assignment.find(a => a.trainingModule.toString() === subjectSession.trainingModule._id.toString()));
    let assignment = program.assignment.find(a => a.trainingModule.toString() === subjectSession.trainingModule._id.toString())
    let homeworks = (await EventService.getHomeworks(subjectSession.trainingModule._id)).data;
    let exams = (await EventService.getExams(subjectSession.trainingModule._id)).data;
    let events = (await EventService.getEvents(subjectSession.trainingModule._id)).data;
    let period = (await eliaAPI.get(`${API_ROUTE}/getPeriod/${subjectSession.period||program.period}`)).data;
    return await new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                status: 200,
                data: {
                    _id: subjectSession.trainingModule?._id,
                    program: program,
                    group: subjectSession.group,
                    trainees: subjectSession.group.trainees,
                    gradebook:{},
                    schedule:{
                        events,
                    },
                    examinate:{
                        exams,
                        homeworks,
                    },
                    information:{
                        progress: 0,
                        name: subjectSession.trainingModule?.name,
                        description: subjectSession.details?.[0]?.description,
                        subjectSessionId: subjectSession._id,
                        image: subjectSession.image,
                        level: subjectSession.group.level,
                        period: period.name,
                        trainers:assignment?.trainers,
                    },
                }
            })
        },30);
    });
};

const getItemDetails = async ({itemId,type}) => {
    switch(type){
        case 'STUDENT':{
            return eliaAPI.get(`${API_ROUTE}/readTrainee/${itemId}`)
        }
        case 'PROGRAM':{
            return eliaAPI.get(`${API_ROUTE}/readProgram/${itemId}`)
        }
        case 'BASE_PROGRAM':{
            return eliaAPI.get(`${API_ROUTE}/readBaseProgram/${itemId}`)
        }
        case 'EXAM_HOMEWORK':{
            return eliaAPI.put(`${API_ROUTE}/getExamHomeworkDetails`,itemId)
        }
        case 'GRADEBOOK':{
            return eliaAPI.put(`${API_ROUTE}/readGradebook`,itemId)
        }
        default: break;
    }

};

const getChapters= async (trainingModuleId)=>{
    return eliaAPI.get(`chapters/get-chapters/${trainingModuleId}`);
}

const getContents= async({type, userId, chapterId})=>{
    switch (type){
        case 'PUBLIC':{
            return eliaAPI.get(`library/getAllPublicContents`);
        }
        case 'PRIVATE':{
            return eliaAPI.get(`library/private/${userId}`);
        }
        case 'LIBRARY_CHAPTER':{
            return eliaAPI.get(`chapters/get-content/${chapterId}`);
        }
        default: break;
    }
}

const myCoursesService = {
    getAll,
    getItem,
    getItemDetails,
    getChapters,
    getContents,
}
export default myCoursesService;