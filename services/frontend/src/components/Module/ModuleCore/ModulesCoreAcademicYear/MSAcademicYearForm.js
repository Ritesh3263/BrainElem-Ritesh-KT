import React, {useEffect, useState} from "react";
import {Col, Form, ListGroup, Row} from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import {useNavigate, useParams} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import SettingsIcon from "@material-ui/icons/Settings";
import moduleCoreService from "services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import DeleteIcon from "@material-ui/icons/Delete";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {EButton} from "styled_components";
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles(theme=>({}))

export default function MSAcademicYearForm(){
    const { t } = useTranslation();
    const { F_showToastMessage, F_getErrorMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { yearId } = useParams();
    const [minDate, setMinDate] = useState("");
    const [actionModalPeriod, setActionModalPeriod] = useState({isOpen: false, returnedValue: false, indexToRemove: null});
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [_errors, _setErrors] = useState([]);
    const [MSAcademicYear, setMSAcademicYear] = useState({
        name: "",
        periods:[
            {
                name: "",
                startDate: "",
                endDate: ""
            },
        ]
    });

    useEffect(()=>{
        if(actionModalPeriod.returnedValue){
            RemovePeriod(actionModalPeriod.indexToRemove);
        }
    },[actionModalPeriod.returnedValue]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeAcademicYear();
        }
    },[actionModal.returnedValue]);


    useEffect(()=>{
        F_handleSetShowLoader(true)
        if(yearId !== "new"){
            moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
                console.log(res.data.academicYears.find(x=>x._id===yearId))
                    setMSAcademicYear(res.data.academicYears.find(x=>x._id===yearId));
                F_handleSetShowLoader(false)
                }).catch(error=>console.error(error))
        }else{
            F_handleSetShowLoader(false)
        }
    },[])

    function saveChanges(){
        if(yearId !== "new"){
                moduleCoreService.updateMSAcademicYear(MSAcademicYear).then(res=>{
                            //display res.message in toast
                            console.log(res)
                            F_showToastMessage(t("Data was updated"),"success");
                            navigate("/modules-core/academic-year")
                }).catch(err=>{
                    _setErrors(err.response.data.message);
                    F_showToastMessage(t('Correct wrong fields'), 'warning')
                });
        }else{
                moduleCoreService.addMSAcademicYear(MSAcademicYear, manageScopeIds.moduleId).then(res=>{
                    //display res.message in toast
                    console.log(res)
                    F_showToastMessage(t("Data was created"),"success");
                    navigate("/modules-core/academic-year")
                }).catch(err=>{
                    _setErrors(err.response.data.message);
                    F_showToastMessage(t('Correct wrong fields'), 'warning')
                });
        }
    }

    function removeAcademicYear(){
            moduleCoreService.removeMSAcademicYear(MSAcademicYear).then(res=>{
                //display res.message in toast
                console.log(res)
                F_showToastMessage(t("Data was removed"),"success");
                navigate("/modules-core/academic-year")
            }).catch(error=>console.error(error));
    }

    function RemovePeriod(index){
        setMSAcademicYear(p=>{
            let val = Object.assign({},p);
            val.periods.splice(index,1);
            return val;
        })
    }


    const periodsListView = ( MSAcademicYear.periods.length >=1 ? MSAcademicYear.periods.map((mod,index)=>
        (<ListGroup.Item className="pl-2 pr-2 py-0 d-flex justify-content-between align-items-center mb-2" key={index} style={{backgroundColor:`rgba(255,255,255,0.35)`, borderRadius:"8px", minWidth:'900px'}}>
            <Col xs={1}><Avatar style={{width: "25px", height: "25px",backgroundColor: `rgba(82, 57, 112, 1)`}}><small>{index+1}</small></Avatar></Col>
            <Col >
                <TextField label={t("Period name")} style={{ margin: 8 }} margin="normal"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           value={mod.name}
                           error={_errors.includes(`periods.${index}.name`)}
                           onInput={(e) => {
                               setMSAcademicYear(p=>{
                                   let val = Object.assign({},p);
                                   val.periods[index].name = e.target.value;
                                   return val;
                               })
                           }}
                />
            </Col>
            <Col >
                <TextField label={t("Start date")} style={{width:"50%"}} margin="normal"
                           type="date"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           error={_errors.includes(`periods.${index}.startDate`)}
                           value={ mod.startDate ? new Date(mod.startDate).toISOString().split('T')[0] : ""}
                           inputProps={{
                               min: (index >0 && MSAcademicYear.periods[index-1]?.endDate) ? MSAcademicYear.periods[index-1]?.endDate?.slice(0,10) : null
                           }}
                           disabled={index>0 && !MSAcademicYear.periods[index-1]?.endDate}
                           onChange={(e) => {
                              setMinDate(e.target.value);
                               setMSAcademicYear(p=>{
                                   let val = Object.assign({},p);
                                   val.periods[index].startDate = e.target.value ? new Date (e.target.value).toISOString() : "";
                                   return val;
                               })
                               if(e.target.value === ""){
                                   setMSAcademicYear(p=>{
                                       let val = Object.assign({},p);
                                       val.periods[index].endDate = e.target.value ? new Date (e.target.value).toISOString() : "";
                                       return val;
                                   })
                               }
                           }}
                />
            </Col>
            <Col >

                <TextField label={t("End date")} style={{width:"50%"}} margin="normal"
                           disabled={!mod.startDate}
                           type="date"
                           error={_errors.includes(`periods.${index}.endDate`)}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           inputProps={{
                               min: minDate
                           }}
                           value={ mod.endDate ? new Date(mod.endDate).toISOString().split('T')[0] : ""}
                           onChange={(e) => {
                               setMSAcademicYear(p=>{
                                   let val = Object.assign({},p);
                                   val.periods[index].endDate = e.target.value ? new Date (e.target.value).toISOString() : "";
                                   return val;
                               })
                           }}
                />
            </Col>
            <Col xs={1} className="d-flex justify-content-end pr-2">
                <IconButton size="small">
                    <DeleteIcon style={{color: `rgba(82, 57, 112, 1)`}}
                        onClick={()=>setActionModalPeriod({isOpen: true, returnedValue: false, indexToRemove: index})}/>
                </IconButton>
            </Col>
        </ListGroup.Item>)) :null)



    return(


        <Card  className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${MSAcademicYear.name ? MSAcademicYear.name : "Year name"}`}/>*/}

            {/* // avatar={<Chip label={yearId==="new" ? t("Add"):t("Edit")} color="primary" />} */}
           
            <CardContent>
                <Grid container justifyContent="space-between" spacing={1}>
                    <Grid item xs={12} md={6}>
                        <TextField label={t("Year name")} style={{maxWidth:'400px'}} margin="dense"
                                   fullWidth={true}
                                   variant="filled"
                                   error={_errors.includes('yearName')}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSAcademicYear.name}
                                   onInput={(e) => {
                                       setMSAcademicYear(p=>{
                                           let val = Object.assign({},p);
                                           val.name = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className='d-flex align-items-center justify-content-end'>
                        <Tooltip title={t("Max 2 periods")} open={MSAcademicYear.periods.length>=2}>
                        <EButton
                            style={{maxWidth:"200px"}}
                            eSize='small'
                            eVariant='primary'
                            disabled={MSAcademicYear.periods.length>=2}
                            onClick={()=>{
                                setMSAcademicYear(p=>({...p,periods: [...p.periods,{
                                        name: "",
                                        startDate: "",
                                        endDate: ""
                                    }]}))
                            }}
                        >{t("Add period")}</EButton>
                        </Tooltip>
                    </Grid>
                </Grid>

                {(MSAcademicYear.periods.length >=1) ?
                    <>
                        <hr/>
                        <ListGroup>
                            {/*<div className="pl-2 pr-2 pb-1 d-flex justify-content-between align-items-center">*/}
                            {/*    <Col md={1} className=""><small>No.</small></Col>*/}
                            {/*    <Col className=""><small>{t("Name of period")}</small></Col>*/}
                            {/*    <Col className=""><small>{t("Start date")}</small></Col>*/}
                            {/*    <Col className=""><small>{t("End date")}</small></Col>*/}
                            {/*    <Col xs={1} className=" text-right"><SettingsIcon/></Col>*/}
                            {/*</div>*/}
                            {periodsListView}
                        </ListGroup>
                    </>: null}

            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center" >
                <Grid container>
                    <Grid item xs={6}>
                        <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                            F_showToastMessage(t("No change"),)
                            navigate("/modules-core/academic-year")
                        }}>
                            {t("Back")}
                        </Button>
                    </Grid>
                    <Grid item xs={6} className="p-0 d-flex justify-content-end">
                        {yearId !== "new" ?
                            <Button variant="contained" size="small" color="inherit"
                                    onClick={()=>setActionModal({isOpen: true, returnedValue: false})}
                                >
                                {t("Remove")}
                            </Button> : null}
                        <Button onClick={saveChanges} size="small" variant="contained" color="primary" className="ml-5">
                            {t("Save")}
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModalPeriod}
                                setActionModal={setActionModalPeriod}
                                actionModalTitle={t("Removing Period")}
                                actionModalMessage={t("Are you sure you want to remove Period? The action is not reversible!")}
            />
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing school year")}
                                actionModalMessage={t("Are you sure you want to remove school year? The action is not reversible!")}
            />
        </Card>
    )
}