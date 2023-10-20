import React, {useState} from "react";
import {Container} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {ETabBar, ETab} from "styled_components";

import Buttons from "./Components/Buttons/Buttons";
import TabBars from "./Components/TabBars/TabBars";
import SwipeableDrawerDef from "./Components/SwipeableDrawer/SwipeableDrawer";
import Notifications from "../Notifications/Notifications";
import CustomAccordion from "../Accordion";
import MyCropper from "./Components/MyCropper/MyCropper";
import IconButton from "./Components/IconButton/IconButton";
import OnBoarding from "./Components/OnBoarding/OnBoarding";
import MobileNotifications from "./Components/MobileNotifications/MobileNotifications";



const components = ['Buttons', 'TabBars', 'Swipeable drawer',"Notifications","Accordion","CropperJS", "IconButton","OnBoarding","MobileNotifications"];
const initialState = components[components.length-1];

export default function TestStyledComponents(){

    const [activeTab, setActiveTab] = useState(initialState);
    const componentsList = components.map(c=><ETab key={c} label={c} value={c} eSize='small'/>);

    return(
        <Container className='p-0'>
            <Grid container>
                <Grid item xs={12}>
                    <ETabBar
                        value={activeTab}
                        onChange={(e,i)=>{setActiveTab(i)}}
                        eSize='small'
                    >
                        {componentsList}
                    </ETabBar>
                </Grid>
                <Grid item xs={12} className='pt-4'>
                    {activeTab === components[0] && (<Buttons/>)}
                    {activeTab === components[1] && (<TabBars/>)}
                    {activeTab === components[2] && (<SwipeableDrawerDef/>)}
                    {activeTab === components[3] && (<Notifications/>)}
                    {activeTab === components[4] && (<CustomAccordion/>)}
                    {activeTab === components[5] && (<MyCropper/>)}
                    {activeTab === components[6] && (<IconButton/>)}
                    {activeTab === components[7] && (<OnBoarding/>)}
                    {activeTab === components[8] && (<MobileNotifications/>)}
                </Grid>
            </Grid>
        </Container>
    )
}