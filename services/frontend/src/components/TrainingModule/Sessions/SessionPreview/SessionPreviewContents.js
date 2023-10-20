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

import CertificationSessionService from "../../../../services/certification_session.service"
import {useTranslation} from "react-i18next";

export default function SessionPreviewContents({content, index, ind, allowCreateEvents, chapterOrigin,
                                                          chapterId, originalTrainingModuleId, trainingPathId, selectedSubject, currentGroupId,
                                                          addEvent, isStudent, isHomework, trackers, updateTrackers, certificationSessionId}){
    const { t, i18n, translationsLoaded } = useTranslation();

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
        <ListItem button className="pl-5">
            <ListItemIcon className="pl-4" edge="end">
                <Avatar style={{width: "25px", height: "25px"}}><small>{index+1}.{ind+1}</small></Avatar>
            </ListItemIcon>
            <ListItemText primary={`${content.content.title ? content.content.title : "-"} - [${content.content.contentType ? content.content.contentType : ""}]`} />
            {/*<ListItemText className="text-right mr-5" secondary={content.content._id}/>*/}
            <ListItemText className="text-right mr-5" primary={content.isCurrentContent && (<small className="text-warning">{t("current content")}</small>)}/>
            {content.content.contentType && content.content.contentType === "TEST" && (
                <ListItemText className="text-right mr-5"  primary={(<><small className="text-warning">{`${t("Grade")}:  `}</small> <span>{content.content?.grade ? content.content.grade : "-"}</span></>)} />
            )}

            {allowCreateEvents&&(
                <IconButton edge="end" aria-label="add event" className="mr-2">
                    <CalendarTodayIcon color="primary" onClick={()=>createEventFromContent(content)}/>
                </IconButton>
            )}

            {/* {isStudent &&( */}
                <IconButton edge="end" aria-label="preview content"  onClick={()=>{
                    window.open(`/content/display/${content.content._id}`, '_blank')
                    // updateTrackers(content.content._id, chapterId, certificationSessionId, content.nextContentId)
                }}
                            // disabled={!content.isAvailable}
                >
                    {/*<VisibilityIcon color={content.isAvailable ? "primary" : "disabled"}/>*/}
                    <VisibilityIcon color="primary"/>
                </IconButton>
            {/* )} */}

        </ListItem>
    )
}