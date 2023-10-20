import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import GradeIcon from '@material-ui/icons/Grade';
import Avatar from "@material-ui/core/Avatar";
import {now} from "moment";

export default function ChapterContentsList({content, index, ind, addEvent, selectedSubject,chapterId, chapterOrigin, currentGroupId, trainingPathId, originalTrainingModuleId, chapterIdForContent}){

    function createEventFromContent(contentType, content){
        addEvent(new Date(now()), {type:"AddNew"}, true, {contentData:{assignedGroup:currentGroupId,assignedSubject:selectedSubject, assignedChapter:chapterId, originalChapter:chapterOrigin, assignedContentId: content.content._id,
                trainingPathId: trainingPathId, originalTrainingModuleId: originalTrainingModuleId, chapterIdForContent:chapterIdForContent, assignedContentType: content.content.contentType}});
    }

    function previewContent(){
        console.log("Preview content")
    }

    return(
        <ListItem button className="pl-5">
            <ListItemIcon className="pl-4" edge="end">
                <Avatar style={{width: "25px", height: "25px"}}><small>{index+1}.{ind+1}</small></Avatar>
                {/*<GradeIcon />*/}
            </ListItemIcon>
            <ListItemText primary={`${content.content.title ? content.content.title : "-"} - [${content.content.contentType ? content.content.contentType : ""}]`} />
            <IconButton edge="end" aria-label="add event">
                <CalendarTodayIcon onClick={()=>createEventFromContent(content.content.contentType, content)}/>
            </IconButton>
            <IconButton edge="end" aria-label="preview content">
                <VisibilityIcon onClick={()=>previewContent()}/>
            </IconButton>
        </ListItem>
    )
}