import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {myCourseActions} from "app/features/MyCourses/data";

import MyCourseForm from "./MyCourseForm";
import CoursesLists from "./Lists";

const MyCourses=()=> {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {formHelper} = useSelector(_=>_.myCourses);
    const [tabFormHelper, setTabFormHelper] = useState({isOpen: false, itemId: null, openType: 'PREVIEW'})


    useEffect(()=>{
        dispatch(myCourseActions.fetch());
        return ()=>{
            dispatch(myCourseActions.clean());
        }

    },[]);

     return (
        <>
            {formHelper.isOpen ? (
                <MyCourseForm tabFormHelper={tabFormHelper} setTabFormHelper={setTabFormHelper}/>
            ) : (
                <CoursesLists />
            )}
        </>
     )
 }

export default MyCourses;