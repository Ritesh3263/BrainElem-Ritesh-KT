import React, { lazy, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// MUIv5
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { ETab, ETabBar } from "styled_components";


import ListItem from "./ListItem";

import EMenuWithFilters from 'styled_components/MenuWithFilters';
import MenuElementsPerPage from "styled_components/MenuElementsPerPage";

// Icons
import { EIconButton } from "styled_components";
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as MoreIcon } from 'icons/icons_32/More_32.svg';


//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v4
import { theme } from "MuiTheme";

const ResultDialog = lazy(() => import("./ResultDialog"));

// Component for dislaying list of Events
// `title` - title displayed at the top of the list
// `events` - list of all events - Should be loaded by getEvents or getExams/getHomeworks
// `types` - types of events to display, each type has it's own tab
// `examinationAction` - `optional` - acttion for examination- by default it goes to `/examinate/${event._id}`
const List = ({ title = "Events", events, types = ['Online Class', 'Exam', 'Quiz', 'Homework', 'Certification'], examinationAction }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    // Used after clicking one of the elements
    const [activeEvent, setActiveEvent] = useState();

    const { F_getHelper, F_getLocalTime } = useMainContext();
    const { user, userPermissions } = F_getHelper()

    // Max elements for page
    const [maxPerPage, setMaxPerPage] = useState(3)

    // Events after applying filters
    const [filteredEvents, setFilteredEvents] = useState(events);
    // Element for opening filters
    const [filtersElement, setFiltersElement] = useState(null);
    const openFilters = Boolean(filtersElement);
    const [filters, setFilters] = useState([
        { key: "DATE", sorter: 1, name: t("Date"), values: [{ key: "NEWEST", name: t("Newest"), selected: 1 }, { key: "OLDEST", name: t("Oldest") }], single: true },
        { key: "STATUS", name: t("Status"), values: [{ key: "UPCOMING", name: t("Upcoming") }, { key: "CURRENT", name: t("Current") },{ key: "FINISHED", name: t("Finished") },{ key: "VERIFIED", name: t("Verified") },{ key: "PUBLISHED", name: t("Published") }], }
    ])


    // Open dialog with single result - used for trainees when opening gradebooks exams
    const [openResultDialog, setOpenResultDialog] = useState(false);
    const [activeResult, setActiveResult] = useState();


    // Get name of tab from event type
    const getTabNameFromType = (type) => {
        let tabName = type;
        if (type == 'Online Class') tabName = "Classes"
        else if (type == 'Quiz') tabName = "Quizes"
        else {
            tabName = type.toLowerCase() + "s"
            tabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
        }
        return t(tabName);
    }


    // APPLY FILTERS 
    useEffect(() => {
        // Select proper type of events based on activeTab
        let filtered = [...events].filter(e => e.eventType.toLowerCase() == types[activeTab].toLowerCase())

        // Apply filters
        let dateFilter = filters.find(f => f.key == "DATE")
        if (dateFilter) {
            let selectedDateFilter = dateFilter.values.find(v => v.selected)
            if (selectedDateFilter?.key == "OLDEST") {
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
            } else if (selectedDateFilter?.key == "NEWEST") {
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
            }
        }

        let statusFilter = filters.find(f => f.key == "STATUS")
        if (statusFilter) {
            let selectedStatusFilterKeys = statusFilter.values.filter(v => v.selected).map(v => v.key)
            if (selectedStatusFilterKeys.length) {
                filtered = filtered.filter(e => selectedStatusFilterKeys.includes(e.status))
            }
        }

        setFilteredEvents(filtered.slice(0, maxPerPage))
    }, [filters, activeTab, maxPerPage])

    useEffect(() => {
        if (activeEvent && userPermissions.isTrainee && !activeEvent.assignedContent) {
            setOpenResultDialog(true)
            let result = activeEvent.results.find(r => r.user == user.id)
            setActiveResult(result)
        }
    }, [activeEvent])

    return (
        <>
            <Grid container sx={{ maxWidth: '530px', background: theme.palette.glass.opaque, p: '8px', borderRadius: '8px', backdropFilter: 'blur(10px)', alignContent: 'flex-start' }}>
                <Grid container item xs={12} sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <Typography sx={{ ...theme.typography.h, fontSize: 24 }}>{title}</Typography>
                    <EIconButton size="small" color="secondary" onClick={(e) => { setFiltersElement(e.currentTarget) }}>
                        <SvgIcon sx={{ transform: 'scale(0.8)' }} viewBox="0 0 32 32" component={MoreIcon} />
                    </EIconButton>
                    <EMenuWithFilters
                        filters={filters} setFilters={setFilters}
                        anchorEl={filtersElement}
                        open={openFilters}
                        onClose={() => { setFiltersElement(null) }}
                    />

                </Grid>
                <Box sx={{ py: '16px' }}>
                    <ETabBar
                        value={activeTab}
                        onChange={(e, i) => { setActiveTab(i) }}
                        eSize='xsmall'
                    >
                        {types.map((type,index) => {
                            let exists = events.filter(e => e.eventType == type).length > 0
                            return <ETab key={index} style={{ minWidth: '115px' }} label={getTabNameFromType(type)} eSize='xsmall' />
                        })}
                    </ETabBar>
                </Box>
                {filteredEvents.map((event, index) =>
                    <Grid key={index} item xs={12} sx={{ pb: '12px' }}>
                        <ListItem event={event} examinationAction={examinationAction} activeEvent={activeEvent} setActiveEvent={setActiveEvent}></ListItem>
                    </Grid>
                )}
                <MenuElementsPerPage maxPerPage={maxPerPage} setMaxPerPage={setMaxPerPage}></MenuElementsPerPage>
            </Grid>

            <ResultDialog result={activeResult} sx={{ '& .MuiDialog-paper': { background: theme.palette.glass.opaque } }}
                open={openResultDialog}
                onClose={() => { setOpenResultDialog(false); setActiveEvent(undefined) }}>
            </ResultDialog>
        </>
    )
}

export default List;