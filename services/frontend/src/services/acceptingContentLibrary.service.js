import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = '?????????';

const getStorageInfo =(content)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                "data": {
                    size: 20.8,
                    unit: "TB",
                    used: 5.6,
                }
            })
        },300)
    })
};

const acceptContent =(data)=>{
    console.log("content: ",data.libraryStatus);
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(true)
        },300)
    })
};

const rejectContent =(data)=>{
    console.log("content: ",data.libraryStatus);
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(true)
        },300)
    })
};


const functions = {
    
    getStorageInfo,
    rejectContent,
    acceptContent,
};

export default functions;