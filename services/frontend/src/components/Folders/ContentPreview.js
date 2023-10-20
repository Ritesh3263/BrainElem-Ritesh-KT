import React from 'react'
import {theme} from "MuiTheme";
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from '@mui/material';
import OptionsButton from "components/common/OptionsButton";
import Grid from '@material-ui/core/Grid';
import EButton from "styled_components/Button";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Icons
import CircleIcon from '@mui/icons-material/Circle';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import RawOnIcon from '@mui/icons-material/RawOn';
import ElderlyIcon from '@mui/icons-material/Elderly';
import ReportIcon from '@mui/icons-material/Report';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import TerminalIcon from '@mui/icons-material/Terminal';
import { ReactComponent as ForwardIcon } from 'icons/icons_48/Arrow small R.svg';
import { ReactComponent as CopyIcon } from 'icons/icons_32/Copy_32.svg';
import { ReactComponent as EditorIcon } from 'icons/set/editor.svg';
import { ReactComponent as WooclapIcon } from 'icons/set/wooclap.svg';
import { ReactComponent as File2Icon } from 'icons/set/file_2.svg';
import { ReactComponent as QuizIcon } from 'icons/set/quiz.svg';

// Services
import ContentService from 'services/content.service'
import EventService from 'services/event.service'
import ChapterService from 'services/chapter.service'
import ModuleService from 'services/module.service'
import TrainingModuleService from 'services/training-module.service'

//Styled components
import ETooltip from "styled_components/Tooltip";
import ETypeChip from "styled_components/atoms/TypeChip";
import { ECard, EChip, ECoursePriceLabel, ESelect } from "styled_components";
import Breadcrumb from 'styled_components/FileManager/Breadcrumb';
import ESvgIcon from 'styled_components/SvgIcon/SvgIcon.styled';
import EIconButton from 'styled_components/EIconButton';
import SvgIcon from 'styled_components/SvgIcon';
import { useState } from 'react';
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import { useEffect } from 'react';
import ContentChips from 'components/Content/Display/ContentChips';

const palette =  theme.palette;

const useStyles = makeStyles(() => ({
    chip: {
        fontSize:'12px !important',
        color: palette.neutrals.darkestGrey + ' !important',
        borderColor: palette.neutrals.darkestGrey + ' !important',
    },
    chip1: {
        fontSize:'12px !important',
        color: palette.semantic.info + ' !important',
        borderColor: palette.semantic.info + ' !important',
    },
    typography12: {
        ...theme.typography.p,
        fontSize:'12px !important',
        color: palette.neutrals.darkGrey,
    },
    typography14: {
        ...theme.typography.p,
        fontSize:'14px !important',
        color: palette.neutrals.almostBlack,
    },
    typography16: {
        ...theme.typography.p,
        fontSize:'16px !important',
        color: palette.neutrals.almostBlack,
    },
    showMore: {
        ...theme.typography.p,
        cursor: 'pointer',
        color: palette.primary.violet,
        fontSize: '14px !important',
    },
    tooltip: {
        display: 'inline-block',
    },
    link: {
        display: 'flex',
        cursor:"pointer"
    },
    icon: {
        marginRight: '4px',
        fontSize: '12px !important',
        color: palette.semantic.info,
    },
    title: {
        // ...theme.typography.h3,
        fontSize: '24px !important',
        color: palette.primary.violet,
        fontWeight: 'bold',
    },
}));

const getStatusColor = (status) => {
    switch (status) {
        case 'AWAITING': return palette.semantic.warning;
        case 'ACCEPTED': return palette.semantic.success;
        case 'REJECTED': return palette.semantic.error;
        case 'PRIVATE': return palette.semantic.info;
        default: return palette.semantic.info;
    }
}
const getStatusText = (status) => {
    switch (status) {
        case 'AWAITING': return 'Awaiting for verification';
        case 'ACCEPTED': return 'Verified';
        case 'REJECTED': return 'Rejected';
        case 'PRIVATE': return 'Private';
        default: return '';
    }
}

