import React from "react";
import Grid from "@material-ui/core/Grid";
import {ETab, ETabBar} from "styled_components";

export default function TabBars(){
    return(
        <Grid container>
            <Grid item xs={12}>
                <h5> new tab bar</h5>
                <ETabBar
                    style={{width:'400px'}}
                    value={1}
                    onChange={(e,i)=>{}}
                    eSize='xsmall'
                >
                    <ETab label='xsmall-Tab1' eSize='small'/>
                    <ETab label='xsmall-Tab2' eSize='small'/>
                </ETabBar>
                <br/>
                <ETabBar
                    style={{width:'400px'}}
                    value={1}
                    onChange={(e,i)=>{}}
                    eSize='small'
                >
                    <ETab label='small-Tab1' eSize='small'/>
                    <ETab label='small-Tab2' eSize='small'/>
                </ETabBar>
                <br/>
                <ETabBar
                    value={1}
                    onChange={(e,i)=>{}}
                    eSize='medium'
                >
                    <ETab label='medium-Tab1_fullWidth' eSize='medium'/>
                    <ETab label='medium-Tab2_fullWidth' eSize='medium'/>
                </ETabBar>
                <br/>
                <ETabBar
                    style={{width:'400px'}}
                    value={1}
                    onChange={(e,i)=>{}}
                    eSize='large'
                >
                    <ETab label='large-Tab1_disabled' eSize='large' disabled/>
                    <ETab label='large-Tab2_disabled' eSize='large' disabled/>
                </ETabBar>
                <br/>
                <ETabBar
                    style={{width:'600px'}}
                    value={1}
                    onChange={(e,i)=>{}}
                    eSize='xlarge'
                >
                    <ETab label='xlarge-Tab1_uppercase' eSize='xlarge' isUppercase/>
                    <ETab label='xlarge-Tab2' eSize='xlarge'/>
                </ETabBar>
            </Grid>
        </Grid>
    )
}