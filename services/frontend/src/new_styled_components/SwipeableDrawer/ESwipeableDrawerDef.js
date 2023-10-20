import React, {useState} from "react";
import {Paper} from "@material-ui/core";
import {Container} from "@mui/material";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import StyledSwipeableDrawer from "./SwipeableDrawer.styled";
import SearchField from "../../components/common/Search/SearchField";
import TableSearch from "../../components/common/Table/TableSearch";
import { theme } from "../../MuiTheme";


export const ESwipeableDrawerDef=(props)=> {
   const {
       children,
       swipeableDrawerHelper,
       setSwipeableDrawerHelper,
       header='Default header',
       setFilteredData = ()=>{},
       originalData = [],
       swipeableDrawerHelper:
           {
               isOpen,
           }
   } = props;
   const [searchingText, setSearchingText] = useState('');

    return(
        <StyledSwipeableDrawer
            {...props}
            anchor='right'
            open={isOpen}
            onOpen={()=>{}}
            PaperProps={{
                style:{
                    backgroundColor: theme.palette.neutrals.white,
                    maxWidth: '450px',
                }}}
            onClose={()=>{
                setSearchingText('');
                setSwipeableDrawerHelper(p=>({...p, isOpen: false}));
            }}
        >
            <Paper elevation={10} className='p-2 pt-3'>
                <Grid container >
                    <Grid item xs={12}>
                        <Typography variant="h3" component="h2" className="text-center text-justify" style={{fontSize:"32px"}}>
                            {header}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className='px-3'>
                        <SearchField
                            className="text-primary"
                            value={searchingText}
                            onChange={({target:{value}})=>{TableSearch(value, originalData, setSearchingText, setFilteredData)}}
                            clearSearch={()=>TableSearch('', originalData, setSearchingText, setFilteredData)}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Container className='p-2'>
                {children}
            </Container>
        </StyledSwipeableDrawer>
    )
};