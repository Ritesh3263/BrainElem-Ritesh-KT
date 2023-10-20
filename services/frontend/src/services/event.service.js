import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'events';

// Read basic data from database
const overview = (eventId) => {
  return eliaAPI.get(`${API_ROUTE}/overview/${eventId}`);
};

// Read event data with associated content
const display = (eventId) => {
  return eliaAPI.get(`${API_ROUTE}/display/${eventId}`);
};

// Read data for group examination view
const readForExamination = (eventId) => {
  return eliaAPI.get(`${API_ROUTE}/examination/${eventId}`);
}

// Allow extra attempt for event
const allowExtraAttempt = (eventId, userId) => {
  return eliaAPI.post(`${API_ROUTE}/${eventId}/allow-extra-attempt/${userId}`, null);
};
// Disallow extra attempt for event
const disallowExtraAttempt = (eventId, userId) => {
  return eliaAPI.post(`${API_ROUTE}/${eventId}/disallow-extra-attempt/${userId}`, null);
};

const add = (event) => {
  if(!event["durationTime"]){
    event["durationTime"] = 0
  }
  // if "durationTime" isn't number, split it 
  else if(isNaN(event["durationTime"])){
    let string = event["durationTime"].split(":");
    event["durationTime"] = parseInt(string[0])*60 + parseInt(string[1]);
  }
  
  return eliaAPI.post(`${API_ROUTE}/add`, event);
};

const addAlt = (event) => {
  return eliaAPI.post(`${API_ROUTE}/addAlt`, event);
};

const addCerificationEvent = (event) => {  
  return eliaAPI.post(`${API_ROUTE}/addCerificationEvent`, event);
};

const update = (event) => {
  if(!event["durationTime"]){
    event["durationTime"] = 0
  }
  // if "durationTime" isn't number, split it   
  else  if(isNaN(event["durationTime"])){
    let string = event["durationTime"].split(":");
    event["durationTime"] = parseInt(string[0])*60 + parseInt(string[1]);
  }

  return eliaAPI.put(`${API_ROUTE}/update/${event._id}`, event);
};

