import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Card, CardHeader, ListSubheader, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import {useMainContext} from "../../../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {makeStyles} from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SidebarSelectSubject from "./SidebarSelectSubject";
import {useCurriculumContext} from "../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import CourseService from "services/course.service";
import CommonImageUpload from "components/common/Image";


const useStyles = makeStyles(theme=>({}));


const initialSubjectData={
    newName: "",
    chosenChapters:[],
    originalTrainingModule: undefined,
    estimatedTime: 0,
    description: "",
    selectedBook:{},
    image: {},
}

export default function AddSubject({handleAddSubject}){
    const classes = useStyles();
    const {F_showToastMessage} = useMainContext();
    const {t} = useTranslation();
    const [newSubject, setNewSubject]=useState(initialSubjectData);
    const [isOpenSidebarAddSubjects,setIsOpenSidebarAddSubjects]=useState(false);
    const [image, setImage] = useState(null);

    /** CurriculumContext **/
    const {
        currentModuleCore,
        setSubjectDisplayMode,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/


    const handleAssignSubject=(subId)=>{
        let selectedSubject = currentModuleCore.trainingModules.filter(s=> s._id === subId)[0];
        setNewSubject(p=>(
            {...p,
                image: selectedSubject.image,
                newName: selectedSubject.name,
                description: selectedSubject.description,
                chosenChapters: selectedSubject.chapters,
                originalTrainingModule: selectedSubject,
                estimatedTime: selectedSubject.estimatedTime,
            }
        ))
    }

    useEffect(()=>{
        setNewSubject(p=>({...p, image}));
    },[image]);

    //console.log("ttttt",newSubject)

    return (
        <Card className="p-0 d-flex flex-fill flex-column m-0">
            <CardHeader className="py-1 pl-3" title={(
                <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {`${t("Add subject")}`}
                </Typography>
            )}
            />

            <CardContent>
                <Grid container className="mt-0">
                    <Grid item md={6} className='px-2 d-flex flex-column justify-content-start align-items-center'>
                        <TextField label={t("Select base subject")} margin="normal"
                                   required={true}
                                   fullWidth
                                   style={{maxWidth: "400px", cursor: "pointer"}}
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   inputProps={{
                                       style:{cursor: 'pointer'}
                                   }}
                                   InputProps={{
                                       readOnly: true,
                                       endAdornment: (
                                           <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                                               <ArrowDropDownIcon />
                                           </InputAdornment>
                                       ),
                                   }}
                                   value={newSubject?.originalTrainingModule?.name}
                                   onClick={(e) => {
                                       setIsOpenSidebarAddSubjects(true);
                                   }}
                        />
                        <TextField label={t("Estimated duration [h]")} margin="normal"
                                   error={ newSubject?.originalTrainingModule && newSubject.estimatedTime ===0}
                                   disabled={newSubject.originalTrainingModule === undefined}
                                   type="number"
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant="filled"
                                   required={true}
                                   //helperText={newSubject.estimatedTime ===0 ? t("required") : ""}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={newSubject.estimatedTime}
                                   onChange={(e)=>{
                                       if(e.target.value !== ""){
                                           if(Number(e.target.value)>0 && Number(e.target.value)<1000){
                                               setNewSubject(p=>({...p, estimatedTime: e.target.value}))
                                           }
                                       }
                                   }}
                        />
                    </Grid>
                    <Grid item md={6} className='px-2 d-flex flex-column justify-content-start align-items-center'>
                        <TextField label={t("Subject name")} margin="normal"
                                   error={newSubject.originalTrainingModule && newSubject.newName === ''}
                                   disabled={newSubject.originalTrainingModule === undefined}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant="filled"
                                   required={true}
                                   //helperText={newSubject.newName === '' ? t("required") : ""}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={newSubject.newName}
                                   onInput={(e) => {
                                       setNewSubject(p=>({...p, newName: e.target.value}))
                                   }}
                        />
                        <TextField label={t("Description")} margin="normal"
                                   disabled={newSubject.originalTrainingModule === undefined}
                                   multiline
                                   rowsMax={4}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={newSubject.description}
                                   onInput={(e) => {
                                       setNewSubject(p=>({...p, description: e.target.value}))
                                   }}
                        />
                        <FormControl fullWidth margin="normal"
                                     hidden={true}
                                     disabled={true}
                                     style={{maxWidth: "400px"}}
                                  // error={BasicValidators.assignedYear}
                                     variant="filled">
                            <InputLabel id="book-select-label">{t("Select book - soon")}</InputLabel>
                            <Select
                                labelId="book-select-label"
                                id="book-select"
                                value={"Soon..."}
                                //renderValue={p=> p.name}
                                onChange={(e) => {

                                }}
                            >
                                {/*{academicYearsList}*/}
                            </Select>
                            {/*{BasicValidators.assignedYear ? (<FormHelperText>{t("required")}</FormHelperText>) : null}*/}
                        </FormControl>
                        {/* <TextField label={t("Upload image - soon")} margin="normal"
                                   disabled={true}
                                   fullWidth
                                   style={{maxWidth: "400px", cursor: "pointer"}}
                                   variant="filled"
                            // helperText={BasicValidators.curriculumName ? t("required") : ""}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   inputProps={{
                                       style:{cursor: 'pointer'}
                                   }}
                                   InputProps={{
                                       readOnly: true,
                                       endAdornment: (
                                           <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                                               <AddCircleOutlineIcon />
                                           </InputAdornment>
                                       ),
                                   }}
                                   value={null}
                                   onInput={(e) => {
                                       // setCurrentCurriculum(p=>({...p, name: e.target.value}))
                                   }}
                        /> */}
                        <FormControl fullWidth margin="normal"
                                     multiline
                                     style={{maxWidth: "400px"}}
                                  // error={BasicValidators.assignedYear}
                                     variant="filled">
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} className='px-2' style={{display:'flex', justifyContent:"center"}}>
                        <CommonImageUpload name={t("Upload image")}
                                           disabled={newSubject.originalTrainingModule === undefined}
                                           value={image} setValue={setImage}
                                           uploadFunction={CourseService.uploadImage}
                                           getFileDetailsFunction={CourseService.getFileDetails}/>
                    </Grid>
                    <Grid item xs={12} md={6} className='px-2'>
                        {image && (
                            <img
                                style={{maxHeight:'200px', width:'auto', objectFit: 'contain'}}
                                src={CourseService.getImageUrl(image)}
                                alt='Course image'
                                loading="lazy"
                            />
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() =>  {
                                setSubjectDisplayMode({mode:"TABLE", subjectId: undefined})
                                F_showToastMessage(t("No change"),)
                            }}>
                                {t("Back")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    disabled={newSubject.originalTrainingModule === undefined}
                                    onClick={()=>{handleAddSubject(newSubject)}} className="ml-5"
                            >{t("Add")}</Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <SidebarSelectSubject isOpenSidebarAddSubjects={isOpenSidebarAddSubjects}
                                  setIsOpenSidebarAddSubjects={setIsOpenSidebarAddSubjects}
                                  handleAssignSubject={handleAssignSubject}
            />
        </Card>
    )
}