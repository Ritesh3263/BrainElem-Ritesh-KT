import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Lists
import ExamList from "./Exams/ExamsList";
import HomeworksList from "./Homeworks/HomeworksList";
//MUI v5
import { Grid } from "@mui/material";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function WelcomeExaminationView({currentSessionId}) {
    const { t } = useTranslation();
    const { setMyCurrentRoute, activeNavigationTab, setActiveNavigationTab, setNavigationTabs } = useMainContext();
    
    useEffect(() => {
        setMyCurrentRoute("Exams and assigments")
        setNavigationTabs([
            {name: "Exams"},
            {name: "Homeworks"}
        ])
        return function cleanup() {
            setNavigationTabs([]);
            setActiveNavigationTab(0);
        };
    }, []);

    return (
        <Grid container>
            <Grid item xs={12} >
                {(activeNavigationTab === 0) ?
                    (<ExamList currentSessionId={currentSessionId}/>) :
                    (<HomeworksList />)
                }
            </Grid>
        </Grid>
    )
}