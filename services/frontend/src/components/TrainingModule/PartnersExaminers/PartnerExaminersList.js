import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Grid from "@material-ui/core/Grid";
import CompanyService from "services/company.service"
import PartnerExaminersTable from "./PartnerExaminersTable";
import PartnerExaminerForm from "./PartnerExaminerForm";
import PartnerImportForm from "./PartnerImportForm";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import OptionsButton from "components/common/OptionsButton";
import ExaminersModal from "./ExaminersModal";
import {EButton} from "../../../styled_components";

const useStyles = makeStyles(theme=>({}))

export default function PartnerExaminersList({partnerId}){
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [MSUsers, setMSUsers] = useState([]);
    // const [module, setModule] = useState(null);
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    const [currentTab, setCurrentTab] = useState({openTab:0, type:""});
    const [activeTab, setActiveTab] = useState(0);
    const [staffTooltip, setStaffTooltip] = useState(true);

    // new
    const [examinersModalHelper, setExaminersModalHelper] = useState({isOpen: false, examinerId: undefined, openType: 'ADD'});

    // options Buttons
    const optionsBtn = [
        {id: 1, name: "Import from CSV", action: ()=>{setCurrentTab({openTab:1, type:""})}, disabled: true,},
        {id: 2, name: "Remove partner", action: ()=>{}, disabled: true,} // removing company functionality to be copied from PartnerForm.js, line 134, "function remove()"
    ]

    useEffect(()=>{
        // get partners by partnerId
        CompanyService.readAllPartnerExaminersAndTrainees(partnerId).then(res=>{
            let examinersAndTrainees = res.data.examiners.concat(res.data.trainees)
            setMSUsers(examinersAndTrainees)
        }).catch(error=>console.log(error))
    },[currentTab.openTab, examinersModalHelper.isOpen])

    return(
        <>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {currentTab.openTab === 0 && (
                        <div>
                            <div className="d-flex pt-2 px-2 mb-2 justify-content-between">
                                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {t("Members")}
                                </Typography>
                                <div className="d-flex justify-content-end">
                                <EButton eSize="small" eVariant="primary"
                                        startIcon={<PersonAddIcon/>}
                                        onClick={()=>{
                                            //setCurrentTab({openTab:2, type:"new"});
                                            setExaminersModalHelper({isOpen: true, examinerId: 'NEW', openType: 'ADD'})
                                        }}
                                >{t("Add member")}</EButton>
                                <OptionsButton btns={optionsBtn} eSize="small"/>
                                </div>
                            </div>
                            <PartnerExaminersTable MSUsers={MSUsers}
                                                     setCurrentTab={setCurrentTab}
                                                     setExaminersModalHelper={setExaminersModalHelper}
                            />
                        </div>
                    )}
                    {currentTab.openTab === 1 && (
                           <PartnerImportForm setCurrentTab={setCurrentTab} partnerId={partnerId}/>
                    )}
                    {currentTab.openTab === 2 && (
                        // <Paper elevation={10} className="p-2">
                        //     {/*<PartnerExaminerForm/>*/}
                        // </Paper>
                        <PartnerExaminerForm currentTab={currentTab} setCurrentTab={setCurrentTab} partnerId={partnerId}/>
                    )}
                </Grid>
            </Grid>
            <ExaminersModal examinersModalHelper={examinersModalHelper}
                            setExaminersModalHelper={setExaminersModalHelper}
                            partnerId={partnerId}
            />
        </>
    )
}