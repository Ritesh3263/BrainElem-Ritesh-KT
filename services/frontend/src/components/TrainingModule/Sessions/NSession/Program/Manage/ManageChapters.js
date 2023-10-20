import React, {useEffect, useState} from "react";
import {ESwipeableDrawer} from "styled_components/index";
import {useTranslation} from "react-i18next";
import ModuleCoreService from "services/module-core.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import ListItemButton from "@mui/material/ListItemButton";
import {Collapse, ListItemText, Typography} from "@mui/material";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";

export default function ManageChapters(props){
    const { t } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const{
        manageChaptersHelper={isOpen: false},
        setManageChaptersHelper=()=>{},
        chosenChapters=[],
        setCurrentCourseObject=()=>{},
    }=props;

    const [filteredData, setFilteredData] = useState([]);
    const [openIndex, setOpenIndex] = useState(undefined);
    const [trainingModules, setTrainingModules] = useState([]);

    const fetchData=async()=>{
        await ModuleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            if (res.status===200 && res.data && res.data.trainingModules.length>0){
                setTrainingModules(res.data.trainingModules);
                return res.data.trainingModules;
            }
        }).catch(err=>console.log(err));
    }

    useEffect(()=>{
        if(manageChaptersHelper.isOpen){
            fetchData().then((trainingModules)=>{
                filterData(trainingModules, chosenChapters)
            });
        }
    },[manageChaptersHelper.isOpen]);

    useEffect(()=>{
        setOpenIndex(undefined);
        filterData(trainingModules, chosenChapters);
    },[trainingModules]);

    const filterData=(trainingModules=[], chosenChapters=[])=>{
        // filter isSelected
        // console.log("chosenChapters=>",chosenChapters)
        //console.log("trainingModules=>",trainingModules)
        // chosenChapters orginalId ?
        if(chosenChapters.length>0){
            trainingModules.map(({chapters=[]})=>{
                chapters.map(chapter=>{
                    chapter.isSelected = false;
                    if(chosenChapters.some(({chapter:{_id, origin}})=> (_id === chapter._id ) || (origin === chapter._id))){
                        chapter.isSelected = true;
                    }
                })
            });
        }
        setFilteredData(trainingModules);
    };

    const updateSelect=(ch)=>{
        if(ch.isSelected){
            setCurrentCourseObject(p=>({...p, chosenChapters: p.chosenChapters.filter(({chapter:{_id,origin}})=> {
                if(origin){
                    return  origin !== ch._id
                }else{
                    return _id !== ch._id
                }
                } )}));
        }else{
            let newObj = {
                chapter: {
                    _id: ch._id,
                    name: ch.name,
                    description: ch.description,
                },
                chosenContents: [],//ch.assignedContent,
            };

            setCurrentCourseObject(p=>({...p, chosenChapters: [...p.chosenChapters,newObj]}));
            //filterData(trainingModules, [...chosenChapters, newObj])
        }
    }

    const allTrainingModulesList = filteredData.map((tr,index)=>(
        <div key={index}>
            <ListItemButton onClick={()=>{setOpenIndex(p=> (p !== index) ? index : undefined)}}>
                <ListItemText primary={
                    <Typography variant="body1" component="span" sx={{ fontWeight: "bold", color: `rgba(82, 57, 112, 1)` }}>
                        {tr?.name} + {"asdfasdf"}
                    </Typography>
                }
                              className="text-center"/>
                {(openIndex === index) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {(tr?.chapters?.length>0) ? tr.chapters.map((ch,ind)=>(
                <Collapse in={openIndex === index} timeout="auto" unmountOnExit key={ind}>
                    <List component="div" disablePadding>
                        <FormControlLabel label={<><span>{ch?.name}</span> <span className="text-muted ml-4">{t("Time")} {`:  ${ch?.durationTime??"-"} [h]`}</span></>}
                                          control={
                                              <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                                                        checked={!!ch?.isSelected}
                                                        name={ch?.name}
                                                        value={index}
                                                        onChange={(e,isS)=>{
                                                            updateSelect(ch);
                                                            if(isS){
                                                                setFilteredData(p=>{
                                                                    let val = [...p];
                                                                    val[index].chapters[ind].isSelected = true;
                                                                    return val;
                                                                })
                                                            }else{
                                                                setFilteredData(p=>{
                                                                    let val = [...p];
                                                                    val[index].chapters[ind].isSelected = false;
                                                                    return val;
                                                                })
                                                            }
                                                        }}
                                              />
                                          }
                        />
                    </List>
                </Collapse>
            )):[]}
        </div>
    ));

    return(
            <ESwipeableDrawer
                swipeableDrawerHelper={manageChaptersHelper}
                setSwipeableDrawerHelper={setManageChaptersHelper}
                header={t("Manage chapters")}
                originalData={trainingModules}
                setFilteredData={setFilteredData}
            >
                <FormGroup className="pl-3">
                    {(allTrainingModulesList?.length>0) ? allTrainingModulesList : <span>{t("No data")}</span>}
                </FormGroup>
            </ESwipeableDrawer>
    )
}