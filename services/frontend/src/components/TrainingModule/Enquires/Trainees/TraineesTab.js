import React, {lazy, useEffect, useState} from "react";
import {Checkbox, Divider, FormControlLabel, FormGroup, ListSubheader, Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TraineesTable from "./TraineesTable";
import CompanyService from "services/company.service";
import CertificationSessionService from "services/certification_session.service"
import {useEnquiryContext} from "components/_ContextProviders/EnquiryProvider/EnquiryProvider";
import Typography from "@material-ui/core/Typography";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { theme } from "MuiTheme";

const TraineeDetailsModal = lazy(() => import("./TraineeDetailsModal/TraineeDetailsModal"));
const useStyles = makeStyles((theme) => ({}));

export default function TraineesTab(){
    const classes = useStyles();
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [isOpenTraineeModal,setIsOpenTraineeModal]=useState({isOpen: false, traineeId: undefined});
    const [allPartnerTrainees, setAllPartnerTrainees]=useState([]);
    const [searchingText, setSearchingText] = useState('');
    const [isOpenSidebarManageTrainees, setIsOpenSidebarManageTrainees] = useState(false);
    const [filteredData,setFilteredData] = useState([]);
    const {
        currentEnquiry,
        enquiryDispatch,
        enquiryReducerActionType,
    } = useEnquiryContext();

    useEffect(()=>{
        if(currentEnquiry?.company){
            CompanyService.readAllPartnerTrainees(currentEnquiry?.company).then(res=>{
                if(res?.status === 200 && res?.data?.trainees){
                    updateSelected(res.data.trainees);
                }
            }).catch(err=>console.log(err));
        }
        else {
            CertificationSessionService.readAllTraineesFromTemplate(currentEnquiry?.certificationSession).then(res=>{
                if(res?.status === 200 && res?.data){
                    updateSelected(res.data);
                }
            }).catch(err=>console.log(err));
        }
    },[currentEnquiry?.trainees]);

    useEffect(()=>{
        setFilteredData(allPartnerTrainees);
    },[allPartnerTrainees]);

    const updateSelected=(uItems=[])=>{
        let selectedList = uItems?.map(co=>{
            currentEnquiry?.trainees?.length>0 && currentEnquiry?.trainees?.map(chC=>{
                if(co._id === chC._id){
                    co.isSelected = true;
                }
            });
            return co;
        });
        setAllPartnerTrainees(selectedList);
    };

    const handleRemoveTrainee=(traineeId)=>{
        enquiryDispatch({type: enquiryReducerActionType.UPDATE_TRAINEES, payload: {type: 'REMOVE', traineeId}});
    }

    const traineeDetailsHandler=(actionType,traineeId)=>{
        if(actionType === 'OPEN'){
            console.log("traineeDetailsHandler",traineeId);
            setIsOpenTraineeModal({isOpen: true, traineeId})
        }
    };

    const allTraineesList = filteredData.map((stu,index)=>(
        <FormControlLabel
            label={`${stu?.name} ${stu?.surname}`}
            control={
                <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                          checked={!!stu?.isSelected}
                          name={stu?.name}
                          value={index}
                          onChange={(e,isS)=>{
                              if(isS){
                                  if(currentEnquiry?.trainees.length+2 > currentEnquiry.traineesLimit )
                                  F_showToastMessage(t("You reached limit of users in this enquiry"),"info");
                                  enquiryDispatch({type: enquiryReducerActionType.UPDATE_TRAINEES,
                                        payload:{type: 'ADD', trainee: stu, traineesLimit: currentEnquiry.traineesLimit}
                                  })
                              }else{
                                  enquiryDispatch({type: enquiryReducerActionType.UPDATE_TRAINEES,
                                      payload:{type: 'REMOVE', traineeId: stu._id}
                                  })
                              }
                          }}
                />
            }
        />
    ));

    return(
        <>
            <Typography variant="h5" component="h2" className="text-left mt-3" style={{color: `rgba(82, 57, 112, 1)`}}>
                {t("Students")}
            </Typography>
            <Divider variant="insert" />
            <Grid container className="mt-2" >
                        <Grid item xs={12} hidden={false}>
                            <Button size="small" variant="contained" color="primary"
                                    onClick={()=>{setIsOpenSidebarManageTrainees(true)}}
                            >{t("Manage students")}</Button>
                        </Grid>
                        <Grid item xs={12} className="mt-2">
                            <TraineesTable handleRemoveTrainee={handleRemoveTrainee}
                                           traineeDetailsHandler={traineeDetailsHandler}
                            />
                        </Grid>
            </Grid>
            <TraineeDetailsModal isOpenTraineeModal={isOpenTraineeModal} setIsOpenTraineeModal={setIsOpenTraineeModal}/>
            <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: theme.palette.neutrals.white,
                    maxWidth:"450px"
                }}}
                style={{width:"500px"}}
                anchor="right"
                onOpen=""
                open={isOpenSidebarManageTrainees}
                onClose={()=>{
                    setIsOpenSidebarManageTrainees(false);
                    setSearchingText('');
                }}
            >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                            <Grid container className="py-2">
                                <Grid item xs={12}>
                                <Typography variant="h3" component="h2" className="mt-2 text-center text-justify mb-2" style={{fontSize:"32px"}}>   
                                    {t("Manage students")}
                                </Typography>    
                                </Grid>
                                <Grid item xs={12}>
                                        <SearchField
                                            className="text-primary"
                                            value={searchingText}
                                            onChange={({target:{value}})=>{TableSearch(value, allPartnerTrainees, setSearchingText, setFilteredData)}}
                                            clearSearch={()=>TableSearch('', allPartnerTrainees, setSearchingText, setFilteredData)}
                                        />
                                </Grid>
                            </Grid>
                        </ListSubheader>}
                >
                    <FormGroup className="pl-3">
                        {(allTraineesList?.length>0) ? allTraineesList : <span>{t("No data")}</span>}
                    </FormGroup>
                </List>
            </SwipeableDrawer>
        </>
    )
}