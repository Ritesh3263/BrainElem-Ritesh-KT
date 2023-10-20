import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import ChapterService from "../../../../services/chapter.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import IdGeneratorHelper from "../../../common/IdGeneratorHelper";
import {Paper} from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import SubjectIcon from "@material-ui/icons/Subject";
import {useNavigate} from "react-router-dom";
import {ETab, ETabBar} from "../../../../styled_components";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))


export default function ProgramAddingChapterModal({isOpen, setOpen, selectedSubject, addNewChapterToSubject, selectedChapters}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const navigate = useNavigate();
    const classes = useStyles();
    const {F_hasPermissionTo} = useMainContext();
    // const [subject, setSubject] = useState({});
    const [chapterToAssign, setChapterToAssign] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [newChapter, setNewChapter] = useState({});

    useEffect(()=>{
        setActiveTab(0);
        // setSubject(selectedSubject);
    },[selectedSubject]);

    useEffect(()=>{
        if(isOpen){
            setNewChapter({
                _id: IdGeneratorHelper(24),
                name:"",
                description: "",
                durationTime:"",
                assignedContent:[],
                dependantChapters:[],
                isSelected: true,
            })
            getChapter();
            // setTimeout(()=>{
            // },50)
        }
    },[isOpen])

    function getChapter(){
        ChapterService.getChapters(selectedSubject).then(res=>{
            if(res.data.length >0){
                let newData =[];
                newData = res.data.map(ch=> ({...ch,isSelected: !!selectedChapters.map(x=>(x.chapter.origin||x.chapter._id)).find(x=>x===ch._id)}))
                let additionalChapters = selectedChapters.filter(x=>!newData.find(y=>y._id===(x.chapter.origin||x.chapter._id))).map(x=>{
                    x.chapter.isSelected = true
                    return x.chapter
                })
                setChapterToAssign([...newData, ...additionalChapters]);
            }
        }).catch(error=>console.log("error", error))
    }

    const createNewChapter =()=>{
        const request=()=>{
            return new Promise(resolve=>{
                setTimeout(()=>{
                    //res
                    resolve({data: "OK"})
                },400)
            })
        }
        request().then(res=> {
            console.log(">>>>", newChapter)
            navigate("/program-edit")
        })
        // Create
    }


    const chapterToAssignList = chapterToAssign.length >0 ? chapterToAssign.map((chapter, index) =>(
        <ListGroup.Item className="pl-2 pr-2 d-flex justify-content-between align-items-center">
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
            <Col xs={3}>{chapter.name ?? "-"}</Col>
            <Col xs={6}>{chapter.description?? "-"}</Col>
            <Col xs={1}>{chapter.durationTime??"-"}</Col>
            <Col xs={1} className="d-flex justify-content-end">
                <Checkbox
                    edge="end"
                    checked={chapter.isSelected}
                    onChange={()=>{
                        setChapterToAssign(p=>{
                            let val = Object.assign([],p);
                            val[index].isSelected = !val[index].isSelected;
                            return val;
                        })
                    }}
                />
            </Col>
        </ListGroup.Item>
    )): <p className="text-center">{t("This subject has no chapter to assign in library yet")}</p>

    return(
        <Dialog
            open={isOpen}
            onClose={()=>{
                setOpen(false);
                setChapterToAssign([]);
            }}
            maxWidth={'lg'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center">
                {activeTab === 0 ? (
                    <>
                    <p><span className="text-success">{t("Add chapters")}</span></p>
                    {/*<p className="text-primary">Add chapter to:  {subject ? (<strong>{subject.name}</strong>) : "-"} (subject)</p>*/}
                    </>
                ):(
                    <>
                    <p className="text-primary">{t("Create new chapter")}</p>
                    </>
                )}
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Paper elevation={12} className="p-2 text-center d-flex justify-content-center">
                        <ETabBar  className="mt-3"
                            value={activeTab}
                            onChange={(e,i)=>setActiveTab(i)}
                            eSize='small'
                        >
                            <ETab label='Add chapter' eSize='small'/>
                            {/* {F_hasPermissionTo('create-chapters') && <ETab  label='Create new chapter' eSize='small'/>} */}
                            {F_hasPermissionTo('create-subject-and-chapters') && <ETab  label='Create new chapter' eSize='small'/>}
                        </ETabBar>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
            {(activeTab === 0) ? (
                <Row className="d-flex flex-row mb-5 mt-0">
                <Col xs={12} className="pt-1 pb-1">
                <DialogContentText id="alert-dialog-description" className="text-center pt-2">
                </DialogContentText>
                <ListGroup>
                <div className="pl-2 pr-2 pb-3 d-flex justify-content-between align-items-center">
                <Col xs={1} className="text-muted">No.</Col>
                <Col xs={3} className="text-muted">{t("Chapter name")}</Col>
            {/* <Col xs={2} className="text-muted">{t("Approved by Librarian")}</Col> */}
                <Col xs={6} className="text-muted">{t("Description")}</Col>
            {/* <Col xs={2} className="text-muted">{t("Duration time [hh-mm]")}</Col> */}
            {/* <Col xs={2} className="text-muted">Co creator</Col> */}
                <Col xs={1} className="text-muted">{t("Duration (minutes)")}</Col>
                <Col xs={1} className="text-muted text-right pr-3">
                <ArrowDropDownIcon/>
                </Col>
                </div>
            {chapterToAssignList ? chapterToAssignList : null}
                </ListGroup>
                </Col>
                </Row>
                ) :(
                <Row className="mb-5">
                    <Col xs={4} className="d-flex flex-column">
                        <TextField label={t("Chapter name")} style={{ width:"100%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={newChapter.name}
                                   onInput={(e) => {
                                       setNewChapter(p=>({...p,name: e.target.value}))
                                   }}
                        />
                    </Col>
                    <Col xs={4} className="d-flex flex-column">
                        <TextField label={t("Chapter description")} style={{ width:"100%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   multiline={true}
                                   rowsMax={3}
                                   value={newChapter.description}
                                   onInput={(e) => {
                                       setNewChapter(p=>({...p,description: e.target.value}))
                                   }}
                        />
                    </Col>
                    <Col xs={4} className="d-flex flex-column">
                        <TextField label={t("Duration time [hh-mm]")} style={{ width:"100%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   type="number"
                                   inputProps={{
                                       min: "0",
                                       max: "9999999",
                                       step: "1"
                                   }}
                                   onInput={(e) => {
                                       setNewChapter(p=>({...p,durationTime: e.target.value}))
                                   }}
                        />
                    </Col>
                </Row>
                )}
            </DialogContent>

                <DialogActions className="d-flex justify-content-between ml-3 mr-3">
                <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary"  onClick={()=>{
                    setOpen(false);
                    setChapterToAssign([]);
                }}>
                    {t("Back")}
                </Button>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                        // disabled={chapterToAssign.length <1}
                        onClick={()=>{
                            if(activeTab ===0){
                                // setChapterToAssign([]);
                                addNewChapterToSubject(selectedSubject, chapterToAssign)
                                setOpen(false);
                            }else{
                                setChapterToAssign(p=>{
                                    let val = Object.assign([],p);
                                    val.push(newChapter)
                                    return val;
                                })
                                // setChapterToAssign([]);
                                setActiveTab(0)
                                // setOpen(false);
                            }
                        }}
                >
                    {activeTab === 0? t("Save"): t("Create")}
                    {/* show warning of truly deletion (inclusive of it contents) when unchecked a chapter  */}
                </Button>
            </DialogActions>
        </Dialog>
    )
}