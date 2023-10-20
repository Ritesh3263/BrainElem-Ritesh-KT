import React, { useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Styled components
import { EDataGrid, EButton, ETextField, ESelect } from "styled_components";
import EBadge from "styled_components/Badge";
import ELegend from 'styled_components/Legend';
import OptionsButton from "components/common/OptionsButton";
import EIconButton from 'styled_components/EIconButton';

// Icons
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

//Services
import ResultService from "services/result.service";
import EventService from "services/event.service";
import ContentService from "services/content.service";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI v5
import { styled } from '@mui/material/styles';
import { IconButton, Typography } from '@mui/material';
import { Grid } from '@mui/material';

// MUI v4
import { theme } from 'MuiTheme'
import { NewEDataGrid } from 'new_styled_components';
import { new_theme } from 'NewMuiTheme';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';



const palette = theme.palette


function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const StyledDataGrid = styled(EDataGrid)({
    "& .MuiDataGrid-row": {
        border: "none",
        background: "transparent",
    },
})

export default function GroupExaminationTableWithActions({ examinedAttendeesResultsPreview, content, event, reloadData = () => { } }) {
    const { F_getHelper, F_getErrorMessage, F_showToastMessage, F_handleSetShowLoader, F_formatSeconds, F_getLocalTime } = useMainContext();
    const { userPermissions } = F_getHelper();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [possibleToPublish, setPossibleToPublish] = useState([]);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const isMdUp = useIsWidthUp("md");

    // Update number of marked results which are possible to be published
    useEffect(() => {
        let count = 0;
        for (let rowId of selectionModel) {
            let row = rows.find(r => r.id == rowId);
            if (row.status == 2) count++;
        }
        setPossibleToPublish(count)
    }, [selectionModel, rows]);


    const examinedAttendeesResultsPreviewList = examinedAttendeesResultsPreview.length > 0 ? examinedAttendeesResultsPreview.map((item, index) =>
    {
        // If test was checked/verified
        let needManualVerification = !ContentService.isChecked(content, item.assignedPoints)

        let passed = '-'
        if (item.user?.passed !== undefined){
            passed = item.user.passed ? t("Passed") : t("Failed")
        }

        let grade = item.grade ? item.grade : ""
        let points = item.points ? item.points : "-"
        let percentage = item.percentage ? item.percentage : "-"


        if (needManualVerification){
            passed = '-'
            grade = '-'
            points = '-'
            percentage = '-'
        }

        return {
        id: index + 1,
        name: item.user && item.user.name ? `${item.user.name} ${item.user.surname}` : "-",
        attempts: item.user && item.user.attempts ? item.user.attempts : '-',
        passed: passed,
        status: item.status,
        statusColor: [palette.neutrals.darkGrey, 'warning', 'success', 'info'][item.status],
        timeSpent: item.timeSpent ? F_formatSeconds(item.timeSpent) : "-",
        grade: grade,
        percentage: percentage,
        comment: item.comment ? item.comment : '',
        points: points,
        traineeId: item.user._id,
        resultId: item?._id,
    }}) : [];

    useEffect(() => {
        setRows(examinedAttendeesResultsPreviewList);
    }, [examinedAttendeesResultsPreview]);

    const buttons = [
        { id: 1, name: t("Allow selected to retake the test"), disabled: !(content), action: () => { allowExtraAttempt() } },
        { id: 2, name: t("Allow all students to retake the test"), disabled: !(content), action: () => { allowExtraAttempt(true) } }
    ]


    // Allow extra attempt
    async function allowExtraAttempt(all = false) {
        F_handleSetShowLoader(true)
        var attendeesIds = []
        if (all) attendeesIds = rows.filter(r => { return (r.attempts) }).map(r => r.traineeId)
        else {
            for (let rowId of selectionModel) {
                let row = rows.find(r => r.id == rowId);
                attendeesIds.push(row.traineeId)
            }
        }

        for (let traineeId of attendeesIds) {
            let service = event ? EventService : ContentService
            let object = event ? event : content
            try {
                await service.allowExtraAttempt(object._id, traineeId)
            } catch (error) {
                console.error(error)
                F_showToastMessage(t('Could not allow extra attempt for one of the users'), 'error')
            }
        }
        F_handleSetShowLoader(false)
        F_showToastMessage(t('Allowed extra attempt'), 'success')
    }

    // Publish selected results if they are verified
    async function publish() {
        F_handleSetShowLoader(true)
        for (let rowId of selectionModel) {
            let row = rows.find(r => r.id == rowId);
            // If verified but not published
            if (row.status == 2) {
                let data = { published: true, publishedAt: ((new Date()).toISOString()), sendMail: false }
                try {
                    await ResultService.update({ _id: row.resultId, ...data })
                } catch (error) {
                    console.error(error)
                    F_showToastMessage(t('Could not publish result for') + ` ${row.name}`, 'error')
                }
            }
        }
        reloadData(event._id)
        F_handleSetShowLoader(false)
        F_showToastMessage(t('Result have been published'), 'success')


    }


    const stopPropagationOfKeys = (e) => {

        e.stopPropagation();
    }

    // Update result in database
    let saveResult = (rowId, resultId, data, errorCallback = () => { }) => {
        F_handleSetShowLoader(true)
        // If no resultId, then add action
        if (!resultId) {
            let row = rows.find(r => r.id == rowId)
            var saveAction = ResultService.add({result: { ...data, user: row.traineeId, event: event._id }})
        } else {
            var saveAction = ResultService.update({ _id: resultId, ...data })
        }

        saveAction.then(
            (response) => {
                F_showToastMessage(t('Saved sucessfully!'), 'success')
                F_handleSetShowLoader(false)
                reloadData(event._id)
            },
            (error) => {
                F_handleSetShowLoader(false)
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
                errorCallback()
            }
        )
    }

    const columns = [
        // { field: 'id', headerName: 'ID', width: 70, hide: false, flex: 1},
        { field: 'name', headerName: t('Full name'), minWidth: 150, flex: 1 },
        { field: 'status', headerName: t('Status'), minWidth: 50, sortable: false, disableColumnMenu: true, renderCell: (params) => (<EBadge ecolor={params.row.statusColor} sx={{ ml: 2 }} variant="dot" />) },
        {
            field: 'grade', headerName: t('Grade'), minWidth: content ? 50 : 80, sortable: false, disableColumnMenu: true, renderCell: (params) => {
                if (content) return <>{params.row.grade}</>
                else return <ETextField size='small'
                    hiddenLabel
                    autoComplete={false}

                    onFocus={event => {
                        event.target.select();
                    }}
                    onClick={event => {
                        event.target.select();
                    }}
                    localValue={params.row.grade}
                    localOnBlur={(event, localValue, setLocalValue) => {
                        setLocalValue(event.target.value)
                        saveResult(params.row.id, params.row.resultId, { grade: event.target.value },
                            () => {
                                setLocalValue(params.row.grade)
                            })
                    }}
                    onKeyDown={(e) => stopPropagationOfKeys(e)}

                >
                </ETextField>
            }
        },
        {
            field: 'comment', headerName: t('Comment'), minWidth: 120, flex: 1, sortable: false, disableColumnMenu: true, renderCell: (params) => {
                return <ETextField size='small'
                    hiddenLabel
                    autoComplete={false}
                    onKeyDown={(e) => stopPropagationOfKeys(e)}
                    onFocus={event => {
                        event.target.select();
                    }}
                    onClick={event => {
                        event.target.select();
                    }}
                    localValue={params.row.comment}
                    localOnBlur={(event, localValue, setLocalValue) => { saveResult(params.row.id, params.row.resultId, { comment: event.target.value }) }}
                >
                </ETextField>
            }
        },
        { field: 'passed', headerName: t('Result'), minWidth: 80, flex: 1, sortable: false, disableColumnMenu: true },
        { field: 'points', headerName: t('Points'), type: "number", minWidth: 80, sortable: false, disableColumnMenu: true},
        { field: 'percentage', headerName: t('Percentage'), type: "number", minWidth: 150, flex: 1, renderCell: (params) => (params.row.percentage !== "-") ? `${params.row.percentage.toFixed(2)}%` : "-", sortable: false, disableColumnMenu: true },
        { field: 'timeSpent', headerName: t('Time'), minWidth: 80, flex: 1, sortable: false, disableColumnMenu: true },
        { field: 'attempts', headerName: t('No. of attempts'), minWidth: 180, sortable: false, disableColumnMenu: true },
        {
            field: 'action',
            headerName: t('Actions'),
            minWidth: 100,
            sortable: false,
            hide: userPermissions.isInspector,
            disableColumnMenu: true,
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderCell: (params) => (
                <>
                    <StyledEIconButton color="primary" size="medium" onClick={() => {
                                                if (event) navigate(`/examinate/${event._id}/${params.row.traineeId}`)
                                                else if (content) navigate(`/examinate/content/${content._id}/${params.row.traineeId}`)
                                            }}>
                        <ChevronRightIcon />
                        {/* TODO: add authorization for seeing results of attendees as trainer, same view as: http://localhost/results/444444444444444444444444 (for classmanager1)  */}
                    </StyledEIconButton>
                </>
            )
        }
    ];


    return (
        <div>
            {/* <Grid container sx={{ justifyContent: 'space-between' }}>
                <Grid item xs={12} >
                    <Typography sx={{ mt: 3, fontSize: "16px", textAlign: "left" }} variant="h3" component="h3">
                        {t('Students’ list')}
                    </Typography>
                </Grid>
                {(!content || content.contentType != "PRESENTATION") &&
                <Grid container item xs={12} sx={{ justifyContent: 'end', mt: 2, flexWrap: 'nowrap', alignItems: 'center' }}>
                    {event && <EButton disabled={!possibleToPublish} sx={{ justifyContent: 'end', mr: 2 }} eSize='small' eVariant='primary'
                        onClick={() => { publish() }}
                    >{t('Publish results') + (possibleToPublish ? ` (${possibleToPublish})` : '')}
                    </EButton>}
                    <OptionsButton sx={{ mr: 2 }} iconButton={true} btns={buttons} />
                </Grid>}
            </Grid> */}
            <div style={{ height: "100%", borderRadius: "8px", backgroundColor: theme.palette.shades.white30 }} >
                <NewEDataGrid sx={{ mt: 2 }}
                    rows={rows}
                    setRows={setRows}
                    checkboxSelection={true}
                    columns={columns}
                    originalData={examinedAttendeesResultsPreviewList}
                    isVisibleToolbar={true}
                    onSelectionModelChange={(newSelectionModel) => { setSelectionModel(newSelectionModel); }}
                    selectionModel={selectionModel}
                    columnVisibilityModel={{
                        // Hide columns when screen is small
                        status: Boolean(event && (!content || content.contentType != "PRESENTATION")),
                        comment: Boolean(!content),
                        grade:  Boolean(event && (!content || content.contentType != "PRESENTATION")),
                        passed: Boolean(isMdUp && (content && content.contentType != "PRESENTATION")),
                        percentage: Boolean(isMdUp && (content && content.contentType != "PRESENTATION")),
                        points: Boolean(isMdUp && (content && content.contentType != "PRESENTATION")),
                        timeSpent: Boolean(isMdUp && content),
                        attempts: Boolean(isMdUp && content),
                        action: Boolean(content)

                    }}
                />
            </div>
            {/* {(event && (!content || content.contentType != "PRESENTATION")) && <ELegend elements={[
                { prefix: t("Status") + ":", name: t("No data"), ecolor: palette.neutrals.darkGrey },
                { prefix: t("Status") + ":", name: t("To do"), ecolor: "warning" },
                { prefix: t("Status") + ":", name: t("Verified"), ecolor: "success" },
                { prefix: t("Status") + ":", name: t("Published"), ecolor: "info" },
            ]}></ELegend>} */}

        </div>
    );
}
