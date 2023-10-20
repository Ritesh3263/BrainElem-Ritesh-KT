import React, { useEffect, useState } from "react";
import {Card, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import TextField from "@mui/material/TextField";

import { new_theme } from "NewMuiTheme";
import Confirm from "components/common/Hooks/Confirm";
import { Box } from "@mui/system";
import { ThemeProvider } from '@mui/material';
import StyledButton from "new_styled_components/Button/Button.styled";
import "./Project.scss"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ProjectService from "services/project.service"

import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import {AiFillDelete} from "react-icons/ai";
import {HiPencil} from "react-icons/hi";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { KeyboardDatePicker } from "@material-ui/pickers";


import { useNavigate } from "react-router-dom";

const palette = new_theme.palette;

export default function TeamsProjects({ editFormHelper, setEditFormHelper }) {
    console.log(editFormHelper)
    const { t } = useTranslation(['translation', 'traits', 'sentinel-MyProjects-AutomatedProjects', 'common']);
    const navigate = useNavigate();
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_formatSeconds, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const { userPermissions, user } = F_getHelper();
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [NADFilter, setNADFilter] = useState('nadfilter-0');
    const [projectIdToDelete,setProjectIdToDelete]=useState(0);
    const [teams, setTeams] = useState([]);
    const [fromStatisticsView, setFromStatisticsView] = useState(false);
    const [openerIndex, setOpenerIndex] = useState([]);
    const traits = ["All","traits:self-activation-short-name","traits:self-confidence-short-name", 'traits:communication-strategy-short-name',"traits:cooperation-short-name","traits:regularity-short-name"]

 
    useEffect(() => {
        F_handleSetShowLoader(true)
        if (editFormHelper.team) {
            ProjectService.readAll().then(res => {
                console.log(res.data);
                setProjects(res.data.filter(project => project.team === editFormHelper.team._id));
                F_handleSetShowLoader(false);
            }).catch(error => console.error(error))
        } else {
            F_handleSetShowLoader(false);
        }
    }, [])

    useEffect(()=>{
        if(projectIdToDelete!==0){
            setActionModal({ isOpen: true, returnedValue: false })
        }
    },[projectIdToDelete])

    const remove = (id) => {
        ProjectService.remove(id).then(res => {
            F_showToastMessage("sentinel-MyProjects-AutomatedProjects:PROJECT_REMOVED", "success")
            setProjectIdToDelete(0);
            setEditFormHelper(p=>({...p, team: null}));
        }).catch(error => console.error(error))
    }


    return (
        <ThemeProvider theme={new_theme}>
            <Card style={{ boxShadow: "none" }}>
                <CardContent sx={{ padding: '0 !important' }}>
                    <Grid container>
                    {currentProject?<>
                                <Grid item xs={12} sx={{ mb:1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb:1 }}>
                                        <Typography variant="subtitle0" component="h2" >{t("sentinel-MyProjects-AutomatedProjects:PROJECT_PREVIEW")}</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                                            <StyledEIconButton eColor="primary" eSize="medium" onClick={() => {
                                                if (F_hasPermissionTo('update-user')) {
                                                    setEditFormHelper({ isOpen: true, openType: 'EDIT', projectId: currentProject._id, isBlocking: false });
                                                } else {
                                                    F_showToastMessage({ message: t('common:CANT_EDIT_USER'), severity: 'error' });
                                                }  }}>
                                                    <HiPencil />
                                                <EditIcon />
                                            </StyledEIconButton>
                                            <StyledEIconButton eColor="primary" eSize="medium" onClick={() => {  setProjectIdToDelete(currentProject._id)  }}>
                                                <AiFillDelete />
                                                <DeleteIcon sx={{ fontSize: '20px', cursor: 'pointer', border: `1px solid ${palette.primary.PBorder}`, borderRadius: '50%', p: '6px', height: '32px', width: '32px', color: palette.newSupplementary.NSupText }}/>
                                            </StyledEIconButton>
                                        </Box>
                                    </Box>
                                    <Divider sx={{mt:0, mb:2}} />
                                </Grid>
                                {/* Add some fields: dropdown for select team, name, description, and deadline. */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px' }}>
                                    {!fromStatisticsView && 
                                        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                            <Grid item xs={12} md={4}>
                                                <div className="heading_buttons btn_result" style={{ display: 'flex' }}>
                                                    <button className="dialogButton ">
                                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {editFormHelper.team.name}
                                                        </span>
                                                        <ArrowDropDownIcon />
                                                    </button>
                                            </div>
                                            </Grid>
                                        </Box>
                                    }
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid item xs={12} md={4}>
                                            <TextField fullWidth disabled={true} variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'} size="small" name='name' label={t("common:NAME")} value={currentProject?.name} />
                                        </Grid>
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid item xs={12}>
                                            {/* multiline rows={4} */}
                                            <TextField fullWidth disabled={true} variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'} size="small" label={t("common:DESCRIPTION")} value={currentProject?.description} rows={4} multiline />
                                        </Grid>
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid item xs={12} md={4}>
                                            <KeyboardDatePicker
                                                fullWidth
                                                size="small" 
                                                className="datePickerH"
                                                inputVariant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                                maxDate={new Date().setDate(new Date().getDate() + 365)} // one year from now
                                                InputProps={{
                                                    readOnly: editFormHelper.openType === 'PREVIEW',
                                                    disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                }}
                                                disabled={true}
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
                                            />
                                        </Grid>
                                    </Box>
                                    {/* project progress */}
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle1">
                                                {t("sentinel-MyProjects-AutomatedProjects:PROJECT_PROGRESS")}
                                            </Typography>
                                            <Box className={`progressBar ${currentProject.progress>0? 'ongoing':''}`} sx={{width:'100% !important', my:2}}>
                                                <div className={`progressBarValue ${currentProject.progress>=100? 'max':''}`} style={{ width: `${currentProject.progress}%`}}></div>
                                            </Box>
                                        </Grid>
                                    </Box>
                                </Box>



                                <Grid item xs={12}>
                                    <hr></hr>
                                        <Typography variant="subtitle0" component="h3">
                                            {t("sentinel-MyProjects-AutomatedProjects:ASSIGNED_SOLUTIONS")}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', my:2 }} gap='8px'>
                                            <Typography variant="body4" component="span" sx={{ color: palette.newSupplementary.NSupText }}>{t("sentinel-MyProjects-AutomatedProjects:AREA_OF_DEVELOPMENT")}:</Typography>
                                            {traits.map((item, index) => (<Box 
                                                key={index} title={t("sentinel-MyProjects-AutomatedProjects:FILTER_BYFILTER_BY")+t(item)}
                                                sx={{ border: `1px solid ${palette.primary.PPurple}`, borderRadius: '8px', p: 1, height: '40px', display: 'flex', cursor:'pointer', backgroundColor: NADFilter==="nadfilter-"+index?palette.primary.PPurple:'white' }}
                                                onClick={() => { setNADFilter("nadfilter-"+index) }}>
                                                <Typography variant="subtitle1" sx={{ color: NADFilter==="nadfilter-"+index?'white':palette.primary.PPurple }}>{t(item)}</Typography>
                                            </Box>))}
                                        </Box>

                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', maxHeight: '420px', height:'100%', overflow: 'auto' }} gap="16px">  
                                    {currentProject?.cognitiveBlockCollection?.length > 0 ? <>
                                    {currentProject.cognitiveBlockCollection.flatMap((opportunity, index) => opportunity.cognitiveBlocks.filter(block=>NADFilter==="nadfilter-0"?true:("nadfilter-"+opportunity.opportunity?.charAt(0)||0)===NADFilter).map((block, index) => {
                                        return <Box key={index} sx={{ border: `1px solid ${palette.primary.PBorder}`, borderRadius: '8px', gap: '16px', alignItems: 'center' }} >
                                            <Box sx={{ flex:1 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '8px', alignItems: 'center', mx: 1 }}>
                                                    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                                        <Box sx={{ display: 'block', height: '23px', borderRadius: '8px', backgroundColor: palette.newSupplementary.SupCloudy, position: 'relative', fontSize: '10px', color: palette.newSupplementary.NSupText, px: '8px', py: '4px' }}>
                                                            {t(traits[opportunity.opportunity?.charAt(0)||0])} 
                                                        </Box>
                                                        <Box sx={{ display: 'block', height: '23px', borderRadius: '8px', backgroundColor: palette.newSupplementary.SupCloudy, position: 'relative', fontSize: '10px', color: palette.newSupplementary.NSupText, px: '8px', py: '4px' }}>
                                                            {t("sentinel-MyProjects-AutomatedProjects:ACTIVITY")} 
                                                        </Box>
                                                        <Typography variant="body4">
                                                            {block.content.title}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', my: 1, mx: 1, gap: '8px' }}>
                                                        
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', fontSize: '12px', color: block.isSelected ? palette.neutrals.almostBlack : palette.primary.PGreyL }}>
                                                                {t("sentinel-MyProjects-AutomatedProjects:DEADLINE")}
                                                                <KeyboardDatePicker
                                                                    fullWidth
                                                                    size="small" 
                                                                    // margin="dense"
                                                                    disabled={!block.isSelected}
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
                                                                    title={t("Solution deadline (must be before or equal to the opportunity deadline)")}
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

                                                                />
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
                                                            <Box sx={{minWidth:'12rem', display: 'block' }}>
                                                            <Box className={`progressBar ${block.progress>0? 'ongoing':''}`}>
                                                                <div className={`progressBarValue ${block.progress>=100? 'max':''}`} style={{ width: `${block.progress}%` }}></div>
                                                            </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    }))}
                                    </>:<Box sx={{my:3}}>
                                        <Typography variant="subtitle1" sx={{ textAlign: 'left', color: palette.newSupplementary.NSupText, fontStyle: 'italic' }}>{t("sentinel-MyProjects-AutomatedProjects:SELECT_TEAM_FOR_OPPORTUNITIES")}</Typography>
                                    </Box>}
                                </Grid>
                                <Divider sx={{ width: '100%', mt:3 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
                                    <StyledButton eVariant="secondary" eSize="medium" onClick={() => { setCurrentProject(null)}} >{t("common:CLOSE")}</StyledButton>
                                </Box>
                            </>:<>
                        <Grid item xs={12} >
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                <StyledEIconButton color="primary" size="medium"  sx={{mr: 3}}
                                    onClick={async () => {
                                        if (editFormHelper.isBlocking) {
                                            let confirm = await isConfirmed(t("sentinel-MyProjects-AutomatedProjects:DISCARD_PROJECT"));
                                            if (!confirm) return;
                                        }
                                        F_showToastMessage("No change",);
                                        setEditFormHelper(p=>({...p, isOpen2: false}))
                                    }}>
                                    <ChevronLeftIcon />
                                </StyledEIconButton>
                                <Box>
                                    <Typography variant="h1" component="h1">
                                        {editFormHelper.team.name}{t("'s projects")}
                                    </Typography>
                                    <Divider variant="insert" className='heading-divider' />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', mt:4 }} gap="8px" >  
                        {projects.length>0 ? projects.map((project, index) => {
                            return (<Box key={project._id} sx={{ border: `1px solid ${palette.primary.PBorder}`, borderRadius: '8px', gap: '8px', cursor:'pointer' }} onClick={() => { setCurrentProject(project) }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py:2 }}>
                                    <Typography variant="body2" sx={{ color: palette.newSupplementary.NSupText, fontWeight:'bold' }}>
                                        {project.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                                        <Box sx={{minWidth:'13rem'}} >
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', fontSize: '12px', color: palette.neutrals.almostBlack }}>
                                                {t("sentinel-MyProjects-AutomatedProjects:SET_DEADLINE")}
                                                <KeyboardDatePicker
                                                    fullWidth
                                                    size="small" 
                                                    // margin="dense"
                                                    className="datePickerH2"
                                                    inputVariant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                                    // maxDate={new Date(project.deadline)} // limit to project deadline
                                                    disabled={true}
                                                    InputProps={{
                                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                    }}
                                                    id={"date-picker-dialog-opportunity"+index}
                                                    // label={t("Deadline")}
                                                    format="DD.MM.yyyy"
                                                    title={t("sentinel-MyProjects-AutomatedProjects:OPPURTUNITY_DEADLINE")}
                                                    // disablePast={true}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={project.deadline ? new Date(project.deadline).toISOString() : null}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                        disabled: editFormHelper.openType === 'PREVIEW',
                                                        style: { display: editFormHelper.openType === 'PREVIEW' ? 'none' : 'block', marginRight:'-8px' }
                                                    }}
                                                    keyboardIcon={<ArrowDropDownIcon />}
                                                />
                                            </Box>
                                        </Box>
                                        <Box className={`progressBar ${project.progress>0? 'ongoing':''}`} sx={{width:'12rem !important'}}>
                                            <div className={`progressBarValue ${project.progress>=100? 'max':''}`} style={{ width: `${project.progress}%` }}></div>
                                        </Box>
                                        <StyledEIconButton color="primary" size="medium" onClick={() => { console.log("projectId::"+project._id)  }}>
                                            <ArrowForwardIosIcon sx={{ transform: openerIndex.includes('opportunity-'+index) ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.3s ease-in-out' }}  />
                                        </StyledEIconButton>
                                    </Box>
                                </Box>
                            </Box>)
                        }):<>
                            <Typography variant="subtitle1" sx={{ textAlign: 'left', color: palette.newSupplementary.NSupText, fontStyle: 'italic' }}>{t("Team has no projects assigned yet")}</Typography>
                        </>}
                        </Grid>
                    </>}
                    </Grid>
                </CardContent>
            </Card>
            <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("sentinel-MyProjects-AutomatedProjects:REMOVING_PROJECT")}
                actionModalMessage={t("sentinel-MyProjects-AutomatedProjects:ARE_YOU_SURE")}
                confirmAction={()=>remove(projectIdToDelete)}
                cancelAction={()=>setProjectIdToDelete(0)}
            />
        </ThemeProvider>
    )
}