import {eliaAPI} from "./axiosSettings/axiosSettings";
import {now} from "moment";
import LogService from "./log.service";
import ContentService from "./content.service";
import UserService from "./user.service";
import EventService from "./event.service";
import CertificationSessionService from "./certification_session.service";

const API_ROUTE = 'dashboard_stats'; // I think we can keep all stats in new controller


const readAssistance= () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                status: 200,
                data:
                    [{
                        _id: "78yf97erf",
                        title:"Grade book",
                        description:"Check all grades from all subjects in one place",
                        url: "/gradebooks-main"
                    },{
                        _id: "78erytge",
                        title:"Create content",
                        description:"Make your own content with our amazing tools, Enjoy!",
                        url: "/create-content",
                    },{
                        _id: "8g9r9tg",
                        title:"Browse content",
                        description:"Click here and open courses which Amelia suggested for you",
                        url: "/explore"
                    },{
                        _id: "8g9r9t1",
                        title:"Library",
                        description:"Click here to open cloud and see your content immediately",
                        url: "/my-library"
                    }]
            })
        },10)
    })
};

const readTipsForLearning = async () => {
    // let tip =  (await UserService.getTip())
    // console.log(tip['data'], "kamil123");
    // const _lastTip =[
    //     {
    //         _id: tip._id, // TODO
    //         title: tip.text,
    //         description: tip.reasoning
    //     }];
    //     return new Promise((resolve, reject)=>{
    //         setTimeout(()=>{
    //             resolve({
    //                 status: 200,
    //                 data: [..._lastTip]
    //             })
    //         },10)
    //     });
    
};

const readTasks= async (type) => {

// EventService.readEvents()

    if(type === 'HOMEWORKS'){
        return EventService.getHomeworks();
    } else if(type === "COGNITIVE"){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:
                    [
                    {
                        _id: '78fgter78fg',
                        title:'Cognitive 1',
                        sessionName:'Session name 1',
                        dueDate: new Date(now()).toISOString(),
                    },{
                        _id: 'g6ergter6ge',
                        title:'Cognitive 2',
                        sessionName:'Session name 2',
                        dueDate: new Date(now()).toISOString(),
                    },{
                        _id: '8g9wr8tgr',
                        title:'Cognitive 3',
                        sessionName:'Session name 3',
                        dueDate: new Date(now()).toISOString(),
                    }
                ]
                })
            },10)
        });
    }else if(type === "EXAMS"){
        return EventService.getExamEventsforTeacher();
    }
};

