import React, {useRef} from "react";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ReactToPrint from 'react-to-print';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    certificateHeader:{
        color: `rgba(168, 92, 255, 1)`,
        fontFamily: "Nunito",
        fontWeight: 700,
        fontStyle: "normal",
        fontSize: "64px",
    },
    certificateTitle:{
        color: `rgba(82, 57, 112, 1)`,
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "18px",
    },
    certificateFooter:{
        color: `rgba(82, 57, 112, 1)`,
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "16px",
    },
    certificateName:{
        color: `rgba(21, 163, 165, 1)`,
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "36px",
    },
    nameOfTrainee:{
        color: `rgba(168, 92, 255, 1)`,
        fontFamily: "Nunito",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "36px",
    },
    mainGrid:{

    }
});

export default function Certificate(){
    const componentRef = useRef();
    const classes = useStyles();
    return(
        <>
            <Paper elevation={11} className="p-2" ref={componentRef}>
                <Grid container spacing={1} className={classes.mainGrid}>
                    <Grid item xs={12} className="d-flex align-items-center justify-content-center mt-3">
                        <Typography variant="body1" className={classes.certificateTitle}>Name of the training center</Typography>
                    </Grid>
                    <Grid item xs={12} className="d-flex align-items-center justify-content-center my-3">
                        <Typography variant="h1" className={classes.certificateHeader}>Certificate</Typography>
                    </Grid>

                    <Grid item xs={12} className="d-flex align-items-center justify-content-center mb-5">
                        <Typography variant="h3" className={classes.certificateName}>Name of certified job</Typography>
                    </Grid>

                    <Grid item xs={12} className="d-flex align-items-center justify-content-center mb-3">
                        <Typography variant="h4" className={classes.nameOfTrainee}>Full name of the person</Typography>
                    </Grid>

                    <Grid item xs={12} className="d-flex flex-column align-items-center justify-content-center mb-5">
                        <Typography variant="h5" className="mb-2">Has successfilly completed</Typography>
                        <Typography variant="h5">Name of the course / training path</Typography>
                    </Grid>

                    <Grid item xs={4} className="d-flex flex-column align-items-center justify-content-center mt-5">
                        <span>_________________</span>
                        <span>issue date</span>
                    </Grid>
                    <Grid item xs={4} className="d-flex align-items-center justify-content-center mt-5">
                        <div style={{backgroundColor: `rgba(239, 209, 53, 1)`, width: "150px", height: "150px", borderRadius: "50%"}}
                              className="d-flex align-items-center justify-content-center">
                            <span>ELiA</span>
                        </div>
                    </Grid>
                    <Grid item xs={4} className="d-flex flex-column align-items-center justify-content-center mt-5">
                        <span>_________________</span>
                        <span>Training Manager</span>
                    </Grid>
                    <Grid item xs={6} className="d-flex align-items-center justify-content-start mb-3 pl-3">
                        <Typography variant="body1" className={classes.certificateFooter}>Certificate #4254234</Typography>
                    </Grid>
                    <Grid item xs={6} className="d-flex align-items-center justify-content-end mb-3 pr-3">
                        <Typography variant="body1" className={classes.certificateFooter}>URL: elia/1234</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <ReactToPrint
                trigger={() => <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" onClick={()=>{}}>Export to PDF</Button>}
                content={() => componentRef.current}
            />
        </>
    )
}