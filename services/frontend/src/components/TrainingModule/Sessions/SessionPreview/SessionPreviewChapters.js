import React, {useEffect, useState} from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import Avatar from "@material-ui/core/Avatar";
import SessionPreviewContents from "./SessionPreviewContents";
import EventService from "../../../../services/event.service";
import {useTranslation} from "react-i18next";

export default function SessionPreviewChapters({item, index, trainingPathId, programId, allowCreateEvents, originalTrainingModuleId,
                                                          selectedSubject, currentGroupId, addEvent, isStudent, isHomework,
                                                          limitChapterIndex, trackers, updateTrackers, certificationSessionId, model}){

    const [open, setOpen] = useState(false);
    const [chapterContents, setChapterContents] = useState([]);
    const { t, i18n, translationsLoaded } = useTranslation();

    useEffect(()=>{
        setOpen(false);
        if(item.chapter._id && trainingPathId){
            // EventService.readContentsWithGrade(item.chapter._id, trainingPathId, model.selectedTrainee).then(res=>{ //=> return 404 [11.09.2021]
            //EventService.readContents(item.chapter._id, trainingPathId).then(res=>{
            EventService.readContentsWithGrade(item.chapter._id, trainingPathId, model.selectedTrainee).then(res=>{
                if(res.data){
                    // filter when content is null
                    let newArr = res.data.filter(c=> c.content !== null );
                    //console.log(newArr)



                    // isCurrentContent true/false _MOCKED 08.09.2021 setCurrentContent=true and mocked grade
                    if(item.isCurrentChapter){
                        let foundexIndexx = newArr.findIndex(i=> i.content._id === item.latestContentId);
                        if(foundexIndexx >=0){
                            newArr[foundexIndexx].isCurrentContent = true;
                            if(foundexIndexx < newArr.length){
                                newArr[foundexIndexx].nextContentId = newArr[foundexIndexx+1].content._id;
                            }else{
                                newArr[foundexIndexx].nextContentIndex = -1;
                            }

                        }else{
                            newArr[0].isCurrentContent = true;
                        }
                    }

                    if(newArr){
                        let foundedContentIndex = newArr.findIndex(z=> z.isCurrentContent);
                        newArr.map((o,index22)=> {
                            // done backend
                            // if(o.content.contentType === "TEST"){
                            //     o.grade = o.content.grade
                            // }
                            // limitation index for chapters
                            if(index < limitChapterIndex){
                                o.isAvailable = true;
                            }
                            if(index === limitChapterIndex && index22 <= foundedContentIndex){
                                o.isAvailable = true;
                            }
                            return o;
                        })
                    }

                    setChapterContents(newArr);
                    // if(isStudent){
                    //     let newData = res.data.filter(c=> c.content.contentType !== "TEST" || (c.content.contentType == "TEST" && isHomework == true ) );
                    //     setChapterContents(newData);
                    // }else{
                    //     setChapterContents(res.data);
                    // }

                }
            }).catch(error=>console.log(error))
        }
        if(item.isCurrentChapter){
            setOpen(true);
        }
    },[item]);

    const contentsList = chapterContents ? chapterContents.map((content,ind)=><SessionPreviewContents
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
        trackers={trackers}
        updateTrackers={updateTrackers}
        certificationSessionId={certificationSessionId}
    />) : null;

    return(
        <>
            <ListItem button onClick={()=>setOpen(p=>!p)}>
                <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
                </ListItemIcon>
                <ListItemText primary={item.chapter.name ? item.chapter.name : "-"}/>
                {/*<ListItemText secondary={`chapterId: ${item.chapter._id}`} />*/}
                <ListItemText className="text-right mr-5" primary={item.isCurrentChapter && (<small className="text-warning">{t("current chapter")}</small>)}/>
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