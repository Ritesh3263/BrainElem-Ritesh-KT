import React, {lazy, useState} from 'react';
import Grid from "@mui/material/Grid";
import {useTranslation} from "react-i18next";
import {Card, CardHeader, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {ETab, ETabBar} from "styled_components";
import {theme} from "MuiTheme";
import Pagination from "../Helpers/Pagination";

const MyLastContentList = lazy(()=> import ("./MyLastContentList"));

function MyLastContent(props) {
    const {
    } = props;
    const { t } = useTranslation();
    const [currentTab,setCurrentTab]=useState({tabId:0,type:'PRIVATE'});
    const [showData, setShowData] = useState([]);
    const [contentItems, setContentItems] = useState([]);

    return (
        <Grid item xs={12} md={4} className='d-flex flex-row flex-grow-1' sx={{maxHeight:'450px'}}>
            <Card style={{background: theme.palette.glass.opaque, borderRadius:'8px'}} className='d-flex flex-column flex-grow-1'>
                <CardHeader className='p-2' title={(
                    <Grid container>
                        <Grid item xs={12} className='d-flex justify-content-start align-items-center'>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                {t('My last content')}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
                />
                <CardContent className='py-0 px-1' style={{overflowX:'hidden',overflowY: 'scroll', display:'flex', flexGrow: 1}} >
                    <Grid container className='mx-1' s>
                        <Grid item xs={12} className='mr-2'>
                            <ETabBar className='mb-2' style={{maxWidth:'300px'}}
                                     value={currentTab.tabId}
                                     onChange={({target:{parentElement:{name}}},i)=>{
                                         setCurrentTab({tabId:i,type: name})
                                     }}
                                     eSize='xsmall'
                            >
                                <ETab  label={t('Private')} style={{minWidth:'100px'}} eSize='xsmall' name='PRIVATE' />
                                <ETab  label={t('Public')} style={{minWidth:'100px'}} eSize='xsmall' name='PUBLIC' />
                                <ETab  label={t('Co-created')} style={{minWidth:'100px'}} eSize='xsmall' name='CO_CREATED' />
                            </ETabBar>
                        </Grid>
                        <Grid item xs={12} className='mt-2 mr-2 d-flex flex-wrap' style={{height: '100%'}}>
                            <MyLastContentList type={currentTab.type} contentItems={showData} setContentItems={setContentItems}/>
                        </Grid>
                    </Grid>
                </CardContent>
                <Pagination
                    viewAllRoute={'my-library'}
                    originalData={contentItems}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default MyLastContent;