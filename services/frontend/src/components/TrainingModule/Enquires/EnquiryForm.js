import React, {lazy, useEffect, useState} from "react";
import {Card, CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useEnquiryContext} from "components/_ContextProviders/EnquiryProvider/EnquiryProvider";
import Typography from "@material-ui/core/Typography";
import EnquiryService from "services/enquiry.service";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {ETab, ETabBar} from "styled_components";
import { theme } from "MuiTheme";

const StudentsTab = lazy(() => import("./Trainees/TraineesTab"));
const GeneralTab = lazy(() => import("./General/GeneralTab"));

const useStyles = makeStyles((theme) => ({}));

export default function EnquiryForm() {
    const classes = useStyles();
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState(0);


    const {
        F_showToastMessage,
    } = useMainContext();

    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeId: undefined});

    const {
        editFormHelper,
        setEditFormHelper,

        currentEnquiry,
        enquiryDispatch,
        enquiryReducerActionType,
    } = useEnquiryContext();


    useEffect(() => {
        if (editFormHelper.enquiryId !== "NEW") {
            EnquiryService.read(editFormHelper.enquiryId).then((res) => {
                if(res?.data && res.status ===200){
                    enquiryDispatch({type: enquiryReducerActionType.INIT, payload: res.data});
                }
            })
        }else{
            enquiryDispatch({type: enquiryReducerActionType.NEW_ENQUIRY, payload: 'NEW_ENQUIRY'});
        }
        setCurrentTab(0);
    }, [editFormHelper.enquiryId]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove(actionModal.removeId);
        }
    },[actionModal.returnedValue]);


    function save() {
        console.log("save");
        if(editFormHelper.enquiryId === 'NEW'){
            EnquiryService.addByModuleManager(currentEnquiry).then(res=>{
                console.log("add:",res.data);
                F_showToastMessage('Data was added','success');
                setEditFormHelper({isOpen: false, openType: undefined, enquiryId: 'NEW'});
                setCurrentTab(0);
            })
        } else {
            EnquiryService.update(currentEnquiry).then(res=>{
                console.log("update:",res.data);
                F_showToastMessage('Data was updated','success');
                setEditFormHelper({isOpen: false, openType: undefined, enquiryId: 'NEW'});
                setCurrentTab(0);
            })
        }
    }

    function remove(enquiryId) {
        EnquiryService.remove(enquiryId).then(res=>{
            console.log("remove:",res.data);
            F_showToastMessage('Data was removed','success');
            setEditFormHelper({isOpen: false, openType: undefined, enquiryId: 'NEW'});
            setCurrentTab(0);
        });
    }

    return (
        <Card className="p-0 d-flex flex-column m-0">
            <CardHeader title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                {` ${currentEnquiry.name || t("Fill enquiry name")}`}
                </Typography>
            )} 
            // avatar={<Chip label={(editFormHelper.enquiryId === 'NEW') ? t("Add"):t("Edit")} color="primary" />}
            />
            <CardContent>
            <ETabBar
                    style={{maxWidth:'450px'}}
                    eSize='small'
                    value={currentTab}
                    onChange={(e,i)=>setCurrentTab(i)}

                >
                    <ETab label='General' style={{minWidth:'50px'}} color={editFormHelper.openType === 'General' ? "primary" : "secondary"}  onClick={() => { setEditFormHelper(p=>({...p, openType: 'GENERAL'}))}} eSize='small'/>
                    <ETab label='Messages' style={{minWidth:'50px'}} disabled={true} onClick={() => {setEditFormHelper(p=>({...p, openType: 'MESSAGES'}))}} eSize='small'/>
                   
                    {editFormHelper.enquiryId !== 'NEW' && (
                    <ETab label='Students' size="small" color={editFormHelper.openType === 'STUDENTS' ? "primary" : "secondary"}
                        style={{minWidth:'50px'}}
                        onClick={() => {
                            setEditFormHelper(p=>({...p, openType: 'STUDENTS'}))
                        }}
                        />
                    )}
            </ETabBar>
                <Grid container spacing={1}>
                    <Grid item xs={12} className="d-flex flex-column">
                        {editFormHelper.openType === 'GENERAL' && (<GeneralTab/>)}
                        {editFormHelper.openType === 'MESSAGES' && <p>{t("Messages")}</p>}
                        {editFormHelper.openType === 'STUDENTS' && <StudentsTab/>}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center">
                    <Grid container>
                        <Grid item xs={6} >
                            <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={() => {
                                    setCurrentTab(0);
                                    F_showToastMessage("No change");
                                    setEditFormHelper({isOpen: false, openType: undefined, enquiryId: 'NEW'});
                                }}
                            >
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {editFormHelper.enquiryId !== 'NEW' && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="inherit"
                                    onClick={() => setActionModal({isOpen: true, returnedValue: false, removeId: currentEnquiry._id})}
                                >
                                    {t("Remove")}
                                </Button>
                            )}
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={save}
                                className="ml-5"
                            >
                                {t("Save")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing enquiry")}
                                actionModalMessage={t("Are you sure you want to remove this enquiry? The action is not reversible!")}
            />
        </Card>
    );
}
