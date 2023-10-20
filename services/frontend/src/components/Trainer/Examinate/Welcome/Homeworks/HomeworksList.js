import React, { useEffect, useState } from "react";
import EventService from "services/event.service";
import { useTranslation } from "react-i18next";
import HomeworksTable from "./HomeworksTable";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import { now } from "moment";
import EventModal from "components/Calendar/helpers/EventModal";

// MUI v5
import { Typography, Grid } from "@mui/material";
import EButton from "styled_components/Button";
// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette



export default function HomeworksList() {
    const { t } = useTranslation();
    const [homeworks, setHomeworks] = useState([]);
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { userPermissions } = F_getHelper();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [fromContentDataForEvent, setFromContentDataForEvent] = useState(null);
    const [eventInfo, setEventInfo] = useState({
        type: "ADD_FROM_GRADEBOOK",
        date: new Date(now()).toISOString(),
        eventType: "Exam",
        assignedGroup: "",
        assignedSubject: ""
    });

    useEffect(() => {
        if (!isOpenModal) {
            EventService.getHomeworks().then(res => {
                setHomeworks(res.data)
            })
        }
    }, [isOpenModal]);


    async function updateEvent({ type, data }) {
        let newData = { ...data, addedFromGradebook: false }
        switch (type) {
            case "add": {
                await EventService.add(newData).then(res => {
                    F_showToastMessage("Event was added success", "success");
                }).catch(error => console.log(error))
                break;
            }
            default: break;
        }
    }

    return (<>
        <div style={{ width: 'auto', height: 'auto', borderRadius: "8px", backgroundColor: theme.palette.shades.white30 }} >
            <Grid container justifyContent='space-between'>
                <Grid>
                    <Typography sx={{ px: 2, pt: 2 }} component="h5" style={{ color: palette.primary.darkViolet }}>
                        {t("List of homeworks")}
                    </Typography>
                </Grid>
                <Grid sx={{ p: 2 }}>
                    {(!userPermissions.isInspector && !userPermissions.isParent) && <>
                        <EButton eVariant='secondary' eSize='small'
                            onClick={() => {
                                setIsOpenModal(true);
                                setEventInfo(p => ({ ...p, eventType: "Homework" }))
                            }}
                        >
                            {t("Add homework")}
                        </EButton>
                    </>}
                </Grid>
            </Grid>
            <HomeworksTable homeworks={homeworks} />
        </div>


        <EventModal isOpen={isOpenModal}
            setOpen={setIsOpenModal}
            eventInfo={eventInfo}
            eventAction={updateEvent}
            fromContentDataForEvent={fromContentDataForEvent}
            setFromContentDataForEvent={setFromContentDataForEvent}
        />
    </>

    )
}