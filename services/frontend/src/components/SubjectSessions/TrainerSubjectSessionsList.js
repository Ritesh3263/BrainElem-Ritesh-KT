import React, {useEffect, useState} from "react";
import SubjectSessionService from "../../services/subject_session.service";
import TrainerSubjectSessionsTable from "./TrainerSubjectSessionsTable";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


export default function TrainerSubjectSessionsList({refreshAfterAdd}){
    const [subjectSessions, setSubjectSessions] = useState([]);
    const {setMyCurrentRoute} = useMainContext();

    useEffect(()=>{
        SubjectSessionService.readAll().then(res=>{
            setSubjectSessions(res.data)
        })
        setMyCurrentRoute("My courses")
    },[refreshAfterAdd]);

    return(
            <TrainerSubjectSessionsTable subjectSessions={subjectSessions}/>
    )
}