const AssignToModal = ({open, setOpen, content}) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const { F_showToastMessage } = useMainContext();
    const [classes1, setClasses1] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [chapters, setChapters] = useState(null);
    const [assignToData, setAssignToData] = useState({
        classId: '',
        subjectId: '',
        chapterId: '',
    });

    useEffect(() => {
        EventService.getMyClasses().then((res) => {
            setClasses1(res.data);
        })
    }, [])


    let classList = classes1?.map((c) => {
        return <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
    })??null;
    let subjectList = subjects?.map((s) => {
        return <MenuItem key={s.originalTrainingModule} value={s.originalTrainingModule}>{s.newName}</MenuItem>
    })??null;
    let chapterList = chapters?.map((c) => {
        return <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
    })??null;


    const handleAssignToDataChange = (e) => {
        setAssignToData({
            ...assignToData,
            [e.target.name]: e.target.value
        });
        if(e.target.name === 'classId') {
            let selectedClass = classes1.find((c) => c._id === e.target.value);
            setSubjects([]);
            selectedClass.program.forEach((c) => {
                EventService.getTrainingModuleFromTrainingPath(c.duplicatedTrainingPath)
                .then((response) => {
                    setSubjects(prevState => [...prevState, ...response.data]);
                })
                .catch((error) => {
                    F_showToastMessage(t("Something went wrong getting subjects"));
                });
            });
        } else if(e.target.name === 'subjectId') {
            ChapterService.getChapters(e.target.value)
                .then((response) => {
                    setChapters(response.data);
                })
                .catch((error) => {
                    F_showToastMessage(t("Something went wrong getting chapters"));
                });
        }
    }

    const handleAssignTo = () => {
        setOpen(false);
        ContentService.assignContentToGroup({...assignToData, contentId: content._id})
            .then((response) => {
                F_showToastMessage(t("Content assigned successfully"));
                setAssignToData({
                    classId: '',
                    subjectId: '',
                    chapterId: '',
                });
            })
            .catch((error) => {
                F_showToastMessage(t("Something went wrong"));
            });
    }

    return (
        <Dialog open={open} 
            onClose={() => setOpen(false)} 
            aria-labelledby="form-dialog-title" 
            maxWidth="sm"
            fullWidth={true}
            PaperProps={{
                style: {
                backgroundColor: palette.glass.opaque + ' !important',
                border: '1px solid ' + palette.shades.whiteStroke,
                borderRadius: '16px',
                },
            }}>
            <DialogTitle className={classes.title} id="form-dialog-title">{t("Assign to program")}</DialogTitle>
            <DialogContent>
                <DialogContentText className={classes.typography14} sx={{pb:'8px'}}>
                    {t("Assign this content to a class, subject and chapter")}
                </DialogContentText>
                <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <FormControl sx={{display:'flex', flexGrow:1, mx:'4px'}} variant="outlined" className={classes.formControl}>
                        <InputLabel id="class-label">{t("Class")}</InputLabel>
                        <ESelect
                            labelId="class-label"
                            id="class"
                            name="classId"
                            value={assignToData.classId}
                            onChange={(e) => handleAssignToDataChange(e)}
                            // label={t("Class")}
                        >
                            {classList}
                        </ESelect>
                    </FormControl>
                    <FormControl sx={{display:'flex', flexGrow:1, mx:'4px'}} variant="outlined" className={classes.formControl}>
                        <InputLabel id="subject-label">{t("Subject")}</InputLabel>
                        <ESelect
                            labelId="subject-label"
                            id="subject"
                            name="subjectId"
                            disabled={!assignToData.classId}
                            value={assignToData.subjectId}
                            onChange={(e) => handleAssignToDataChange(e)}
                            // label={t("Subject")}
                        >
                            {subjectList}
                        </ESelect>
                    </FormControl>
                    <FormControl sx={{display:'flex', flexGrow:1, mx:'4px'}} variant="outlined" className={classes.formControl}>
                        <InputLabel id="chapter-label">{t("Chapter")}</InputLabel>
                        <ESelect
                            labelId="chapter-label"
                            id="chapter"
                            name="chapterId"
                            disabled={!assignToData.subjectId}
                            value={assignToData.chapterId}
                            onChange={(e) => handleAssignToDataChange(e)}
                            // label={t("Chapter")}
                        >
                            {chapterList}
                        </ESelect>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{justifyContent:'space-between', px: '20px', pb:'32px' }}>
                <EButton onClick={() => setOpen(false)} eSize="medium" eVariant="secondary">
                    {t("Cancel")}
                </EButton>
                <EButton onClick={handleAssignTo} eSize="medium" eVariant="primary" disabled={!assignToData.chapterId}>
                    {t("Confirm")}
                </EButton>
            </DialogActions>
        </Dialog>
    );
}
// const ContentPreview = ({data, setActiveContent, folders, setFolders, callOnFocus}) => {