const readPerformance = async (userId, role, type) => {
    // TODO: create single request controller function to get all the data
    // get student Id here to pass in the request
    let logByDay = (await LogService.logByDay(7)).data
    let tip = (await UserService.getTip(userId)).data
    let receivedCertifications = (await CertificationSessionService.countReceivedCertifications(userId)).data.count
    let countFinishedSessions = (await CertificationSessionService.countFinishedSessions(userId)).data.count
    

    //content counting
    let contentInfo = (await LogService.averageContentCreationTime()).data
    let countContentAcceptedByLibrarian = (await ContentService.countContentAcceptedByLibrarian()).data
    let countLessons = (await ContentService.countLessons()).data.count
    let countTests = (await ContentService.countTests()).data.count
    let countAllContent = countLessons + countTests

    // events counting
    let countOnlineClasses = (await EventService.countOnlineClasses()).data.count
    let countExams = (await EventService.countExams()).data.count
    let countHomeworks = (await EventService.countHomeworks()).data.count
    let countAllEvents = countOnlineClasses + countExams + countHomeworks
    let numberOfUpcomingEvents = (await EventService.numberOfUpcomingEvents()).data.length
    // events in whole module
    let countOnlineClassesInModule = (await EventService.countOnlineClassesInModule()).data.count
    let countExamsInModule = (await EventService.countExamsInModule()).data.count
    let countHomeworksInModule = (await EventService.countHomeworksInModule()).data.count
    let countAllEventsInModule = countOnlineClassesInModule + countExamsInModule + countHomeworksInModule
    
    // users counting
    let countAllUsers = (await UserService.countUsersInModule()).data
    let countPartners = (await UserService.countPartners()).data
    let countArchitects = (await UserService.countArchitects()).data
    let countTrainingManagers = (await UserService.countTrainingManagers()).data
    let countLibrarians = (await UserService.countLibrarians()).data
    let countTrainers = (await UserService.countTrainers()).data
    let countParents = (await UserService.countParents()).data
    let countInspectors = (await UserService.countInspectors()).data
    let countTrainees = (await UserService.countTrainees()).data
    let countCoordinators = (await UserService.countCoordinators()).data

    let totalVisitTime = Math.round(10*logByDay?.reduce((acc, log)=>acc+log.activityTimePerDay, 0)/60||0)/10
    let loginCount = logByDay.reduce((acc, log)=>acc+log.loginCount, 0)||0
    let user = JSON.parse(localStorage.user)||{}

    // Process time in second and return formated string
    function formatSeconds(time) {
        let minutes = Math.floor(time / 60)
        let seconds = Math.round(time - minutes * 60)
        return minutes ? minutes + "m" : seconds + "s";
    }

    const statisticalInfos =[
        {
            name: 'Last visit',
            info: new Date(user.prevLogin?.time||now()).toLocaleString(),
        },
        {
            name: 'Last login device type',
            info: user.prevLogin?.deviceType||'Unknown',
        },
        {
            name: 'Total #login in last 7 days',
            info: loginCount,
        },
        {
            name: 'Average visit time',
            info: Math.round(10*totalVisitTime/(loginCount||1))/10+" minutes",
        },
        {
            name: 'Total visit time',
            info: totalVisitTime+" minutes",
        },
        {
            name: 'Number of created contents',
            info: contentInfo.numberOfContents,
        },
        {
            name: 'Number of accepted contents (library)',
            info: countContentAcceptedByLibrarian.count,
        },
        {
            name: 'Average time spent on creating contents',
            info: formatSeconds(contentInfo.averageContentCreationTime), 
        },
    ];

    function filterEmptyPieChart(data){
        data[0].subItems = data[0].subItems?.filter(item=>item.grade>0)
        if(!(data[0].subItems?.length > 0)){
            data[0].subItems = [{
                grade: 0,
                name: 'No data',
                percentageValue: 0.01,
            }]
        }
        return data
    }
   
    // USERS PIE CHART
    const usersPieChart=[{
        name: 'Users',
        subItems:[
            // {name: 'Eco Manager', percentageValue: countEcoManagers/countAllUsers*100||0.01 ,grade: countEcoManagers }, 
            // {name: 'Cloud Manager', percentageValue: countCloudManagers/countAllUsers*100||0.01 ,grade: countCloudManagers }, 
            // {name: 'Network Manager', percentageValue: countNetworkManagers/countAllUsers*100||0.01 ,grade: countNetworkManagers }, 
            // {name: 'Module Manager', percentageValue: countModuleManagers/countAllUsers*100||0.01 ,grade: countModuleManagers }, 
            // {name: 'Partner', percentageValue: countPartners/countAllUsers*100||0.01 ,grade: countPartners }, 
            // {name: 'Architect', percentageValue: countArchitects/countAllUsers*100||0.01 ,grade: countArchitects }, 
            // {name: 'Training Manager', percentageValue: countTrainingManagers/countAllUsers*100||0.01 ,grade: countTrainingManagers }, 
            // {name: 'Librarian', percentageValue: countLibrarians/countAllUsers*100||0.01 ,grade: countLibrarians }, 
            {name: 'Trainer', percentageValue: countTrainers/countAllUsers*100||0.01 ,grade: countTrainers }, 
            {name: 'Parent', percentageValue: countParents/countAllUsers*100||0.01 ,grade: countParents }, 
            // {name: 'Inspector', percentageValue: countInspectors/countAllUsers*100||0.01 ,grade: countInspectors }, 
            {name: 'Trainee', percentageValue: countTrainees/countAllUsers*100||0.01 ,grade: countTrainees }, 
            // {name: 'Coordinator', percentageValue: countCoordinators/countAllUsers*100||0.01 ,grade: countCoordinators }, 
        ]
    }];

    // EVENT PIE CHART
    const eventPieChart=[{
        name: 'Event',
        subItems:[
            {name: 'Online Class',
                percentageValue: countOnlineClasses/countAllEvents*100||0.01, 
                grade: countOnlineClasses
            },
            {name: 'Exam',
                percentageValue: countExams/countAllEvents*100||0.01, 
                grade: countExams 
            },
            {name: 'Homework',
                percentageValue: countHomeworks/countAllEvents*100||0.01, 
                grade: countHomeworks 
             }
        ]
    }];


    // EVENT PIE CHART FOR MODULE
    const eventPieChartForWholeModule=[{
        name: 'Event',
        subItems:[
            {name: 'Online Class',
                percentageValue: countOnlineClassesInModule/countAllEventsInModule*100||0.01, 
                grade: countOnlineClassesInModule
            },
            {name: 'Exam',
                percentageValue: countExamsInModule/countAllEventsInModule*100||0.01, 
                grade: countExamsInModule 
            },
            {name: 'Homework',
                percentageValue: countHomeworksInModule/countAllEventsInModule*100||0.01, 
                grade: countHomeworksInModule 
             }
        ]
    }];

    // CONTENT PIE CHART
    const contentPieChart=[{
        name: 'Content',
        subItems:[
            {name: 'TEST',
                percentageValue: countTests/countAllContent*100||0.01, 
                grade: countTests 
            },
            {name: 'LESSON',
                percentageValue: countLessons/countAllContent*100||0.01, 
                grade: countLessons 
             }
        ]
    }];

    const pieChartData3=[{
        name: 'Event Pie Chart',
        subItems:[
            {name: 'Trainee',
                percentageValue: 20,
                grade: 4
            },
            {name: 'Parent',
                percentageValue: 35, 
                grade: 5
            },
            {name: 'Trainer',
                percentageValue: 45,
                grade: 6
             }
        ]
    }];
    // according to mongoDb, Sunday = 1, Monday = 2, Tuesday = 3, Wednesday = 4, Thursday = 5, Friday = 6, Saturday = 7
    const screenTime_line_char_data=['Su','M','T','W','Th','F','S'].map((day, index)=>{
        let _logByDay = logByDay.find(log=>log._id.weekDay === (index+1));
        return {
            day,
            onScreen: Math.round(10*_logByDay?.activityTimePerDay/60)/10||0,
            offScreen: Math.round(10*_logByDay?.awayTime/60)/10||0,
        }
    });
    
    const lastWeekActivity=['Su','M','T','W','Th','F','S'].map((day, index)=>{
        let _logByDay = logByDay.find(log=>log._id.weekDay === (index+1));
        return {
            day,
            activityTimePerDay: _logByDay?.activityTimePerDay??0,
            loginCount: _logByDay?.loginCount??0,
        }
    });

    if(type === 'TRAINEE'){ // trainee
        statisticalInfos.push({ 
            name: 'Number of upcoming events',
            info: receivedCertifications,
        },{
            name: 'Number of finished courses',
            info: countFinishedSessions,
        },{
            name: 'Number of total contents',
        })
        if (user.isInTrainingCenter) statisticalInfos.push({
                name: 'Number of received certificates', // training center only
                info: receivedCertifications,
            })
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:
                        {
                            selectItems:[{
                                name: 'Weekly activity',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                totalVisitTime,
                                numberOfUpcomingEvents,
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                chartType: 'bar',
                                lastWeekActivity,
                            },{
                                name: 'Content',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'pie',
                                pieChartData: filterEmptyPieChart(contentPieChart),
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            },{
                                name: 'Screen time',
                                totalVisitTime,
                                loginCount,
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                numberOfUpcomingEvents,
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'line',
                                screenTime: screenTime_line_char_data,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            }],

                        }
                })
            },10)
        });
    }
    else if(type === 'PARENT'){ // parent
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:
                        {
                            selectItems:[{
                                name: 'Weekly activity',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                totalVisitTime,
                                numberOfUpcomingEvents,
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                chartType: 'bar',
                                lastWeekActivity,
                            },{
                                name: 'Content',
                                averageVisitTime: Math.round(10*totalVisitTime/(loginCount||1))/10,
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                lastActivityDate: new Date(now()).toISOString(),
                                countAllContent,
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'pie',
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                pieChartData: filterEmptyPieChart(contentPieChart),
                            },{
                                name: 'Screen time',
                                averageVisitTime: Math.round(10*totalVisitTime/(loginCount||1))/10,
                                totalVisitTime,
                                loginCount,
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                lastActivityDate: new Date(now()).toISOString(),
                                numberOfUpcomingEvents,
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'line',
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                screenTime: screenTime_line_char_data
                            }],

                        }
                })
            },10)
        });
    }else if(type === 'TRAINER'){ //trainer
        statisticalInfos.push({ 
            name: 'Number of upcoming events',
            info: receivedCertifications,
        },{
            name: 'Number of total contents',
        })
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:
                        {
                            selectItems:[{
                                name: 'Weekly activity',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                totalVisitTime,
                                numberOfUpcomingEvents,// TODO 
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                chartType: 'bar',
                                lastWeekActivity,
                            },{
                                name: 'Event',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                numberOfUpcomingEvents,// TODO 
                                receivedCertifications,
                                countAllEvents,
                                noCertificates: receivedCertifications,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                chartType: 'pie',
                                pieChartData: filterEmptyPieChart(eventPieChart),
                            },{
                                name: 'Content',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'pie',
                                pieChartData: filterEmptyPieChart(contentPieChart),
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            },{
                                name: 'Screentime',
                                totalVisitTime,
                                loginCount,
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                numberOfUpcomingEvents,
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'line',
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                screenTime: screenTime_line_char_data,
                            }],

                        }
                })
            },10)
        });
    }else if(type === 'ARCHITECT'){ // architect
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:
                        {
                            _id:'8rgpe8rgw8e',
                            selectItems:[
                            {
                                name: 'Weekly activity',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                totalVisitTime,
                                numberOfUpcomingEvents,// TODO 
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                chartType: 'bar',
                                lastWeekActivity,
                            },
                            {
                                name: 'User',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                numberOfUpcomingEvents,// TODO 
                                receivedCertifications,
                                countAllEvents,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                noCertificates: receivedCertifications,
                                chartType: 'pie',
                                pieChartData: filterEmptyPieChart(usersPieChart),
                            },
                            {
                                name: 'Event',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                numberOfUpcomingEvents,// TODO 
                                receivedCertifications,
                                countAllEvents,
                                noCertificates: receivedCertifications,
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                chartType: 'pie',
                                pieChartData: filterEmptyPieChart(eventPieChart),
                            },{
                                name: 'Content',
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'pie',
                                pieChartData: filterEmptyPieChart(contentPieChart),
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            },{
                                name: 'Screentime',
                                totalVisitTime,
                                loginCount,
                                lastActivity: loginCount>0? 'This week': 'More than 7 days',
                                numberOfUpcomingEvents,
                                receivedCertifications,
                                noCertificates: receivedCertifications,
                                chartType: 'line',
                                statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                                screenTime: screenTime_line_char_data,
                            }],

                        }
                })
            },10)
        });
    }
    else if(['MODULEMANAGER','ASSISTANT'].includes(type)){ //modulemanager
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                status: 200,
                data:
                    {
                        _id:'8rgpe8rgw8z',
                        selectItems:[
                        {
                            name: 'Weekly activity',
                            lastActivity: loginCount>0? 'This week': 'More than 7 days',
                            totalVisitTime,
                            numberOfUpcomingEvents,// TODO 
                            receivedCertifications,
                            noCertificates: receivedCertifications,
                            statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            chartType: 'bar',
                            lastWeekActivity,
                        },
                        {
                            name: 'User',
                            lastActivity: loginCount>0? 'This week': 'More than 7 days',
                            numberOfUpcomingEvents,// TODO 
                            receivedCertifications,
                            noCertificates: receivedCertifications,
                            statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            chartType: 'pie',
                            pieChartData: filterEmptyPieChart(usersPieChart),
                        },
                        {
                            name: 'Event',
                            lastActivity: loginCount>0? 'This week': 'More than 7 days',
                            numberOfUpcomingEvents,// TODO 
                            receivedCertifications,
                            countAllEventsInModule,
                            noCertificates: receivedCertifications,
                            statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            chartType: 'pie',
                            pieChartData: filterEmptyPieChart(eventPieChartForWholeModule),
                        },{
                            name: 'Content',
                            lastActivity: loginCount>0? 'This week': 'More than 7 days',
                            receivedCertifications,
                            noCertificates: receivedCertifications,
                            chartType: 'pie',
                            pieChartData: filterEmptyPieChart(contentPieChart),
                            statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                        },{
                            name: 'Screentime',
                            totalVisitTime,
                            loginCount,
                            lastActivity: loginCount>0? 'This week': 'More than 7 days',
                            numberOfUpcomingEvents,
                            receivedCertifications,
                            noCertificates: receivedCertifications,
                            chartType: 'line',
                            statisticalInfos: statisticalInfos.sort(() => Math.random() - 0.5),
                            screenTime: screenTime_line_char_data,
                        }],

                    }
            })
        },300)
    });
}

};

