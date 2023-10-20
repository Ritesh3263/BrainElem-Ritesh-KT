import React from "react";
import {SessionProvider} from "components/_ContextProviders/SessionProvider/SessionProvider";
import SessionsList from "./SessionsList";
export default function NSessionMain(){
    return(
        <SessionProvider>
            <SessionsList />
        </SessionProvider>
    )
}