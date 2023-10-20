import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Col, ListGroup} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import SearchField from "../../../../common/Search/SearchField";
import TableSearch from "../../../../common/Table/TableSearch";
import {Paper} from "@material-ui/core";

const useStyles = makeStyles(theme=>({}))

export default function MSCAddingChapterModal({isOpen, setOpen, subjectChapters, pushChapterToSubject}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const [searchingText, setSearchingText] = useState('');
    const [chapters, setChapters] = useState([]);

    useEffect(()=>{
        setChapters(subjectChapters);
    },[subjectChapters, isOpen])

    const chaptersList = chapters.map((chapter, index) =>(
        <ListGroup.Item className="pl-2 pr-2 d-flex justify-content-between align-items-center" style={chapter.isSelected ? {backgroundColor: "lightblue"} : null}>
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
            <Col xs={3}>{chapter.name}</Col>
            <Col xs={2}>{chapter.durationTime ? chapter.durationTime : 0}</Col>
            <Col xs={2}>{chapter.assignedContent ? chapter.assignedContent.length : "-"}</Col>
            <Col xs={1} className="d-flex justify-content-end p-0">
                <Checkbox
                    checked={chapter.isSelected}
                    onChange={()=>{
                        setChapters(p=>{
                            let val = Object.assign([],p);
                            val[index].isSelected = !val[index].isSelected;
                            return val;
                        })
                    }}
                />
            </Col>
        </ListGroup.Item>
    ));


    return(
        <Dialog
            open={isOpen}
            onClose={()=>{
                setOpen(false)
                setSearchingText('')
            }}
            maxWidth={'md'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center"><h4 className="text-primary">{t("Choose chapters")}</h4></DialogTitle>
            <Paper elevation={12} className="d-flex justify-content-end">
                <SearchField
                    className="text-primary"
                    value={searchingText}
                    onChange={(e)=>{TableSearch(e.target.value, subjectChapters, setSearchingText, setChapters)}}
                    clearSearch={()=>TableSearch('', subjectChapters, setSearchingText, setChapters)}
                />
            </Paper>
            <DialogContent>
                <ListGroup>
                    <div className="pl-2 pr-2 pb-3 d-flex justify-content-between align-items-center">
                        <Col xs={1} className="text-muted">No.</Col>
                        <Col xs={3} className="text-muted">{t("Chapter name")}</Col>
                        <Col xs={2} className="text-muted">{t("Duration time [hh-mm]")}</Col>
                        <Col xs={2} className="text-muted">{t("Assigned content")}</Col>
                        <Col xs={1} className="text-muted text-right pr-1">
                            <ArrowDropDownIcon/>
                        </Col>
                    </div>
                    {chaptersList.length>0 ? chaptersList : t("Not Found")}
                </ListGroup>
            </DialogContent>
            <DialogActions className="d-flex justify-content-between ml-3 mr-3">
                <Button variant="contained" size="small" color="secondary" onClick={()=>setOpen(false)}>
                    {t("Back")}
                </Button>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                        onClick={()=>{
                            pushChapterToSubject(chapters).then(()=>{
                                setChapters(p=>{
                                    let val = Object.assign([],p);
                                    val.map(ch=> ch.isSelected = false);
                                    return val;
                                })
                                setOpen(false);
                            });
                        }}
                >
                    {t("Save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}