// Options button for single element - used for editing/deleting etc.
// Contents, Courses and Events are supported

import React, { lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Confirm from "components/common/Hooks/Confirm";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

//Services
import LibraryService from 'services/library.service'
import ContentService from 'services/content.service'

// MUIv5
import SvgIcon from "@material-ui/core/SvgIcon";

// Styled components
import OptionsButton from "components/common/OptionsButton";

//Icons
import { ReactComponent as EditIcon } from 'icons/icons_32/Edit_32.svg';
import { ReactComponent as DeleteIcon } from 'icons/icons_32/Delete_32.svg';
import { ReactComponent as CopyIcon } from 'icons/icons_32/Copy_32.svg';
import { ReactComponent as CalendarIcon } from 'icons/icons_32/Calendar_32.svg';
import { ReactComponent as ResultsIcon } from 'icons/icons_32/Menu statiscts_32.svg';


const  EDialog = lazy(() => import("styled_components/Dialog"));
const  CreateEvent = lazy(() => import("components/Item/Event/Create"));

// Options button for single element - used for editing/deleting etc.
//
// `element` - element for which button is created
// `deleteElementCallback` - function to run after deleting element in the list - can be used to reload list or update the state
// `editElementCallback` - function to run after editing element in the list - can be used to reload list or update the state
// `additionalActions` - addtional options displayed under the default options/actions
const ListItemOptionsButton = ({ element, deleteElementCallback=null, editElementCallback=null, additionalActions = [], isInProgram=false, ...props }) => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_getErrorMessage, F_handleSetShowLoader, F_getHelper } = useMainContext();
    const { user, userPermissions } = F_getHelper()

    // Modal window with event
    const [eventForDialog, setEventForDialog] = useState(false)
    const [openEventDialog, setOpenEventDialog] = useState(false)

    // Properties passed in program preview
    const params = new URLSearchParams(window.location.search)
    const tmId = params.get('tmId');
    const chId = params.get('chId');
    const groupId = params.get('groupId');

    // Action for deleting element
    async function deleteElelemnt(element) {
        if (!await isConfirmed(t("Are you sure you want to delete this element with all the associated data?"))) return;
        if (!element.contentType) {
            F_showToastMessage(t("Not implemented"))
            return
        }
        let content = element
        F_handleSetShowLoader(true)
        ContentService.remove(content._id).then(
            (response) => {
                if (deleteElementCallback) deleteElementCallback(content._id)
                F_handleSetShowLoader(false)
                F_showToastMessage(t("Element was deleted sucessfully."), 'success')
            },
            (error) => {
                console.error(error)
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
                F_handleSetShowLoader(false)
            }
        )
    }

    // Get actions for element managment
    // edit/delete/copy link etc.
    function getActions() {
        if (element.contentType) return getActionsForContent(element)
        else if (element.eventType) return getActionsForEvent(element)
        else return []//Course
    }

    // Get actions for content managment
    // edit/delete/copy link etc.
    function getActionsForEvent(event) {
        let actions = []

        // ONLY FOR EVENTS

            actions.push({
                id: 10, name: t("Copy link"), icon: <SvgIcon viewBox="0 0 32 32" component={CopyIcon} />, action: (e) => {
                    var link = `${window.location.protocol}//${window.location.host}/event/${event._id}/content/display`
                    if (!navigator.clipboard) {
                        F_showToastMessage(t("You must use HTTPS connection to copy the link"))
                        console.log(link)
                    } else {
                        navigator.clipboard.writeText(link)
                        F_showToastMessage(t("Link was copied to clipboard"))
                    }
                }
            })

        

        if (event.canExamine) {
            actions.push({ id: 4, name: t("Reschedule"), icon: <SvgIcon viewBox="0 0 32 32" component={CalendarIcon} />, action: () => {
                setEventForDialog(event)
                setOpenEventDialog(true)
            } })
        }
        // Can examinate/supervise
        if (event.canExamine) {
            actions.push({
                id: 3, name: t("Students’ results"),  icon: <SvgIcon viewBox="0 0 32 32" component={ResultsIcon} />, action: () => {
                    if (event && event.canExamine) navigate(`/examinate/${event._id}`)
                }
            })
        }
        return [...actions, ...additionalActions]
    }


    // Get actions for content managment
    // edit/delete/copy link etc.
    function getActionsForContent(content) {
        let actions = [
            {
                id: 0, name: t("Copy link"), icon: <SvgIcon viewBox="0 0 32 32" component={CopyIcon} />, action: (e) => {
                    var link = `${window.location.protocol}//${window.location.host}/content/display/${content._id}`
                    if (!navigator.clipboard) {
                        F_showToastMessage(t("You must use HTTPS connection to copy the link"))
                        console.log(link)
                    } else {
                        navigator.clipboard.writeText(link)
                        F_showToastMessage(t("Link was copied to clipboard"))
                    }
                }
            },
        ]
        if (content.canEdit) {
            actions.push({ id: 1, name: t("Edit"), icon: <SvgIcon viewBox="0 0 32 32" component={EditIcon} />, action: (e) => { navigate(`/edit-` + content.contentType.toLowerCase() + "/" + content._id) } })
            
            // Only when outside of a program!
            // Deleting should be done only in the program edit mode
            // Deleting this content directly will casuse error while loading program
            if (!isInProgram) actions.push({
                id: 2, name: t("Delete"), icon: <SvgIcon viewBox="0 0 32 32" component={DeleteIcon} />,
                action: (e) => {deleteElelemnt(content)}
            })
            else {// Remove content from program
                actions.push({id: 2,disabled: true, name: t("Remove"),
                    icon: <SvgIcon viewBox="0 0 32 32" component={DeleteIcon} />, 
                    // action: {()=>{}}
            })

            }
        }// If the user is creator and can't edit it means that content has been already approved
        else if (!content.canEdit && ContentService.isOwnerOrCocreator(user.id, content)) {
            // Redirect to source when editing
            actions.push({
                id: 3, name: t("Edit"), icon: <SvgIcon viewBox="0 0 32 32" component={EditIcon} />, action: (e) => {
                    navigate(`/edit-` + content.contentType.toLowerCase() + "/" + content._id)
                }
            })
            // This `delete` should send a request to librarian for accepting archiving of this `content`
            if (content.sendToLibrary && !content.archiveContentFromLibraryRequested) {
                actions.push({
                    id: 4, name: t("Archive"), icon: <SvgIcon viewBox="0 0 32 32" component={DeleteIcon} />, action: (e) => {
                        F_handleSetShowLoader(true)
                        LibraryService.requestArchiveOfContentFromLibrary(content._id).then(res => {
                            if (editElementCallback) editElementCallback(content._id, 'archiveContentFromLibraryRequested', true)
                            F_showToastMessage(t("Archiving content from Library was requested."), 'success')
                            F_handleSetShowLoader(false)
                        }, (err) => {
                            console.error(err)
                            F_showToastMessage(t("Could not request archiving of the conentent from Library."), 'error')
                            F_handleSetShowLoader(false)
                        })
                    }
                })
            } else if (content.sendToLibrary) {
                actions.push({
                    id: 5, name: t("Revoke archiving of content"), icon: <SvgIcon viewBox="0 0 32 32" component={DeleteIcon} />, action: (e) => {
                        F_handleSetShowLoader(true)
                        LibraryService.revokeArchiveOfContentFromLibrary(content._id).then(res => {
                            if (editElementCallback) editElementCallback(content._id, 'archiveContentFromLibraryRequested', false)
                            F_showToastMessage(t("Archiving content from Library was revoked."), 'success')
                            F_handleSetShowLoader(false)
                        }, (err) => {
                            console.error(err)
                            F_showToastMessage(t("Could not revoke archiving of the conentent from Library.", 'error'))
                            F_handleSetShowLoader(false)
                        })
                    }
                })
            }
        }

        // Can examinate/supervise
        if (content.canExamine) {
            actions.push({
                id: 6, name: t("Students’ results"),  icon: <SvgIcon viewBox="0 0 32 32" component={ResultsIcon} />, action: () => {
                    if (groupId) navigate(`/examinate/content/${content._id}/group/${groupId}`)
                    else navigate(`/examinate/content/${content._id}/all`)
                }
            })
        }

        if (groupId && tmId && chId && content.canExamine) {
            actions.push({ id: 7, name: t("Schedule"), icon: <SvgIcon viewBox="0 0 32 32" component={CalendarIcon} />, action: () => {
                setEventForDialog({
                    assignedGroup: groupId,
                    assignedTrainer:  user.id,
                    assignedSubject: tmId,
                    assignedChapter: chId,
                    assignedContent: content._id,
                    eventType: content?.contentType=="PRESENTATION" ? "Online Class" : "Exam"
                
                })
                setOpenEventDialog(true)
            } })
        }

        return [...actions, ...additionalActions]
    }


    if (!element) return <></>
    return (<>
            <OptionsButton {...props} iconbutton={+true} btns={getActions()} />
            {openEventDialog && <EDialog open={openEventDialog} onClose={() => { setOpenEventDialog(false);  }}>
                <CreateEvent 
                    data={eventForDialog}
                    hidden={["offline", "groups","trainers","trainingModules","chapters", "contents"]}
                    onClose={()=>setOpenEventDialog(false)}
                    onSuccess={()=>{
                        editElementCallback(element._id)
                    }}
                ></CreateEvent>
            </EDialog>}
    </>

    )
}

export default ListItemOptionsButton;