import React, { useEffect, useState,useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import Avatar from "@mui/material/Avatar";
import moduleCoreService from "services/module-core.service";
import ModalContent from "./ModalContent/ModalContent";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import chapterService from "services/chapter.service";
import Button from '@mui/material/Button';
import CreateNewChapterModal from "./ModalCreateNewChapter/CreateNewChapterModal";
import PanToolIcon from '@material-ui/icons/PanTool';
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Checkbox, FormControlLabel, FormGroup, ListSubheader } from '@mui/material';
import { useTranslation } from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import DeleteIcon from "@material-ui/icons/Delete";
import Chip from "@mui/material/Chip";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import { theme } from "MuiTheme";
import { EButton } from "styled_components";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./subject.scss"



const initialState = {
    name: "",
    description: "",
    category: "",
    categories: [],
    chapters: []
}

export default function MSSubjectsForm(props) {
    const {
        editFormHelper = {},
        setEditFormHelper = (isOpen, openType, subjectId) => { },
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { subjectId } = useParams();
    const { setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader, F_hasPermissionTo } = useMainContext();
    const { manageScopeIds, user } = F_getHelper();
    const [isFromAI, setIsFromAI] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState("");
    const [currentModule, setCurrentModule] = useState({});
    const [subjectIndex, setSubjectIndex] = useState(0);
    const [MSCategories, setMSCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [addChapterModal, setAddChapterModal] = useState(false);
    const [actionModalChapter, setActionModalChapter] = useState({ isOpen: false, returnedValue: false, indexToRemove: null });
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [MSSubject, setMSSubject] = useState(initialState);

    const [MSChaptersToAssign, setMSChaptersToAssign] = useState([]);
    const [isOpenDrawerCategory, setIsOpenDrawerCategory] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [newCategories, setNewCategories] = useState([]);
    const [_errors, _setErrors] = useState([]);
    const { categoryId } = useParams();
    const [MSCategory, setMSCategory] = useState({
        name: "",
        description: "",
        error:false,
        errorMessage:""
    });

    const [newChapter, setNewChapter] = useState({
        _id: "",
        name: "",
        description: "",
        durationTime: "",
        createdAt: "",
        assignedContent: [],
        dependantChapters: [],
        creator: "",
        isSelected: true,
    });

    const [basicValidators, setBasicValidators] = useState({
        name: false,
        description: false,
        durationTime: false,
    })

    const textRef = useRef()

    useEffect(() => {
        if (actionModalChapter.returnedValue) {
            RemoveChapter(actionModalChapter.indexToRemove);
        }
    }, [actionModalChapter.returnedValue]);

    useEffect(() => {
        if (actionModal.returnedValue) {
            removeSubject();
        }
        F_handleSetShowLoader(false)
    }, [actionModal.returnedValue]);


    useEffect(() => {
        if (editFormHelper.isOpen) {
            setMSSubject(() => ({ ...initialState, chapters: [] }))
            F_handleSetShowLoader(true)
            setCurrentModuleId(manageScopeIds.moduleId)
            moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
                let editedSubject = undefined;
                setCurrentModule(res.data)
                if (res.data.academicYears && editFormHelper.openType !== "ADD") {
                    setSubjectIndex(res.data.trainingModules.findIndex(sy => sy._id === editFormHelper.subjectId));
                    editedSubject = res.data.trainingModules.find(sy => sy._id === editFormHelper.subjectId);
                    setMSSubject(editedSubject);
                    F_handleSetShowLoader(false)
                }
                if (res.data.categories) {
                    updateSelect(res.data.categories, editedSubject?.categories);
                    F_handleSetShowLoader(false)
                }
            }).catch(error => console.error(error));
        }
    }, [editFormHelper.isOpen]);


    const updateSelect = (mainItems, assignedCategories = []) => {
        let selectedList = mainItems?.map(co => {
            assignedCategories?.map(chC => {
                if (co._id === chC._id) {
                    co.isSelected = true;
                }
            })
            return co;
        });
        setMSCategories(selectedList);
    };

    useEffect(() => {
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            if (res.data.categories) {
                let editedSubject = res.data.trainingModules.find(sy => sy._id === editFormHelper.subjectId);
                updateSelect(res.data.categories, editedSubject?.categories);
                F_handleSetShowLoader(false)
            }
        }).catch(error => console.error(error));
        setFilteredData(MSCategories);
    }, []);

    async function updateData() {
        console.log()
        if (MSSubject?.name?.length < 3) throw new Error('name');
        else _setErrors([]);
        await setMSSubject(p => {
            let val = Object.assign({}, p);
            if (val.chapters.length > 0) {
                val.chapters.map(ch => delete ch.isSelected)
            }
            return val;
        })
    }

    function saveChanges() {
        if (editFormHelper.openType === "ADD") {
            updateData().then(() => {
                console.log("in subject")
                moduleCoreService.addMSSubject(manageScopeIds.moduleId, MSSubject).then(res => {
                    //display res.message in toast
                    setEditFormHelper({ isOpen: false, openType: null, subjectId: null })
                    F_showToastMessage(t("Data was created"), "success");
                    navigate("/modules-core/subjects")
                }).catch(error => console.error(error));
            }).catch(err => {
                if (err.message === 'name') {
                    _setErrors(p => (['name']))
                }
            })
           
        } else {
            updateData().then(() => {
                moduleCoreService.updateMSSubject(MSSubject).then(res => {
                    setEditFormHelper({ isOpen: false, openType: null, subjectId: null })
                    F_showToastMessage(t("Data was updated"), "success");
                    navigate("/modules-core/subjects")
                }).catch(error => console.error(error));
            }).catch(err => {
                console.log(err);
            })  
        }
    }

    function removeSubject() {
        moduleCoreService.removeMSSubject(MSSubject).then(res => {
            //display res.message in toast
            console.log(res)
            F_showToastMessage(t("Data was removed"), "success");
            navigate("/modules-core/subjects")
        }).catch(error => console.error(error));
        setEditFormHelper({ isOpen: false, openType: 'ADD', subjectId: undefined })
    }

    function RemoveChapter(index) {
        setMSSubject(p => {
            let val = Object.assign({}, p);
            val.chapters.splice(index, 1);
            return val;
        })
    }

    function pushChapters(chapters) {
        setMSSubject(p => {
            let val = Object.assign({}, p);
            if (chapters.length > 0) {
                chapters.forEach(ch => {
                    if (ch.isSelected) { val.chapters.push(ch) }
                });
            }
            return val;
        })
    }

    //console.log(MSSubject.chapters)
    const chaptersList = MSSubject?.chapters?.length >= 1 ? MSSubject.chapters.map((chapter, index) => (

        <Grid container key={chapter._id} className="tbl_selected_tr" style={{ backgroundColor: new_theme.palette.shades.white60}}>

            <Grid item xs={12} className="pl-2 pr-2 d-flex align-items-center ">
                <Col xs={1}><Avatar style={{ width: "25px", height: "25px", background: 'transparent' }}><small>{index + 1}</small></Avatar></Col>
                <Col xs={4} className="no_border">
                    <TextField className="search_table no_border input_padd_0"  margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={chapter.name}
                        onInput={(e) => {
                            setMSSubject(p => {
                                let val = Object.assign({}, p);
                                val.chapters[index].name = e.target.value;
                                return val;
                            })
                        }}
                    />
                </Col>
                <Col xs={6} >
                    <TextField className="search_table no_border input_padd_0"  margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={chapter.description}
                        onInput={(e) => {
                            setMSSubject(p => {
                                let val = Object.assign({}, p);
                                val.chapters[index].description = e.target.value;
                                return val;
                            })
                        }}
                    />
                </Col>
                <Col xs={1} className="d-flex justify-content-start pr-3">
                    <IconButton className="text-danger pl-4" size="small" >
                        <DeleteIcon style={{ color: new_theme.palette.newSupplementary.NSupText }} onClick={() => setActionModalChapter({ isOpen: true, returnedValue: false, indexToRemove: index })} />
                    </IconButton>
                </Col>
            </Grid>
        </Grid>
    )) : []
    function saveCatChanges() {
        if(MSCategory.name.length<=2){
            setMSCategory(p => ({ ...p,error:true,errorMessage:'Enter valid name.'}));
            F_showToastMessage(`${t('Enter valid name.')}`,"error");
        }
        if (categoryId !== "new" && MSCategory.name.length>2) {
            moduleCoreService.addMSCategory(currentModuleId, MSCategory).then(res => {
                setNewCategories(MSCategory);
                F_showToastMessage(t("Data was created"), "success");
            }).catch(error => console.error(error));
        }
    }
    useEffect(() => {
        refreshDrawer();
    }, [newCategories]);
    useEffect(()=>{
        chapterService.readAll().then(res => {
            let newList = res.data.length > 0 ? res.data.filter(c => !MSSubject.chapters.some(i => i._id === c._id)) : [];
            setMSChaptersToAssign(newList);
        }).catch(err => console.log(err));
    },[])
    function refreshDrawer(pleaseOpen) {
        if (pleaseOpen) {
            setIsOpenDrawerCategory(pleaseOpen);
        }
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            if (res.data.categories) {
                let editedSubject = res.data.trainingModules.find(sy => sy._id === editFormHelper.subjectId);
                updateSelect(res.data.categories, editedSubject?.categories);
                F_handleSetShowLoader(false);
                setFilteredData(res.data.categories);
            }
        }).catch(error => console.error(error));

    }

    // function getSuggestion(){
    //     setOpenDialog(true);
    //         chapterService.readAll().then(res=>{
    //             let newList = res.data.length>0 ? res.data.filter(c => !MSSubject.chapters.some(i=> i._id === c._id)) : [];
    //             setMSChaptersToAssign(newList);
    //         }).catch(err=>console.log(err));
    // }
    
    function createNewChapter(newChapter) {
        // and push chapter to db
        if (newChapter.name.length > 3) {
            chapterService.addChapter(subjectId, newChapter).then(res => {
                let newChap = [{...res.data.chapter, isSelected: true }]
                pushChapters(newChap).then(setAddChapterModal(false));
                F_showToastMessage("New chapter was created", "success");
            }).catch(error => console.error(error))
        }
    };

    const assignedCategoriesList = MSSubject?.categories?.length > 0 ? MSSubject?.categories.map(i => (
        <Chip label={i?.name} className='m-1'
            key={i?._id}
            style={{ backgroundColor: theme.palette.newSupplementary.SupCloudy, color: theme.palette.newSupplementary.NSupText, borderRadius: '5px' }}
            onDelete={() => { categoryAction({ type: 'REMOVE', category: i?._id }) }}
        />
    )) : <p>{t("List is empty")}</p>;

    const categoryAction = ({ type, category }) => {
        if (type === 'ADD') {
            setMSSubject(p => ({ ...p, categories: [...p.categories, category] }));
            setMSCategories(p => {
                let val = Object.assign([], p);
                val[val.findIndex(i => i?._id === category?._id)].isSelected = true;
                return val;
            });
        } else if (type === 'REMOVE') {
            setMSSubject(p => ({ ...p, categories: p.categories.filter(i => i?._id !== category) }));
            setMSCategories(p => {
                let val = Object.assign([], p);
                val[val.findIndex(i => i?._id === category)].isSelected = false;
                return val;
            });
        }
    };


    const allCategoriesList = filteredData.map((item, index) => (
        <FormControlLabel
            key={index}
            label={item?.name}
            control={
                <Checkbox style={{ color: new_theme.palette.secondary.DarkPurple }}
                    checked={!!item?.isSelected}
                    name={item?.name}
                    value={index}
                    onChange={(e, isS) => {
                        if (isS) {
                            categoryAction({ type: 'ADD', category: item });
                        } else {
                            categoryAction({ type: 'REMOVE', category: item?._id });
                        }
                    }}
                />
            }
        />
    ));
    const [ManageAssignedCategories, setManageAssignedCategories] = React.useState(false);
    const AssignedCategories = () => setManageAssignedCategories(true);
    function validateData(fromSave){
        // if(newChapter.name.length<3 || newChapter.description.length<3 || (newChapter.durationTime.length<1 && newChapter.durationTime === "")){
        if(newChapter.name.length<3 ){
            if(newChapter.name.length<3){
                setBasicValidators(p=>({...p,name: true}))
            }else{
                setBasicValidators(p=>({...p,name: false}))
            }
            if(newChapter.description.length<3){
                setBasicValidators(p=>({...p,description: false}))
                // setBasicValidators(p=>({...p,description: true}))
            }else{
                setBasicValidators(p=>({...p,description: false}))
            }
            if(newChapter.durationTime.length<1 && newChapter.durationTime === ""){
                setBasicValidators(p=>({...p,durationTime: false}))
                // setBasicValidators(p=>({...p,durationTime: true}))
            }else{
                setBasicValidators(p=>({...p,durationTime: false}))
            }
        }else {
            setBasicValidators({
                name: false,
                description: false,
                durationTime: false,
            })
           if(fromSave === "SAVE"){
               createNewChapter(newChapter);
           }
        }
    }

    return (
        <ThemeProvider theme={new_theme}>
            <div  ref={textRef} ></div>
            {!ManageAssignedCategories ?
                <>
                    <Grid item xs={12} >
                        <div className="admin_content" style={{ paddingTop: "0" }}>
                            <div className="admin_heading" >
                                <Grid>
                                    <Typography variant="h1" component="h1" style={{ inlineSize: 'max-content' }}>{t("Add Subject")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>

                            </div>
                            <Grid item xs={12} sx={{ mt: 1 }}>
                                <Grid container className="account-grid" sx={{ mt: 3 }}>
                                    <Grid item xs={12} sm={6} md={3} sx={{ px: 1, display: 'flex', flexDirection: 'column' }}>

                                        <TextField label={t("Subject Name")} margin="dense"
                                            fullWidth={true}
                                            name='name'
                                            variant='filled'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            error={(_errors.includes("name"))}
                                            helperText={(_errors.includes("name")) && t('Incorrect name [3-20 characters]')}
                                            value={MSSubject.name}
                                            
                                            onInput={({target:{name,value}}) => {
                                                setMSSubject(p=>({...p,[name]: value}))
                                            }}
                                        />
                                        
                                    </Grid>
                                    <Grid item xs={12} className="role-sec-head">
                                        <Grid className="mb-flex-colum" item xs={12} sx={{ display:'flex', mt: 3, gap:2 }}>
                                            <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText, alignSelf:'center' }}>{t("Assigned Catagories")}</Typography>
                                            <div className="heading_buttons">
                                                <StyledButton eVariant="primary" eSize="large"
                                                    onClick={AssignedCategories}
                                                >
                                                    {t("Assign Categories")}
                                                </StyledButton>
                                            </div>

                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                                        </Grid>
                                        {assignedCategoriesList}
                                    </Grid>
                                    <Grid item xs={12} className="role-sec-head">
                                        <Grid item xs={12} sx={{ mt: 3 }}>
                                            <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Create Chapter")}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                                        </Grid>

                                    </Grid>
                                    <Box className="textField-box" sx={{ display: 'flex', width: '100%', gap: '20px', alignItems:'center' }}>
                                        <Grid item xs={12} sm={6} md={3} sx={{ px: 1, display: 'flex', flexDirection: 'column' }}>
                                            <TextField label={t("Chapter Name")} margin="dense"
                                                fullWidth={true}
                                                name='chaptername'
                                                variant='filled'
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                error={basicValidators.name}
                                                helperText={basicValidators.name && "invalid"}
                                                value={newChapter.name}
                                                onInput={(e) => {
                                                    setNewChapter(p => ({ ...p, name: e.target.value }))
                                                }}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3} sx={{ px: 1, display: 'flex', flexDirection: 'column' }}>
                                            <TextField label={t("Chapter Description")} margin="dense"
                                                fullWidth={true}
                                                name='chapterdesc'
                                                variant='filled'
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                multiline={true}
                                                rowsMax={2}
                                                error={basicValidators.description}
                                                helperText={basicValidators.description && "invalid"}
                                                value={newChapter.description}
                                                onInput={(e) => {
                                                    setNewChapter(p => ({ ...p, description: e.target.value }))
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3} sx={{ px: 1, display: 'flex', flexDirection: 'column' }}>
                                            <TextField label={t("Duration Time [ hh-mm ]")} margin="dense"
                                                fullWidth={true}
                                                name='chapterTime'
                                                variant='filled'
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                type="number"
                                                error={basicValidators.durationTime}
                                                helperText={basicValidators.durationTime && "invalid"}
                                                inputProps={{
                                                    min: "0",
                                                    max: "9999999",
                                                    step: "1"
                                                }}
                                                onInput={(e) => {
                                                    setNewChapter(p => ({ ...p, durationTime: e.target.value }))
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3} sx={{ px: 1, display: 'flex', flexDirection: 'column' }} style={{textAlign:'right'}}>
                                            <StyledButton eVariant="primary" eSize="large" onClick={()=>{
                                                validateData("SAVE");
                                            }}>
                                                {t("Save")}
                                            </StyledButton>
                                        </Grid>
                                    </Box>
                                    <Grid item xs={12} className="role-sec-head">
                                        <Grid item xs={12} sx={{ mt: 3 }}>
                                            <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Choose Chapter")}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                                        </Grid>
                                        {/* <Grid container spacing={1}>
                                            <Grid  item xs={12} > */}
                                                {/* <SubjectsTable MSSubjects={MSSubjects} setEditFormHelper={setEditFormHelper}/> */}
                                            {/* </Grid>

                                        </Grid> */}
                                        <ModalContent className="table_choose" MSAllChapters={MSChaptersToAssign} setMSAllChapters={setMSChaptersToAssign} pushChapters={pushChapters} isFromAI={isFromAI} />

                                    </Grid>

                                    <Grid item xs={12} className="role-sec-head">
                                        <Grid item xs={12} sx={{ mt: 3 }}>
                                            <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Selected Chapter")}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                                        </Grid>
                                        <Grid container spacing={1} className="px-4 tbl-selected-chap">

                                            <Grid className="chap-width-mb" item xs={12} >
                                                <Grid item xs={12} className="pl-3 pr-3 d-flex align-items-center selected_tbl_head">
                                                    <Col xs={1} className="text-left" >No.</Col>
                                                    <Col xs={4} className="text-left" >{t("Chapter name")}</Col>
                                                    <Col xs={6} >{t("Chapter description")}</Col>
                                                    <Col xs={1} >{t("Action")}</Col>

                                                </Grid>

                                            {chaptersList}
                                                {/* <SubjectsTable MSSubjects={MSSubjects} setEditFormHelper={setEditFormHelper}/> */}
                                            </Grid>

                                        </Grid>

                                    </Grid>
                                    <Grid container className="btn-flex btn-grid-mb">
                                        <Grid item className="text-right">
                                            <StyledButton eVariant="secondary" eSize="medium" onClick={() => {
                                                setEditFormHelper({ isOpen: false, openType: 'ADD', subjectId: undefined })
                                                F_showToastMessage("No change",)
                                            }}>
                                                {t("Back")}
                                            </StyledButton>
                                        </Grid>

                                        <Grid item className="text-right">
                                            {(subjectId === "EDIT") || (editFormHelper.openType === 'EDIT') ?
                                                <StyledButton eVariant="secondary" eSize="medium" onClick={() => setActionModal({ isOpen: true, returnedValue: false })}>
                                                    {t("Remove")}
                                                </StyledButton>
                                                : null}
                                            <StyledButton eVariant="primary" eSize="medium" onClick={saveChanges}>
                                                {editFormHelper.openType === 'ADD' ? t("Submit") : t("Update")}
                                            </StyledButton>

                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Grid>
                            {/* <Card className="p-2 d-flex flex-column m-0" id="main-container">
                                <CardHeader title={(
                                    <Typography variant="h3" component="h3" className="text-left" style={{ color: theme.palette.primary.lightViolet }}>
                                        {` ${MSSubject?.name || t("Create subject")}`}
                                    </Typography>
                                )}
                                />
                                <CardContent>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6} className='d-flex align-items-center pb-0'>
                                            <TextField label={t("Subject name")} style={{ maxWidth: "400px", marginBottom: '0px' }} margin="dense"
                                                fullWidth={true}
                                                variant="filled"
                                                name={"name"}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                error={(_errors.includes("name"))}
                                                helperText={(_errors.includes("name")) && t('Incorrect name [3-20 characters]')}
                                                value={MSSubject.name}
                                                onInput={({ target: { name, value } }) => {
                                                    setMSSubject(p => ({ ...p, [name]: value }))
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex align-items-center justify-content-between">
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} md={6}>
                                                    <EButton eSize="small" eVariant="secondary"
                                                        onClick={() => { refreshDrawer(true) }}
                                                    >{t("Manager assigned categories")}</EButton>
                                                </Grid>
                                                {/* <Grid item xs={12} md={6}>
                                            <EButton eSize="small" eVariant="primary"
                                                    startIcon={<AddCircleOutlineIcon/>}
                                                    onClick={()=>{navigate("/modules-core/subjects-categories/new")}}
                                            >{t("Add new category")}</EButton>
                                        </Grid> 
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={6} className='align-items-start'>
                                            <Paper elevation={10} className='p-2 mt-4' style={{ borderRadius: '8px' }}>
                                                <Typography variant="h3" component="h3" className="text-center" style={{ fontSize: "18px" }} >
                                                    {t("Assigned categories")}tUser
                                                </Typography>
                                                {assignedCategoriesList}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} className='mt-5 mb-2'>
                                            <Typography variant="h5" component="h2" className="text-left" >
                                                {t("Assigned chapters")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} >
                                                    <EButton eSize="small" eVariant="secondary"
                                                    >{t("Add chapter")}</EButton>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <EButton eSize="small" eVariant="secondary"

                                                    >{t("Assign chapter")}</EButton>
                                                </Grid>
                                            </Grid>


                                            {(MSSubject?.chapters?.length >= 1) ?
                                                <>
                                                    <Grid container className='mt-4'>
                                                        <Grid item xs={12}>
                                                            {chaptersList}
                                                        </Grid>
                                                    </Grid>
                                                </> : null}
                                        </Grid>
                                    </Grid>

                                </CardContent>
                                <CardActionArea>
                                    <CardActions className="d-flex justify-content-between align-items-center mt-3" >
                                        <Grid container>
                                            <Grid item xs={6} className='d-flex align-items-center'>
                                                <EButton eVariant="secondary" eSize="small"
                                                    onClick={() => {
                                                        setEditFormHelper({ isOpen: false, openType: 'ADD', subjectId: undefined })
                                                        F_showToastMessage("No change",)
                                                        // navigate("/modules-core/subjects")
                                                    }}>
                                                    {t("Dismiss")}
                                                </EButton>
                                            </Grid>
                                            <Grid item xs={6} className="p-0 d-flex justify-content-end align-items-center">
                                                {(subjectId === "EDIT") || (editFormHelper.openType === 'EDIT') ?
                                                    <EButton eVariant="secondary" size="small" color="inherit"
                                                        onClick={() => setActionModal({ isOpen: true, returnedValue: false })}>
                                                        {t("Remove")}
                                                    </EButton> : null}
                                                <Button onClick={saveChanges} size="small" variant="contained" color="primary" className="ml-5">
                                                    {editFormHelper.openType === 'ADD' ? t("Add") : t("Update")}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </CardActionArea>

                                <CreateNewChapterModal addChapterModal={addChapterModal} setAddChapterModal={setAddChapterModal} createNewChapter={createNewChapter} />
                               

                            </Card> */}
                        </div>
                        <ConfirmActionModal actionModal={actionModalChapter}
                                    setActionModal={setActionModalChapter}
                                    actionModalTitle={t("Removing chapter")}
                                    actionModalMessage={t("Are you sure you want to remove chapter? The action is not reversible!")}
                                />
                              
                    </Grid>
                </>
                :
                <>
                    <Grid item xs={12}>
                        <div className="admin_content" style={{ paddingTop: "0" }}>
                            <div className="admin_heading" >
                                <Grid>
                                    <Typography variant="h1" component="h1" style={{ inlineSize: 'max-content' }}>{t("Assigned Categories")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                        <Grid container className="account-grid" sx={{ mt: 3 }}>
                        <Grid item xs={12} className="role-sec-head">
                            <Grid className="mt-mb-0" item xs={12} sx={{ mt: 3 }}>
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Category Name")}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                            </Grid>
                            
                        </Grid>
                        <Box className="cat-name-box" >
                            <Grid item xs={12} sm={6} md={3} style={{display:'flex', alignItems:'center', gap:'20px'}}>
                                <TextField label={t("Category Name")} margin="dense"
                                    fullWidth={true}
                                    name='subjectname'
                                    variant='filled'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={MSCategory.error}
                                    value={MSCategory.name}
                                    onChange={({ target: { value } }) => {

                                        if(value.length>2){
                                            setMSCategory(p => ({ ...p, name: value,error:false,errorMessage:'' }))
                                        }else{
                                            setMSCategory(p => ({ ...p, name: value,error:true,errorMessage:'Enter valid name.'}))
                                        }
                                    }}
                                />  
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} style={{display:'flex', alignItems:'center', gap:'20px'}}>
                                <div className="heading_buttons">
                                    <StyledButton eVariant="primary" eSize="large" onClick={saveCatChanges} >
                                        {t("Add")}
                                    </StyledButton>
                                </div>
                            </Grid>
                        </Box>
                        <Grid item xs={12} className="role-sec-head">
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Categories")}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                            </Grid>
                            <FormGroup className="pl-3 subject_checkboxes" style={{flexDirection:'row'}}>
                                {(allCategoriesList?.length > 0) ? allCategoriesList : <span>{t("No data")}</span>}
                            </FormGroup>

                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid container className="btn-flex btn-grid-mb">
                        <Grid item className="text-right">
                            <StyledButton eVariant="secondary" eSize="medium" onClick={() => {
                               setManageAssignedCategories(false)
                            }}>
                                {t("Back")}
                            </StyledButton>
                            
                        </Grid>
                        <Grid item className="text-right">
                            
                            <StyledButton eVariant="primary" eSize="medium" onClick={()=>{
                                console.log("ref",textRef.current.offsetTop)
                                window.scrollTo({
                                    behavior: "smooth",
                                    top: 0
                                  });
                                setManageAssignedCategories(false)
                            }}>
                                {t("Save")}
                            </StyledButton>
                        </Grid>
                    </Grid>

                    {/* <div>
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                                    <Grid container className="py-2">
                                        <Grid item xs={12}>
                                            <Typography variant="h3" component="h2" className="mt-2 text-center text-justify mb-2" style={{ fontSize: "32px" }}>
                                                {t("Manage assigned categories")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} className='px-3 mb-2'>
                                            <SearchField
                                                className="text-primary"
                                                value={searchingText}
                                                onChange={({ target: { value } }) => { TableSearch(value, MSCategories, setSearchingText, setFilteredData) }}
                                                clearSearch={() => TableSearch('', MSCategories, setSearchingText, setFilteredData)}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListSubheader>}
                        >
                            <FormGroup className="pl-3">
                                {(allCategoriesList?.length > 0) ? allCategoriesList : <span>{t("No data")}</span>}
                            </FormGroup>
                            <CardHeader title={(
                                <Typography variant="h5" component="h5" className="text-center" >
                                    {t("Add new category below")}:
                                </Typography>
                            )} />
                            <Grid item xs={12} >
                                <Box textAlign='center'>
                                    <TextField label={t("Category name")} textAlign='center' margin="normal"
                                        className="pl-3"
                                        // fullWidth={true}
                                        variant="filled"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={MSCategory.name}
                                        onChange={({ target: { value } }) => {
                                            setMSCategory(p => ({ ...p, name: value }))
                                        }}
                                    />
                                </Box>
                                <Box textAlign='center'>
                                    <Button onClick={saveCatChanges} size="small" variant="contained" color="primary" >
                                        {t("Add")}
                                    </Button>
                                </Box>
                            </Grid>
                        </List>
                    </div> */}
                </>
            }

        </ThemeProvider>
    )
}