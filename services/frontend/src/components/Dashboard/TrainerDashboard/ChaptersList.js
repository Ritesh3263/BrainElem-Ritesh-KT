import React, {useEffect, useState} from "react";

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import StarBorder from '@material-ui/icons/StarBorder';
import Avatar from "@material-ui/core/Avatar";
import ChapterContentsList from "./ChapterContentsList";
import EventService from "../../../services/event.service";

export default function ChaptersList({item, index, trainingPathId, addEvent, selectedSubject, currentGroupId, originalTrainingModuleId}){

    const [open, setOpen] = React.useState(false);
    const [chapterContents, setChapterContents] = useState([]);

    useEffect(()=>{
        if(item.chapter._id && trainingPathId){
            EventService.readContents(item.chapter._id, trainingPathId).then(res=>{
                if(res.data){
                    setChapterContents(res.data);
                }
            })
        }
    },[item]);

    const contentsList =chapterContents ? chapterContents.map((content,ind)=><ChapterContentsList content={content} ind={ind} index={index} addEvent={addEvent} selectedSubject={selectedSubject} chapterOrigin={item.chapter.origin} chapterId={item.chapter._id} chapterIdForContent={item.chapter._id} currentGroupId={currentGroupId} trainingPathId={trainingPathId} originalTrainingModuleId={originalTrainingModuleId}/>) : null;

    return(
    <>
        <ListItem button onClick={()=>setOpen(p=>!p)}>
            <ListItemIcon>
                <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
            </ListItemIcon>
            <ListItemText primary={item.chapter.name ? item.chapter.name : "-"}/>
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {contentsList}
            </List>
        </Collapse>
    </>
    )
}