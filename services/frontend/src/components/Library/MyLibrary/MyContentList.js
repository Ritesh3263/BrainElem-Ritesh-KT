import React, {useEffect, useState, lazy} from "react";
import { useTranslation } from "react-i18next";
import LibraryService from "services/library.service"
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const Window = lazy(() => import("styled_components/FileManager/Window"));

function addProperties(object, t=null, name='Main catalogue', parent=null) {
    object._id = object._id||Math.random().toString(36).substr(2, 9)
    object._parent = parent;
    object._name = t?t(name):name;
    if (object._folder) {
        for (let [key, value] of Object.entries(object)) {
            if(['_folder','_id','_parent','_name','_mixed'].includes(key)) continue;
            addProperties(value, null, key, object);
        }
    } 
    return object;
}

export default function MyContentList(props){
    const{
        type,
        activeContent,
        setActiveContent,
        folders,
        setFolders,
    }=props;
    const {F_handleSetShowLoader } = useMainContext();
    const { t } = useTranslation();

    useEffect(()=>{
        F_handleSetShowLoader(true);
        if(type ==="private"){
            LibraryService.getUserPrivateContent().then(res=>{
                let Folders = addProperties(res.data.folders,t);
                setFolders(Folders);
                F_handleSetShowLoader(false)
            })
        }else if(type ==="public"){
            LibraryService.getUserPublicContent().then(res=>{
                let Folders = addProperties(res.data.folders,t);
                setFolders(Folders);
                F_handleSetShowLoader(false)
            })
        }else{
            LibraryService.getUserCoCreatedContent().then(res=>{
                let Folders = addProperties(res.data.folders,t);
                setFolders(Folders);
                F_handleSetShowLoader(false);
            })
        }

    },[type]);

    return (<Window folders={folders} setFolders={setFolders} activeContent={activeContent} setActiveContent={setActiveContent} />)
}