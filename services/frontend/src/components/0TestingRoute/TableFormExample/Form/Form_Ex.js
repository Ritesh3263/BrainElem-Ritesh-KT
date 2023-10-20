import React, {useEffect, useState} from "react";
import {Card, CardHeader, Divider, ListSubheader, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import CardContent from "@material-ui/core/CardContent";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}));

export default function Form_Ex({editFormHelper,setEditFormHelper}){
    const classes = useStyles();
    const { t } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const [activeTab, setActiveTab] = useState(0);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);


    const remove=()=>{
        console.log("remove");
        setEditFormHelper({isOpen: false, curriculumId: null});
        F_showToastMessage(t("Data was removed - mock"),"success");
    }

    const save=()=>{
        console.log("save");
        setEditFormHelper({isOpen: false, curriculumId: null});
        F_showToastMessage(t("Data was saved - mock"),"success");
    }

    return(
        <Card className="p-0 d-flex flex-column m-0 h-100">

            {/*<CardHeader title={(*/}
            {/*    <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>*/}
            {/*        {` ${competenceBlock?.title || t("Competence block name")}`}*/}
            {/*    </Typography>*/}
            {/*)} avatar={<Chip label={formIsOpen.isNew ? t("Add"):t("Edit")} color="primary" />}*/}
            {/*/>*/}

            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${0 || t("Competence block name")}`}
                </Typography>
            )} avatar={<Chip label={(editFormHelper.curriculumId === 'NEW') ? t("Add"):t("Edit")} color="primary" />}
            />

            <CardContent>
                <ButtonGroup size="small" color="primary" aria-label="large outlined primary button group" className="d-flex flex-fill justify-content-center">
                    <Button classes={{root: classes.root}} size="small" variant="contained" color={activeTab === 0 ? "primary" : "secondary"}
                            style={{width: "50%"}}
                            onClick={()=>{setActiveTab(0)}}
                    >{t("General informations")}</Button>
                    <Button classes={{root: classes.root}} size="small" variant="contained" color={activeTab === 0 ? "secondary" : "primary"}
                            style={{width: "50%"}}
                            onClick={()=>{setActiveTab(1)}}
                    >{t("Methods & Criteria")}</Button>
                </ButtonGroup>

                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {activeTab === 0 ? (
                            <>
                                <span>General settings</span>
                            </>
                        ) : (
                            <>
                                <span>Assign subjects</span>
                            </>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage(t("No change"),)
                                setEditFormHelper({isOpen: false, curriculumId: null});
                            }}>
                                {t("Back")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {
                                editFormHelper.curriculumId !== 'NEW' && (
                                    <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                                            onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                        {t("Remove")}
                                    </Button>
                                )
                            }
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    onClick={save} className="ml-5"
                            >{t("Save")}</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>

            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing curriculum")}
                                actionModalMessage={t("Are you sure you want to remove competence curriculum? The action is not reversible!")}
            />
        </Card>
    )
}