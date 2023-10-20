import React, {useState, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import ItemsList from "./ItemsList/ItemsList";
import ItemDetails from "./ItemDetail/ItemDetails";
import Typography from "@material-ui/core/Typography";
import CertificationSessionService from "../../../services/certification_session.service"
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import LogService from "../../../services/log.service";
import ModuleCoreService from "../../../services/module-core.service";
import MainExplore from "./Mian/MainExplore";
import SearchExplore from "./Search/SearchExplore";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import {theme} from "MuiTheme";
import ContentService from "services/content.service";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {useNavigate, useParams} from "react-router-dom";
import {Paper} from "@material-ui/core";
import {EButton} from "styled_components";
import {isWidthUp} from "@material-ui/core/withWidth";
import UserService from "services/user.service";

const useStyles = makeStyles((theme) => ({
    paper:{
        [theme.breakpoints.down('sm')]:{
            padding: 0,
        }
    }
}));

export default function ExploreSessions(){
    const classes = useStyles();
    const {t} = useTranslation();
    const { searchQuery } = useParams();
    const navigate = useNavigate();
    const [itemsHelper, setItemsHelper]=useState({isOpen: false, contentId: undefined});
    const [searchText, setSearchText]=useState('')
    const [items, setItems]=useState([]);
    const [allUserSessions, setAllUserSessions] = useState([]);
    const [popularTeachers, setPopularTeachers] = useState([]);
    const [isOpenCognitiveDrawer, setIsOpenCognitiveDrawer] = useState({isOpen: false, cognitiveTestId: undefined});
    const [interestModalHelper,setInterestModalHelper] = useState({isOpen: false})
    const [initTime, setInitTime] = useState(performance.now())

    const {
        F_handleSetShowLoader,
        setMyCurrentRoute,
        currentScreenSize,
        F_showToastMessage,
        F_getErrorMessage,
        F_getHelper
    } = useMainContext();
    const {user, manageScopeIds} = F_getHelper();

    useEffect(()=>{
        if(searchQuery?.length>0){
            setSearchText(searchQuery);
        }else{
            setSearchText('');
        }
    },[searchQuery]);


    useEffect(()=>{
        if(user?.id){
            setMyCurrentRoute("Explore");
            ModuleCoreService.readAllModuleTrainers(manageScopeIds.moduleId).then(res=>{
                if(res.status === 200 && res.data){
                    setPopularTeachers(res.data);
                }
            });

            UserService.read(user.id).then(res=>{
                if(res.status===200){
                    if(res.data?.details?.subinterests?.length<=0){
                        setInterestModalHelper({isOpen: true});
                    }
                }
            }).catch(err=>console.log(err));

            CertificationSessionService.readAllUserSessions().then(res => {
                if (res.status === 200) setAllUserSessions(res.data)
            })


        }
        
    },[]);


    useEffect(() => {
        setItems([])
        const timeOutId = setTimeout(() => {
            F_handleSetShowLoader(true)
            // If searchQuery is undefined the search will return recommended sessions
            if (searchQuery) LogService.logAction('searchSession', {query: searchQuery})
            var searchFunction = CertificationSessionService.getSessionsForExplore(undefined, searchQuery)
            searchFunction.then(response => {
                let certificationSessions = response.data.hits.hits.map(hit => { return { '_id': hit._id, ...hit._source } })
                setInitTime(performance.now())
                setItems(certificationSessions)
                F_handleSetShowLoader(false)
            }).catch((err)=>{
                F_handleSetShowLoader(false)

            })
        }, 500);

        return () => clearTimeout(timeOutId);

    }, [searchQuery]);




    const takeCourse = (sessionId, alreadyTaken=false) => {
        if(alreadyTaken){
            window.open(`/sessions/${sessionId}`, "_blank");
        }else{
            let certificationSessionId = sessionId||itemsHelper.contentId
            CertificationSessionService.takeCourse(certificationSessionId).then(res=>{
                if(res.status===200 && res?.data){
                    F_showToastMessage(res.data.message, 'success');
                    CertificationSessionService.readAllUserSessions().then(res => {
                        if (res.status === 200){
                             setAllUserSessions(res.data)
                             setItemsHelper({isOpen: false, contentId: undefined});
                        }
                    })
                } else if (res.status===202){
                    F_showToastMessage(res.data.message, 'warning');
                }
            }).catch(err=>{
                F_showToastMessage(F_getErrorMessage(err), "error");
            });
        }
    };

    return(
        <Grid container >
            {searchText?.length>0 ? (
                <Grid item xs={12} md={itemsHelper.isOpen ? 7 : 12} className={isWidthUp('md',currentScreenSize) ? "pr-2" : "mb-3"} >
                     <Grid container spacing={2}>
                        {searchText && (
                            <Grid item xs={12}>
                                <Typography variant="h6" component="h6" className="text-left " style={{color: `rgba(82, 57, 112, 1)`}}>
                                    <strong>{`${t("Search result for")} : `}</strong>
                                    <span>{searchText?.slice(0,50)}</span>
                                </Typography>
                                <Typography variant="body1" component="span" className="text-left" style={{color: `rgba(255, 255, 255, 0.9)`}}>
                                    {`${t('Number of results')}: ${items?.length}`}
                                </Typography>
                                <EButton
                                    className='ml-3'
                                    eVariant='secondary'
                                         eSize='xsmall'
                                         onClick={()=>{
                                             setItemsHelper({isOpen: false, contentId: undefined});
                                             setSearchText('');
                                             navigate('/explore-courses');
                                         }}
                                >
                                    {t("Back")}
                                </EButton>
                            </Grid>
                        )}
                        <ItemsList items={items} itemsHelper={itemsHelper} setItemsHelper={setItemsHelper} takeCourse={takeCourse} allUserSessions={allUserSessions} _popularTeachers={popularTeachers}/>
                    </Grid>
                </Grid>
            ):(
                <Grid item xs={itemsHelper.isOpen ? 7 : 12}  >
                    {searchText?.length>0 ? (
                        <SearchExplore/>
                    ) : (
                        <MainExplore items={items}
                                     _popularTeachers={popularTeachers}
                                     itemsHelper={itemsHelper}
                                     setItemsHelper={setItemsHelper}
                                     takeCourse={takeCourse}
                                     allUserSessions={allUserSessions}
                                     setSearchText={setSearchText}
                        />
                    )}
                </Grid>
            )}
            {itemsHelper.isOpen && (
                <Grid item xs={12} md={5} >
                    <ItemDetails setItemsHelper={setItemsHelper} itemsHelper={itemsHelper} takeCourse={takeCourse} allUserSessions={allUserSessions}/>
                </Grid>
            )}

        </Grid>
    )
}