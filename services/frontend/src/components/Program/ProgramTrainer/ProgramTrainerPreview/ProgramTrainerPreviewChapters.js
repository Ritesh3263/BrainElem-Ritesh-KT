import React, {useEffect, useState} from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import Avatar from "@material-ui/core/Avatar";
import ProgramTrainerPreviewContents from "../ProgramTrainerPreview/ProgramTrainerPreviewContents"
import EventService from "../../../../services/event.service";

export default function ProgramTrainerPreviewChapters({item, index, trainingPathId, programId, allowCreateEvents, originalTrainingModuleId,
                                                          selectedSubject, currentGroupId, addEvent, isStudent, isHomework}){

    const [open, setOpen] = React.useState(false);
    const [chapterContents, setChapterContents] = useState([]);

    useEffect(()=>{
        if(item.chapter._id && trainingPathId){
            EventService.readContents(item.chapter._id, trainingPathId, currentGroupId).then(res=>{
                if(res.data){
                    // filter when content is null
                    let newArr = res.data.filter(c=> c.content !== null );
                    //console.log(newArr)
                    setChapterContents(newArr);
                    // if(isStudent){
                    //     let newData = res.data.filter(c=> c.content.contentType !== "TEST" || (c.content.contentType == "TEST" && isHomework == true ) );
                    //     setChapterContents(newData);
                    // }else{
                    //     setChapterContents(res.data);
                    // }

                }
            })
        }
    },[item]);

    const contentsList = chapterContents ? chapterContents
    .filter(c => {
        let shouldHide = true;
        if(c.content?.visibleInGroups.find(groupId => groupId === currentGroupId)) {
            shouldHide = true;
        }
        else if(c.content?.hiddenInGroups.find(groupId => groupId === currentGroupId)) {
            shouldHide = false;
        }
        else {
          shouldHide = !c.content?.hideFromTrainees;
        }
        return shouldHide;
      }).map((content,ind)=><ProgramTrainerPreviewContents
        content={content} ind={ind} index={index}
        allowCreateEvents={allowCreateEvents}
        chapterOrigin={item.chapter.origin}
        chapterId={item.chapter._id}
        originalTrainingModuleId={originalTrainingModuleId}
        trainingPathId={trainingPathId}
        selectedSubject={selectedSubject}
        currentGroupId={currentGroupId}
        addEvent={addEvent}
        isStudent={isStudent}
        isHomework={isHomework}
    />) : null;

    return(
        <>
            <ListItem button onClick={()=>setOpen(p=>!p)}>
                <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px", backgroundColor: "rgba(82, 57, 112, 1)"}}>{index+1}</Avatar>
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