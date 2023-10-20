import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../../../../_ContextProviders/SessionProvider/SessionProvider";
import ExaminersTable from "./ExaminersTable";
import ExaminerPreview from "./ExaminerPreview";
import { ThemeProvider, Typography, Grid, Box } from "@mui/material";
import { Button, Checkbox, FormControlLabel, FormGroup, ListSubheader, Paper } from "@material-ui/core";
import StyledButton from "new_styled_components/Button/Button.styled";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import SearchField from "../../../../../common/Search/SearchField";
import TableSearch from "../../../../../common/Table/TableSearch";
import CompanyService from "../../../../../../services/company.service";
import moduleCoreService from "../../../../../../services/module-core.service";
import { useMainContext } from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { theme } from "../../../../../../MuiTheme";
import { new_theme } from "NewMuiTheme";
import "../Certificate.scss";

export default function Examiners() {
    const { t } = useTranslation();
    const [examinerPreviewHelper, setExaminerPreviewHelper] = useState({ isOpen: false, examinerId: undefined });
    const { F_getHelper } = useMainContext();
    const { userPermissions } = F_getHelper();
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);
    const [allExaminers, setAllExaminers] = useState([]);
    const {
        currentSession,
        sessionReducerActionsType,
        sessionDispatch,
    } = useSessionContext();

    useEffect(() => {
        setFilteredData(allExaminers)
    }, [allExaminers]);

    useEffect(() => {
        if (currentSession?.module) {
            moduleCoreService.readAllModuleTrainers(currentSession?.module).then(res => {
                if (res?.status === 200 && res?.data?.length > 0) {
                    updateSelect(res.data);
                }
            }).catch(err => console.log(err));
        }
    }, [currentSession?.examiners]);


    const updateSelect = (trItems = []) => {
        let selectedList = trItems?.map(co => {
            currentSession?.examiners?.length > 0 && currentSession?.examiners?.map(chC => {
                if (co._id === chC._id) {
                    co.isSelected = true;
                }
            });
            return co;
        });
        setAllExaminers(selectedList);
    };

    const allExaminersList = filteredData.map((exa, index) => (
        <FormControlLabel
            label={`${exa?.name} ${exa?.surname}`}
            control={
                <Checkbox style={{ color: new_theme.palette.secondary.DarkPurple }}
                    checked={!!exa?.isSelected}
                    name={exa?.name}
                    value={index}
                    onChange={(e, isS) => {
                        if (isS) {
                            sessionDispatch({
                                type: sessionReducerActionsType.UPDATE_EXAMINERS,
                                payload: { type: 'ADD', examiner: exa }
                            })
                        } else {
                            sessionDispatch({
                                type: sessionReducerActionsType.UPDATE_EXAMINERS,
                                payload: { type: 'REMOVE', examinerId: exa._id }
                            })
                        }
                    }}
                />
            }
        />
    ));

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container>
                {userPermissions.isTrainingManager && (
                    <Grid item xs={12}>
                        <Button variant="contained" size="small" color="secondary" onClick={() => { setIsOpenSidebar(true) }}>
                            {t("Manage examiners")}
                        </Button>
                    </Grid>
                )}
                {!examinerPreviewHelper.isOpen && <>
                    <Grid item xs={12} className="p-3">
                        <ExaminersTable setExaminerPreviewHelper={setExaminerPreviewHelper}
                            assignedExaminers={currentSession?.examiners}
                        />
                    </Grid>
                </>}

                {examinerPreviewHelper.isOpen && examinerPreviewHelper.examinerId && (
                    <Grid item xs={12} className='mt-4'>
                        <ExaminerPreview
                            examinerPreviewHelper={examinerPreviewHelper}
                            setExaminerPreviewHelper={setExaminerPreviewHelper}
                            currentSession={currentSession?.name}
                        />
                    </Grid>
                )}
                <SwipeableDrawer
                    PaperProps={{
                        style: {
                            backgroundColor: theme.palette.neutrals.white,
                            maxWidth: "450px"
                        }
                    }}
                    anchor="right"
                    onOpen=""
                    open={isOpenSidebar}
                    onClose={() => {
                        setIsOpenSidebar(false);
                        setSearchingText('');
                    }}
                >
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                                <Grid container className="py-2">
                                    <Grid item xs={12}>
                                        <Typography variant="h3" component="h2" className="mt-2 text-center text-justify" style={{ fontSize: "32px" }}>
                                            {t("Manage examiners")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} className='px-3 mb-2'>
                                        <SearchField
                                            className="text-primary"
                                            value={searchingText}
                                            onChange={({ target: { value } }) => { TableSearch(value, currentSession?.examiners, setSearchingText, setFilteredData) }}
                                            clearSearch={() => TableSearch('', currentSession?.examiners, setSearchingText, setFilteredData)}
                                        />
                                    </Grid>
                                </Grid>
                            </ListSubheader>}
                    >
                        <FormGroup className="pl-3">
                            {(allExaminersList?.length > 0) ? allExaminersList : <span>{t("No data")}</span>}
                        </FormGroup>
                    </List>
                </SwipeableDrawer>
            </Grid>
        </ThemeProvider>
    )
}