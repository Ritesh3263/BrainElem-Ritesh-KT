import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {CardActionArea, CardActions, Typography} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import {useTranslation} from "react-i18next";
import {Stack} from "@mui/material";
import {EButton} from "styled_components";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Grid from "@mui/material/Grid";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import CropRotateIcon from '@material-ui/icons/CropRotate';
import UploadIcon from '@mui/icons-material/Upload';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";

export default function CropperModal(props){
    const { t } = useTranslation();
    const{
        pictureDialogHelper={isOpen:false},
        setPictureDialogHelper=(isOpen,)=>{},
        setCroppedData=()=>{},
        image,
        setImage,
        setFileName,
    }=props;
    const {
        F_handleSetShowLoader,
        currentScreenSize
    } = useMainContext();
    const [cropper, setCropper] = useState(); // curren cropped object
    const [cropBoxDetails, setCropBoxDetails] = useState({});


    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
        setFileName(files[0].name)
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCroppedData(cropper.getCroppedCanvas());
        }
    };

    useEffect(()=>{
        if(pictureDialogHelper.isOpen){
            F_handleSetShowLoader(true);
        }
    },[pictureDialogHelper]);

    const handleChangeCropBox=(data={})=>{
        setCropBoxDetails(p=>({...p,width: data.width, height: data.height}));
    }

    return(
        <Dialog
            open={pictureDialogHelper.isOpen}
            onClose={()=>{setPictureDialogHelper({isOpen: false})}}
            maxWidth={'lg'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center p-0">
                <Typography variant="h3" component="h2" className="mt-2 text-center text-justify"
                            style={{fontSize:"32px", color:new_theme.palette.primary.MedPurple}}>
                    {t("Picture manage")}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Cropper
                            src={image}
                            style={{ height: 420, width: "100%" }}
                            // Cropper.js options
                            initialAspectRatio={4 / 3}
                            aspectRatio={4 / 3}
                            responsive={true}
                            guides={false}
                            preview=".img-preview"
                            onInitialized={(instance) => {
                                setCropper(instance);
                            }}
                            modal={true}
                            ready={()=>{
                                F_handleSetShowLoader(false);
                            }}
                            cropstart={({target:{cropper:{cropBoxData}}})=>{handleChangeCropBox(cropBoxData)}}
                            zoomable={true}
                            minCropBoxWidth={200}
                            minCropBoxHeight={200}
                        />
                    </Grid>
                    <Grid item xs={12} className="mt-3">
                        <Stack direction={isWidthUp('md',currentScreenSize) ? "row" : "row"} alignItems="center" justifyContent="start" flexWrap="wrap" gap="5px" spacing={1} className="d-flex ">
                                <StyledButton className="m-mb-0" eSize='small' eVariant='secondary'
                                         component='label'                                        
                                         startIcon={<UploadIcon/>}
                                >
                                    {t('Upload')}
                                    <input type="file"
                                           onChange={onChange}
                                           accept='image/*'
                                           hidden={true}/>
                                </StyledButton>
                            <StyledButton className="m-mb-0" eSize='small' eVariant='secondary'
                                     startIcon={<ZoomInIcon/>}
                                     onClick={()=>{cropper.zoom(0.1)}}
                            >{t('Zoom')} +</StyledButton>
                            <StyledButton className="m-mb-0" eSize='small' eVariant='secondary'
                                     startIcon={<ZoomOutIcon/>}
                                     onClick={()=>{cropper.zoom(-0.1)}}
                            >{t('Zoom')} -</StyledButton>
                            <StyledButton className="m-mb-0" eSize='small' eVariant='secondary'
                                     startIcon={<CropRotateIcon/>}
                                     onClick={()=>{cropper.rotate(90)}}
                            >{t('Rotate')}</StyledButton>
                            <StyledButton className="m-mb-0" eSize='small' eVariant='secondary'
                                     startIcon={<ControlCameraIcon/>}
                                     onClick={()=>{cropper.setDragMode('move')}}
                            >{t('Picture move')}</StyledButton>
<br/>
                            <div>
                                <Typography variant="body1" component="span"
                                            className="text-left text-justify ml-5" style={{color: new_theme.palette.newSupplementary.NSupText}}>
                                    {`width: ${~~cropBoxDetails.width??'-'} px`}
                                </Typography>
                                <Typography variant="body1" component="span"
                                            className="text-left text-justify ml-3" style={{color: new_theme.palette.newSupplementary.NSupText}}>
                                    {`height: ${~~cropBoxDetails.height??'-'} px`}
                                </Typography>
                            </div>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
            <CardActionArea>
                <CardActions>
                    <Stack direction='row' alignItems="center" justifyContent="space-between" spacing={0} className="d-flex flex-fill">
                        <StyledButton eSize='small' eVariant='secondary'
                                 onClick={()=>{setPictureDialogHelper({isOpen: false})}}
                        >{t('Back')}</StyledButton>
                        <StyledButton eSize='small' eVariant='primary'
                                 onClick={()=>{
                                     getCropData();
                                     setPictureDialogHelper({isOpen: false});
                                 }}
                        >{t('Save')}</StyledButton>
                    </Stack>
                </CardActions>
            </CardActionArea>
        </Dialog>
    )
}