import React from "react";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NotificationService from "services/notification.service";
import {Button} from "@material-ui/core";

export default function Notifications(){
    const { F_showToastMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const sampleNotification = {
        type: 'CALENDAR_EVENT',
        name: 'Notification xx',
        content: 'Content of notification xx',
        module: '200004000080000000000000',
        userId: user.id,
    }

    const addNotification =()=>{
        NotificationService.addUserNotification(sampleNotification).then(res=>{
            if(res.status === 200){
                F_showToastMessage("Data was added","success");
            }
        }).catch(err=>console.log(err));
    }
    return(
        <>
            <br/>
            <Button variant="contained" size="small" color="secondary" onClick={addNotification}>
                Add notifications for me
            </Button>
        </>
    )
}