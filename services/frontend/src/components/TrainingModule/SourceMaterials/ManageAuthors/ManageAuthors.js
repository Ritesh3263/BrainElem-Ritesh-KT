import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import {Checkbox, FormControlLabel, FormGroup, ListSubheader} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchField from "components/common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "components/common/Table/TableSearch";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import SourceMaterialService from "services/source_material.service";
import Typography from "@material-ui/core/Typography";
import { theme } from "MuiTheme";

export default function ManageAuthors(props){
    const {
        manageAuthorsDrawerHelper,
        setManageAuthorsDrawerHelper,
        manageDrawerTypes,
        sourceMaterial,
        handleManageAssignedItems,
        tooltip10,
    } = props;
    const {t} = useTranslation();
    const {F_showToastMessage, F_handleSetShowLoader,F_getErrorMessage} = useMainContext();
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [bookAuthors, setBookAuthors] = useState([]);

    /**-------------------------------------------------------------**/

    useEffect(()=>{
        F_handleSetShowLoader(true);
        SourceMaterialService.readAllBookAuthors().then(res=>{
            if(res.status === 200 && res.data.length>0){
                updateSelected(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(error=>{
            console.error(error);
            F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
            F_handleSetShowLoader(false);
        });
    },[manageAuthorsDrawerHelper.openType,sourceMaterial.authors, sourceMaterial.publishers]);


    useEffect(()=>{
        setFilteredData(bookAuthors);
    },[bookAuthors]);

    const updateSelected=(couItems=[])=>{
        let modelItems=[];
        if(manageAuthorsDrawerHelper.openType === manageDrawerTypes.AUTHOR){
            modelItems = sourceMaterial?.authors??[];
        }else{
            modelItems = sourceMaterial?.publishers??[];
        }
        let selectedList = couItems?.map(co=>{
            modelItems?.map(chC=>{
                if(co._id === chC._id){
                    co.isSelected = true;
                }
            })
            return co;
        });
        setBookAuthors(selectedList);
    };


    const allAuthorsList = filteredData.map((item,index)=>(
        <FormControlLabel
            label={`${item?.name} ${item?.lastname}`}
            control={
                <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                          checked={!!item.isSelected}
                          name={item?.name}
                          value={index}
                          ref={tooltip10}
                          onClick={({target:{isOnBoarding=false}})=>{
                              if (isOnBoarding){
                                  setTimeout(()=>{
                                      setManageAuthorsDrawerHelper({isOpen: false, openType: manageDrawerTypes.AUTHOR});
                                  },300);
                              }
                          }}
                          onChange={(e,isS)=>{
                              if(isS){
                                  handleManageAssignedItems(
                                      manageAuthorsDrawerHelper.openType === manageDrawerTypes.AUTHOR ? manageDrawerTypes.AUTHOR : manageDrawerTypes.PUBLISHER,
                                      'ADD',
                                      item,)
                              }else{
                                  handleManageAssignedItems(
                                      manageAuthorsDrawerHelper.openType === manageDrawerTypes.AUTHOR ? manageDrawerTypes.AUTHOR : manageDrawerTypes.PUBLISHER,
                                      'REMOVE',
                                      item,)
                              }
                          }}
                />
            }
        />
    ));

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                backgroundColor: theme.palette.neutrals.white,
                maxWidth:"450px"
            }}}
            anchor="right"
            onOpen=""
            open={manageAuthorsDrawerHelper.isOpen}
            onClose={()=>{
                setManageAuthorsDrawerHelper({isOpen: false, openType: manageDrawerTypes.AUTHOR});
                setSearchingText('');
            }}
        >
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                        <Grid container  className="py-2">
                            <Grid item xs={12}>
                            <Typography variant="h3" component="h2" className="text-center text-justify mt-2" style={{fontSize:"32px"}}>
                                {`${t("Manage")} ${manageAuthorsDrawerHelper.openType === manageDrawerTypes.AUTHOR  ? t("authors") : t("publishers")}`}
                            </Typography>
                            </Grid>
                            <Grid item xs={12} className='px-3 mb-2'>
                                    <SearchField
                                        className="text-primary"
                                        value={searchingText}
                                        onChange={({target:{value}})=>{TableSearch(value, bookAuthors, setSearchingText, setFilteredData)}}
                                        clearSearch={()=>TableSearch('', bookAuthors, setSearchingText, setFilteredData)}
                                    />
                            </Grid>
                        </Grid>
                    </ListSubheader>}
            >
                <FormGroup className="pl-3">
                    {(allAuthorsList?.length>0) ? allAuthorsList : <span>{t("No data")}</span>}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}