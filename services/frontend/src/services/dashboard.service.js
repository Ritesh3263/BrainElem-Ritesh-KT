import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = '???????';

/** All **/

const getBookmarkCourses = (userId)=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: [
                    {
                        _id:"f87wfgtw",
                        name: "Course 1",
                        subject: "Math",
                        category: "Science"
                    },
                    {
                        _id:"ciheorhcf",
                        name: "Course 2",
                        subject: "Physics",
                        category: "Science"
                    },
                    {
                        _id:"7iyf78erdf",
                        name: "Course 3",
                        subject: "Biology",
                        category: "Science"
                    },
                ],
            });
        }, 300);
    });
}

/** Trainer **/
const getContentToFill = (trainerId)=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: [
                    {
                        _id:"f87wfgtw",
                        name: "Content 2",
                        subject: "Math",
                        className: " Ia",
                        coCreator: "Mr. Who",
                    },
                    {
                        _id:"ciheorhcf",
                        name: "Content 3",
                        subject: "Physics",
                        className: " Ib",
                        coCreator: "Mr. Who",
                    },
                    {
                        _id:"7iyf78erdf",
                        name: "Content 4",
                        subject: "Biology",
                        className: " Ic",
                        coCreator: "Mr. Who",
                    },
                ],
            });
        }, 300);
    });
}

const getToExaminate = ()=>{
    return eliaAPI.get(`/events/getExamEvents`);
}

/** Trainee **/
const getHomeworks = (traineeId)=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: [
                    {
                        _id:"f87wfgtw",
                        name: "Homework 1",
                        startDate: "2021-03-31T12:13:46.847Z",
                        endDate: "2021-03-31T12:13:46.847Z",
                    },
                    {
                        _id:"ciheorhcf",
                        name: "Homework 2",
                        startDate: "2021-03-31T12:13:46.847Z",
                        endDate: "2021-03-31T12:13:46.847Z",
                    },
                    {
                        _id:"7iyf78erdf",
                        name: "Homework 3",
                        startDate: "2021-03-31T12:13:46.847Z",
                        endDate: "2021-03-31T12:13:46.847Z",
                    },
                ],
            });
        }, 300);
    });
}

const getMyGrades = (traineeId)=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: [
                    {
                        _id:"f87wfgtw",
                        name: "Exam 1",
                        grade: 5,
                        date: "2021-03-31T12:13:46.847Z"
                    },
                    {
                        _id:"ciheorhcf",
                        name: "Exam 2",
                        grade: 4,
                        date: "2021-03-31T12:13:46.847Z"
                    },
                    {
                        _id:"7iyf78erdf",
                        name: "Exam 3",
                        grade: 3,
                        date: "2021-03-31T12:13:46.847Z"
                    },
                ],
            });
        }, 300);
    });
}

/** Class manager dashboard ? **/


const functions = {
    getBookmarkCourses,
    getContentToFill,
    getToExaminate,
    getHomeworks,
    getMyGrades,
};

export default functions;