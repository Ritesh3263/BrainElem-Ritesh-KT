import React from "react";
import EnquiresList from "./EnquiresList";
import {EnquiryProvider} from "components/_ContextProviders/EnquiryProvider/EnquiryProvider";

export default function EnquiresMain(){
    return(
        <EnquiryProvider>
            <EnquiresList/>
        </EnquiryProvider>
    )
}