const readUpcomingEvents= () => {
    return eliaAPI.get(`${API_ROUTE}/upcoming/events`);
};

const myLatestContent= () => {
    return eliaAPI.get(`${API_ROUTE}/latest/my_content`);
};

const loadContentDetails= (id) => {
    return eliaAPI.get(`${API_ROUTE}/details/content/${id}`);
};

const readLastActivity= () => {
    return eliaAPI.get(`${API_ROUTE}/latest/activities`);
};


const readAccomplishments= () => {
    return eliaAPI.get(`${API_ROUTE}/latest/my_accomplishments`);
};

const readMyLastEnquiries= () => {
    return eliaAPI.get(`${API_ROUTE}/latest/my_enquiries`);
};

const readNetworks= () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                status: 200,
                data:[
                    {
                        _id:'78gfrtog78',
                        name: 'Network 1',
                        storage:[
                            {
                                name: 'REST_VALUE',
                                value: 10,
                            },
                            {
                                name: 'Taken space',
                                value: 7.2,
                                unit: 'PB',
                            }
                        ]
                    },
                    {
                        _id:'g87ofewrgty7e',
                        name: 'Network 2',
                        storage:[
                            {
                                name: 'REST_VALUE',
                                value: 15,
                            },
                            {
                                name: 'Taken space',
                                value: 73.42,
                                unit: 'GB',
                            }
                        ]
                    },
                    {
                        _id:'e78fgye7g',
                        name: 'Network 3',
                        storage:[
                            {
                                name: 'REST_VALUE',
                                value: 100,
                            },
                            {
                                name: 'Taken space',
                                value: 9.42,
                                unit: 'GB',
                            }
                        ],
                    }
                ]
            })
        },10)
    })
};

