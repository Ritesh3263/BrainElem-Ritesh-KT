import React from "react";
import {EAccordion} from "styled_components";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from '@mui/material/Grid';
import {useTranslation} from "react-i18next";
export default function CustomAccordion(){
    const { t} = useTranslation();

    const child = (
        <Paper elevation={11} className="p-3">
            <Grid container>
                <Grid item xs={4} style={{backgroundColor:'lightgreen'}} className='p-2'>
                    <Typography variant="h5" component="h3" className="text-left">
                        Test 1
                    </Typography>
                </Grid>
                <Grid item xs={4} style={{backgroundColor:'olive'}} className='p-2'>
                    <Typography variant="h5" component="h3" className="text-left">
                        Test 2
                    </Typography>
                </Grid>
                <Grid item xs={4} style={{backgroundColor:'lightblue'}} className='p-2'>
                    <Typography variant="h5" component="h3" className="text-left">
                        Test 3
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
    return(
        <>
            <p className='mb-2'>Accordion with header name and header background</p>
            <EAccordion
                headerName={t("Sample header name")}
                headerBackground
                //disabled
                defaultExpanded={true}
                >
                {child}
            </EAccordion>
            <p className='mb-2 mt-5'>Accordion without header name and header background</p>
            <EAccordion
                headerBackground
            >
                {child}
            </EAccordion>
            <p className='mb-2 mt-5'>Accordion with header name and without header background</p>
            <EAccordion
                headerName={t("Sample header name")}
            >
                {child}
            </EAccordion>
            <p className='mb-2 mt-5'>Accordion without header name and without header background</p>
            <EAccordion
            >
                {child}
            </EAccordion>
        </>
    )
}