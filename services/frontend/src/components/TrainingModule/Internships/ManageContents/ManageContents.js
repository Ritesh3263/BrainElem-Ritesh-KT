import React, {useEffect, useState} from "react";
import {ESwipeableDrawer} from "styled_components";
import {FormControlLabel, FormGroup, Radio} from "@material-ui/core";
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
        chosenContent={},
        updateAssignments =(type,payload)=>{},
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
                            filterData(res.data,chosenContent);
                        }
                    }).catch(err=>console.log(err));
                    break;
                }
                case 'PRIVATE':{
                    LibraryService.getUserPrivateContent().then(res=>{
                        if(res.status===200){
                            setLibraryContents(res.data.allContents);
                            filterData(res.data.allContents,chosenContent);
                        }
                    }).catch(err=>console.log(err));
                    break;
                }
                case 'CO_CREATED':{
                    LibraryService.getUserCoCreatedContent().then(res=>{
                        if(res.status===200){
                            setLibraryContents(res.data.allContents);
                            filterData(res.data.allContents,chosenContent);
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


    const filterData=(libraryContent=[],chosenContent={})=>{
            libraryContent.map(cont=> {
                cont.isSelected = cont._id === chosenContent?._id;
            });
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
            key={index}
            label={<div><span>{item?.title}</span><span className="text-right text-muted ml-4">{t("Level")} {`:  ${item?.level??"-"}`}</span></div>}
            control={
                <Radio
                    checked={!!item.isSelected}
                    style={{width: '20px', height: '20px', color: `rgba(82, 57, 112, 1)`, marginRight: '10px'}}
                    onChange={(e,isS)=>{
                        setLibraryContents(p=>{
                            return p.map(c=>{
                                c.isSelected = false;
                                if (c._id === item?._id) {
                                    c.isSelected = true;
                                }
                                return c;
                            })
                        });
                        updateAssignments('ADD',item);
                    }}
                />
            }
        />
    ));


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