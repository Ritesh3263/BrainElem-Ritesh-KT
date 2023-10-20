import React, {useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Paper} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import {TabPanel} from "@material-ui/lab";
import Tab from "@material-ui/core/Tab";
import {theme} from "../../../MuiTheme";

const useStyles = makeStyles({});

export default function UI_tabs(props){
    const classes = useStyles(props);
    const [value, setValue] = useState(0);
    return(
        <>
        <span style={{backgroundColor: "orange"}} className="mb-5">Tabs</span>
            <Paper elevation={12} style={{width: "500px"}}>
                <Tabs
                    value={value}
                    textColor="primary"
                    variant="fullWidth"
                    onChange={(e,i)=>setValue(i)}
                    aria-label="tabs example"
                >
                    <Tab label="One"/>
                    <Tab label="Two" />
                    <Tab label="Three" />
                </Tabs>
            </Paper>
        </>
    )
}