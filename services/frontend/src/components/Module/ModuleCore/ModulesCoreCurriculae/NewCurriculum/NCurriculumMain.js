import React from "react";
import {CurriculumProvider} from "components/_ContextProviders/CurriculumProvider/CurriculumProvider";
import NCurriculumList from "./NCurriculumList"
export default function NCurriculumMain(){
    return(
        <CurriculumProvider>
            <NCurriculumList/>
        </CurriculumProvider>
    )
}