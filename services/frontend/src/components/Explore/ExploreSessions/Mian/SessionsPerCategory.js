import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {theme} from "../../../../MuiTheme";
import ImageList from "@mui/material/ImageList";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import CertificationSessionService from "services/certification_session.service";
import {Paper} from "@material-ui/core";
import ImageListItem from "@mui/material/ImageListItem";
import ItemImage from "../ItemsList/ItemImage";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import {EButton, ECoursePriceLabel} from "../../../../styled_components";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import {isWidthUp} from "@material-ui/core/withWidth";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useShoppingCartContext} from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import UserService from "services/user.service";
import OptionsButton from "components/common/OptionsButton";

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth:'275px', 
        cursor: 'pointer', 
        overflow:"hidden",
        '&:hover': {
            transform: "scale(1.02, 1.02)"
         },
    },
}))

export default function SessionsPerCategory({category, itemsHelper, setItemsHelper, setSearchText, hiddens, setHiddens}){
    const {t} = useTranslation();
    const classes = useStyles();
    const [items, setItems] = useState([]);
    const [sliderLength, setSliderLength] = useState(2);
    const [paginationSlider, setPaginationSlider] = useState({startElement: 0, endElement: 2});
    const {
        F_getHelper,
        F_setCurrentUser,
        currentScreenSize,
        F_showToastMessage,
    } = useMainContext();

    const {
        getCurrency
    } = useShoppingCartContext();

    const {user} = F_getHelper();
    useEffect(()=>{
        if(isWidthUp('xs',currentScreenSize)){
            setSliderLength(1);
            setPaginationSlider({startElement: 0, endElement: 1});
        }
        if(isWidthUp('sm',currentScreenSize)){
            setSliderLength(1);
            setPaginationSlider({startElement: 0, endElement: 1});
        }
        if(isWidthUp('md',currentScreenSize)){
            setSliderLength(2);
            setPaginationSlider({startElement: 0, endElement: 2});
        }
        if(isWidthUp('lg',currentScreenSize)){
            setSliderLength(3);
            setPaginationSlider({startElement: 0, endElement: 3});
        }
        if(isWidthUp('xl',currentScreenSize)){
            setSliderLength(5);
            setPaginationSlider({startElement: 0, endElement: 5});
        }
    },[currentScreenSize]);


    useEffect(()=>{
        CertificationSessionService.getSessionsForExplore(category._id).then(res=>{
            if(res.status === 200 && res.data){
                let certificationSessions = res.data.hits.hits.map(hit => { return { '_id': hit._id, ...hit._source } })
                setItems(certificationSessions)
            }
        }).catch(err=>console.log(err));

    },[]);

    const byCategoryCoursesList = items
    .filter(x=>hiddens.courses?.find(y=>y.toString()===x._id.toString())===undefined)
    .slice(paginationSlider.startElement,(itemsHelper.isOpen ? paginationSlider.endElement-1 : paginationSlider.endElement))
    .map((item,index)=> (
        <div  className={`m-2 ${classes.root}`} style={{maxWidth:'275px'}} key={index} 
        onClick={()=>{
            setSearchText(item.name);
            setItemsHelper({isOpen: true, contentId: item?._id})
        }}
        >
            <Paper elevation={10} className='p-0' style={{borderRadius:"4px", background:theme.palette.glass.opaque}}>
                 <ImageListItem style={{minWidth:"275px"}}>

                        {<ECoursePriceLabel
                        className="mb-2"
                        price={(item.paymentEnabled && item.price) ? item.price.toString() : t("FREE")}
                        currency={(item.paymentEnabled && item.price) ? getCurrency() : ""}
                        style={{background: ((item.paymentEnabled && item.price) ? theme.palette.primary.yellow : theme.palette.neutrals.white )}}
                    />}
                    <ItemImage image={item?.coursePath?.image}/>
                    <ImageListItemBar
                        style={{backgroundColor:`rgba(0,0,0,0.0)`}}
                        position="top"
                        actionPosition='left'
                        actionIcon={
                            <div className='d-flex p-1 pl-2'>
                                <div className='d-flex'>
                                    <EButton
                                        eVariant='primary'
                                        eSize='xsmall'
                                        onClick="()"
                                    >{t("Course")}</EButton>
                                    <EButton style={{border:"1px solid Beige"}}
                                        eVariant='secondary'
                                        eSize='xsmall'
                                        onClick="()"
                                    >{t("Open enrol")}</EButton>
                                   
                                   {/* todo 1: prevent clicking whole tile when clicked here */}
                                   {/* todo 2: send item id to action function inside option button */}

                                </div>
                                {/* <IconButton aria-label="icon label" size="small"
                                            className='mt-1 mx-2'
                                            style={{backgroundColor: 'rgba(255,255,255,0.7)',border:"1px solid Beige"}}
                                            onClick="()"
                                    //onClick={()=>{window.open(`/overview/${item._id}`, '_blank')}}
                                >
                                    <MoreHorizIcon style={{color: `rgba(82, 57, 112, 1)`, width:"15px", height:'15px'}}/>
                                </IconButton> */}
                                <div className='pl-4 ml-3'>
                                <OptionsButton btns={[
                                    {id: 1, name: t("Hide this content"), action: ()=>{
                                        if (user) {
                                            if (item._id) {
                                                UserService.hideFromMe("course", item._id)
                                                .then(res => {
                                                    if (res.status === 200) {
                                                        F_showToastMessage(t("Content has been hidden successfully!"), "success");
                                                        setHiddens(prevState => ({
                                                            ...prevState,
                                                            courses: [...prevState.courses, item._id], // p.s. we can use simply `...res.data` instead of prevState.courses and item._id
                                                        })); 
                                                        F_setCurrentUser(prevState => {
                                                            let courses = prevState.hidden?.courses||[];
                                                            return {
                                                                ...prevState,
                                                                hidden: {
                                                                    ...prevState.hidden,
                                                                    courses: [...courses, item._id],
                                                                }
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                            else console.log("No course id has been provided!")
                                        } else {
                                            F_showToastMessage("You need to be logged in to hide this content from you!", "warning");
                                        }

                                    },},
                                    {id: 2, name: t("Edit"), action: "()=>{}",},
                                    {id: 3, name: t("Hide locked element"), action: "()=>{}",},
                                    {id: 4, name: t("Delete"), action: "()=>{}",}
                                ]} iconButton={true} /> 
                                </div>
                            </div>
                        }
                    />
                </ImageListItem>
                <Grid container  className='p-1'>
                    <Grid style={{overflowX: "hidden"}} item xs={11} className="mt-1">
                        <Typography variant="h5" component="h5" className="text-left"
                                    style={{color: theme.palette.primary.lightViolet,
                                        maxWidth: '280px',
                                        overflowX: "hidden",
                                        fontSize:"16px",
                                        whiteSpace: 'nowrap',
                                        textOverflow:'ellipsis'}}>
                            {item?.name??'-'}
                        </Typography>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,
                                        maxWidth: '280px',
                                        overflowX: "hidden",
                                        whiteSpace: 'nowrap',
                                        textOverflow:'ellipsis'}}>
                            {item?.coursePath?.description??'-'}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} className="d-flex flex-column justify-content-between align-items-center py-1" >
                        <IconButton aria-label="icon label" size="small" 
                                    style={{backgroundColor: 'rgba(255,255,255,0.7)'}}
                                    onClick={()=>{
                                        setSearchText(item.name);
                                        setItemsHelper({isOpen: true, contentId: item?._id})
                                    }}
                        >
                            <RemoveRedEyeOutlinedIcon style={{fontSize:"22px", color:`rgba(82, 57, 112, 1)`}}/>
                        </IconButton>
                        <Typography variant="body2" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                            <small>{`${item?.durationTime||'12'}h`}</small>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    ));

    return(
        <Grid container className='mt-3' style={{borderRadius:'8px'}}>
            <Grid item xs={12} className='my-2 pl-2'>
                <Typography variant="h5" component="span" className="text-left text-justify" style={{color: theme.palette.primary.darkViolet, fontSize:"24px"}}>
                    {category?.name??'-'}
                </Typography>
            </Grid>
            {items?.length>0 ? (
                <Grid item xs={12} className='d-flex'>
                    <Box style={{width:'40px'}} className='d-flex justify-content-center align-items-center'>
                        <IconButton size="small" color="secondary"
                                    style={{backgroundColor:'rgba(255,255,255,0.65)'}}
                                    disabled={paginationSlider.startElement === 0}
                                    onClick={()=>{
                                        setPaginationSlider(p=>({startElement: p.startElement-1, endElement: p.endElement-1}));
                                    }}
                        >
                            <ChevronLeftIcon style={{fill:theme.palette.primary.darkViolet}}/>
                        </IconButton>
                    </Box>
                    <Box className='flex-grow-1'>
                        <Grid container className='d-flex'>
                            <Grid item xs={12} className="d-flex align-items-left justify-content-left mt-2 ml-">
                                <ImageList cols={itemsHelper.isOpen ? 2 : sliderLength} rowHeight={190} className='d-flex justify-content-center'>
                                    {byCategoryCoursesList}
                                </ImageList>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box style={{width:'40px'}} className='d-flex justify-content-center align-items-center'>
                        <IconButton size="small" color="secondary"
                                    style={{backgroundColor:'rgba(255,255,255,0.65)'}}
                                    disabled={items?.length <= paginationSlider.endElement}
                                    onClick={()=>{
                                        setPaginationSlider(p=>({startElement: p.startElement+1, endElement: p.endElement+1}));
                                    }}
                        >
                            <ChevronRightIcon style={{fill:theme.palette.primary.darkViolet}}/>
                        </IconButton>
                    </Box>
                </Grid>
            ):<span className='pl-2'>{t("List is empty")}</span>}

        </Grid>
    )
}