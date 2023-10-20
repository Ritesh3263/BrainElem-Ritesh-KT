import React, { lazy, memo, useCallback, useEffect, useState } from "react";
import { Card, Collapse, Dialog, Divider, TextField, Typography, Box, Grid } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import moduleCoreService from "services/module-core.service";
import { ETextField } from "new_styled_components";
import Checkbox from "@mui/material/Checkbox";
import { new_theme } from "NewMuiTheme";
import Confirm from "components/common/Hooks/Confirm";
import { ThemeProvider } from '@mui/material';
import StyledButton from "new_styled_components/Button/Button.styled";
import "./Project.scss"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ProjectService from "services/project.service"
import TeamService from "services/team.service"
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import DisplayContent from "components/Content/Display/DisplayContent"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Popover from "@mui/material/Popover";
import { Fragment } from "react";
import { KeyboardDatePicker } from "@material-ui/pickers";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from "react-router-dom";
// import TeamsDialog from "./TeamsDialog";

const TeamsDialog = lazy(() => import('./TeamsDialog'));
// import {makeStyles} from "@mui/material";

// const useStylesDatePicker = makeStyles({
//     paper:{
//         backgroundColor:yellow,
//         height : '200vh',
//     },
//     span : {
//         color: new_theme.palette.primary.MedPurple,
//         width:'400px'
//     },
//     ['MuiButton-text'] : {
//         height:'200px'
//     }
// })

const palette = new_theme.palette;

const NameField = memo(({  ...props }) => (
    <TextField
    //   label="Name"
    //   value={value}
    //   onChange={onChange}
        {...props}
    />
  ));

