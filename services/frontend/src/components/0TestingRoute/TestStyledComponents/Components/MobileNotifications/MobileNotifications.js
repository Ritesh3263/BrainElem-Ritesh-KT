import React, {useState} from 'react';
import Paper from "@material-ui/core/Paper";
import {EButton} from "styled_components";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import {eliaAPI} from "services/axiosSettings/axiosSettings";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const initialState={
    title: 'Self notification 🔥',
    body:'Sending by expo server',
    _data: {someData: 'goes here'},
}

const MobileNotifications =()=>{
    const { F_showToastMessage } = useMainContext();
    const [notification, setNotification] = useState(initialState);

    async function sendMobileNotificationHandler(){
            await eliaAPI.post(`test/mobile-notification`,notification).then(res=>{
                console.log(res)
                F_showToastMessage('Notifications was send successfully', 'success')
            }).catch(err=>{
                F_showToastMessage('Something went wrong', 'error')
                console.log(err)
            })
    }

     return (
        <Paper sx={{flexGrow:1}} style={{padding: 8}} elevation={10}>
            <h5>Send mobile notification on my connected devices</h5>
            <Paper elevation={11} style={{width:400, padding:15}}>
                <TextField label="Title" margin="dense"
                           fullWidth={true}
                           variant="outlined"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={notification.title}
                           onChange={({target:{value}})=>setNotification(p=>({...p,title:value}))}
                />
                <TextField label="Content" margin="dense"
                           fullWidth={true}
                           variant="outlined"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={notification.body}
                           onChange={({target:{value}})=>setNotification(p=>({...p,body:value}))}
                />
                <EButton
                    sx={{my:2}}
                    fullWidth={true}
                    eSize='small'
                    eVariant="primary"
                    onClick={sendMobileNotificationHandler}
                >send</EButton>
            </Paper>

        </Paper>
     )
 }

export default MobileNotifications;