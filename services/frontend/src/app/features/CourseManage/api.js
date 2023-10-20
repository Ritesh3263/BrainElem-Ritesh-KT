import {eliaAPI} from "services/axiosSettings/axiosSettings";
import {now} from "moment";

const API_ROUTE = 'subject_session';

const getChapters= async (offset,itemId)=>{
    return eliaAPI.get(`${API_ROUTE}/anchorProgramByChapter/${itemId}`)
}

const getContent= async (itemId)=>{
    // contentId
    return await eliaAPI.get(`contents/${itemId}`);
}

const doneItem= async (data)=>{ // CommonDataService.markCompleted()
    if(data.type==="CONTENT"){
        await eliaAPI.post(`commonData/markCompleted`,{
            category: "contents",
            categoryId: data.contentId,
            value: data.isDone
        })
    }else if(data.type==="CHAPTER"){
        await eliaAPI.post(`commonData/markCompleted`,{
            category: "chapters",
            categoryId: data.chapterId,
            value: data.isDone
        })
    } else {
        console.log("ddd",data)
    }
}
const endCourse= async (courseId)=>{
    console.log("courseId",courseId)
    // contentId
    //return await eliaAPI.get(`contents/${itemId}`);
}


const courseManageService = {
    getChapters,
    getContent,
    doneItem,
    endCourse,
}
export default courseManageService;