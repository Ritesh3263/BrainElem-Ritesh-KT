import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Col, Row} from "react-bootstrap";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import IdGeneratorHelper from "components/common/IdGeneratorHelper";
import {now} from "moment";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Grid from "@mui/material/Grid";
import Typography from "@material-ui/core/Typography";
import {EButton} from "../../../../../styled_components";

const useStyles = makeStyles(theme=>({}))

export default function CreateNewChapterModal({addChapterModal, setAddChapterModal, createNewChapter}){
    const { t } = useTranslation();
    const classes = useStyles();
    const { F_showToastMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [newChapter, setNewChapter] = useState({
        _id: "",
        name:"",
        description: "",
        durationTime:"",
        createdAt:"",
        assignedContent:[],
        dependantChapters:[],
        creator:"",
        isSelected: true,
    });
    const [basicValidators, setBasicValidators] = useState({
        name: false,
        description: false,
        durationTime: false,
    })

    useEffect(()=>{
        setNewChapter(p=>({...p,
         _id: IdGeneratorHelper(24),
         creator: user.id,
         createdAt: new Date(now()).toISOString(),
            name:"",
            description: "",
            durationTime:"",
            assignedContent:[],
            dependantChapters:[],
            isSelected: true,
        }))
    },[addChapterModal])

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
    return(
        <div
            open={addChapterModal}
            onClose={()=>setAddChapterModal(false)}
            maxWidth={'md'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="d-flex align-items-center justify-content-center">
                <Typography variant="h5"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("Create chapter")}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                        <TextField label={t("Chapter name")} style={{ maxWidth:"400px"}} margin="dense"
                                   fullWidth={true}
                                   variant='filled'
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   error={basicValidators.name}
                                   helperText={basicValidators.name && "invalid"}
                                   value={newChapter.name}
                                   onInput={(e) => {
                                       setNewChapter(p=>({...p,name: e.target.value}))
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label={t("Chapter description")} style={{ maxWidth:"400px"}} margin="dense"
                                   fullWidth={true}
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   multiline={true}
                                   rowsMax={3}
                                   error={basicValidators.description}
                                   helperText={basicValidators.description && "invalid"}
                                   value={newChapter.description}
                                   onInput={(e) => {
                                       setNewChapter(p=>({...p,description: e.target.value}))
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label={t("Duration time [hh-mm]")} style={{ maxWidth:"400px"}} margin="dense"
                                   fullWidth={true}
                                   variant="filled"
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
                                       setNewChapter(p=>({...p,durationTime: e.target.value}))
                                   }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="d-flex justify-content-between ml-3 mr-3">
                <EButton eVariant="secondary" eSize="small"
                         onClick={()=>setAddChapterModal(false)}>
                    {t("Back")}
                </EButton>
                <EButton eSize="small" eVariant="primary"
                         onClick={()=>{
                    validateData("SAVE");
                }}>
                    {t("Save")}
                </EButton>
            </DialogActions>
        </div>
    )
}