const ContentPreview = ({data, folderTail}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const classes = useStyles();
    const [tagExpanded, setTagExpanded] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showAssignToModal, setShowAssignToModal] = useState(false);
    const [contentModule, setContentModule] = useState(null);

    const { F_getLocalTime, F_showToastMessage, F_getHelper, activeNavigationTab } = useMainContext();
    const {user} = F_getHelper();

    useEffect(() => {   
        ModuleService.read(data.module).then((response) => {
            setContentModule(response.data);
        }).catch((error) => {
            console.log(t("Something went wrong getting module"));
        });
    }, [data]);
        
    useEffect(() => {
        setShowMore(false)
    }, [activeNavigationTab]);


    function getActionsForContent(content) {
        let actions = [
            { id: 1, disabled: true, name: t("Bookmart as favorite"), icon: <SvgIcon viewBox="0 0 32 32" component={BookmarkAddIcon} />, 
                action: (e) => { console.log("Bookmart as favorite") }
            },
            { id: 2, disabled: true, name: t("Report as..."), icon: <SvgIcon viewBox="0 0 32 32" component={ReportIcon} />, 
                action: (e) => { console.log("Report as...") }
            },
            { id: 3, disabled: false, name: t("Copy link"), icon: <SvgIcon viewBox="0 0 32 32" component={CopyIcon} />, action: (e) => {
                var link = `${window.location.protocol}//${window.location.host}/content/display/${content._id}`
                if (!navigator.clipboard) {
                    F_showToastMessage(t("You must use HTTPS connection to copy the link"))
                    console.log(link)
                } else {
                    navigator.clipboard.writeText(link)
                    F_showToastMessage(t("Link was copied to clipboard"))
                }
            }},
        ]
        
        if (user.role === "Trainer") actions.unshift({
            id: 0, disabled: false, name: t("Assign to program"), icon: <SvgIcon viewBox="0 0 32 32" component={TerminalIcon} />, 
            action: (e) => { 
                console.log("Assign to program")
                setShowAssignToModal(true)
            } 
        })
        return actions
    }

    function getProgressBarComponent(progress=0) {
        return <Grid container sx={{ position: 'absolute', top: 150 - 8, left: 0, width: '100%' }}>
            <Box sx={{ height: '8px', width: `${progress}%`, background: palette.primary.violet }}></Box>
            <Box sx={{ height: '8px', width: `${100 - progress}%`, background: palette.neutrals.darkestGrey }}></Box>
        </Grid>
    }

  return (<>
        <ImageListItem >
            <img style={{ maxHeight:"160px", borderRadius:"8px 8px 0 0" }}
                src={ContentService.getImageUrl(data)}
                alt=" "
                loading="lazy"
            />
            {getProgressBarComponent(data.progress)}
            <Box sx={{ p: "8px", position: 'absolute', top: 0, width:'100%' }}><ETypeChip className={classes.chip1} type={data.contentType}></ETypeChip></Box>
            <Box sx={{ p: "8px", position: 'absolute', top: 0, textAlign: 'right', width:'100%', fontSize:'12px', color:palette.neutrals.white }}>
                <Box sx={{ borderRadius: '4px', background: palette.neutrals.darkestGrey, px: "8px", display: 'inline-block' }}>
                {data.durationTime && Math.floor(data.durationTime / 60) + "min"}
                </Box>
            </Box>
        </ImageListItem>
        <Grid container style={{ border: '1px solid '+ palette.neutrals.white, paddingBottom: "10px" }}>
            <Grid item xs={12} >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1, pl: "8px", py: "8px" }}>
                        <Typography className={classes.typography16}>
                            {data.title}
                        </Typography>
                        <Typography className={classes.typography14} style={{ color: palette.neutrals.darkestGrey }}>
                            {t("Author")}: {data.owner?.name} {data.owner?.surname}
                        </Typography>

                        <Typography className={classes.typography12}>
                            {t("Created")}: {F_getLocalTime(data.createdAt)}
                        </Typography>
                    </Box>
                    <Box sx={{ width: '40px', height: '40px', mr: '8px' }} >
                        <OptionsButton iconbutton={+true} btns={getActionsForContent(data)} size="large" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}} />
                    </Box>
                    <Box sx={{ width: '40px', height: '40px', mr: '8px' }} >
                        <EIconButton onClick={() => {navigate(`/content/display/${data._id}`)}} size="large" color="primary" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}}>
                            <SvgIcon viewBox={"17 17 14 14"} component={ForwardIcon} color="white" />
                        </EIconButton>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} className="px-3" style={{ borderTop: '1px solid '+ palette.neutrals.white }}>
                {/* show more show less toggle text */}
                <Typography className={classes.showMore} sx={{textAlign: 'center', mt: 1, cursor: 'pointer', mb: (showMore?3:0) }}
                    {...(showMore ? { onClick: () => setShowMore(false) } : { onClick: () => setShowMore(true) })}>
                    {showMore ? t("Show less") : t("Show more information")}
                </Typography>
                { showMore && (<>
                    {/* hashtags */}
                    <Typography className={classes.typography14} sx={{textAlign:'center'}}>
                        {data.tags?.slice(0, 3).map((hashtag, index) => <span style={{paddingRight:'6px'}} key={index}>#{hashtag.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}</span>)}
                        {data.tags?.length > 3 && (tagExpanded? 
                            <>
                                {data.tags?.slice(3).map((hashtag, index) => (<span key={index}>#{hashtag.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')} </span>))}
                                <span className={classes.showMore} onClick={() => setTagExpanded(false)}>show less</span>
                            </>:
                            <span className={classes.showMore} onClick={() => setTagExpanded(true)}>+{data.tags.length - 3} more</span>
                        )}
                    </Typography>
                    {/* tags */}
                    <Box className="d-flex justify-content-center align-items-center my-1">
                        <ContentChips content={data} elements={true} className={classes.chip}></ContentChips>
                    </Box>
                    {/* details in two columns */}
                    {<Grid container spacing={2} key={'Opened'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('Open')}
                        </Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.typography14}>
                            {t('N/A')}
                        </Typography></Grid>
                    </Grid>}
                    {<Grid container spacing={2} key={'Assigned'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('Assigned to')}
                        </Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.typography14}>
                            {data.assignedToPrograms===0?"No class":data.assignedToPrograms===1?'1 program in a class':data.assignedToPrograms+" classes' programs"}
                        </Typography></Grid>
                    </Grid>}
                    {<Grid container spacing={2} key={'School'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('School Level')}
                        </Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.typography14}>
                            {data.level}
                        </Typography></Grid>
                    </Grid>}
                    {<Grid container spacing={2} key={'Average'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('Average Dificulty')}
                        </Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.typography14}>
                            {t('N/A')}
                        </Typography></Grid>
                    </Grid>}
                    {<Grid container spacing={2} key={'Description'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('Description')}
                        </Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.typography14}>
                            {data.description}
                        </Typography></Grid>
                    </Grid>}
                    {<Grid container spacing={2} key={'Location'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('Location')}
                        </Typography></Grid>
                        <Grid item xs={8}><Typography className={classes.typography14}>
                            {folderTail.length>0 && <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', gap: '20px', padding: '10px 0', borderBottom: '1px dashed #ccc'}}>
                                {folderTail.map((folder, index) => {
                                    return (<>
                                        <Typography key={index} variant="caption1" component="span" sx={{cursor: 'pointer', color: '#4a9ea6', fontSize:"14px", fontWeight: index === folderTail.length - 1 ? '700' : '400' }}>{folder.name}</Typography>
                                        {index < folderTail.length - 1 && '>'}
                                    </>
                                    )
                                })}
                            </Box>}
                            {/* <Breadcrumb folders={folders} setFolders={setFolders} setActiveContent={setActiveContent} callOnFocus={callOnFocus} simple /> */}
                        </Typography></Grid>
                    </Grid>}
                    {<Grid container spacing={2} key={'Source'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('Source Material')}
                        </Typography></Grid>
                        <Grid item xs={8}>
                        <Typography className={classes.typography14}>
                            {data.books?.length>0 ? data.books.map((book, index) => <span key={index}>"{book.name}" {t('by')} {book.authors?.map((author, index) => <span key={index}>{author.name} {author.surname}{index<book.authors.length-1 && ', '}</span>)||t('unknown')}. {book.year}</span>) : t('Not found')}
                        </Typography>
                        </Grid>
                    </Grid>}
                    {<Grid container spacing={2} key={'Library'}>
                        <Grid item xs={4}><Typography className={classes.typography14}>
                            {t('Library Status')}
                        </Typography></Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.typography14}>
                                {t("Status")}
                                <Typography className={classes.typography16} component="span">
                                    {<CircleIcon sx={{ fontSize:10, color: getStatusColor(data.libraryStatus), mx: '10px' }}></CircleIcon>}
                                    {t(getStatusText(data.libraryStatus))}
                                </Typography>
                            </Typography>
                            {['ACCEPTED','REJECTED'].includes(data.libraryStatus) && <Typography className={classes.typography14}>
                                {data.approvedInLibraryAt && t('on') +' '+ F_getLocalTime(data.approvedInLibraryAt)} {t('by')} {contentModule?.name??t("Not found")}
                            </Typography>}
                            {data.libraryStatusReason && data.libraryStatus==='REJECTED'&& <Typography className={classes.typography14}>
                                {t("Provided reason")}: {t(data.libraryStatusReason)}
                            </Typography>}
                        </Grid>
                    </Grid>}
                </>)}
            </Grid>
        </Grid>
        <AssignToModal open={showAssignToModal} setOpen={setShowAssignToModal} content={data} />
    </>)
}

export default ContentPreview