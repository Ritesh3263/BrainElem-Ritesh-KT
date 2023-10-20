import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import {Col, Row} from "react-bootstrap";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import {useNavigate} from "react-router-dom";

export default function MultiSelectButton({allManagersList, assignedManagers, setAllManagersList, setAssignedManagers, addNewRoute, directName}){
    const navigate = useNavigate()

    useEffect(()=>{
            markUsers().then(
                //markAssigned().then().catch()
            ).catch(errors=>console.error(errors))

    },[])

    // 1) Compare all users list with selected users list
    async function markUsers(){
            setAllManagersList(p=>{
                let val = Object.assign([],p);
                val.map(usr=>{
                    usr.isSelected = false;
                })
                return val;
            });
    }

    async function markAssigned(){
        await setAllManagersList(p=>{
            let val = Object.assign([],p);
            val.map(usr=>{
                assignedManagers.map(asUsr=>((asUsr._id == usr._id) ? (usr.isSelected = true) : null))
            })
            return val;
        });
    }

    const usersListView = allManagersList.map(user=>
        (<MenuItem key={user._id} value={user._id} style={user.isSelected ? {backgroundColor:"lightgreen"} : null}
                   onClick={()=>{
                       setAllManagersList(p=>{
                           let val = Object.assign([],p);
                           let index = val.findIndex(usr=> usr._id == user._id);
                           val[index].isSelected = !val[index].isSelected;
                           return val;
                       })}}>
            {user.username}
        </MenuItem>))

    function assignUsers(){
        setAssignedManagers(allManagersList.filter(usr=> usr.isSelected ? usr : null));
    }

    return(
        <FormControl style={{width:"50%"}} as={Row} className="mt-3">
            <InputLabel id="demo-simple-select-label">Assign manager</InputLabel>
            <Select
                margin="normal"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                multiple
                value={allManagersList.map(usr=>usr.isSelected ? usr._id : null)}
                input={<Input />}
                onClose={assignUsers}
            >
                <MenuItem className="text-success" onClick={()=>navigate(addNewRoute)}>+ {directName}</MenuItem>
                {usersListView}
            </Select>
        </FormControl>
    )
}