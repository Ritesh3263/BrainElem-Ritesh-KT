import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import MyContentList from "./MyContentList";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

import ContentService from 'services/content.service'




export default function MyLibrary() {
    const { t } = useTranslation();
    const [folders, setFolders] = useState({});
    const [activeContent, setActiveContent] = useState(null)

    // setCurrentRoute
    const { F_getLocalTime, F_showToastMessage, F_getHelper, setMyCurrentRoute, activeNavigationTab, setActiveNavigationTab, F_handleSetShowLoader, setNavigationTabs } = useMainContext();

    useEffect(()=>{
        F_handleSetShowLoader(true);
        setMyCurrentRoute("Library")
        F_handleSetShowLoader(false);
    },[])

    function handleActiveContent(content) {
        if (content) {
            F_handleSetShowLoader(true);
            ContentService.getContent(content._id).then(res => {
                if (res.data) {
                    setActiveContent(res.data);
                    F_handleSetShowLoader(false);
                }
            }).catch(err => {
                F_handleSetShowLoader(false);
                F_showToastMessage(t("Error"), t("Error while loading content"), "error");
            })
        } else {
            setActiveContent(null);
        }
    }

    useEffect(() => {
        setMyCurrentRoute("Library")
        setNavigationTabs([
            {name: "Private"},
            {name: "Public"},
            {name: "Co-created"}
        ])
        return function cleanup() {
            setNavigationTabs([]);
            setActiveNavigationTab(0);
        };
    }, []);

    useEffect(() => {
            setActiveContent(null)
    }, [activeNavigationTab]);



    return (<>
        {activeNavigationTab === 0 &&<MyContentList type={"private"} activeContent={activeContent} setActiveContent={handleActiveContent} folders={folders} setFolders={setFolders} />}
        {activeNavigationTab === 1 &&<MyContentList type={"public"} activeContent={activeContent} setActiveContent={handleActiveContent} folders={folders} setFolders={setFolders} />}
        {activeNavigationTab === 2 &&<MyContentList type={"coCreated"} activeContent={activeContent} setActiveContent={handleActiveContent} folders={folders} setFolders={setFolders} />}
    </>);
}