import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CourseService from "services/course.service";
import CoursePathService from "services/course_path.service";
import {useTranslation} from "react-i18next";
import {useCoursePathContext} from "components/_ContextProviders/CoursePathProvider/CoursePathProvider";
import {FormHelperText, OutlinedInput} from "@mui/material";
import {EButton} from "styled_components";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import CropperModal from "components/0TestingRoute/TestStyledComponents/Components/CropperModal/CropperModal";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Grid from "@mui/material/Grid";
import { ETabBar, ETab } from "new_styled_components";
import { new_theme } from "NewMuiTheme";
import { Divider } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";


const levels =["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg';

export default function General(props){
    const{
        errorValidator={},
    }=props;
    const { t } = useTranslation();
    const {
        coursePathActionType,
        currentCoursePath,
        coursePathDispatch,
    } = useCoursePathContext();
    const [categories, setCategories] = useState([]);
    const [pictureDialogHelper, setPictureDialogHelper]=useState({isOpen: false});
    const { F_showToastMessage, F_handleSetShowLoader, F_getErrorMessage } = useMainContext();
    //=> cropper
    const [image, setImage] = useState(defaultSrc); // img src
    const [croppedData, setCroppedData] = useState("#"); // after cropped
    const [fileName, setFileName] = useState("newFile.png");

    useEffect(() => {
        setCroppedData('#')
        CourseService.getCategoryRefsFromModule().then((res) => {
            setCategories(res.data);
        });
    }, []);

    const setImageHandler=(data)=>{
        coursePathDispatch({type: coursePathActionType.BASIC_UPDATE, payload: {
                field: 'image',
                value: data,
            }});
    };

    const categoriesList = categories.map((item, index) => (
        <MenuItem key={item._id} value={item}>
            {item.name}
        </MenuItem>
    ));

    useEffect(()=>{
       if(currentCoursePath.image !== null){
            setImage(CoursePathService.getImageUrl(currentCoursePath.image));
            setFileName(currentCoursePath.image.fileName);
        }
    },[currentCoursePath.image]);

    useEffect(()=>{
        if(croppedData !== '#'){
           uploadImage(croppedData, fileName);
        }
    },[croppedData]);

    const uploadImage=(croppedData, fileName)=>{
        croppedData.toBlob((blob)=>{
            const formData = new FormData();
            formData.append('file', blob, fileName);
            CoursePathService.uploadImage(formData).then(res=>{
                if(res.status===200){
                    F_showToastMessage(t("File was Uploaded"), 'success')
                    setImageHandler(res.data)
                }
            })
        });
    };




    return(
        <>
            <Grid container spacing={{xs:1, sm:2}}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        variant="filled"
                        error={'name' in errorValidator}
                        helperText={'name' in errorValidator && 'required'}
                        label="name"
                        name='name'
                        fullWidth={true}
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentCoursePath.name}
                        onChange={({target}) =>{
                            coursePathDispatch({type: coursePathActionType.BASIC_UPDATE, payload: {
                                    field: target.name, value: target.value
                                }});
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl  margin="dense" variant="filled" fullWidth={true}>
                        <InputLabel id="demo-simple-select-label">{t('Category')}</InputLabel>
                        <Select
                            error={'category' in errorValidator}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name='category'
                            value={currentCoursePath.category}
                            renderValue={p=> p.name}
                            //input={<Input />}
                            onChange={({target}) =>{
                                coursePathDispatch({type: coursePathActionType.BASIC_UPDATE, payload: {
                                        field: target.name, value: target.value
                                    }});
                            }}
                        >
                            {categoriesList}
                        </Select>
                        {'category' in errorValidator ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        variant="filled"
                        label="Short description"
                        name='description'
                        margin="dense"
                        fullWidth={true}
                        multiline={true}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentCoursePath.description}
                        onChange={({target}) =>{
                            coursePathDispatch({type: coursePathActionType.BASIC_UPDATE, payload: {
                                    field: target.name, value: target.value
                                }});
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl margin="dense" variant="filled" fullWidth={true}>
                        <InputLabel shrink={true} id="demo-simple-select-label">{t('Level')}</InputLabel>
                        <Select
                            error={'level' in errorValidator}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name='level'
                            value={currentCoursePath.level}
                            // renderValue={p=> p.name}
                            //input={<Input />}
                            onChange={({target}) =>{
                                coursePathDispatch({type: coursePathActionType.BASIC_UPDATE, payload: {
                                        field: target.name, value: target.value
                                    }});
                            }}
                        >
                            {levels.map((item, index) => (<MenuItem key={index+1} value={item}>{item}</MenuItem>))}
                        </Select>
                        {'level' in errorValidator ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl margin="dense" variant="filled" fullWidth={true}>
                        <InputLabel shrink={true} id="demo-simple-select-label">{t('Course type')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currentCoursePath.type}
                            error={'type' in errorValidator}
                            name='type'
                            
                            onChange={({target}) =>{
                                coursePathDispatch({type: coursePathActionType.BASIC_UPDATE, payload: {
                                        field: target.name, value: target.value
                                    }});
                            }}
                        >
                            <MenuItem value="ONLINE">{t("ONLINE")}</MenuItem>
                            <MenuItem value="BLENDED">{t("BLENDED")}</MenuItem>
                        </Select>
                        {'type' in errorValidator ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                    </FormControl>
                </Grid>
                <Grid item xs={12} >
                    <StyledButton
                        eSize='small'
                        eVariant='secondary'
                        startIcon={<PhotoSizeSelectLargeIcon/>}
                        onClick={()=>{setPictureDialogHelper({isOpen:true})}}
                    >{`${croppedData !== '#' ? t("Manage image") : t("Upload image")}`}</StyledButton>
                </Grid>
                <Grid item xs={12} >
                    {croppedData !== '#' ? (
                        <img
                            className="width-mb-100"
                            style={{maxHeight:'250px', width:'auto', objectFit: 'contain'}}
                            src={croppedData.toDataURL()}
                            alt='Course image'
                            loading="lazy"
                        />
                    ) : (
                        <img
                            className="width-mb-100"
                            style={{maxHeight:'250px', width:'auto', objectFit: 'contain'}}
                            src={CoursePathService.getImageUrl(currentCoursePath.image)}
                            alt='Course image'
                            loading="lazy"
                        />
                    )}
                </Grid>
            </Grid>

            {/*<div className="d-flex justify-content-between mt-2">*/}
            {/*    <CommonImageUpload name={t("Upload image")} description={t("Upload image for course")}*/}
            {/*                       value={currentCoursePath.image} setValue={setImageHandler}*/}
            {/*                       uploadFunction={CoursePathService.uploadImage}/>*/}
            {/*</div>*/}
            {/*{currentCoursePath?.image && (*/}
            {/*    <img*/}
            {/*        style={{maxHeight:'250px', width:'auto', objectFit: 'contain'}}*/}
            {/*        src={CoursePathService.getImageUrl(currentCoursePath.image)}*/}
            {/*        alt='Course image'*/}
            {/*        loading="lazy"*/}
            {/*    />*/}
            {/*)}*/}

            <CropperModal pictureDialogHelper={pictureDialogHelper}
                          setPictureDialogHelper={setPictureDialogHelper}
                          image={image}
                          setImage={setImage}
                          setCroppedData={setCroppedData}
                          setFileName={setFileName}
            />
        </>
    )
}