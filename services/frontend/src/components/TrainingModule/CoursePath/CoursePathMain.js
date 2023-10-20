import React from "react";
import {CoursePathProvider} from "components/_ContextProviders/CoursePathProvider/CoursePathProvider";
import CoursePathsList from "./CoursePathsList";

export default function CoursePathMain(){
    return(
        <CoursePathProvider>
            <CoursePathsList/>
        </CoursePathProvider>
    )
}