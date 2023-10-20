import {now} from "moment";
import {eliaAPI} from "./axiosSettings/axiosSettings";

const getUsersActivity =(content)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                "data":[
                    {
                        _id: "8ofgh7erf",
                        date: new Date(now()).toISOString(),
                        assigment: "Module x",
                        username: "Mgo 1",
                        actionType: "adding module by user"
                    },
                    {
                        _id: "8f9rj0f89w",
                        date: new Date(now()).toISOString(),
                        assigment: "Module x",
                        username: "Username",
                        actionType: "adding module by user"
                    },
                    {
                        _id: "897rewfgure",
                        date: new Date(now()).toISOString(),
                        assigment: "Module x",
                        username: "Username",
                        actionType: "adding module by user"
                    }
                ]
            })
        },300);
    })
}


const functions ={
    getUsersActivity,
}

export default functions;