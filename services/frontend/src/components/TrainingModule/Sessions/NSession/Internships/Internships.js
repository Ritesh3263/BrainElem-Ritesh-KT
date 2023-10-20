import React, {useState, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import InternshipsTable from "./InternshipsTable";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import InternshipForm from "./InternshipForm";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AssignInternships from "./AssignInterships/AssignInternships";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function Internships(){
    const { t } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const {
        currentSession,
    } = useSessionContext();
    const [isOpenInternshipHelper, setIsOpenInternshipHelper] = useState({isOpen: false, type: 'PREVIEW', internshipId: undefined});
    const [openSidebarDrawer, setOpenSidebarDrawer] = useState(false);

    useEffect(()=>{
        console.log(currentSession)
    },[currentSession]);

    return(
        <Grid container>
            <Grid item xs={12}>
                <div className="d-flex pt-2 px-2 justify-content-between">
                    <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("Internships")}
                    </Typography>
                    <Button size="small" variant="contained" color="primary"
                            startIcon={<AddCircleOutlineIcon/>}
                            disabled={(!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)}
                            onClick={()=>{setOpenSidebarDrawer(true)}}
                    >{t("Assign internship")}</Button>
                </div>
            </Grid>
            <Grid item xs={isOpenInternshipHelper.isOpen ? 5 : 12} className="mt-4 p-1">
               <InternshipsTable internships={currentSession?.internships}
                                 setIsOpenInternshipHelper={setIsOpenInternshipHelper}
               />
            </Grid>
            {isOpenInternshipHelper.isOpen && (
                <Grid item xs={isOpenInternshipHelper.isOpen ? 7 : 0} className="mt-4 p-1">
                    <InternshipForm isOpenInternshipHelper={isOpenInternshipHelper} setIsOpenInternshipHelper={setIsOpenInternshipHelper}/>
                </Grid>
            )}
            <AssignInternships openSidebarDrawer={openSidebarDrawer} setOpenSidebarDrawer={setOpenSidebarDrawer}/>
        </Grid>
    )
}