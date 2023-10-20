import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'chapters';

const readAll = () => {
  // Get all chapters in training module
  return eliaAPI.get(`${API_ROUTE}/all`);
};

const addChapter = (trainingModuleId, data) => {
  return eliaAPI.post(`${API_ROUTE}/${trainingModuleId}`,data);
};

const renameChapterName = (chapterId, data) => {
  return eliaAPI.put(`${API_ROUTE}/rename/${chapterId}`,data);
};

const getChaptersSuggestionFromAI =(content)=>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({
        "data":[
          {
            _id: "h9y786t4rfh",
            isSelected: true,
            name: "Quantum mechanics",
            description: "description...",
            type: "TEST",
            level: "Advanced",
            creator: "Dom Pérignon",
          },
          {
            _id: "9786rfrt",
            isSelected: true,
            name: "Optics",
            description: "description...",
            type: "TEST",
            level: "Advanced",
            creator: "Dom Pérignon",
          },
        ]
      })
    },300)
  })
}

const getContents= (chapterId) => {
  //  Get contents with provided id from database,if it is avaliable for the user.
  return eliaAPI.get(`${API_ROUTE}/get-content/${chapterId}`);
}

const getChapters= (trainingModuleId) => {
  //  Get contents with provided id from database,if it is avaliable for the user.
  return eliaAPI.get(`${API_ROUTE}/get-chapters/${trainingModuleId}`);
}

const functions = {
  readAll,
  renameChapterName,
  getChaptersSuggestionFromAI,
  getContents,
  getChapters,
  addChapter,
}
export default functions;
