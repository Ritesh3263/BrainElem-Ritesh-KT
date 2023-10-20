import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Col, ListGroup, Row} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ChapterService from "services/chapter.service"
import LibraryService from "services/library.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";

const useStyles = makeStyles(theme=>({}))


export default function ProgramAddingContentModal({isOpen, setOpen, selectedChapter, addNewContentToChapter, contentFrom}){
    const { t } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const classes = useStyles();
    const [chapter, setChapter] = useState({});
    const [contentToAssign, setContentToAssign] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(()=>{
        setChapter(selectedChapter);
    },[selectedChapter]);

    useEffect(()=>{
        if(isOpen){
            setTimeout(()=>{
                getContent();
            },200)
        }
    },[isOpen]);

    useEffect(()=>{
        setFilteredData(contentToAssign);
    },[contentToAssign]);



    function getContent(){
       if(contentFrom === "LIBRARYCHAPTER"){
           ChapterService.getContents(selectedChapter.origin || selectedChapter._id).then(res=>{
               if(res.data.length >0){
                   let newData =[];
                   newData = res.data.map(cont=> ({...cont,isSelected: false}))
                   setContentToAssign(newData);
               }
           }).catch(error=>console.log("error", error))
        }else if(contentFrom === "LIBRARY"){
            LibraryService.getAllPublicContents().then(res=>{
                if(res.data.length >0){
                    let newData =[];
                    newData = res.data.map(cont=> ({...cont,isSelected: false}))
                    setContentToAssign(newData);
                }
            })
        }else if(contentFrom === "PRIVATE"){
           LibraryService.getUserPrivateContent().then(res=>{
               if(res.data.allContents.length >0){
                   let newData =[];
                   newData = res.data.allContents.map(cont=> ({...cont,isSelected: false}))
                   setContentToAssign(newData);
               }
           })
       }else{
           // nothing
       }

    }
    const contentToAssignList = filteredData.length >0 ? filteredData.map((content, index) =>(
        <ListGroup.Item className="pl-2 pr-2 d-flex justify-content-between align-items-center">
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}><small>{index+1}</small></Avatar></Col>
            <Col xs={3}>{content.title ? content.title : "-"}</Col>
            <Col xs={2}><small>{content.approvedByLibrarian ? t("Yes") : "-"}</small></Col>
            <Col xs={2}><small>{content.title ? content.contentType : "-"}</small></Col>
            <Col xs={2}>{content.durationTime ? (`0${(content.durationTime/60) / 60 ^ 0}`.slice(-2) + ':' + ('0' + (content.durationTime/60) % 60).slice(-2)) : "-"}</Col>
            <Col xs={1}>
                    <IconButton size="small" className="text-primary text-center">
                        <a href={`/content/preview/${content._id}`} target="_blank"><VisibilityIcon/></a>
                    </IconButton>
            </Col>
            <Col xs={1} className="d-flex justify-content-end">
                {/*<IconButton size="small" className="text-success">*/}
                {/*    <ControlPointIcon onClick={()=>{*/}
                {/*        setChapter(p=>{*/}
                {/*            let val = Object.assign({},p);*/}
                {/*            val.chosenContents.push({content:content, contentPosition:0});*/}
                {/*            return val;*/}
                {/*        })*/}
                {/*    }}/>*/}
                {/*</IconButton>*/}
                <Checkbox
                    edge="end"
                    checked={content.isSelected}
                    onChange={()=>{
                        setContentToAssign(p=>{
                            let val = Object.assign([],p);
                            let findIndex = val.findIndex(i=> i._id === content._id);
                            if(findIndex !== -1){
                                val[findIndex].isSelected = !val[findIndex].isSelected;
                                setSearchText('');
                            }
                            return val;
                        })
                    }}
                />
            </Col>
        </ListGroup.Item>
    )): <p className="text-center">This chapter has no content to assign in library yet</p>

    return(
        <Dialog
            open={isOpen}
            onClose={()=>{
                setOpen(false);
                setContentToAssign([]);
            }}
            maxWidth={'lg'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center">
                <p>Assign from <span className="text-success">{contentFrom === "LIBRARY" ? t("Content from public library") : t("Content from private library")}</span></p>
                <p className='mb-0'>Add content to:  {chapter ? (<strong>{chapter.name}</strong>) : "-"} (chapter)</p>
                <div className='text-right' style={{float: 'right', maxWidth:'350px'}}>
                        <SearchField value={searchText}
                                     clearSearch={()=>{TableSearch('',contentToAssign,setSearchText,setFilteredData)}}
                                     onChange={({target:{value}})=>{TableSearch(value,contentToAssign,setSearchText,setFilteredData)}}  />
                </div>
            </DialogTitle>
            <DialogContent    style={{height:'600px', minWidth:'800px'}}>
                <Row className="d-flex flex-row mb-5 mt-0">
                    <Col xs={12} className="pt-1 pb-1">
                        <DialogContentText id="alert-dialog-description" className="text-center pt-2">
                        </DialogContentText>
                        <ListGroup>
                            <div className="pl-2 pr-2 pb-3 d-flex justify-content-between align-items-center">
                                <Col xs={1} className="text-muted">No.</Col>
                                <Col xs={3} className="text-muted">{t("Content name")}</Col>
                                <Col xs={2} className="text-muted">{t("Approved by Librarian")}</Col>
                                <Col xs={2} className="text-muted">{t("Content Type")}</Col>
                                <Col xs={2} className="text-muted">{t("Duration time [hh-mm]")}</Col>
                                {/* <Col xs={2} className="text-muted">Co creator</Col> */}
                                <Col xs={1} className="text-muted">{t("Preview")}</Col>
                                <Col xs={1} className="text-muted text-right pr-3">
                                    <ArrowDropDownIcon/>
                                </Col>
                            </div>
                            {contentToAssignList ? contentToAssignList : null}
                        </ListGroup>
                    </Col>
                </Row>
            </DialogContent>
            <DialogActions className="d-flex justify-content-between ml-3 mr-3">
                <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary"  onClick={()=>{
                    setOpen(false);
                    setContentToAssign([]);
                }}>
                    {t("Back")}
                </Button>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                        disabled={contentToAssign.length <1}
                        onClick={()=>{
                            setContentToAssign([]);
                            setOpen(false);
                            addNewContentToChapter(selectedChapter, contentToAssign)
                        }}
                >
                    {t("Save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}