const readNetworkDetails= (type) => {
    if(type === 'AVERAGE_GRADE'){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:[
                        {
                            _id:'78gfrtog78',
                            name: 'Averge grade 1',
                            averageGrade:[
                                {
                                    name: 'REST_VALUE',
                                    value: 1.4,
                                },
                                {
                                    name: 'Grade',
                                    value: 3.6,
                                }
                            ],
                        },
                        {
                            _id:'g87ofewrgty7e',
                            name: 'Averge grade 2',
                            averageGrade:[
                                {
                                    name: 'REST_VALUE',
                                    value: 0.4,
                                },
                                {
                                    name: 'Grade',
                                    value: 4.6,
                                }
                            ],
                        },
                        {
                            _id:'e78fgye7g',
                            name: 'Averge grade 3',
                            averageGrade:[
                                {
                                    name: 'REST_VALUE',
                                    value: 2.6,
                                },
                                {
                                    name: 'Grade',
                                    value: 2.4,
                                }
                            ],
                        }
                    ]
                })
            },10)
        })
    }else if(type === 'STUDENT_FREQUENCY'){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:[
                        {
                            _id:'78gfrtog78',
                            name: 'Frequency 1',
                            averageFrequency:[
                                {
                                    name: 'REST_VALUE',
                                    value: 25.0,
                                },
                                {
                                    name: 'Frequency',
                                    value: 85.0,
                                }
                            ],
                        },
                        {
                            _id:'g87ofewrgty7e',
                            name: 'Frequency 2',
                            averageFrequency:[
                                {
                                    name: 'REST_VALUE',
                                    value: 5.0,
                                },
                                {
                                    name: 'Frequency',
                                    value: 95.0,
                                }
                            ],
                        },
                        {
                            _id:'e78fgye7g',
                            name: 'Frequency 3',
                            averageFrequency:[
                                {
                                    name: 'REST_VALUE',
                                    value: 30.0,
                                },
                                {
                                    name: 'Frequency',
                                    value: 70.0,
                                }
                            ],
                        }
                    ]
                })
            },10)
        })
    }
};

