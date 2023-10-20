import React, {useEffect, useState} from "react";
import List from '@material-ui/core/List';
import Avatar from "@material-ui/core/Avatar";
import EventService from "../../../../services/event.service";
import ProgramTrainerEditContents from "./ProgramPreviewEditContents";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";

export default function ProgramTrainerEditChapters({item, index, trainingPathId, programId, blockChapterDnd, expanded, handleChange, contentToAdd, removeContentFromChapter}){

    const [chapterContents, setChapterContents] = useState([]);

    function stringGen(yourNumber){
        let text = "";
        const possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < yourNumber; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    useEffect(()=>{
        if(item.chapter._id && trainingPathId){
            EventService.readContents(item.chapter._id, trainingPathId).then(res=>{
                if(res.data){
                    // filter when content is null
                    let newArr = res.data.filter(c=> c.content !== null );
                    setChapterContents(newArr);
                }
            })
        }
    },[item]);

    function removeContent2(contentIndex){
        setChapterContents(p=>{
            let val = Object.assign([],p);
            val.splice(contentIndex,1);
            return val;
        })
    }

    useEffect(()=>{
        if(contentToAdd !== null){
            if(item.chapter._id === contentToAdd.chapter._id){
                if(contentToAdd.content.length >0){
                  contentToAdd.content.map(con=>{
                      if(con.isSelected){
                          delete con.isSelected;
                          let newCont = {
                              _id: stringGen(24),
                              content: con,
                          }
                          setChapterContents(p=>([...p,newCont]))
                      }

                  })
                }
            }
        }
    },[contentToAdd]);



    function handleOnDragEnd(result){
        if(result.destination !== null){
            if(chapterContents.length >1){
                let dropId = new String(result.source.droppableId).slice(17,result.length);
                const items = Array.from(chapterContents);
                const [reorderedItem] = items.splice(result.source.index,1);
                items.splice(result.destination.index, 0, reorderedItem);
                setChapterContents(items);
            }
        }
    }

    // const contentsList = chapterContents ? chapterContents.map((content,ind)=><ProgramTrainerEditContents content={content} ind={ind} index={index} programId={programId}/>) : null;

    return(
        <>
            {/*<ListItem button onClick={()=>handleOpenChapter(open, item.chapter)} style={{backgroundColor:open ? "lightblue" : "lightgray"}} className="my-4">*/}
            {/*    {!blockChapterDnd && (<DragIndicatorIcon className="mr-2"/>)}*/}
            {/*    <ListItemIcon>*/}
            {/*        <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>*/}
            {/*    </ListItemIcon>*/}
            {/*    <ListItemText primary={item.chapter.name ? item.chapter.name : "-"}/>*/}
            {/*    {open ? <ExpandLess /> : <ExpandMore />}*/}
            {/*</ListItem>*/}
            {/*<Collapse in={open} timeout="auto" unmountOnExit>*/}
            {/*    <List component="div" disablePadding>*/}
            {/*        /!*{contentsList}*!/*/}
            {/*        <DragDropContext onDragEnd={handleOnDragEnd} >*/}
            {/*            <Droppable droppableId={`droppableChapter-${index}`}>*/}
            {/*                {(provided)=>(*/}
            {/*                    <div {...provided.droppableProps} ref={provided.innerRef}>*/}
            {/*                        {*/}
            {/*                            chapterContents ? chapterContents.map((content,ind)=>(*/}
            {/*                                <Draggable draggableId={item._id} index={index} key={item._id} isDragDisabled={false}>*/}
            {/*                                    {(provided)=>(*/}
            {/*                                        <div*/}
            {/*                                            {...provided.draggableProps}*/}
            {/*                                            {...provided.dragHandleProps}*/}
            {/*                                            ref={provided.innerRef}*/}
            {/*                                        >*/}
            {/*                                            <ProgramTrainerEditContents content={content} ind={ind} index={index} programId={programId}/>*/}
            {/*                                        </div>*/}
            {/*                                    )}*/}
            {/*                                </Draggable>*/}
            {/*                            )*/}
            {/*                            ): <></>*/}
            {/*                        }*/}
            {/*                        {provided.placeholder}*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            </Droppable>*/}
            {/*        </DragDropContext>*/}
            {/*    </List>*/}
            {/*</Collapse>*/}

            <Accordion expanded={expanded === `panel-${index}`} onChange={handleChange(`panel-${index}`,item)} className="my-4" square={false}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    style={{backgroundColor:expanded === `panel-${index}` ? `rgba(255,255,255,1)` : `rgba(255,255,255,0.65)`}}
                >
                        {!blockChapterDnd && (<DragIndicatorIcon className="mr-2"/>)}
                    <Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar>
                    <Typography className="ml-4">{item.chapter.name ? item.chapter.name : "-"}<small style={{color:"gray"}}>{chapterContents.length?"":" (empty chapter)"}</small></Typography>
                </AccordionSummary>
                <AccordionDetails className="p-0">
                    <List component="div"  className="flex-fill">
                        {/*{contentsList}*/}
                        <DragDropContext onDragEnd={handleOnDragEnd} >
                            <Droppable droppableId={`droppableChapter-${index}`}>
                                {(provided)=>(
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {
                                            chapterContents ? chapterContents.map((content,ind)=>(
                                                    <Draggable draggableId={content.content._id} index={ind} key={content.content._id} isDragDisabled={false} >
                                                        {(provided)=>(
                                                            <div
                                                                className="my-3"
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                ref={provided.innerRef}
                                                            >
                                                                <ProgramTrainerEditContents content={content} ind={ind} index={index} programId={programId}
                                                                                            removeContentFromChapter={removeContentFromChapter} removeContent2={removeContent2}/>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            ): <></>
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </List>
                </AccordionDetails>
            </Accordion>
        </>
    )
}