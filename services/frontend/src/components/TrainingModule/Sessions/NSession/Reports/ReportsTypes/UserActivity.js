import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import EliaPieChart from "../../../../../Reports/ReportTypes/Charts/EliaPieChart";
import EliaBarChart from "../../../../../Reports/ReportTypes/Charts/EliaBarChart";
import UserActivityTable from "./UserActivityTable";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const reportsPeriods =[
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
]

export default function UserActivity({currentReport}){
    const { t } = useTranslation();
    const [selectedPeriod, setSelectedPeriod] = useState({id: 2, name: "1 week"})
    const reportsPeriodsList = reportsPeriods.map((item, index)=><MenuItem key={item.id} value={item}>{item.name}</MenuItem>);

    return(
            <Grid container>
                <Grid item xs={12} className="mt-3">
                    <Typography variant="body1"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("User activity")}
                    </Typography>
                    <hr className="my-1 mr-4"/>
                </Grid>
                <Grid item xs={6} className='mt-2 pr-1'>
                            <Paper elevation={10} className='mb-3 p-2' style={{height: '240px'}}>
                                <Typography variant="body1"
                                            component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {t("Report period")}
                                </Typography>
                                <FormControl fullWidth margin="normal" required={false} style={{maxWidth: "400px"}}
                                             error={false}
                                             variant='filled'>
                                    <InputLabel id="period-select-label">{t("Select period")}</InputLabel>
                                    <Select
                                        name='period'
                                        labelId="period-select-label"
                                        id="period-select"
                                        value={selectedPeriod}
                                        renderValue={p=>p.name}
                                        onChange={(e) => {
                                            setSelectedPeriod(e.target.value)
                                        }}
                                    >
                                        {reportsPeriodsList}
                                    </Select>
                                </FormControl>
                            </Paper>
                </Grid>
                <Grid item xs={6} className='mt-2 pl-1'>
                    <Paper elevation={10} className='mb-3 p-2'>
                        <Typography variant="body1"
                                    component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t("Average grade")}
                        </Typography>
                        <EliaPieChart />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={10} className='p-2' style={{overflowX:"scroll"}}>
                        <Typography variant="body1"
                                    component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t("Average grade")}
                        </Typography>
                        <EliaBarChart />
                    </Paper>
                </Grid>
                <Grid item xs={12} className='mt-2'>
                    <Paper elevation={10} className='p-2'>
                        <Typography variant="body1"
                                    component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t("Last activity")}
                        </Typography>
                        <UserActivityTable currentReport={currentReport}/>
                    </Paper>
                </Grid>
            </Grid>
    )
}