const DescriptionField = memo(({  ...props }) => (
    <TextField
    //   label="Description"
    //   value={value}
    //   onChange={onChange}
        {...props}
    />
  ));

  const MemoizedOrientation = memo(({
    currentProject,
    showFilter,
    setNADFilter,
    setShowFilter,
    NADFilter,
    opportunityCounter,
    setEditFormHelper,
    setCurrentProject,
    setOpportunityCounter,
    setOpenerIndex,
    editFormHelper,
    openerIndex,
    selectedTeams,
    contentHelper,
    setContentHelper
      }) => {

    const { t } = useTranslation(['translation', 'traits', 'sentinel-MyProjects-AutomatedProjects']);
    const navigate = useNavigate();
    const { F_showToastMessage, F_formatSeconds, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader,  F_t } = useMainContext();
    const { userPermissions, user } = F_getHelper();

    return <>
        <Grid item xs={12}>
            <hr className="d-mb-none"></hr>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop:{xs:2, md:0} }}>
                <Typography variant="subtitle0" component="h3">
                    {t("sentinel-MyProjects-AutomatedProjects:LIST_OF_OPPORTUNITIES")}
                </Typography>
                <StyledEIconButton eColor="primary" eSize="medium" 
                    disabled={!currentProject?.cognitiveBlockCollection?.length > 0}
                    title={t("sentinel-MyProjects-AutomatedProjects:FILTER")}
                    onClick={() => { 
                        if(showFilter){
                            setNADFilter("nadfilter-0");
                            setShowFilter(false);
                        } else {
                            setShowFilter(true);
                        }
                        }} >
                    <FilterListIcon />
                </StyledEIconButton>
            </Box>
            {showFilter && <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', mt:2 }} gap='8px'>
                {["All","traits:self-activation-short-name","traits:self-confidence-short-name", 'traits:communication-strategy-short-name',"traits:cooperation-short-name","traits:regularity-short-name"].map((item, index) => (<Box 
                    key={index} title={t("sentinel-MyProjects-AutomatedProjects:FILTER_BY")+t(item)}
                    sx={{ border: `1px solid ${palette.primary.PPurple}`, borderRadius: '8px', p: 1, height: '40px', display: 'flex', cursor:'pointer', backgroundColor: NADFilter==="nadfilter-"+index?palette.primary.PPurple:'white' }}
                    onClick={() => { setNADFilter("nadfilter-"+index) }}>
                    <Typography variant="subtitle1" sx={{ color: NADFilter==="nadfilter-"+index?'white':palette.primary.PPurple }}>{t(item)}</Typography>
                </Box>))}
            </Box>}

        </Grid>
        {currentProject?.cognitiveBlockCollection?.length > 0 && <Box sx={{my:2, color: 'black'}}>Selected: {opportunityCounter}</Box> }  
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', maxHeight: '500px', height:'100%', overflow: 'auto' }} gap="16px">  
            {currentProject?.cognitiveBlockCollection?.length > 0 ? <>
            {currentProject.cognitiveBlockCollection.filter(opp=>NADFilter==="nadfilter-0"?true:("nadfilter-"+opp.opportunity.area.key)===NADFilter).map((opportunity, index) => {
                return <Box key={opportunity.id} sx={{ border: `1px solid ${palette.primary.PBorder}`, borderRadius: '8px', gap: '16px'}} >
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', my: 2, mx: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '10px', width:'100%' }}>
                            <Box sx={{ minWidth: 0, pl:3, pr: '10px', cursor: 'pointer', maxWidth:'13rem', width:'100%' }} onClick={() => { 
                                setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                setCurrentProject(p => ({ 
                                    ...p, // considering that the _id is unique for the filter below
                                    cognitiveBlockCollection: p.cognitiveBlockCollection.map((item, i) => item.id === opportunity.id ? { 
                                        ...item, 
                                        isSelected: !item.isSelected, 
                                        cognitiveBlocks: item.cognitiveBlocks.map((block)=>({...block, isSelected: !item.isSelected}))
                                    } : item) 
                                }))
                                setOpportunityCounter(prev => prev + (opportunity.isSelected ? -1 : 1))
                                }}>
                                {opportunity.isSelected? <RemoveCircleOutlineIcon sx={{ fontSize: '20px', color: "black", mr: '10px' }} />: <AddCircleOutlineIcon sx={{ fontSize: '20px', color: "black", mr: '10px' }} />}
                                <Typography variant="subtitle1" component="span" sx={{ color: palette.newSupplementary.NSupText, fontWeight:'bold' }}>{opportunity.isSelected? t("sentinel-MyProjects-AutomatedProjects:REMOVE_FROM_PROJECT"):t("sentinel-MyProjects-AutomatedProjects:ADD_TO_PROJECT")}</Typography>
                            </Box>
                            <Typography onClick={() => { setOpenerIndex(prev => prev.includes('opportunity-'+index) ? prev.filter(i => i !== 'opportunity-'+index) : [...prev, 'opportunity-'+index]) }} variant="body4" sx={{ px: '10px', cursor: 'pointer' }}>
                                {opportunity.opportunity?.text|| t('sentinel-MyProjects-AutomatedProjects:OPPORTUNITY_TEXTS')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                            {opportunity.isSelected && <Box sx={{minWidth:'13.3rem'}} >
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', fontSize: '12px', color: palette.neutrals.almostBlack, justifyContent:'space-between' }}>
                                    {t("sentinel-MyProjects-AutomatedProjects:SET_DEADLINE")}
                                    <KeyboardDatePicker
                                        fullWidth
                                        size="small" 
                                        error={false}
                                        helperText=""
                                        disabled={currentProject.deadline === null}
                                        className="datePickerH2"
                                        inputVariant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                        maxDate={new Date(currentProject?.deadline)} // limit to project deadline
                                        InputProps={{
                                            readOnly: editFormHelper.openType === 'PREVIEW',
                                            disableUnderline: editFormHelper.openType === 'PREVIEW',
                                        }}
                                        id={"date-picker-dialog-opportunity"+index}
                                        // label={t("Deadline")}
                                        format="DD.MM.yyyy"
                                        title={t("sentinel-MyProjects-AutomatedProjects:OPPURTUNITY_DEADLINE")}
                                        disablePast={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={opportunity.deadline ? new Date(opportunity.deadline).toISOString() : null}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                            disabled: editFormHelper.openType === 'PREVIEW',
                                            style: { display: editFormHelper.openType === 'PREVIEW' ? 'none' : 'block', marginRight:'-8px' }
                                        }}
                                        onChange={(date) => {
                                            if (date && date._isValid) {
                                                setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                                setCurrentProject(p => ({ 
                                                    ...p, 
                                                    cognitiveBlockCollection: p.cognitiveBlockCollection.map((item, i) => item.id === opportunity.id ? { 
                                                        ...item, 
                                                        deadline: date.toISOString(),
                                                        cognitiveBlocks: item.cognitiveBlocks.map((block)=>({...block, deadline: date.toISOString()}))
                                                    } : item) }))
                                            }
                                        }}
                                        keyboardIcon={<ArrowDropDownIcon />}
                                        onClick={()=>{
                                            if (!currentProject.deadline) {
                                                F_showToastMessage("sentinel-MyProjects-AutomatedProjects:SET_PROJECT_DEADLINE", "warning")
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>}
                            <Box className={`progressBar ${opportunity.progress>0? 'ongoing':''}`} sx={{width:'12rem !important'}}>
                                <div className={`progressBarValue ${opportunity.progress>=100? 'max':''}`} style={{ width: `${opportunity.progress}%` }}></div>
                            </Box>
                            <StyledEIconButton color="primary" size="medium" onClick={() => { setOpenerIndex(prev => prev.includes('opportunity-'+index) ? prev.filter(i => i !== 'opportunity-'+index) : [...prev, 'opportunity-'+index]) }}>
                                <ArrowForwardIosIcon sx={{ transform: openerIndex.includes('opportunity-'+index) ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.3s ease-in-out' }}  />
                            </StyledEIconButton>
                        </Box>
                    </Box>
                    <Collapse in={openerIndex.includes('opportunity-'+index)} timeout="auto" unmountOnExit sx={{ mx: '10px' }}>
                    <Divider />
                        <Box sx={{ mt:1, mb:2, overflow: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                        {opportunity.users.map((user, index) => {
                            return <Box key={index} 
                                        sx={{ border: `1px solid ${palette.primary.PPurple}`, borderRadius: '8px', padding: '8px', height: '40px' }}
                                        onClick={() => { console.log("user") }}
                                    >
                                        {/* <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect y="0.793945" width="24" height="24" rx="12" fill="#EADDFF"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6 10.3939C15.6 12.3822 13.9883 13.9939 12 13.9939C10.0118 13.9939 8.40002 12.3822 8.40002 10.3939C8.40002 8.40572 10.0118 6.79395 12 6.79395C13.9883 6.79395 15.6 8.40572 15.6 10.3939ZM14.4 10.3939C14.4 11.7194 13.3255 12.7939 12 12.7939C10.6745 12.7939 9.60002 11.7194 9.60002 10.3939C9.60002 9.06846 10.6745 7.99395 12 7.99395C13.3255 7.99395 14.4 9.06846 14.4 10.3939Z" fill="#6750A4"/>
                                            <path d="M12 15.7939C8.11539 15.7939 4.80559 18.091 3.5448 21.3092C3.85194 21.6142 4.17548 21.9026 4.514 22.1732C5.45284 19.2186 8.39806 16.9939 12 16.9939C15.602 16.9939 18.5472 19.2186 19.4861 22.1732C19.8246 21.9026 20.1481 21.6142 20.4553 21.3092C19.1945 18.091 15.8847 15.7939 12 15.7939Z" fill="#6750A4"/>
                                        </svg> */}

                                        <Typography component='span' variant="subtitle1" sx={{ color: palette.primary.PPurple, pl:1  }}>{user.name + " " + user.surname}</Typography>
                                </Box>
                        })}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap='10px'>
                            {opportunity.cognitiveBlocks.map((block, index) => {
                                return <Box key={index} sx={{ backgroundColor: palette.newSupplementary.SupCloudy, borderRadius: '8px', padding: '0px 16px 0px 16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}
                                    onClick={() => { console.log("block") }}>
                                    <Box sx={{ flex:1 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px', alignItems: 'center', my: 1 }}>
                                            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                                <Box sx={{ display: 'block', height: '23px', borderRadius: '8px', backgroundColor: 'white', position: 'relative', fontSize: '10px', color: palette.newSupplementary.NSupText, px: '8px', py: '4px' }}>
                                                    {t("sentinel-MyProjects-AutomatedProjects:ACTIVITY")} {/* {block.content.type} */}
                                                </Box>
                                                <Typography variant="body4">
                                                    {block.content.title}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
                                                <Box sx={{minWidth:'12rem', display: 'block' }}>
                                                <Box className={`progressBar ${block.progress>0? 'ongoing':''}`}>
                                                    <div className={`progressBarValue ${block.progress>=100? 'max':''}`} style={{ width: `${block.progress}%` }}></div>
                                                </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Divider sx={{mx:0}} />
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', my: 1}}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '10px' }}>
                                                <Box sx={{ minWidth: '0px', p: '0px', cursor: 'pointer' }} onClick={() => { 
                                                    setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                                    setCurrentProject(p => ({ 
                                                        ...p, // considering that the _id is unique for the filter below
                                                        cognitiveBlockCollection: p.cognitiveBlockCollection.map((item, i) => item.id === opportunity.id ? { ...item, cognitiveBlocks: item.cognitiveBlocks.map((solBlock, j) => block.content.title === solBlock.content.title ? { ...solBlock, isSelected: !solBlock.isSelected } : solBlock) } : item) }))
                                                    }}>
                                                    {block.isSelected? <RemoveCircleOutlineIcon sx={{ fontSize: '20px', color: "black", mr: '10px' }} />: <AddCircleOutlineIcon sx={{ fontSize: '20px', color: "black", mr: '10px' }} />}
                                                    <Typography variant="subtitle1" component="span" sx={{ color: palette.newSupplementary.NSupText, fontWeight:'bold' }}>{block.isSelected? t("sentinel-MyProjects-AutomatedProjects:REMOVE_SOLUTION"):t("sentinel-MyProjects-AutomatedProjects:ADD_SOLUTION")}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', fontSize: '12px', color: block.isSelected ? palette.neutrals.almostBlack : palette.newSupplementary.NSupTextL }}>
                                                    {t("sentinel-MyProjects-AutomatedProjects:SET_DEADLINE")}
                                                    <KeyboardDatePicker
                                                        fullWidth
                                                        size="small" 
                                                        error={false}
                                                        helperText=""
                                                        // margin="dense"
                                                        disabled={!block.isSelected||opportunity.deadline===null}
                                                        className="datePickerH2"
                                                        inputVariant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                                        maxDate={new Date(opportunity.deadline?opportunity.deadline:currentProject.deadline)} // limit to opportunity deadline
                                                        InputProps={{
                                                            readOnly: editFormHelper.openType === 'PREVIEW',
                                                            disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                        }}
                                                        id={"date-picker-dialog-solution"+index}
                                                        // label={t("Deadline")}
                                                        format="DD.MM.yyyy"
                                                        title={t("sentinel-MyProjects-AutomatedProjects:SOLUTION_DEADLINE")}
                                                        disablePast={true}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={block.deadline ? new Date(block.deadline).toISOString() : null}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                            disabled: editFormHelper.openType === 'PREVIEW',
                                                            style: { display: editFormHelper.openType === 'PREVIEW' ? 'none' : 'block', marginRight:'-8px' }
                                                        }}
                                                        onChange={(date) => {
                                                            if (date && date._isValid) {
                                                                setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                                                setCurrentProject(p => ({ ...p, cognitiveBlockCollection: p.cognitiveBlockCollection.map((item, i) => item.id === opportunity.id ? { ...item, cognitiveBlocks: item.cognitiveBlocks.map((solBlock, j) => block.content.title === solBlock.content.title ? { ...solBlock, deadline: date.toISOString() } : solBlock) } : item) }))
                                                            }
                                                        }}
                                                        keyboardIcon={<ArrowDropDownIcon />}
                                                        onClick={()=>{
                                                            if (!block.isSelected){
                                                                F_showToastMessage("sentinel-MyProjects-AutomatedProjects:SELECT_SOLUTION_FIRST", "warning")
                                                            } else if (!opportunity.deadline) {
                                                                F_showToastMessage("sentinel-MyProjects-AutomatedProjects:SET_OPPORTUNITY_DEADLINE", "warning")
                                                            }
                                                        }}

                                                    />
                                                    {t("sentinel-MyProjects-AutomatedProjects:ESTIMATED_TIME")+": "+F_formatSeconds(block.content.durationTime, false)}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <StyledEIconButton color="primary" size="medium" onClick={() => { 
                                        setContentHelper(p => ({ ...p, isOpen: true, contentId: block.content._id }))
                                     }}>
                                        <ArrowForwardIosIcon  />
                                    </StyledEIconButton>
                                </Box>
                            })}
                            {/* Hide BOX:  "Do you think that you may have, or do you recognise yourself as having one of these potential difficulties?"*/}
                            {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                                <Typography variant="body2" component="span" sx={{ color: palette.newSupplementary.NSupText, fontWeight:'400' }}>{t("Do you think that you may have, or do you recognise yourself as having one of these potential difficulties?")}</Typography>
                                <Box sx={{ overflow:'hidden', cursor:'pointer', borderRadius: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: palette.newSupplementary.SupCloudy, fontSize:'14px', textAlign:'center' }}>
                                    {/* <Button sx={{px:2, backgroundColor: palette.newSupplementary.SupCloudy, borderRadius: '16px 0 0 16px'}}>{t("No")}</Button>
                                    <Button sx={{px:2, backgroundColor: palette.newSupplementary.SupCloudy, borderRadius: 0}}>{t("Maybe")}</Button>
                                    <Button sx={{px:2, backgroundColor: palette.newSupplementary.SupCloudy, borderRadius: '0 16px 16px 0'}}>{t("Yes")}</Button>
                                    <Box sx={{ height: '40px', px: 2, py:1, width: '8rem', color: opportunity.feedback?.[user.id]?.confirmed === -1 ? 'white' : palette.primary.MedPurple, backgroundColor: opportunity.feedback?.[user.id]?.confirmed === -1 ? palette.primary.MedPurple:'white' }}
                                        onClick={() => { setEditFormHelper(p => ({ ...p, isBlocking: true }));setCurrentProject(p => ({ ...p, cognitiveBlockCollection: p.cognitiveBlockCollection.map((item, i) => item.id === opportunity.id ? { ...item, feedback: { ...item.feedback, [user.id]: { confirmed: -1 } } } : item) })) }}>{t("No")}</Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{ height: '40px', px: 2, py:1, width: '8rem', color: opportunity.feedback?.[user.id]?.confirmed === 0 ? 'white' : palette.primary.MedPurple, backgroundColor: opportunity.feedback?.[user.id]?.confirmed === 0 ? palette.primary.MedPurple:'white' }}
                                        onClick={() => { setEditFormHelper(p => ({ ...p, isBlocking: true }));setCurrentProject(p => ({ ...p, cognitiveBlockCollection: p.cognitiveBlockCollection.map((item, i) => item.id === opportunity.id ? { ...item, feedback: { ...item.feedback, [user.id]: { confirmed: 0 } } } : item) })) }}>{t("Maybe")}</Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{ height: '40px', px: 2, py:1, width: '8rem', color: opportunity.feedback?.[user.id]?.confirmed === 1 ? 'white' : palette.primary.MedPurple, backgroundColor: opportunity.feedback?.[user.id]?.confirmed === 1 ? palette.primary.MedPurple:'white' }}
                                        onClick={() => { setEditFormHelper(p => ({ ...p, isBlocking: true }));setCurrentProject(p => ({ ...p, cognitiveBlockCollection: p.cognitiveBlockCollection.map((item, i) => item.id === opportunity.id ? { ...item, feedback: { ...item.feedback, [user.id]: { confirmed: 1 } } } : item) })) }}>{t("Yes")}</Box>
                                </Box>
                            </Box> */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}> </Box>
                        </Box>
                    </Collapse>
                </Box>
            })}
            </>:<Box sx={{mt:3}}>
                <Typography variant="subtitle1" sx={{ textAlign: 'left', color: palette.newSupplementary.NSupText, fontStyle: 'italic' }}>{t("sentinel-MyProjects-AutomatedProjects:SELECT_TEAM_FOR_OPPORTUNITIES")}</Typography>
            </Box>}
        </Grid>
    </>
})
export default function ProjectForm({ editFormHelper, setEditFormHelper, currentProject, setCurrentProject, fromStats, projectN, setProjectN }) {
    const { t } = useTranslation(['translation', 'traits', 'sentinel-MyProjects-AutomatedProjects', 'common']);
    const navigate = useNavigate();
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_formatSeconds, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader, F_t } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const { userPermissions, user } = F_getHelper();
    const [NADFilter, setNADFilter] = useState('nadfilter-0');
    const [showFilter, setShowFilter] = useState(false); 
    const [opportunityCounter, setOpportunityCounter] = useState(0);
    const [teams, setTeams] = useState([]);
    const [students, setStudents] = useState([]);
    // const [fromStatisticsView, setFromStatisticsView] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [validators, setValidators] = useState({ email: false, username: false, usernameAvailable: false, name: false, surname: false, password: false, passwordConfirm: false });
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [border, setBorder] = useState(false)
    const [openerIndex, setOpenerIndex] = useState([]);

    const [teamName, setTeamName] = useState([]);
    const [selectedTeams,setSelectedTeams] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [open, setOpen] = useState(false);
    const [userNames, setUserNames] = useState([]);
    const [containerEl, setContainerEl] = useState(null);
    const [contentHelper, setContentHelper] = useState({ isOpen: false, contentId: null });

    const opennew = Boolean(containerEl);
    
    // const handleOpennew = (e) => {
    //     setContainerEl(e.currentTarget);
    // };
    // const handleClosenew = () => {
    //     setContainerEl(null);
    // };

    const teamsClickOpen = () => {
        if(fromStats) F_showToastMessage("sentinel-MyProjects-AutomatedProjects:YOU_CANT_CHANGE", "warning")
        else setOpen(true);
    };


    useEffect(() => {
        F_handleSetShowLoader(true)
        TeamService.readAllTeam().then(res => {
            setTeams(res.data.data)
            setAllUsers(res.data.data.flatMap(d=>d.trainee))
            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
    }, [editFormHelper.isOpen])

    useEffect(() => {
        if (teams.length > 0 && currentProject.team) {
            setTeamName([teams.filter(t => t._id === currentProject.team)[0].name])
        } else {
            setTeamName([])
        }
    }, [teams, currentProject.team])

    useEffect(() => {
        F_handleSetShowLoader(true)
        if (editFormHelper.isOpen && editFormHelper.openType === 'EDIT') {
            console.log('EDIT');
            ProjectService.read(editFormHelper.projectId).then(res => {
                if (res.status === 200) {
                    let theProject = res.data;
                    theProject.cognitiveBlockCollection.forEach((item) => {
                        item.id = item.opportunity.key
                        item.isSelected = true;
                        item.cognitiveBlocks.forEach((block) => {
                            block.isSelected = true;
                        })
                    })
                    setProjectN(p=>({...p, name: theProject.name, description: theProject.description||''}));
                    setCurrentProject(theProject);
                    setSelectedTeams([theProject.team])
                    setOpportunityCounter(theProject.cognitiveBlockCollection.length);
                    F_handleSetShowLoader(false)
                }
            }).catch(err => console.log(err));
        } else if (editFormHelper.isOpen && editFormHelper.openType === 'ADD') {
            let theProject = currentProject
            if (currentProject.cognitiveBlockCollection?.length>0){
                // setFromStatisticsView(true);
                theProject.cognitiveBlockCollection.forEach((item) => {
                    item.isSelected = false
                    item.cognitiveBlocks.forEach((block) => {
                        block.isSelected = false;
                    })
                })
            }
            setCurrentProject(theProject);
            if (editFormHelper.team) setSelectedTeams([editFormHelper.team._id])
            setOpportunityCounter(0);
            F_handleSetShowLoader(false)
        } 
    }, [editFormHelper.isOpen, editFormHelper.projectId]);

    useEffect(() => {
        if (actionModal.returnedValue) {
            remove();
        }
    }, [actionModal.returnedValue]);

    useEffect(() => {
        setFilteredData(students);
    }, [students]);

    const handleNameChange = useCallback((event) => {
        const { value } = event.target;
        setProjectN(p=>({...p, name: value}));
        // setEditFormHelper(p => ({ ...p, isBlocking: true }));
      }, []);

    const handleDescriptionChange = useCallback((event) => {
        const { value } = event.target;
        setProjectN(p=>({...p, description: value}));
        // setEditFormHelper(p => ({ ...p, isBlocking: true }));
    }, []);


    const remove = () => {
        moduleCoreService.removeModuleUser(manageScopeIds.moduleId, editFormHelper.projectId).then(res => {
            F_showToastMessage("common:USER_REMOVED", "success")
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', projectId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }

    const save = async () => {
        let toasts = [];
        if (projectN.name.length === 0) toasts.push(t("sentinel-MyProjects-AutomatedProjects:ADD_PROJECT_NAME"))
        if (currentProject?.deadline === null || currentProject?.deadline?.length === 0) toasts.push(t("sentinel-MyProjects-AutomatedProjects:ADD_PROJECT_DEADLINE"))
        if (opportunityCounter === 0) toasts.push(t("sentinel-MyProjects-AutomatedProjects:ADD_OPPORTUNITY"))
        if (toasts.length > 0) {
            F_showToastMessage(toasts.join(".\n"), "warning");
            return;
        }

        let projectToBeSaved = { 
            ...currentProject,
            name: projectN.name,
            description: projectN.description,
            cognitiveBlockCollection: currentProject.cognitiveBlockCollection.filter(cbc=>cbc.isSelected).map((item) => ({
                ...item,
                cognitiveBlocks: item.cognitiveBlocks.filter(cb=>cb.isSelected)
            }))
        };
        if (editFormHelper.projectId === "NEW") {
            ProjectService.add(projectToBeSaved).then(res => {
                F_showToastMessage(res.data.message, res.status === 200 ? t('common:SUCCESS') : t('common:WARNING'));
                setEditFormHelper({ isOpen: false, openType: 'PREVIEW', projectId: undefined, isBlocking: false })
            }).catch(error => {
                console.log(error)
            })
        } else {
            ProjectService.edit(projectToBeSaved).then(res => {
                //display res.message in toast
                F_showToastMessage(res.data.message, res.status === 200 ? t('common:SUCCESS') : t('common:WARNING'));
                setEditFormHelper({ isOpen: false, openType: 'PREVIEW', projectId: undefined, isBlocking: false })
            }).catch(error => {
                console.log(error)
            });
        }
    }

    return (
        <ThemeProvider theme={new_theme}>
            {!contentHelper.isOpen?<Card style={{ boxShadow: "none" }}>
                <CardContent sx={{ padding: '0 !important' }}>
                    <Grid container>
                        <Grid item xs={12} >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <StyledEIconButton sx={{mr: 3}} color="primary" size="medium"
                                    onClick={async () => {
                                        if (editFormHelper.isBlocking) {
                                            let confirm = await isConfirmed(t("sentinel-MyProjects-AutomatedProjects:DISCARD_PROJECT"));
                                            if (!confirm) return;
                                        }
                                        F_showToastMessage("No change",);
                                        setEditFormHelper({ isOpen: false, openType: 'PREVIEW', projectId: 'NEW', isBlocking: false });
                                    }}>
                                    <ChevronLeftIcon />
                                </StyledEIconButton>
                                <div>
                                    <Typography variant="h1" component="h1">
                                        {editFormHelper.openType === 'ADD' ? t("sentinel-MyProjects-AutomatedProjects:NEW_PROJECT") : t("sentinel-MyProjects-AutomatedProjects:EDIT_PROJECT")}
                                    </Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </div>
                            </div>
                        </Grid>
                        <>
                            <Grid item xs={12} sx={{ mb: 2 }}>
                                <hr className="d-mb-none" />
                                <Typography sx={{mt:3}} variant="subtitle0" component="h2" >{t("common:OVERVIEW")}</Typography>
                            </Grid>

                            {/* Add some fields: dropdown for select team, name, description, and deadline. */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px' }}>
                                {!fromStats && 
                                    <Box className="mb-colum" sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: {md:'flex-start', xs:'stretch'}, gap:'20px' }}>
                                        <Grid item xs={12} md={4}>
                                            <div className="heading_buttons btn_result" style={{ display: 'flex',position: 'relative' }}>
                                                {teamName.length > 0 && <Box sx={{position: 'absolute', zIndex: 1, top: '6px', left: '10px', fontSize: '12px', color: new_theme.palette.newSupplementary.NSupText }}>
                                                    {F_t("Teams")}
                                                </Box>}
                                                <button className="dialogButton " 
                                                    onClick={teamsClickOpen}
                                                    // disabled={fromStats}
                                                    // onMouseEnter={handleOpennew}
                                                    // onMouseLeave={handleClosenew}
                                                    >
                                                    <span style={{ marginTop: teamName.length > 0?'20px':'-4px' }}>
                                                        {teamName.length > 0 ? teamName.map((team, index) => {
                                                            return <Fragment key={index}>
                                                                {team}{index !== teamName.length - 1 && ", "}

                                                            </Fragment>
                                                        }) : F_t("Teams")}
                                                    </span>
                                                    <KeyboardArrowDownIcon sx={{fontSize: '22px'}} />
                                                </button>






    {/* NEW DRAWER FOR SELECTING TEAMS ###################################### */}
    {/* 
    
    const [drawerForTeamsOpen, setDrawerForTeamsOpen] = useState(false);
    const [teams, setTeams] = useState([]);

    useEffect(() => {// LOADING OPPORTUNITIES
        if (!teams || !selectedTeams) return

        console.log("LOADING OPPORTUNITIES FOR ", selectedTeams)
        F_handleSetShowLoader(true)
        let selectedTeams = teams.filter(t=>selectedTeams.includes(t._id))
        let usersIds = selectedTeams.flatMap(t=>t.trainee)
        usersIds = [...new Set(usersIds)];//Remove duplicates
        ProjectService.getOpportunitiesForUsers(usersIds.map(u=>u._id)).then((res) => {
            setCurrentProject(p => ({ ...p, cognitiveBlockCollection: res.data }))
            F_handleSetShowLoader(false)
        }).catch((err) => {
            console.log(err)
            F_handleSetShowLoader(false)
        })
    }, [selectedTeams]) */}

                                            {/* <TeamsDialog
                                                open={drawerForTeamsOpen}
                                                setOpen={setDrawerForTeamsOpen}
                                                teams={teams}// List to select
                                                onlyWithAvailableResult={false}
                                                onlyTeamsSelection={true}
                                                onlySingleTeamSelection={true}
                                                onConfirm={(users, teams) => {
                                                    setTeamName(teams.map(t => t.name))
                                                    setSelectedTeams(teams.map(t => t._id))
                                                    setDrawerForTeamsOpen(false)
                                                }}

                                                onClose={() => {
                                                    setDrawerForTeamsOpen(false)
                                                }}
                                            /> */}
                                            <TeamsDialog
                                                open={open}
                                                onClose={() => { setOpen(false) } }
                                                teams={teams}
                                                allUsers={allUsers}
                                                setUsers={setUsers}
                                                setTeams={setTeams}
                                                setTeamName={setTeamName}
                                                selectedTeams={selectedTeams}
                                                setSelectedTeams={setSelectedTeams}
                                                setUserNames={setUserNames}
                                                userIds={userIds}
                                                setCurrentProject={setCurrentProject}
                                                setUserIds={setUserIds}
                                                fromProject={true}
                                            />

                                        </div>
                                        </Grid>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', justifyContent:{xs:'space-between'} }}>
                                            <StyledButton className="mb-50" eVariant="secondary" eSize="xsmall" sx={{mr:0}} onClick={() => { 
                                                    if (selectedTeams.length>0) {
                                                        setEditFormHelper(p => ({ ...p, team: { _id: selectedTeams[0], name: teamName[0] }, isOpen2: true}))
                                                    } else {
                                                        F_showToastMessage("sentinel-MyProjects-AutomatedProjects:SELECT_TEAM_FIRST", "warning")
                                                    }
                                                }}>{t("sentinel-MyProjects-AutomatedProjects:TEAMS_PROJECTS")}</StyledButton> {/* TO BE ENABLED ONCE VIEW IS AVAILABLE */}
                                            <StyledButton className="mb-50" eVariant="secondary" eSize="xsmall" sx={{mr:0}} onClick={() => { selectedTeams.length>0? navigate(`/Teams/Results?teamId=${selectedTeams[0]}`):F_showToastMessage("sentinel-MyProjects-AutomatedProjects:SELECT_TEAM_FIRST", "warning")}}>{t("sentinel-MyProjects-AutomatedProjects:TEAMS_RESULTS")}</StyledButton>
                                        </Box>
                                    </Box>
                                }
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid item xs={12} md={4}>
                                    <ETextField sx={{mb: 0}} fullWidth variant='filled' size="medium" name='name' label={t("Name")} value={projectN.name} onChange={handleNameChange} error={validators.name} helperText={validators.name ? t("sentinel-MyProjects-AutomatedProjects:NAME_LENGTH") : ""} />
                                    {/* <NameField fullWidth variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'} size="small" name='name' label={t("Name")} value={projectName} onChange={handleNameChange} error={validators.name} helperText={validators.name ? t("Name must be between 3 and 20 characters") : ""} /> */}
                                    </Grid>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid item xs={12}>
                                        {/* multiline rows={4} */}
                                        {/* {memo(<TextField fullWidth variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'} size="small" label={t("Description")} value={projectDescription} onChange={handleDescriptionChange} error={validators.description} helperText={validators.description ? t("Description must be between 3 and 20 characters") : ""} rows={4} multiline />)} */}
                                        <ETextField sx={{mb: 0}} fullWidth variant="filled" size="medium" label={t("Description")} value={projectN.description} onChange={handleDescriptionChange} error={validators.description} helperText={validators.description ? t("sentinel-MyProjects-AutomatedProjects:DESCRIPTION_LENGTH") : ""} />
                                        {/* <DescriptionField value={projectDescription} onChange={handleDescriptionChange} /> */}
                                    </Grid>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid item xs={12} md={4}>
                                        <KeyboardDatePicker
                                            fullWidth
                                            size="small"
                                            error={false}
                                            helperText="" 
                                            className="datePickerH"
                                            inputVariant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                            maxDate={new Date().setDate(new Date().getDate() + 365)} // one year from now
                                            InputProps={{
                                                readOnly: editFormHelper.openType === 'PREVIEW',
                                                disableUnderline: editFormHelper.openType === 'PREVIEW',
                                            }}
                                            id="date-picker-dialog"
                                            label={t("sentinel-MyProjects-AutomatedProjects:DEADLINE")}
                                            format="DD.MM.yyyy"
                                            // disableFuture={true}
                                            title={t("sentinel-MyProjects-AutomatedProjects:PROJECT_DEADLINE_FOR_OPPOPTUNITY_SOLUTIONS")}
                                            disablePast={true}
                                            value={currentProject?.deadline ? new Date(currentProject.deadline).toISOString() : null}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                                disabled: editFormHelper.openType === 'PREVIEW',
                                                style: { display: editFormHelper.openType === 'PREVIEW' ? 'none' : 'block', marginRight:'-8px' }
                                            }}
                                            onChange={(date) => {
                                                if (date && date._isValid) {
                                                    setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                                    setCurrentProject(p => ({ 
                                                        ...p, deadline: date.toISOString(),
                                                        cognitiveBlockCollection: p.cognitiveBlockCollection.map((CBC, i) => ({ 
                                                            ...CBC, 
                                                            deadline: date.toISOString(),
                                                            cognitiveBlocks: CBC.cognitiveBlocks.map((block)=>({
                                                                ...block, 
                                                                deadline: date.toISOString()
                                                            }))
                                                        }))
                                                    }))
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Box>
                            </Box>

                            <MemoizedOrientation 
                                currentProject={currentProject}
                                showFilter={showFilter}
                                setNADFilter={setNADFilter}
                                setShowFilter={setShowFilter}
                                NADFilter={NADFilter}
                                opportunityCounter={opportunityCounter}
                                setEditFormHelper={setEditFormHelper}
                                setCurrentProject={setCurrentProject}
                                setOpportunityCounter={setOpportunityCounter}
                                setOpenerIndex={setOpenerIndex}
                                editFormHelper={editFormHelper}
                                openerIndex={openerIndex}
                                selectedTeams={selectedTeams}
                                contentHelper={contentHelper}
                                setContentHelper={setContentHelper}
                            />
                            <Divider sx={{ width: '100%', mt: 3 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                                <StyledButton eVariant="secondary" eSize="medium">{t("common:CANCEL")}</StyledButton>
                                {editFormHelper.openType === "EDIT" ?
                                    <StyledButton eVariant="primary" eSize="medium"
                                        onClick={save} disabled={!editFormHelper.isBlocking}
                                    >{t("sentinel-MyProjects-AutomatedProjects:UPDATE_PROJECT")}</StyledButton>

                                    : <StyledButton eVariant="primary" eSize="medium"
                                        onClick={save}
                                    >{t("sentinel-MyProjects-AutomatedProjects:CREATE_PROJECT")}</StyledButton>
                                }
                            </Box>
                        </>
                    </Grid>
                </CardContent>
            </Card>:
            <DisplayContent 
                contentId={contentHelper.contentId}
                backBtnFn={()=>{setContentHelper(p => ({ ...p, isOpen: false, contentId: null }))}}
                isPreview={true}
                // hideTopBar={false}
                // showSettingsTab={false}
                // hideBackButton={true}
                // show={contentHelper.isOpen}
                // setShow={(value) => { setContentHelper(p => ({ ...p, isOpen: value })) }}
            />}
            <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("sentinel-MyProjects-AutomatedProjects:REMOVING_PROJECT")}
                actionModalMessage={t("sentinel-MyProjects-AutomatedProjects:ARE_YOU_SURE")}
            />
        </ThemeProvider>
    )
}