const readNetworkPerformance= () => {
    const _mock_data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
            date: '24.01',
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
            date: '25.01',
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
            date: '26.01',
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
            date: '27.01',
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
            date: '28.01',
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
            date: '29.01',
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
            date: '30.01',
        },
    ];

    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                status: 200,
                data:[{
                    _id: '7y07rfey',
                    name: 'Item 1',
                    info:{
                        usersTotal: 1223,
                        students: 123,
                        teachers: 43,
                        others: 54554,
                        c1: 1221,
                        c2:45323,
                        c3:54345,
                        c4:5445,
                    },
                    chartData:[..._mock_data],
                },{
                    _id: '8pg9rt8g',
                    name: 'Item 2',
                    info:{
                        usersTotal: 1223,
                        students: 123,
                        teachers: 43,
                        others: 54554,
                        c1: 1221,
                        c2:45323,
                        c3:54345,
                        c4:5445,
                    },
                    chartData:[..._mock_data],
                },{
                    _id: '8gr8grg8g',
                    name: 'Item 3',
                    info:{
                        usersTotal: 1223,
                        students: 123,
                        teachers: 43,
                        others: 54554,
                        c1: 1221,
                        c2:45323,
                        c3:54345,
                        c4:5445,
                    },
                    chartData:[..._mock_data],
                }]
            })
        },10)
    })
};

