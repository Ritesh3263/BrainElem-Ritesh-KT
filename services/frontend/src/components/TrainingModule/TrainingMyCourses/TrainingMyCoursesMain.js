import React from "react";
import {SessionProvider} from "components/_ContextProviders/SessionProvider/SessionProvider";
import TrainingMyCoursesList from "./TrainingMyCoursesList";
export default function TrainingMyCoursesMain(){
    return(
        <SessionProvider>
            <TrainingMyCoursesList/>
        </SessionProvider>
    )
}