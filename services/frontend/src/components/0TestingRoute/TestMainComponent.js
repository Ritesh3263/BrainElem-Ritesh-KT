import React, {useEffect} from "react";
import {Button, Divider} from "@material-ui/core";
import UI_tabs from "./UI_Tabs/UI_tabs";
import Certificate from "./Certificate/Certificate";
import QuickSearch from "./QuickSearchTest/QuickSearch";
import MainSendData from "./Search/MainSendData";
import DeepSearchMain from "./DeepSearch/DeepSearchMain";
import ToggleButton from "./ToggleButton/ToggleButton";
import SnackToast from "../common/SnackbarToast/SnackToast";
import SkeletonLoading from "./SkeletonLoading/SkeletonLoading";
import WelcomePage from "./WelcomePage/WelcomePage";
import NCurriculumList from "../Module/ModuleCore/ModulesCoreCurriculae/NewCurriculum/NCurriculumList";
import {CurriculumProvider} from "../_ContextProviders/CurriculumProvider/CurriculumProvider";
import MainList_Ex from "./TableFormExample/MianList_Ex";
import TestStyledComponents from "./TestStyledComponents/TestStyledComponents";
export default function TestMainComponent(){
    return(
        <>
        <h4>Testing main component - component is used for testing, imported components (wrapped them)</h4>
            <Divider className='mb-4'/>

            {/*-----------------------------MY TESTING COMPONENTS---------------------------------*/}
        {/*    <Certificate/>    */}

        {/*    <UI_tabs/>        */}

        {/*    <QuickSearch/>    */}

        {/*    Search in objects, filter*/}
        {/*    <MainSendData/>*/}

        {/*    Deep search in nested objects*/}
        {/*    <DeepSearchMain helper={helper}/>*/}

        {/*     Toggle Button    */}
        {/*    <ToggleButton/>*/}

        {/*     Snackbar    */}
        {/*    <SnackToast/>*/}

        {/*Skeleton Loading*/}
        {/*<SkeletonLoading/>*/}

        {/*Welcome Page    */}
        {/*<WelcomePage/>*/}

        {/*Example of List + form    */}
        {/* <MainList_Ex/>*/}

        {/*New Curriculum    */}
        {/*    <CurriculumProvider>*/}
        {/*        <NCurriculumList/>*/}
        {/*    </CurriculumProvider>*/}

         {/*Test Styled components   */}
            <TestStyledComponents/>
        </>
    )
}