import React from "react";
import {SessionProvider} from "components/_ContextProviders/SessionProvider/SessionProvider";
import SessionsListWithoutCompany from "./SessionsListWithoutCompany";
export default function NSessionMainWithoutCompany(){
    return(
        <SessionProvider>
            <SessionsListWithoutCompany />
        </SessionProvider>
    )
}