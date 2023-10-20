import React from "react";
import ListItem from "@material-ui/core/ListItem";
import {Link, useNavigate} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from "@material-ui/core/Avatar";
import {BsPencil} from "react-icons/bs";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import {now} from "moment";
import { isWidthUp } from '@material-ui/core/withWidth';
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function ProgramTrainerPreviewContents({content, index, ind, allowCreateEvents, chapterOrigin,
                                                          chapterId, originalTrainingModuleId, trainingPathId, selectedSubject, currentGroupId,
                                                          addEvent, isStudent, isHomework}){

    const {currentScreenSize} = useMainContext();

    function createEventFromContent(content){
        addEvent(new Date(now()), {type:"AddNew"}, true, {contentData:{
            assignedGroup:currentGroupId,
            assignedSubject:selectedSubject,
            trainingPathId: trainingPathId,
            originalTrainingModuleId: originalTrainingModuleId,
            assignedContentId: content.content._id,
            assignedContentType: content.content.contentType,
            assignedChapter:chapterId,
            originalChapter:chapterId,


        }});
    }

    return(
        <ListItem button className={isWidthUp('sm',currentScreenSize) ? "pl-5" : "pl-0"}>
            <ListItemIcon className="pl-4" edge="end">
                <Avatar style={{width: "25px", height: "25px", backgroundColor: "rgba(82, 57, 112, 1)"}}><small>{index+1}.{ind+1}</small></Avatar>
            </ListItemIcon>
            <ListItemText primary={`${content.content.title ? content.content.title : "-"} - [${content.content.contentType ? content.content.contentType : ""}]`} />
            {allowCreateEvents&&(
                <IconButton edge="end" aria-label="add event" className="mr-2">
                    <CalendarTodayIcon color="primary" onClick={()=>createEventFromContent(content)}/>
                </IconButton>
            )}
                { (isStudent && (content.content.contentType === "TEST" && !isHomework) ) ? (
                    <></>
                ): (
                    <Link target="_blank" to={`/content/display/${content.content._id}`}>
                    <IconButton edge="end" aria-label="preview content">
                        <VisibilityIcon color="primary"/>
                    </IconButton>
                    </Link>
                )}

        </ListItem>
    )
}