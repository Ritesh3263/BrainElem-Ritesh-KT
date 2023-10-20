import React, {lazy, useEffect, useState} from "react";
import moduleCoreService from "../../services/module-core.service";
import {Link, useNavigate, useParams} from "react-router-dom"
import AuthService from "../../services/auth.service";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {useTranslation} from "react-i18next";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import CommonService from "../../services/common.service";
import {ListSubheader, Paper} from "@mui/material";
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import userService from "../../services/user.service";
import SearchField from "../common/Search/SearchField";
import DeepSearchFunction from "../common/Search/DeepSearchFunction";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@mui/material/Typography";
import { theme } from "MuiTheme";
import SettingsProfile from "./SettingsProfile/SettingsProfile";
import Periods from "../Period/Periods";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";




export default function ProfileSettings(){
    const { openParam } = useParams();
    const { t, i18n} = useTranslation();
    const navigate = useNavigate();
    const [currentUSer, setCurrentUser] = useState({});
    const [openSidebarDrawer, setOpenSidebarDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [allInterest,setAllInterest] = useState([]);
    const [userInterest, setUserInterest] = useState(null);
    const [user, setUser] = useState(null)

    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, F_setCurrentUser, F_reloadUser, F_handleSetShowLoader} = useMainContext();

    useEffect(()=>{
        if(openParam === 1){
            setTimeout(()=>{
                setOpenSidebarDrawer(true);
            },500)
        }
        setCurrentUser(AuthService.getCurrentUser());

        fetchUserData().then((data)=>{
            setTimeout(()=>{
                setUserInterests(data);
            },300)
        })
        setMyCurrentRoute("Profile settings")
    },[]);

    useEffect(()=>{
        setFilteredData(allInterest);
    },[openSidebarDrawer])

    async function fetchUserData(){
        let {data} = await userService.read(F_getHelper().user?.id)
        if(data) setUser(data)
        return data;
    }

    function setUserInterests(data){
        CommonService.getAllInterests().then(res2 => {
            let userSubinterests = data.details.subinterests ? data.details.subinterests : [];
            let userInt = [];
            if(res2.data){
                let newData = res2.data.map(interest=>{
                    interest.subinterests && interest.subinterests.map(subinterest=>{
                        let newData2 =subinterest;
                            newData2.isSelected = false;
                            userSubinterests.map(int=>{
                            if(subinterest._id === int){
                                newData2.isSelected = true;
                                userInt.push({_id: subinterest._id, name: subinterest.name, isSelected: true})
                            }
                        })
                        return newData2;
                    });
                    return interest;
                });
                setUserInterest(userInt);
                if(userInt.length <=0){
                    //setOpenSidebarDrawer(true)
                }
                setAllInterest(newData);
                setFilteredData(newData);
            }
        }).catch(error=>console.log(error))
    }


    function handleSubInterest(){
        let subInterestList = [];
        let interestList = [];
        if(allInterest){
            allInterest.map(interest=>{
                if(interest.subinterests){
                    interest.subinterests.map(subInterest=>{
                        if(subInterest.isSelected){
                            subInterestList.push(subInterest._id);
                            interestList.push({_id: subInterest._id, name: subInterest.name, isSelected: true})
                        }
                    });
                }
            })
            setUser(p=>{
                let val = Object.assign({},p);
                val.details.subinterests = subInterestList;
                return val;
            });
            setUserInterest(interestList);
        }
    }


    function saveData() {
        F_handleSetShowLoader(true)
        moduleCoreService.updateModuleUser(user).then(res=>{

            F_reloadUser(true)
            F_showToastMessage("User was changed successfully","success");
        }).catch(error=>console.error(error));

    }

    return(
        <>
            {user && <SettingsProfile
                user={user}
                setUser={setUser}
                setOpenSidebarDrawer={setOpenSidebarDrawer}
                userInterest={userInterest}
                saveData={saveData}
            />}
            <SwipeableDrawer
                onOpen=''
                PaperProps={{
                    style:{
                        backgroundColor: theme.palette.neutrals.white,
                        maxWidth:"450px"
                    }}}
                anchor="right"
                open={openSidebarDrawer}
                onClose={()=>{
                    setOpenSidebarDrawer(false)
                    setSearchingText('')
                }}
            >
                <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader0" hidden={false}>
                    <Grid container style={{ position: "relative", top:"0px", zIndex: 100, overflow:"hidden"}} className="py-2">
                        <Grid item xs={12}>
                            <Typography variant="h3" component="h2" className="text-left text-justify mt-2" style={{fontSize:"34px", color:new_theme.palette.primary.MedPurple}}>
                                {t("Manage interests")}
                            </Typography>
                            <Divider variant="insert" className='heading_divider' />
                        </Grid>
                        <Grid item xs={12} style={{marginTop:20}}>
                            <SearchField
                                
                                className="text-primary"
                                value={searchingText}
                                onChange={(e)=>{DeepSearchFunction(e.target.value, allInterest, setSearchingText, setFilteredData)}}
                                clearSearch={()=>DeepSearchFunction('', allInterest, setSearchingText, setFilteredData)}
                            />
                        </Grid>
                    </Grid>
                </ListSubheader>
                <List subheader={<li/>}>
                    {filteredData.length>0 ? filteredData.map((section, index)=>(
                        <li key={`section-${index}`}>
                            <ul className="p-0 text-center">
                                <ListSubheader style={{
                                                        fontSize:"22px", 
                                                        zIndex: 0, 
                                                        fontWeight:700, 
                                                        fontFamily:'Nunito', 
                                                        color: new_theme.palette.newSupplementary.NSupText, 
                                                        textAlign:'left'
                                                    }} 
                                    className="mt-0">{section.name}</ListSubheader>
                                {section.subinterests && section.subinterests.map((subInterest, ind)=>(
                                    <ListItem key={ind}>
                                        <ListItemIcon>
                                            <Checkbox
                                                className="sideDrawer-checkbox"
                                                edge="end"
                                                checked={!!subInterest.isSelected}
                                                tabIndex={ind}
                                                size="medium"
                                                color= {new_theme.palette.newSupplementary.NSupText}
                                                inputProps={{ 'aria-labelledby': ind }}
                                                onChange={()=>{
                                                    setAllInterest(p=>{
                                                        let val = Object.assign([],p);
                                                        let foundedIndex = allInterest.findIndex(i=> i._id === section._id);
                                                        let foundedSubindex = allInterest[foundedIndex].subinterests.findIndex(i=> i._id === subInterest._id);
                                                        val[foundedIndex].subinterests[foundedSubindex].isSelected = !val[foundedIndex].subinterests[foundedSubindex].isSelected ;
                                                        handleSubInterest(foundedIndex, foundedSubindex);
                                                        return val;
                                                    });
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={subInterest.name}/>
                                    </ListItem>
                                ))}
                            </ul>
                        </li>
                    )) : <span className="ml-5">{t("No Data")}</span>}

                </List>
            </SwipeableDrawer>
            {/* <Periods showPeriodDialog={showPeriodDialog} setShowPeriodDialog={setShowPeriodDialog}/>
            <Button variant="contained" color="primary" className="text-white" onClick={()=>{setShowPeriodDialog(true)} }>
                {t("Select Period")}
            </Button> */}
        </>
    )
}