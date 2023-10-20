import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import ChapterItem from "./ChapterItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import ContentDetails from "./ContentDetails";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import { new_theme } from "NewMuiTheme";
import CreateEvent from "components/Item/Event/Create";
import { Dialog } from '@material-ui/core';
import "../SessionForm.scss";

export default function CourseTable({ currentCourseObject = {}, setCurrentCourseObject, setIsOpenChapterSecondHelper, manageContentHelper, setManageContentHelper, groupId, onClose }) {
    const { t } = useTranslation();
    const {
        isOpenSessionForm,
    } = useSessionContext();
    const [isOpenChapter, setIsOpenChapter] = useState({ isOpen: false, chapterId: undefined });
    const [contentDetailsHelper, setContentDetailsHelper] = useState({ isOpen: false, contentId: undefined });
    const [eventHelper,setEventHelper] = useState({isOpen: false, event: {
        _id: undefined,
        name: '',
        description: '',
        eventType: '',

        assignedGroup: groupId,
        assignedCourse: currentCourseObject._id,
        assignedSession: isOpenSessionForm.sessionId,

        date: undefined,
        endDate: undefined,
        durationTime: 0,
        }});


    useEffect(() => {
        if (isOpenChapter.isOpen) {
            setIsOpenChapterSecondHelper(true);
        } else {
            setIsOpenChapterSecondHelper(false);
        }
    }, [isOpenChapter.isOpen]);

    function handleOnDragEndChapter(result) {
        if (result.destination !== null) {
            const items = Array.from(currentCourseObject?.chapters);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            setCurrentCourseObject(p => ({ ...p, chapters: items }));
        }
    }



    const chaptersList = currentCourseObject?.chosenChapters?.length > 0 ? currentCourseObject?.chosenChapters.map((ch, index) => (
        <Draggable draggableId={ch.chapter._id} index={index} key={ch.chapter._id} isDragDisabled={isOpenChapter.isOpen || (isOpenSessionForm.type === 'PREVIEW')}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <ChapterItem key={index} chapter={ch} index={index} setEventHelper={setEventHelper}
                        isOpenChapter={isOpenChapter} setIsOpenChapter={setIsOpenChapter}
                        setCurrentCourseObject={setCurrentCourseObject}
                        setContentDetailsHelper={setContentDetailsHelper}
                        manageContentHelper={manageContentHelper}
                        setManageContentHelper={setManageContentHelper}
                        contentDetailsHelper={contentDetailsHelper}
                        groupId={groupId}
                    />
                </div>)}
        </Draggable>
    )) : (
        <Paper elevation={10}
            className="d-flex flex-grow-1 align-items-center justify-content-center">
            {t("No data")}
        </Paper>);

    return (
        <>
            <DragDropContext onDragEnd={handleOnDragEndChapter}>
                    <Droppable droppableId={`droppableChapter-1`}>
                        {(provided)=>(
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{backgroundColor: new_theme.palette.newSupplementary.SupCloudy}}>
                                {chaptersList}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {contentDetailsHelper.isOpen && (
                <Grid item xs={contentDetailsHelper.isOpen ? 6 : 0} className="pl-2">
                    <ContentDetails contentDetailsHelper={contentDetailsHelper}
                                    setContentDetailsHelper={setContentDetailsHelper} groupId={groupId}
                    />
                </Grid>
            )}
            <Dialog open={eventHelper.isOpen} className="create_event_dialog" PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }
                }}>
              <CreateEvent 
                data={eventHelper?.event} 
                hidden={["offline", "groups", "trainers", "sessions", "courses", "trainingModules", "chapters", "contents"]}
                trainingModules={[]}// Set empty array - those are only used for school subjects
                onClose={()=>{setEventHelper(p => ({ isOpen: false })); onClose();}}
            />
            </Dialog>

        </>
    )
}