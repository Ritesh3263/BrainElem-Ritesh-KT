import React from "react";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { isWidthUp } from '@material-ui/core/withWidth';

export default function NavCurrentRoute({whiteSpace="nowrap", textAlign="left"}){
    const { t} = useTranslation();
    const {myCurrentRoute, currentScreenSize, collapseSidebarMobile} = useMainContext();
    return(
        <div className="m-0 p-0" style={{ overflowX: 'hidden'}}>
            <Typography variant={window.innerWidth > 600 ? "h4":"h5"} component="h2" className="p-0 m-0" style={{whiteSpace: whiteSpace, textAlign: textAlign, color: `rgba(255, 255, 255, 1)`, overflowX: 'hidden', textOverflow: "ellipsis"}}>
                {t(myCurrentRoute??"-")}
            </Typography>
        </div>

    )
}