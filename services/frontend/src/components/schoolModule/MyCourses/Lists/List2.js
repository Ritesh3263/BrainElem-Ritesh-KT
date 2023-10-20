import React from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Box from '@material-ui/core/Box';
import StarIcon from '@mui/icons-material/Star';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {myCourseActions} from "app/features/MyCourses/data";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

const List2=()=> {
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {data, filteredData, isPending} = useSelector(_=>_.myCourses);

    const itemsList = filteredData.length>0 ? filteredData.map((item,index)=>{
        // let period = item.group.academicYear.periods.find(p=> new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date()); // auto selects onGoing period
        let period = item.group?.academicYear.periods.find(p=> p._id.toString()===item?.period?.toString());
        return (
            <Grid item xs={12} md={6} lg={4} xl={3} style={{cursor:'pointer'}} key={item._id} onClick={()=>{dispatch(myCourseActions.setFormHelper({isOpen: true, itemId: item._id}))}}>
                <Paper elevation={11} className='p-2'>
                    <Grid container>
                        <Grid item xs={12}>
                            <IconButton color="secondary" size="small"
                                        onClick={()=>{}}
                            >
                                <StarOutlineIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} className='mt-2'>
                            <Box style={{
                                    backgroundColor:'lightblue', 
                                    height:'200px',
                                    backgroundImage: item.image ? `url(/api/v1/courses/images/${item.image}/download)` : `noImage`,
                                    backgroundSize: 'cover',
                                }} className="d-flex justify-content-center align-items-center">
                            </Box>
                        </Grid>
                        <Grid item xs={12} className='mt-2'>
                            <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {item?.trainingModule?.name||'-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className='mt-1'>
                            <Chip label={period?.name || 'period'}
                                  className="mr-1 mt-1"
                                  size="small" variant="outlined"
                                  style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.45)',borderRadius:'6px', borderColor:'rgba(82, 57, 112, 1)'}}
                            />
                            <Chip label={item?.group?.name||'-'}
                                  className="mr-1 mt-1"
                                  size="small" variant="outlined"
                                  style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.45)',borderRadius:'6px', borderColor:'rgba(82, 57, 112, 1)'}}
                            />
                        </Grid>
                        <Grid item xs={12} className='mt-2'>
                            <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {`Last time active: ${item?.updatedAt && new Date(item.updatedAt).toLocaleDateString()}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
    }
        ) : (
            <Grid item xs={12}>
                <Paper elevation={11} className='p-2'>
                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("You don't have any courses yet")}
                    </Typography>
                </Paper>
            </Grid>
    );

     return (
        <Grid container spacing={2}>
            {itemsList}
        </Grid>
     )
 }

export default List2;