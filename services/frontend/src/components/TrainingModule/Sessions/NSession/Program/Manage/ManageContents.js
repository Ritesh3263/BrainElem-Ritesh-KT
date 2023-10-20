import React, {useEffect, useState} from "react";
import {ESwipeableDrawer} from "styled_components";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import LibraryService from "services/library.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@material-ui/core/Typography";

export default function ManageContents(props){
    const { t } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const{
        manageContentHelper={isOpen: false, contentType: null},
        setManageContentHelper=()=>{},
        chosenContents=[],
        updateChapter =(type,payload)=>{},
    }=props;


    const [libraryContents, setLibraryContents] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(()=>{
        if(manageContentHelper.isOpen){
            switch(manageContentHelper.contentType){
                case 'PUBLIC':{
                    LibraryService.getAllPublicContents().then(res=>{
                        if(res.status===200){
                            setLibraryContents(res.data);
                            filterData(res.data,chosenContents);
                        }
                    }).catch(err=>console.log(err));
                    break;
                }
                case 'PRIVATE':{
                    LibraryService.getUserPrivateContent().then(res=>{
                        if(res.status===200){
                            setLibraryContents(res.data.allContents);
                            filterData(res.data.allContents,chosenContents);
                        }
                    }).catch(err=>console.log(err));
                    break;
                }
                case 'CO_CREATED':{
                    LibraryService.getUserCoCreatedContent().then(res=>{
                        if(res.status===200){
                            setLibraryContents(res.data.allContents);
                            filterData(res.data.allContents,chosenContents);
                        }
                    }).catch(err=>console.log(err));
                    break;
                }
                default: {
                 setLibraryContents([]);
                 break;
                }
            }
        }else {
            setLibraryContents([]);
        }
    },[manageContentHelper.isOpen]);


    const filterData=(libraryContent=[],chosenContents=[])=>{
        if(chosenContents.length>0){
            libraryContent.map(cont=>{
                cont.isSelected = false;
                if(chosenContents.some(({content:{_id, origin}})=> (_id === cont._id) || (origin === cont._id) )){
                    cont.isSelected = true;
                }
            });
        }
        setFilteredData(libraryContent)
    };


    const returnLibraryContentType=(type)=>{
        switch (type){
            case 'PUBLIC':{
                return t("Public content");
            }
            case 'PRIVATE':{
                return t("Private content");
            }
            case 'CO_CREATED':{
                return t("Co-created content");
            }
            default: return '-';
        }
    };

    const allLibraryContents = filteredData.map((item,index)=>(
        <FormControlLabel
            label={<div><span>{item?.title}</span><span className="text-right text-muted ml-4">{t("Level")} {`:  ${item?.level??"-"}`}</span></div>}
            control={
                <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                          checked={!!item?.isSelected}
                          name={item?.name}
                          value={index}
                          onChange={(e,isS)=>{
                                updateSelect(item);
                                if(isS){
                                    setFilteredData(p=>{
                                        let val = [...p];
                                        val[index].isSelected = true;
                                        return val;
                                    })
                                }else{
                                    setFilteredData(p=>{
                                        let val = [...p];
                                        val[index].isSelected = false;
                                        return val;
                                    })
                                }
                          }}
                />
            }
        />
    ));

    const updateSelect=(con)=>{
        if(con.isSelected){
            updateChapter('REMOVE',con._id);
        }else{
            let newObj={
                content:{
                    _id: con._id,
                    title: con.title,
                    contentType: con.contentType,
                }
            }
            updateChapter('ADD',newObj);
        }
    }


    return(
        <ESwipeableDrawer
            swipeableDrawerHelper={manageContentHelper}
            setSwipeableDrawerHelper={setManageContentHelper}
            header={t("Manage contents")}
            originalData={libraryContents}
            setFilteredData={setFilteredData}
        >
            <Typography variant="h5" component="h2" className="text-left mb-2" style={{color: `rgba(82, 57, 112, 1)`}}>
                {returnLibraryContentType(manageContentHelper.contentType)}
            </Typography>
            <FormGroup className="pl-3">
                {(allLibraryContents?.length>0) ? allLibraryContents : <span>{t("No data")}</span>}
            </FormGroup>
        </ESwipeableDrawer>
    )
}