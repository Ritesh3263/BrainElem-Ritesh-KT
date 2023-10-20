import React from "react";
import {CourseProvider} from "components/_ContextProviders/CourseProvider/CourseProvider";
import CoursesList from "./CoursesList";

export default function CourseMain(){
    return(
        <CourseProvider>
            <CoursesList/>
        </CourseProvider>
    )
}