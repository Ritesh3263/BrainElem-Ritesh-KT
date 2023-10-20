import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Card, Col, ListGroup} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from "@material-ui/core/Icon";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { new_theme } from "NewMuiTheme";
import { TextField, ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
const useStyles = makeStyles(theme=>({}))

export default function ModalContent(props){
    const{
        isOpen,
        setOpen,
        MSAllChapters,
        setMSAllChapters,
        pushChapters,
        isFromAI
    }=props;
    const { t } = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const classes = useStyles();

    useEffect(()=>{
        setFilteredData(MSAllChapters)
        console.log(MSAllChapters);
    },[MSAllChapters])

    const contentList = filteredData.map((chapter, index) =>(
        <ListGroup.Item className="pl-2 pr-2 d-flex justify-content-between align-items-center tbl_choose_tr" style={{backgroundColor: chapter.isSelected && new_theme.palette.newSupplementary.SupCloudy, minWidth:"850px"}}>
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", background:'transparent'}} ><small>{index+1}</small></Avatar></Col>
            <Col xs={4} >{chapter.name ? chapter.name : "-"}</Col>
            <Col xs={4} >{chapter.description ? chapter.description : "-"}</Col>
            <Col xs={2} >{chapter.durationTime ? chapter.durationTime+" (minutes)" : "-"}</Col>
            {/* <Col xs={3}>{chapter.contentType ? chapter.contentType : "-"}</Col>
            <Col xs={2}>{chapter.level ? chapter.level : "-"}</Col> */}
            {/*<Col xs={2}>{chapter.creator}</Col>*/}
            <Col xs={1} style={{minWidth:'50px'}}>
                <Checkbox
                className="subject_checkboxes"
                    edge="end"
                    checked={chapter.isSelected}
                    onChange={()=>{
                        setMSAllChapters(p=>{
                            let val = Object.assign([],p);
                            val[index].isSelected = !val[index].isSelected;
                            return val;
                        })
                    }}
                />
            </Col>
            {/*<Col xs={1} className="d-flex justify-content-end p-0 pr-2">*/}
            {/*    <IconButton size="small" className="text-danger" style={{display:"none"}}>*/}
            {/*        <ClearIcon onClick={()=>{*/}
            {/*            setMSAllChapters(p=>{*/}
            {/*                let val = Object.assign([],p);*/}
            {/*                val.splice(index,1);*/}
            {/*                return val;*/}
            {/*            })*/}
            {/*        }}/>*/}
            {/*    </IconButton>*/}
            {/*</Col>*/}
        </ListGroup.Item>
    ));

    return(
        <ThemeProvider theme={new_theme}>
        <div
            className="choose-tbl-subjectForm"
            style={{position:'relative'}}
            open={isOpen}
            onClose={()=>{
                setOpen(false)
                setSearchingText('')
            }}
            maxWidth={'lg'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {/* <DialogTitle id="alert-dialog-title" className="text-center">
                <Typography variant="h5"
                            component="h6" className="text-center"
                            >
                    {t("Choose chapters")}
                </Typography>
            </DialogTitle> */}
            <Paper elevation={12} className="d-flex justify-content-start choose-tbl-subjectForm-head" style={{backgroundColor:new_theme.palette.newSupplementary.SupCloudy}}>
                <TextField
                    variant="outlined"
                    className="text-primary search_table"
                    value={searchingText}
                    placeholder={t("Search Value")} 
                    onChange={(e)=>{TableSearch(e.target.value, MSAllChapters, setSearchingText, setFilteredData)}}
                    clearSearch={()=>TableSearch('', MSAllChapters, setSearchingText, setFilteredData)}
                />
            </Paper>
                <DialogContent className="choose_tbl_hight">
                {isFromAI &&(
                    <DialogContentText className="text-success text-center">
                        <Icon style={{textAlign:"center", height: "100%", width: "100%"}}>
                            {/*<img src="/img/ai_assistant/assistant.svg" style={{height:"40px"}}/>*/}
                            <img src="/img/welcome_screen/robot.png" style={{height:"70px"}} className="mr-2"/>
                        </Icon>
                        {t("This is the result, what i found")}
                    </DialogContentText>
                )}

                <ListGroup>
                    <div className="pl-2 pr-2 pb-3 pt-3 d-flex justify-content-between align-items-center table_choose_header">
                        <Col xs={1} className="text-left" >No.</Col>
                        <Col xs={4} style={{color: new_theme.palette.secondary.DarkPurple}} className="text-left" >{t("Chapter name")}</Col>
                        <Col xs={4} style={{color: new_theme.palette.secondary.DarkPurple}}>{t("Chapter description")}</Col>
                        <Col xs={2} style={{color: new_theme.palette.secondary.DarkPurple}}>{t("Duration time [hh-mm]")}</Col>
                        {/* <Col xs={3} className="text-muted">Type of content</Col> */}
                        {/* <Col xs={2} className="text-muted">Level</Col> */}
                        {/*<Col xs={2} className="text-muted">Creator</Col>*/}
                        <Col xs={1} style={{olor: new_theme.palette.secondary.DarkPurple}}>{t("Select")}</Col>
                        {/*<Col xs={1} className="text-muted text-right">*/}
                        {/*    <ArrowDropDownIcon/>*/}
                        {/*</Col>*/}
                    </div>
                    {contentList.length>0 ? contentList : t("Not Found")}
                </ListGroup>
            </DialogContent>
            <DialogActions className="d-flex align-item-right ml-3 mr-3 table_choose_btns" style={{paddingTop:'20px'}}>
                {/* <Button variant="contained" size="small" color="secondary" onClick={()=>setOpen(false)}>
                    {t("Back")}
                </Button> */}
                {/* <Button size="small" variant="contained" color="primary" onClick={()=>{
                    pushChapters(MSAllChapters).then(()=>setOpen(false));
                }}>
                    {t("Save")}
                </Button> */}
                <StyledButton eVariant="primary" eSize="large" onClick={()=>{
                    pushChapters(MSAllChapters);}}>
                    {t("Add")}
                </StyledButton>
            </DialogActions>
        </div>
        </ThemeProvider>
    )
}