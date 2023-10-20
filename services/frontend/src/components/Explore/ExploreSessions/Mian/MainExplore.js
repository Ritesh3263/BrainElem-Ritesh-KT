import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import Popular from "./Popular";
import ItemImage from "../ItemsList/ItemImage";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import { EButton, ECoursePriceLabel, ETakeCourseButton } from "../../../../styled_components";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";
import IconButton from "@material-ui/core/IconButton";
import ImageList from '@mui/material/ImageList';
import { theme } from "../../../../MuiTheme";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CourseService from "../../../../services/course.service";
import SessionsPerCategory from "./SessionsPerCategory";
import { isWidthUp } from "@material-ui/core/withWidth";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import OptionsButton from "components/common/OptionsButton";
import UserService from "services/user.service";
import Autocomplete from 'styled_components/Autocomplete'
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "app/features/Explore/data"
import ContentService from 'services/content.service'
import CertificationSessionService from 'services/certification_session.service'

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '275px',
        cursor: 'pointer',
        overflow: "hidden",
        '&:hover': {
            transform: "scale(1.02, 1.02)"
        },
    },
}))

export default function MainExplore({ items = [], _popularTeachers = [], itemsHelper, setItemsHelper, takeCourse, allUserSessions, setSearchText }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [theMostPopularItem, setTheMostPopularItem] = useState(null);
    const [categories, setCategories] = useState([]);
    const [sliderLength, setSliderLength] = useState(2);
    const [paginationSlider, setPaginationSlider] = useState({ startElement: 0, endElement: 3 });
    const [hiddens, setHiddens] = useState({});
    const {
        myCurrentRoute,
        F_getHelper,
        F_setCurrentUser,
        currentScreenSize,
        F_showToastMessage,
    } = useMainContext();

    const {
        getCurrency
    } = useShoppingCartContext();

    const { user } = F_getHelper();
    const isTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
    const dispatch = useDispatch();
    const { item: boardingItem = {} } = useSelector(s => s.boarding);
    // Load state from Redux store
    const { activeIndex, contents } = useSelector(s => s.contentFactory);
    const [searchQueryValue, setSearchQueryValue] = useState('');
    const [searchQueryInputValue, setSearchQueryInputValue] = useState('');
    const { searchQuery } = useSelector(s => s.explore);
    const navigate = useNavigate();

    useEffect(() => {
        setSearchQueryValue(searchQuery)
        search(searchQuery)
    }, [searchQuery]);

    const search = (query) => {
        if (query && query.length > 0) {
            if (isTrainingCenter) {
                navigate(`/explore-courses/${query}`);
            } else {
                navigate(`/explore/${query}`);
            }
        }
        else {
            if (isTrainingCenter) {
                navigate(`/explore-courses/${query}`);
            } else if (myCurrentRoute == "Explore") {
                //navigate(`/explore`);
            }
        }
    }

    useEffect(() => {
        if (isWidthUp('xs', currentScreenSize)) {
            setSliderLength(1);
            setPaginationSlider({ startElement: 0, endElement: 1 });
        }
        if (isWidthUp('sm', currentScreenSize)) {
            setSliderLength(1);
            setPaginationSlider({ startElement: 0, endElement: 1 });
        }
        if (isWidthUp('md', currentScreenSize)) {
            setSliderLength(2);
            setPaginationSlider({ startElement: 0, endElement: 2 });
        }
        if (isWidthUp('lg', currentScreenSize)) {
            setSliderLength(3);
            setPaginationSlider({ startElement: 0, endElement: 3 });
        }
        if (isWidthUp('xl', currentScreenSize)) {
            setSliderLength(5);
            setPaginationSlider({ startElement: 0, endElement: 5 });
        }
    }, [currentScreenSize]);

    useEffect(() => {
        CourseService.getCategoryRefsFromModule().then((res) => {
            if (res.status === 200 && res?.data?.length > 0) {
                setCategories(res.data);
            }
        }).catch(err => console.log(err));
        if (user) {
            setHiddens(user.hiddens);
        }
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            let newItems = [...items];
            setTheMostPopularItem(newItems.splice(0, 1)[0]);
        }
    }, [items]);

    const recommendedCoursesList = items
        .filter(x => hiddens.courses?.find(y => y.toString() === x._id.toString()) === undefined)
        .slice(paginationSlider.startElement, (itemsHelper.isOpen ? paginationSlider.endElement - 1 : paginationSlider.endElement))
        .map((item, index) => (
            <div className={`m-2 ${classes.root}`} key={index} style={{ maxWidth: '275px' }} onClick={() => {
                setSearchText(item.name)
                setItemsHelper({ isOpen: true, contentId: item?._id })
            }
            }>
                <Paper elevation={10} style={{ background: theme.palette.glass.opaque, borderRadius: "4px" }} className='pb-0'>
                    <ImageListItem style={{ minWidth: "275px" }}>
                        {<ECoursePriceLabel
                            price={(item.paymentEnabled && item.price) ? item.price.toString() : t("FREE")}
                            currency={(item.paymentEnabled && item.price) ? getCurrency() : ""}
                            style={{ background: ((item.paymentEnabled && item.price) ? theme.palette.primary.yellow : theme.palette.neutrals.white) }}
                        />}
                        <ItemImage image={item?.coursePath?.image} />
                        <ImageListItemBar
                            style={{ backgroundColor: `rgba(0,0,0,0.0)` }}
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
                                        <EButton style={{ border: "1px solid Beige" }}
                                            eVariant='secondary'
                                            onClick="()"
                                            eSize='xsmall'
                                        >{t("Open enrol")}</EButton>
                                    </div>
                                    <div className='pl-4 ml-3'>
                                        <OptionsButton btns={[
                                            {
                                                id: 1, name: t("Hide this content"), action: (e) => {
                                                    // e.stopPropagation();
                                                    // e.preventDefault();
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
                                                                            let courses = prevState.hidden?.courses || [];
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

                                                },
                                            },
                                            { id: 2, name: t("Edit"), action: "()=>{}", },
                                            { id: 3, name: t("Hide locked element"), action: "()=>{}", },
                                            { id: 4, name: t("Delete"), action: "()=>{}", }
                                        ]} iconButton={true} />
                                    </div>
                                </div>
                            }
                        />
                    </ImageListItem>
                    <Grid container className='p-1'>
                        <Grid item xs={11} className="mt-1">
                            <Typography variant="h5" component="h5" className="text-left"
                                style={{
                                    color: theme.palette.primary.lightViolet,
                                    maxWidth: '280px',
                                    fontSize: "16px",
                                    overflowX: "hidden",
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}>
                                {item?.name ?? '-'}
                            </Typography>
                            <Typography variant="body1" component="h6" className="text-left"
                                style={{
                                    color: `rgba(82, 57, 112, 1)`,
                                    maxWidth: '280px',
                                    overflowX: "hidden",
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}>
                                {item?.coursePath?.description ?? '-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className="d-flex flex-column justify-content-between align-items-center py-1" >
                            <IconButton aria-label="icon label" size="small"
                                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}

                            >
                                <RemoveRedEyeOutlinedIcon style={{ fontSize: "22px", color: `rgba(82, 57, 112, 1)` }} />
                            </IconButton>
                            <Typography variant="body2" component="h6" className="text-left" style={{ color: `rgba(82, 57, 112, 1)` }}>
                                <small>{`${item?.durationTime || '12'}h`}</small>
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        ));

    const categoriesList = categories?.length > 0 ? categories.map(category => (
        <Grid item xs={12} key={category._id}>
            <SessionsPerCategory category={category} itemsHelper={itemsHelper} setItemsHelper={setItemsHelper} setSearchText={setSearchText} hiddens={hiddens} setHiddens={setHiddens} />
        </Grid>
    )) : [];

    return (
        <Grid container >
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        {myCurrentRoute == "Explore" && <Autocomplete
                            explore={true}
                            freeSolo
                            //blurOnSelect={true}
                            value={searchQueryValue}
                            inputValue={searchQueryInputValue}
                            onInputChange={(event, value) => {
                                setSearchQueryInputValue(value)
                            }
                            }
                            onChange={(event, value) => {
                                if (value) dispatch(setSearchQuery(value))
                            }}
                            suggestions={[]}
                            getSuggestions={async (query) => {
                                if (isTrainingCenter) {
                                    let res = await CertificationSessionService.getSessionsForExplore(undefined, query)
                                    let data = res?.data?.hits?.hits
                                    if (data) return data.map(a => a._source?.name)
                                    else return []
                                }
                                else {
                                    let res = await ContentService.suggest(query)
                                    let data = res?.data?.hits?.hits
                                    data = data.filter(a => a._source.contentType != "ASSET")//Ignore assets
                                    if (data) return data.map(a => a._source.title)
                                    else return []
                                }
                            }}


                            sx={{ ml: '32px' }}
                            placeholder={`${t("Search")}`}
                            class="search_textbox"
                        >
                        </Autocomplete>}
                    </Grid>
                    <Grid item xs={12} md={8} className='pr-2'>
                        <Paper elevation={10} className="p-3" style={{ height: '100%', borderRadius: '8px', backdropFilter: 'blur(20px)' }}>
                            <Grid container style={{ height: "210px" }} >
                                <Grid item xs={5}>
                                    <ItemImage image={theMostPopularItem?.coursePath?.image} fromSingeItem={true} />
                                </Grid>
                                <Grid item xs={7} className="d-flex flex-grow-1">
                                    <Grid container className="pl-2" style={{ overflow: 'hidden' }}>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" component="h5" className="text-left ml-3 mt-1" style={{ fontSize: "32px", color: theme.palette.primary.lightViolet }}>
                                                <strong>{theMostPopularItem?.name?.slice(0, 50)}</strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" component="h5" className="text-left ml-3 mr-3" style={{ fontSize: "14px", maxHeight: '130px', overflow: 'hidden' }}>
                                                <span>{theMostPopularItem?.coursePath?.description || theMostPopularItem?.course?.description}</span>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} className="d-flex align-items-end justify-content-between pr-1 pl-1">
                                            {theMostPopularItem && <EButton eVariant='secondary'
                                                //style={{width: '25%'}}
                                                disabled={itemsHelper.isOpen || theMostPopularItem === null}
                                                onClick={() => {
                                                    setSearchText(theMostPopularItem?.name)
                                                    setItemsHelper({ isOpen: true, contentId: theMostPopularItem?._id })
                                                }}
                                            >
                                                {t("Learn more")}
                                            </EButton>}
                                            {theMostPopularItem && <ETakeCourseButton
                                                course={theMostPopularItem}
                                                takeCourse={takeCourse}
                                                allUserSessions={allUserSessions}
                                                isLoggedIn={user?.id ? true : false}
                                                disabled={itemsHelper.isOpen || theMostPopularItem === null}
                                            />}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} className={!isWidthUp('md', currentScreenSize) && "mt-3"}>
                        <Popular _trending={items} _popularTeachers={_popularTeachers} />
                    </Grid>
                </Grid>
            </Grid>
            {recommendedCoursesList.length > 0 ?
                <Grid item xs={12}>
                    <Grid container className='mt-3' style={{ borderRadius: '8px' }}>
                        <Grid item xs={12} className='mt-2 '>
                            <Typography variant="h5" component="span" className="text-left text-justify p-3" style={{ color: theme.palette.primary.darkViolet, fontSize: "24px" }}>
                                {t("Recommended")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className='d-flex'>
                            <Box style={{ width: '40px' }} className='d-flex justify-content-center align-items-center'>
                                <IconButton size="small" color="secondary"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.65)' }}
                                    disabled={paginationSlider.startElement === 0}
                                    onClick={() => {
                                        setPaginationSlider(p => ({ startElement: p.startElement - 1, endElement: p.endElement - 1 }));
                                    }}
                                >
                                    <ChevronLeftIcon style={{ fill: theme.palette.primary.darkViolet }} />
                                </IconButton>
                            </Box>
                            <Box className='flex-grow-1'>
                                <Grid container>
                                    <Grid item xs={12} className="d-flex align-items-left justify-content-left mt-2 ml-2">
                                        <ImageList cols={itemsHelper.isOpen ? 2 : sliderLength} rowHeight={190} className='d-flex justify-content-center'>
                                            {recommendedCoursesList}
                                        </ImageList>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box style={{ width: '40px' }} className='d-flex justify-content-center align-items-center'>
                                <IconButton size="small" color="secondary"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.65)' }}
                                    disabled={items?.length <= paginationSlider.endElement}
                                    onClick={() => {
                                        setPaginationSlider(p => ({ startElement: p.startElement + 1, endElement: p.endElement + 1 }));
                                    }}
                                >
                                    <ChevronRightIcon style={{ fill: theme.palette.primary.darkViolet }} />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                : ""
            }
            {categoriesList}
        </Grid>
    )
}