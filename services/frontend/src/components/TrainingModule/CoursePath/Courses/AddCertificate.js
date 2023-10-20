import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import {
    Checkbox,
    Radio,
    FormControlLabel, FormGroup,
    ListSubheader,
    Paper
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchField from "../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../common/Table/TableSearch";
import chapterService from "../../../../services/chapter.service";
import {useCoursePathContext} from "../../../_ContextProviders/CoursePathProvider/CoursePathProvider";
import CertificateService from "../../../../services/certificate.service";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@mui/material/Typography";
import { theme } from "../../../../MuiTheme";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";


export default function AddCertificate({isOpenSidebarAddCertificate, setIsOpenSidebarAddCertificate}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [availableCertificates, setAvailableCertificates] = useState([]);
    // const [selectedCertificate, setSelectedCertificate] = useState(undefined);
    const [filteredData,setFilteredData] = useState([]);
    
    const {F_showToastMessage, F_handleSetShowLoader,F_getErrorMessage} = useMainContext();

    /** coursePathContext **/
    const {
        currentCoursePath,
        coursePathActionType,
        coursePathDispatch,
    } = useCoursePathContext();

    useEffect(()=>{
        CertificateService.readAll().then(res=>{
            if(res.status === 200 && res.data){
                setAvailableCertificates(res.data.map(c=>{
                    if(c._id === currentCoursePath?.certificate?._id||c._id === currentCoursePath?.certificate){
                        c.isSelected = true;
                    } else {
                        c.isSelected = false;
                    }
                    return c;
                }));
                F_handleSetShowLoader(false);
            }else{
                F_showToastMessage(F_getErrorMessage({response:res}));
            }
        }).catch(error=>{
            console.error(error);
            F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
            F_handleSetShowLoader(false);
        })
    },[currentCoursePath]);
    useEffect(()=>{
        setFilteredData(availableCertificates);
    },[availableCertificates]);

    const allCertificatesList = filteredData?.map(certificate=>(
        <FormControlLabel
            key={certificate._id}
            control={
                <Radio
                    checked={certificate.isSelected}
                    style={{width: '20px', height: '20px', color: new_theme.palette.newSupplementary.NSupText, marginRight: '10px'}}
                    onChange={()=>{
                        // setSelectedCertificate(certificate);
                        coursePathDispatch({
                            type: coursePathActionType.SET_CERTIFICATE,
                            payload: certificate._id
                        });
                    }}
                    value={certificate._id}
                />
            }
            label={certificate.name}
        />
    ));

    
    return(
        <SwipeableDrawer
                PaperProps={{
                    style:{
                        backgroundColor: theme.palette.neutrals.white,
                        maxWidth:"450px"
                }}}
            anchor="right"
            // onOpen=''
            onOpen={()=>{
                // setIsOpenSidebarAddCertificate(true);
                // setSearchingText('');
            }}
            open={isOpenSidebarAddCertificate}
            onClose={()=>{
                setIsOpenSidebarAddCertificate(false);
                setSearchingText('');
            }}
        >
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                        <Grid container  className="py-2">
                            <Grid item xs={12}>
                            <Typography variant="h3" component="h2" className="text-left text-justify mt-2" style={{fontSize:"34px", color:new_theme.palette.primary.MedPurple}}>
                                {t("Select certificate")}
                            </Typography>   
                            <Divider variant="insert" className='heading_divider' />
                            
                            </Grid>
                            <Grid item xs={12} style={{marginTop:20}}>
                                    <SearchField
                                        className="text-primary"
                                        value={searchingText}
                                        onChange={(e)=>{TableSearch(e.target.value, availableCertificates, setSearchingText, setFilteredData)}}
                                        clearSearch={()=>TableSearch('', availableCertificates, setSearchingText, setFilteredData)}
                                    />
                            </Grid>
                        </Grid>
                    </ListSubheader>}
            >
                <FormGroup className="pl-4">
                    {allCertificatesList?.length>0 ? allCertificatesList: <span>{t("No data")}</span>}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}