import React, {lazy, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";

const List = lazy(()=>import("./List"));
const Preview = lazy(()=>import("./Preview"));

const Students=()=> {
    const {t} = useTranslation();

    const [previewHelper, setPreviewHelper] = useState({isOpen: false, itemId: null});

     return (
        <Grid container>
            <Grid item xs={12}>
                <Paper elevation={10} style={{borderRadius:'0px 0px 6px 6px'}} className='p-3'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" component="h2" className="text-left font-weight-bold" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("List of assigned students")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} lg={previewHelper.isOpen ? 6 : 12} className='mt-2'>
                            <List setPreviewHelper={setPreviewHelper}/>
                        </Grid>
                        <Grid item xs={12} lg={previewHelper.isOpen && 6} hidden={!previewHelper.isOpen} className='mt-2' >
                            <Preview
                                previewHelper={previewHelper}
                                setPreviewHelper={setPreviewHelper} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
     )
 }

export default Students;