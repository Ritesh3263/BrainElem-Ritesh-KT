import React from "react";
import Grid from "@material-ui/core/Grid";
import {ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function ProAndCon({currentTrainee, currentReport, setCurrentReport, reportType}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();

    function addItem(type){
        if(type === 'PROS'){
            setCurrentReport(p=>{
                let val = Object.assign({},p);
                val.pros.push("")
                return val;
            })
        }else{
            setCurrentReport(p=>{
                let val = Object.assign({},p);
                val.cons.push("")
                return val;
            })
        }
    }

    const prosList = currentReport.pros && currentReport.pros.length>0 ? currentReport.pros.map((item,index)=>(
        <ListItem key={index} className="my-1" alignItems="center" style={{width:"50%", backgroundColor:`rgba(255,255,255,0.35)`,borderRadius:"8px"}}>
            {reportType === "PREVIEW" ? (
                <span>{item}</span>
            ) : (
              <>
                  <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete"
                                  onClick={(e)=>{setCurrentReport(p=>{
                                      let val = Object.assign({},p);
                                      val.pros.splice(index,1);
                                      return val;
                                  })}}>
                          <DeleteIcon />
                      </IconButton>
                  </ListItemSecondaryAction>
                  <TextField
                      value={item}
                      onChange={(e)=>{setCurrentReport(p=>{
                          let val = Object.assign({},p);
                          val.pros[index] = e.target.value;
                          return val;
                      })}}
                  />
              </>
            )}
        </ListItem>
    )) : [];

    const consList = currentReport.cons && currentReport.cons.length>0 ? currentReport.cons.map((item,index)=>(
        <ListItem key={index} className="my-1" alignItems="center" style={{width:"50%", backgroundColor:`rgba(255,255,255,0.35)`,borderRadius:"8px"}}>
            {reportType === "PREVIEW" ? (
            <span>{item}</span>
            ) : (
            <>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete"
                                onClick={(e)=>{setCurrentReport(p=>{
                                    let val = Object.assign({},p);
                                    val.cons.splice(index,1);
                                    return val;
                                })}}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
                <TextField
                    value={item}
                    onChange={(e)=>{setCurrentReport(p=>{
                        let val = Object.assign({},p);
                        val.cons[index] = e.target.value;
                        return val;
                    })}}
                />
            </>
            )}
        </ListItem>
    )) : [];

    return(
            <Grid container spacing={3} className="mt-3">
                <Grid item xs={12} className="mt-3">
                    <TextField
                        variant="filled"
                        style={{width:"100%"}}
                        label={t("Report")}
                        margin="normal"
                        value={currentReport.comment}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            readOnly: reportType === "PREVIEW"
                        }}
                        placeholder={`This is a report about ${currentTrainee?.name} ${currentTrainee?.surname}`}
                        onInput={(e) => {
                            setCurrentReport(p=>{
                                let val = Object.assign({},p);
                                val.comment= e.target.value;
                                return val;
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Paper elevation={10}>
                        <Typography variant="h6" component="h2" className="text-center">
                            {t("Pro's list")}
                        </Typography>
                        <List
                            aria-labelledby="nested-list-subheader"
                            className="d-flex flex-column align-items-center"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader" disableSticky={true}  hidden={reportType === "PREVIEW"}>
                                    <Button size="small" variant="contained" color="primary" className="ml-5" startIcon={<AddCircleOutlineIcon/>} onClick={()=>addItem('PROS')}>
                                        {t("Add Pro's item")}
                                    </Button>
                                </ListSubheader>
                            }>
                            {prosList.length>0  ? prosList : "There is no pro's"}
                        </List>
                    </Paper>
                </Grid>


                <Grid item xs={12} lg={6}>
                    <Paper elevation={10}>
                        <Typography variant="h6" component="h2" className="text-center">
                            {t("Cons's list")}
                        </Typography>
                        <List
                            aria-labelledby="nested-list-subheader"
                            className="d-flex flex-column align-items-center"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader" disableSticky={true}  hidden={reportType === "PREVIEW"}>
                                    <Button size="small" variant="contained" color="primary" className="ml-5" startIcon={<AddCircleOutlineIcon/>} onClick={()=>addItem('CONS')}>
                                        {t("Add Con's item")}
                                    </Button>
                                </ListSubheader>
                            }>
                            {consList.length>0  ? consList : "There is no con's"}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        )
}