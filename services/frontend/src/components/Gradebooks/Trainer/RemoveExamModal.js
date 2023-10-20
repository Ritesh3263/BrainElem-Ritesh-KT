import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Col, ListGroup} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import Confirm from "components/common/Hooks/Confirm";
/** To remove - only for old gradebook **/
const useStyles = makeStyles(theme=>({}))

export default function RemoveExamModal({isOpen, setOpen, exams, removeExam}){
    const { t } = useTranslation();
    const {isConfirmed} = Confirm();
    const classes = useStyles();
    const examsList = exams.length>0 ? exams.map(e=><FormControlLabel value={e._id}
                                       control={<Radio className="mr-2" style={{width: '20px', height: '20px', color: `rgba(82, 57, 112, 1)`}}/>}
                                       label={e.name} onChange={()=>removeHandler(e._id)}/>)
        : <p>{t("List is empty")}</p>
    const [toRemove, setToRemove] = useState(null);

    useEffect(()=>{
        setToRemove(null);
    },[isOpen])

    const removeHandler=(eId)=>{
        setToRemove(eId);
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
            <DialogTitle id="alert-dialog-title" className="text-center text-danger" title={t("Delete columns")}>
                <span className="text-primary">{t("Delete columns")}</span>
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
                <Button variant="contained" size="small" color="secondary" onClick={()=>setOpen(false)}>
                    {t("Back")}
                </Button>
                <Button variant="contained" size="small" color="inherit"
                        onClick={async ()=>{
                            let confirm = await isConfirmed(t("Are you sure you want to delete this column?"));
                            if(confirm) removeExam(toRemove)
                        }}>
                    {t("Remove")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}