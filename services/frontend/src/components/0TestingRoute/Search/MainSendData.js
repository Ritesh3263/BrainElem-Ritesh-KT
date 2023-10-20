import React, {useEffect, useState} from "react";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchFieldTest from "./SearchFieldTest";
import TableSearch from "../../common/Table/TableSearch";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import {createTheme, createStyles, makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";

export default function MainSendData(){
    const [searchTextTest, setSearchTextTest] = useState('');
    const [data, setData] = useState([]);

    const staticData = [
        {
            id: "89fr89erfy",
            name: "Test 1",
            surname: "Some surname",
            age: 30,
        },
        {
            id: "oeyf7g8er",
            name: "Super 2",
            surname: "Wariable hyper",
            age: 11,
        },
        {
            id: "gphrpeg9r",
            name: "Content 3",
            surname: "Module content",
            age: 34,
        },
        {
            id: "879gpthrr",
            name: "Chapter 4",
            surname: "Perfect cat",
            age: 67,
        }
    ];

    useEffect(()=>{
        setData(staticData);
    },[]);

    return(
     <Grid container spacing={3}>
         <Grid item xs={12}>
             <Paper elevation={10} className="p-4">
                <SearchFieldTest
                    value={searchTextTest}
                    // inputValue | stacticData_can't change | setSearchText | SetVisibleData
                    onChange={(e)=>TableSearch(e.target.value, staticData, setSearchTextTest, setData)}
                    clearSearch={()=>TableSearch('', staticData, setSearchTextTest, setData)}
                />
             </Paper>
         </Grid>
         <Grid item xs={12}>
             <Paper elevation={10} className="p-4">
                 {data.map(i=><p key={i.id}>{i.name}</p>)}
             </Paper>
         </Grid>
     </Grid>
    )
}