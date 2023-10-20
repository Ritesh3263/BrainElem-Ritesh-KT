import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import {
    Checkbox,
    FormControlLabel, FormGroup,
    ListSubheader,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchField from "../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../common/Table/TableSearch";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useCoursePathContext} from "../../../_ContextProviders/CoursePathProvider/CoursePathProvider";
import InternshipService from "../../../../services/internship.service";
import Typography from "@mui/material/Typography";
import { theme } from "../../../../MuiTheme";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";


export default function AddInternship({isOpenSidebarAddInternship, setIsOpenSidebarAddInternship}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [internships, setInternships] = useState([]);

    const {F_showToastMessage, F_handleSetShowLoader,F_getErrorMessage} = useMainContext();
    /** coursePathContext **/
    const {
        currentCoursePath,
        coursePathActionType,
        coursePathDispatch,
    } = useCoursePathContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        InternshipService.readAll().then(res=>{
            if(res.status === 200 && res.data){
                // updateSelected(res.data);
                updateSelected(res.data.map(c=>{
                    c.isSelected = Boolean(currentCoursePath?.internships?.find(i=>i._id === c._id||i===c._id));
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

    const updateSelected = (intItems=[])=>{
        let selectedList = intItems?.map(int=>{
            currentCoursePath?.internships?.map(chI=>{
                if(int._id === chI._id||int._id===chI){
                    int.isSelected = true;
                }else{
                    int.isSelected = false;
                }
            })
            return int;
        });
        setFilteredData(selectedList);
    };
    
    const allInternshipsList = filteredData?.map((internship,index)=>(
        <FormControlLabel
            // label={<div><span>{internship.name}</span></div>}
            key={internship._id}
            control={
                <Checkbox style={{color: new_theme.palette.newSupplementary.NSupText}}
                    checked={!!internship.isSelected}
                    name={internship.name}
                    value={index}
                    onChange={(e,checked)=>{
                        if(checked){
                            coursePathDispatch({
                                type: coursePathActionType.UPDATE_INTERNSHIPS,
                                payload: {type: 'ADD', internship}
                            });
                        }else{
                            coursePathDispatch({
                                type: coursePathActionType.UPDATE_INTERNSHIPS,
                                payload: {type: 'REMOVE', internshipId: internship._id}
                            });
                        }
                    }}
                />
            }
            label={internship.name}
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
                // setIsOpenSidebarAddInternship(true);
                // setSearchingText('');
            }}
            open={isOpenSidebarAddInternship}
            onClose={()=>{
                setIsOpenSidebarAddInternship(false);
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
                                {t("Select internships")}
                            </Typography>
                            <Divider variant="insert" className='heading_divider' />

                            </Grid>
                            <Grid item xs={12} style={{marginTop:20}}>
                                    <SearchField
                                        className="text-primary"
                                        value={searchingText}
                                        onChange={(e)=>{TableSearch(e.target.value, internships, setSearchingText, setFilteredData)}}
                                        clearSearch={()=>TableSearch('', internships, setSearchingText, setFilteredData)}
                                    />
                            </Grid>
                        </Grid>
                    </ListSubheader>}
            >
                <FormGroup className="pl-3">
                    {allInternshipsList.length > 0 ? allInternshipsList : <div className="text-center">{t("No Internships")}</div>}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}