const readCurriculums= (type) => {
    return eliaAPI.get(`${API_ROUTE}/loadCurriculums/${type}`);
};

const readClasses= (type) => {
    return eliaAPI.get(`${API_ROUTE}/loadClasses/${type}`);
};

const readArchitectTasks= (type) => {
    if(type === 'NEW' ){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:[
                        {
                            _id: '7h8f0yref7',
                            updatedAt: new Date(now()).toISOString(),
                            location: 'Catalog 1',
                            course:{
                                _id: '78frtgrf',
                                name: 'Course name 1 - new'
                            }
                        },
                        {
                            _id: 'g978ytg978',
                            updatedAt: new Date(now()).toISOString(),
                            location: 'Catalog 2',
                            course:{
                                _id: '8gt9rtg',
                                name: 'Course name 2 - new'
                            }
                        }
                    ]
                })
            },10)
        })
    }else if(type === 'DONE'){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve({
                    status: 200,
                    data:[
                        {
                            _id: '78rtyg78t',
                            updatedAt: new Date(now()).toISOString(),
                            location: 'Catalog 3',
                            course:{
                                _id: '7g89petryge',
                                name: 'Course name 3'
                            }
                        },
                        {
                            _id: '9g78yfertg',
                            updatedAt: new Date(now()).toISOString(),
                            location: 'Catalog 4',
                            course:{
                                _id: 'p89erygr',
                                name: 'Course name 4'
                            }
                        },
                        {
                            _id: '89gtyreg0yre',
                            updatedAt: new Date(now()).toISOString(),
                            location: 'Catalog 5',
                            course:{
                                _id: 'p89erygr',
                                name: 'Course name 4'
                            }
                        }
                    ]
                })
            },10)
        })
    }
};

// Load top/low results for dashboards
const loadTopLowResults = (classId,subjectId) => {
    return eliaAPI.get(`${API_ROUTE}/top-low-results/${classId}/${subjectId}`)
}

// Load top/low timeSpent for dashboards
const loadTopLowTimeSpent = (classId) => {
    return eliaAPI.get(`${API_ROUTE}/top-low-time-spent/${classId}`)
}

const functions = {
    readAssistance,
    // readTipsForLearning,
    readTasks,
    readPerformance,
    readUpcomingEvents,
    myLatestContent,
    loadContentDetails,
    readAccomplishments,
    readLastActivity,
    readMyLastEnquiries,
    readNetworkPerformance,
    readNetworks,
    readNetworkDetails,
    readCurriculums,
    readClasses,
    readArchitectTasks,
    loadTopLowResults,
    loadTopLowTimeSpent,
}
export default functions;