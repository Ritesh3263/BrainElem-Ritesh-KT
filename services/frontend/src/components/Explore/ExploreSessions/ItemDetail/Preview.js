import React, {lazy, useEffect, useState} from 'react';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import {ETab, ETabBar} from "../../../../styled_components";

const Overview = lazy(()=>import("../ItemPreview/Overview"));
const Content = lazy(()=>import("../ItemPreview/Content"));
const Reviews = lazy(()=>import("../ItemPreview/Reviews"));


export default function Preview({currentItemDetails}){
    const {t} = useTranslation();
    const [activeTab, setActiveTab]=useState(0);

    return(
        <Grid container style={{overflow: 'hidden'}} >
            <Grid item xs={12} className="d-flex align-items-center justify-content-center">
                        <ETabBar
                            value={activeTab}
                            onChange={(e,i)=>setActiveTab(i)}
                            eSize='small'
                            style={{minWidth:'350px'}}
                        >
                            <ETab label='Overview' eSize='small'/>
                            <ETab label='Content' eSize='small'/>
                            <ETab  label='Reviews' eSize='small' disabled={true}/>
                        </ETabBar>
            </Grid>
            <Grid item xs={12}>
                {activeTab===0 &&(<Overview currentItemDetails={currentItemDetails}/>)}
                {activeTab===1 &&(<Content currentItemDetails={currentItemDetails}/>)}
                {activeTab===2 &&(<Reviews currentItemDetails={currentItemDetails}/>)}
            </Grid>
        </Grid>
    )
}