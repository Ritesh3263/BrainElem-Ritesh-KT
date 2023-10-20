import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Divider, FormHelperText} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import {makeStyles} from "@material-ui/core/styles";
import SetupCurriculum from "./SetupCurriculum";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));


export default function ClassProgram(props){
    const{
        MSClass={},
        setMSClass=()=>{},
        activeTab={},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [selectedPeriod, setSelectedPeriod] = useState({});
    const [currentProgram, setCurrentProgram] = useState({});

    useEffect(()=>{
        if(MSClass?.academicYear?.periods?.length>0 && activeTab === 1){
            setSelectedPeriod(MSClass?.academicYear?.periods[0]);
        }
    },[activeTab]);

    useEffect(()=>{
        if(selectedPeriod._id){
            setCurrentProgram(MSClass?.program.find(pr=> pr.period === selectedPeriod._id) || {})
        }
    },[selectedPeriod, MSClass]);


    const periodsList = MSClass?.academicYear?.periods ? MSClass?.academicYear?.periods.map((item, index)=>(<MenuItem key={item._id} value={item}>{item.name}</MenuItem>)):[];

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("Class program")}</small>
                <Divider variant="insert" />
            </Grid>
            <Grid item xs={12} md={6}>
                    <FormControl style={{ maxWidth: "400px" }} margin="dense" variant="filled" fullWidth={true} required={true}>
                        <InputLabel id="demo-simple-select-label">{t('Select period')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="selectedPeriod"
                            value={selectedPeriod}
                            renderValue={p=> p.name}
                            onChange={({target:{name,value}}) =>{
                                setSelectedPeriod(value);
                            }}
                        >
                            {periodsList}
                        </Select>
                        {!MSClass?.academicYear?.periods?.length>0 && (<FormHelperText className="text-danger">{t("Select year in general")}</FormHelperText>)}
                    </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={11} className='p-2 mt-2'>
                    <Grid container>
                        <Grid item xs={2} className='d-flex justify-content-center align-items-center'>
                            <SchoolOutlinedIcon className={`${classes.darkViolet}`} fontSize="large"/>
                        </Grid>
                        <Grid item xs={10}>
                            <Grid container>
                                <Grid item xs={12} className='mb-2'>
                                    <Typography variant="body1" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Information about class program")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {`${t("Assigned curriculum")}: `}
                                    </Typography>
                                    <Typography variant="body2" component="h2" className={`text-left ${!currentProgram?.trainingPath?.name && 'text-danger'}`}>
                                        {`${selectedPeriod && (currentProgram?.trainingPath?.name || t('No assigned curriculum'))}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className='d-flex'>
                                    <Typography variant="body2" component="h2" className="text-left mr-1" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {`${t("Assigned subjects")}: `}
                                    </Typography>
                                    <Typography variant="body2" component="h2" className={`text-left ${!currentProgram?.assignment?.length && 'text-danger'}`}>
                                        {`${selectedPeriod && (currentProgram?.assignment?.length || t('No assigned subjects'))}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <SetupCurriculum selectedPeriod={selectedPeriod}
                                 MSClass={MSClass}
                                 currentProgram={currentProgram}
                                 setMSClass={setMSClass}
                />
            </Grid>
        </Grid>
    )
}