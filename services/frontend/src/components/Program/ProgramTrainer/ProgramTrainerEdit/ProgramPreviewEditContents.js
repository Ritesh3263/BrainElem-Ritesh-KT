import React,{useState, useEffect} from "react";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import Avatar from "@material-ui/core/Avatar";
import {BsPencil} from "react-icons/bs";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import ClearIcon from "@material-ui/icons/Clear";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Tooltip from '@material-ui/core/Tooltip';


export default function ProgramTrainerEditContents({ content, index, ind, programId, removeContentFromChapter, removeContent2}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    useEffect(()=>{
        if(actionModal.returnedValue){
            removeContent();
        }
    },[actionModal.returnedValue]);

    function removeContent(){
        removeContentFromChapter(index,ind);
        removeContent2(ind);
    }

    return(
        <>
        <ListItem button className="pl-0">
            <DragIndicatorIcon className="ml-4"/>
            <ListItemIcon edge="end" className="ml-2">
                <Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}><small>{index+1}.{ind+1}</small></Avatar>
            </ListItemIcon>
            <ListItemText primary={`${content.content.title ? content.content.title : "-"} - [${content.content.contentType ? content.content.contentType : ""}]`} />
            <Link target="_blank" to={`/edit-${content.content.contentType.toLowerCase()}/${content.content._id}`}>
            {!content.content.approvedByLibrarian &&
            !content.content.approvedByCloudManager &&
            content.content.owner===user.id &&
            <IconButton disabl edge="end" aria-label="edit content" size="small">
                <BsPencil color="primary"/>
            </IconButton>
            }
            </Link>
            <IconButton edge="end" aria-label="remove content" size="small" className="text-danger ml-3">
            {content.content.existsEvent? 
                <Tooltip title={t(`You can't delete because some event exists linking this content. Remove the event first to delete this content.`)}>
                        <ClearIcon color="disabled" />
                </Tooltip>:
                <ClearIcon onClick={()=>setActionModal({isOpen: true, returnedValue: false})}/>
            }
            </IconButton>
        </ListItem>
    <ConfirmActionModal actionModal={actionModal}
                        setActionModal={setActionModal}
                        actionModalTitle={t("Removing content")}
                        actionModalMessage={t("Are you sure you want to remove content? The action is not reversible! You have to use save button to save data")}
    />
        </>
    )
}