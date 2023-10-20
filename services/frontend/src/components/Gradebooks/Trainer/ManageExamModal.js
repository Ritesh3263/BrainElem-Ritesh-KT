import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
/** To manage - only for old gradebook **/
const useStyles = makeStyles(theme=>({}))

export default function ManageExamModal({isOpen, setOpen, exams, manageExam}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const examsList = exams.length>0 ? exams.map(e=><FormControlLabel value={e._id} control={<Radio className="mr-2" style={{width: '20px', height: '20px', color: `rgba(82, 57, 112, 1)`}}/>} label={e.name}
                                                                      onChange={()=>manageHandler(e._id)}/>) : <p>{t("List is empty")}</p>
    const [toManage, setToManage] = useState(null);

    useEffect(()=>{
        setToManage(null);
    },[isOpen])

    const manageHandler=(eId)=>{
        setToManage(eId);
    }

    return(
        <Dialog
            open={isOpen}
            onClose={()=>setOpen(false)}
            maxWidth={'sm'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center text-danger" title={t("Manage columns")}>
                <span className="text-primary">{t("Manage columns")}</span>
            </DialogTitle>
            <DialogContent>
                <FormControl component="fieldset">
                    {/*<FormLabel component="legend">{t("Exams")}</FormLabel>*/}
                    <RadioGroup
                        aria-label="exams-list"
                        defaultValue=""
                        name="radio-buttons-group"
                    >
                        {examsList}
                    </RadioGroup>
                </FormControl>

            </DialogContent>
            <DialogActions className="d-flex justify-content-between">
                <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={()=>setOpen(false)}>
                    {t("Back")}
                </Button>
                <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                        onClick={()=>{manageExam(toManage)}}>
                    {t("Manage")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}