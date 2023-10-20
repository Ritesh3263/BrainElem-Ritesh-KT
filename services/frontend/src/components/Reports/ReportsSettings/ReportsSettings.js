import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import ReportsSoftSkills from "./ReportsSoftSkills/ReportsSoftSkills";
import ReportsTemplates from "./ReportsTemplates/ReportsTemplates";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ETab, ETabBar} from "styled_components";

export default function ReportsSettings(){
    const { t } = useTranslation();
    const {setMyCurrentRoute} = useMainContext();
    const [currentTab, setCurrentTab]= useState(0);
    useEffect(()=>{
        setMyCurrentRoute('Reports');
    },[]);

    const {  activeNavigationTab, setActiveNavigationTab, setNavigationTabs } = useMainContext();

    useEffect(() => {
        setMyCurrentRoute("Reports")
        setNavigationTabs([
            {name: "Templates"},
            {name: "Soft Skills"}
        ])
        return function cleanup() {
            setNavigationTabs([]);
            setActiveNavigationTab(0);
        };
    }, []);
    return(
        <Grid container>
            <Grid item xs={12}>
                {activeNavigationTab ===0 && (<ReportsTemplates/>)}
                {activeNavigationTab ===1 && (<ReportsSoftSkills/>)}
            </Grid>
        </Grid>
    )
}