import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import EliaPieChart from "./Charts/EliaPieChart";
import EliaBarChart from "./Charts/EliaBarChart";
import UserActivityTable from "./UserActivityTable";
import {now} from "moment";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";


export default function UserActivity(props){
    const{
        currentReport,
    }=props;
    const { t } = useTranslation();
    const [lastUserActivity, setLastUserActivity] = useState([
        {
            date: now(),
            eventType: "EventType1",
            eventTitle: "EventTitle1",
            subject: "SubjectName1",
        },
        {
            date: now(),
            eventType: "EventType2",
            eventTitle: "EventTitle2",
            subject: "SubjectName2",
        },
        {
            date: now()+10000000,
            eventType: "EventType3",
            eventTitle: "EventTitle3",
            subject: "SubjectName3",
        }
    ]);
    const [selectedPeriod, setSelectedPeriod] = useState(3)
    const [reportsPeriods, setReportsPeriods] = useState([
        {
            id: 1,
            name: "1 day"
        },
        {
            id: 2,
            name: "1 week"
        },
        {
            id: 3,
            name: "2 weeks"
        },
        {
            id: 4,
            name: "1 month"
        },
        {
            id: 5,
            name: "1 period"
        }
    ]);

    const reportsPeriodsList = reportsPeriods.map((item, index)=><MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>);


    return(
            <Grid container spacing={2} className="mt-3">
                <Grid item xs={12} lg={6}>
                    <Paper elevation={10} className="p-3">
                        <h5>{t("Report period")}</h5>
                        <FormControl style={{minWidth:'200px', maxWidth:'400px'}} margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t("Select period")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedPeriod}
                                //input={<Input/>}
                                // renderValue={p=> p.managerName}
                                onChange={(e) => {
                                    setSelectedPeriod(e.target.value)
                                }}
                            >
                                {reportsPeriodsList}
                            </Select>
                        </FormControl>
                    </Paper>
                    <Paper elevation={10} className="mt-2 p-3">
                        <h5>{t("Average grade")}</h5>
                        <EliaPieChart currentReport={currentReport}/>
                    </Paper>
                    <Paper elevation={10} className="mt-2 p-3" style={{overflowX:"scroll"}}>
                        <h5>{t("Average grades in subjects")}</h5>
                        <EliaBarChart currentReport={currentReport}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Paper elevation={10} className="p-3">
                        <h5>{t("Last user activity")}</h5>
                        <UserActivityTable lastUserActivity={lastUserActivity}/>
                    </Paper>
                </Grid>
            </Grid>
        )
}