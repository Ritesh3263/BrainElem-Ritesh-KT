import React, {lazy, useState} from 'react';
import Grid from "@mui/material/Grid";
import {useTranslation} from "react-i18next";
import {Card, CardHeader, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import OptionsButton from "components/common/OptionsButton";
import {ETab, ETabBar} from "styled_components";
import {theme} from "MuiTheme";
import Pagination from "../Helpers/Pagination";

const Tasks = lazy(() => import("./Tasks"));

function MyTasksArchitect(props) {
    const {} = props;
    const { t } = useTranslation();
    const [currentTab,setCurrentTab]=useState(0);
    const [currentTasks,setCurrentTasks]=useState([]);
    const [showData, setShowData] = useState([]);


    const buttons= [
        {id: 1, name: t("View completed"), action: ()=>{viewCompletedHandler()}},
        {id: 2, name: t("Sort by"), action: ()=>{sortByHandler()}},
    ];

    const viewCompletedHandler=()=>{
        console.log("viewCompletedHandler")
    };

    const sortByHandler=()=>{
        console.log("sortByHandler");
        // by selected tab no.
    };

    return (
        <Grid item xs={12} md={4} className='d-flex flex-row flex-grow-1'>
            <Card style={{background: theme.palette.glass.opaque, borderRadius:'8px'}} className='d-flex flex-column flex-grow-1'>
                <CardHeader className='p-2' title={(
                    <Grid container>
                        <Grid item xs={10} className='d-flex justify-content-start align-items-center'>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                {t('Architect\'s tasks')}
                            </Typography>
                        </Grid>
                        {/*<Grid item xs={2} className='d-flex justify-content-end align-items-center'>*/}
                        {/*    <OptionsButton iconButton={true} btns={buttons}/>*/}
                        {/*</Grid>*/}
                    </Grid>
                )}
                />
                <CardContent className='py-0 px-1' style={{overflowX:'hidden', display:'flex', flexGrow: 1}}>
                    <Grid container className='mx-1'>
                        <Grid item xs={12}>
                            <ETabBar className="mb-1" style={{maxWidth:'230px'}}
                                     value={currentTab}
                                     onChange={(e,i)=>setCurrentTab(i)}
                                     eSize='xsmall'
                            >
                                <ETab  label={t('New')} style={{minWidth:'115px'}} eSize='xsmall'/>
                                <ETab  label={t('Done')} style={{minWidth:'115px'}} eSize='xsmall'/>
                            </ETabBar>
                        </Grid>
                        <Grid item xs={12} className='mt-2 mr-2' style={{height:'100%'}}>
                            {currentTab === 0 && (<Tasks type='NEW' setCurrentTasks={setCurrentTasks} currentTasks={showData}/>)}
                            {currentTab === 1 && (<Tasks type='DONE' setCurrentTasks={setCurrentTasks} currentTasks={showData}/>)}
                        </Grid>
                    </Grid>
                </CardContent>
                <Pagination
                    //disableViewAll
                    viewAllRoute={'/courses'}
                    originalData={currentTasks}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default MyTasksArchitect;