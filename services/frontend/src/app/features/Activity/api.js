import {eliaAPI} from "services/axiosSettings/axiosSettings";

const API_ROUTE = 'dashboard_stats/latest/activities';


const getActivities= async ()=>{
    return eliaAPI.get(`${API_ROUTE}`);
}

const getActivity= async (itemId)=>{
    // activityId
    return await new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                status: 200,
                data: {
                    _id:'her8f7ef',
                    contentType: 'Exam',
                    title: 'Content 1',
                    isShowOthers: true,
                    isDone: true,
                },
            })
        },300);
    });
}

const activityService = {
    getActivities,
    getActivity,
}
export default activityService;