const remove = (eventId) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${eventId}`);
};

const removeByExam = (eventId) => {
  return eliaAPI.delete(`${API_ROUTE}/removeByExam/${eventId}`);
};

const readAll = () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const readTrainingModules = (classId,periodId) => {
  if(!periodId) return (new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: "PerioId is undefined" });
    }, 300);
  }))
  else return eliaAPI.get(`${API_ROUTE}/getSubjects/${classId}/${periodId}`);
};

const readTrainingModulesForEvents = (classId) => {
  return eliaAPI.get(`${API_ROUTE}/getSubjectsForEvents/${classId}`);
};

const getTrainingModuleFromTrainingPath = (trainingPathId) => {
  return eliaAPI.get(`${API_ROUTE}/getTrainingModuleFromTrainingPath/${trainingPathId}`);
};

const readChapters = (subjectId, trainingPathId) => {
  return eliaAPI.get(`${API_ROUTE}/readChapters/${subjectId}/${trainingPathId}`);
};

const readContents = (chapterId, trainingPathId, groupId) => {
  return eliaAPI.get(`${API_ROUTE}/readContents/${chapterId}/${trainingPathId}/${groupId}`);
};

const readContentsWithGrade = (chapterId, trainingPathId, traineeId) => {
  return eliaAPI.get(`${API_ROUTE}/readContentsWithGrade/${chapterId}/${trainingPathId}/${traineeId}`);
};

const getEvents = (trainingModuleId) => {  
  if (trainingModuleId) return eliaAPI.get(`${API_ROUTE}/getEvents/${trainingModuleId}`);
  else return eliaAPI.get(`${API_ROUTE}/getEvents`);
};

const readEventsFromSession = (sessionId, assignedGroup) => {
  if(assignedGroup === undefined) return eliaAPI.get(`${API_ROUTE}/readEventsFromSession/${sessionId}`);
  else return eliaAPI.get(`${API_ROUTE}/readEventsFromSession/${sessionId}/${assignedGroup}`);
};

const readEventsFromAllSessions = () => {
  return eliaAPI.get(`${API_ROUTE}/readEventsFromAllSessions`);
};

const getTraineePreviewEvents = (groupId) => {  
  return eliaAPI.get(`${API_ROUTE}/getTraineePreviewEvents/${groupId}`);
};

const getEventTypes = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            _id: "fcu8p9eyhc",
            type: "Online Class",
          },
          {
            _id: "7foher",
            type: "Exam",
          },
          // {
          //   _id: "7hqcer",
          //   type: "Quiz",
          // },
          {
            _id: "7hqce35rtq3r",
            type: "Homework",
          },
        ],
        status: 200,
      });
    }, 100);
  });
};

const getMyClasses = () => {
  return eliaAPI.get(`${API_ROUTE}/getMyClasses`);
};

const getTrainerClassesFromSessions = (trainerId) => {
  return eliaAPI.get(`${API_ROUTE}/getTrainerClassesFromSessions/${trainerId}`);
};

const getParentClasses = (parentId) => {
  return eliaAPI.get(`${API_ROUTE}/readGroupsByParentId/${parentId}`);
};

// Start meeting(video-call) associated with requested event
const startMeeting = (eventId,  meetingUrl, meetingDetails) => {
  return eliaAPI.post(`${API_ROUTE}/${eventId}/meeting/start`, {meetingUrl: meetingUrl, meetingDetails:meetingDetails});
}

// End meeting(video-call) associated with requested event
const endMeeting = (eventId) => {
  return eliaAPI.post(`${API_ROUTE}/${eventId}/meeting/end`);
}


// Get link for meeting(video-call) associated with requested event
const getMeetingUrl = (eventId) => {
  return eliaAPI.get(`${API_ROUTE}/${eventId}/meeting/url`);
}

// Get details for meeting(video-call) associated with requested event
const getMeetingDetails = (eventId) => {
  return eliaAPI.get(`${API_ROUTE}/${eventId}/meeting/details`);
}

/** Karol 06.07.21 **/
const getTraineeClasses = (traineeId) => {
  return eliaAPI.get(`${API_ROUTE}/getTraineeClasses/${traineeId}`);
};

const getExamEventsforTeacher = () => {  
  return eliaAPI.get(`${API_ROUTE}/getAllExamsForTeacherViaEvent`);
};

const getExamEventsforSession = (currentSessionId) => {  
  return eliaAPI.get(`${API_ROUTE}/getAllExamsForSession/${currentSessionId}`);
};

const getExamEventsforParent = () => {  
  return eliaAPI.get(`${API_ROUTE}/getAllExamsForParentViaEvent`);
};

const getExamsListOfTrainee = (groupId, contentId) => {  
  return eliaAPI.get(`${API_ROUTE}/getExamsListOfTrainee/${groupId}/${contentId}`);
};

const getHomeworks = (trainingModuleId) => {
  if (trainingModuleId) return eliaAPI.get(`${API_ROUTE}/getHomeworks/${trainingModuleId}`);
  else return eliaAPI.get(`${API_ROUTE}/getHomeworks`);
};

const getExams = (trainingModuleId) => {
  if (trainingModuleId) return eliaAPI.get(`${API_ROUTE}/getExams/${trainingModuleId}`);
  else return eliaAPI.get(`${API_ROUTE}/getExams`);
};

const getTraineeEventExamByContent = (contentId) => {  
  return eliaAPI.get(`${API_ROUTE}/getTraineeEventExamByContent/${contentId}`);
};

const getExamListOfSubject = (classId, periodId, trainingModuleId) => {  
  return eliaAPI.get(`${API_ROUTE}/getExamListOfSubject/${classId}/${periodId}/${trainingModuleId}`);
};

const getExamListOfCourse = (groupId,courseId) => {  
  return eliaAPI.get(`${API_ROUTE}/getExamListOfCourse/${groupId}/${courseId}`);
};

const getExamListOfSubjectOldWay = (classId, trainingModuleId) => {  
  return eliaAPI.get(`${API_ROUTE}/getExamListOfSubjectOldWay/${classId}/${trainingModuleId}`);
};


// stats

const countOnlineClasses = (userId) => {
  if (userId) return eliaAPI.get(`${API_ROUTE}/countOnlineClasses/${userId}`); // user average content creation time
  else return eliaAPI.get(`${API_ROUTE}/countOnlineClasses`); // all users average content creation time
}

const countExams = (userId) => {
  if (userId) return eliaAPI.get(`${API_ROUTE}/countExams/${userId}`); // user average content creation time
  else return eliaAPI.get(`${API_ROUTE}/countExams`); // all users average content creation time
}

const countHomeworks = (userId) => {
  if (userId) return eliaAPI.get(`${API_ROUTE}/countHomeworks/${userId}`); // user average content creation time
  else return eliaAPI.get(`${API_ROUTE}/countHomeworks`); // all users average content creation time
}

const countOnlineClassesInModule = (userId) => {
  return eliaAPI.get(`${API_ROUTE}/countOnlineClassesInModule`);}

const countExamsInModule = (userId) => {
  return eliaAPI.get(`${API_ROUTE}/countExamsInModule`);}

const countHomeworksInModule = (userId) => {
  return eliaAPI.get(`${API_ROUTE}/countHomeworksInModule`);}

const numberOfUpcomingEvents = (userId) => {
  if (userId) return eliaAPI.get(`${API_ROUTE}/numberOfUpcomingEvents/${userId}`); // user average content creation time
  else return eliaAPI.get(`${API_ROUTE}/numberOfUpcomingEvents`); // all users average content creation time
}

const functions = {
  add,
  addAlt,
  addCerificationEvent, 
  update,
  remove,
  removeByExam,

  allowExtraAttempt,
  disallowExtraAttempt,
  
  overview,
  display,
  readForExamination,
  readAll,
  getEvents,
  readEventsFromSession,
  readEventsFromAllSessions,
  getEventTypes,
  getMyClasses,
  getTrainerClassesFromSessions,

  getTraineeClasses,
  getTraineePreviewEvents,

  readTrainingModules,
  readTrainingModulesForEvents,
  getTrainingModuleFromTrainingPath,
  readChapters,
  readContents,
  readContentsWithGrade,

  getExamEventsforTeacher,
  getExamEventsforSession,
  getExamsListOfTrainee,
  getExams,
  getHomeworks,

  getParentClasses,
  getExamEventsforParent,

  getTraineeEventExamByContent,
  getExamListOfSubject,
  getExamListOfSubjectOldWay,
  getExamListOfCourse,

  //stats
  countOnlineClasses,
  countExams,
  countHomeworks,
  numberOfUpcomingEvents,
  countOnlineClassesInModule,
  countExamsInModule,
  countHomeworksInModule,


  // meetings(viedo call)
  startMeeting,
  endMeeting,
  getMeetingUrl,
  getMeetingDetails
};

export default functions;
