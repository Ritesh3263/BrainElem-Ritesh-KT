import {eliaAPI} from "./axiosSettings/axiosSettings";
import i18next from "i18next";

const getQuestions= async(user,type,area)=>{
    let userData=JSON.parse(user)
    let url=``;
    let lang = i18next.language || 'en'

    if(type=="manual"){
     url=`users/opportunities/${userData.id}/?size=15&lang=${lang}&areaId=${area}`;
    }
    if(type=="auto"){
        url=`users/opportunities/${userData.id}/?size=15&lang=${lang}`
    }
    return eliaAPI.get(url,{'headers':{
        'token':userData.accessToken
    }});

}

const functions={
    getQuestions
}
export default functions;