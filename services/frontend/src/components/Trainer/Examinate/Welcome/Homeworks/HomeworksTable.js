import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPencil } from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import { EDataGrid } from "styled_components";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { isWidthUp } from "@material-ui/core/withWidth";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const useStyles = makeStyles(theme => ({}))

export default function HomeworksTable(props) {
    const {
        homeworks = [],
    } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const { currentScreenSize, F_getHelper, F_getLocalTime } = useMainContext();
    const { userPermissions } = F_getHelper();

    const homeworksList = homeworks.length > 0 ? homeworks.map((item, index) =>
    ({
        id: index + 1,
        name: item.name,
        assignedSubject: item.assignedSubject && item.assignedSubject.name ? item.assignedSubject.name : "-",
        assignedChapter: item.assignedChapter && item.assignedChapter.name ? item.assignedChapter.name : "-",
        assignedGroup: item?.assignedGroup && item.assignedGroup.name ? item.assignedGroup.name : "-",
        examDate: item.date ? item.date : "-",
        assignedGroupId: item?.assignedGroup?._id,
        assignedContentId: item?.assignedContent?._id,
        eventId: item?._id,
    })) : [];

    useEffect(() => {
        setRows(homeworksList);
    }, [homeworks]);

    const isColumnVisible = () => {
        return !isWidthUp('md', currentScreenSize);
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false },
        { field: 'name', headerName: t('Homework name'), width: 120, flex: 1 },
        { field: 'assignedSubject', headerName: t('Assigned subject'), width: 120, flex: 1, hide: isColumnVisible() },
        { field: 'assignedChapter', headerName: t('Assigned chapter'), width: 120, flex: 1, hide: isColumnVisible(), },
        { field: 'assignedGroup', headerName: t('Class name'), width: 120, flex: 1 },
        {
            field: 'examDate', headerName: t('Homework date'), width: 120, type: 'date', flex: 1, hide: isColumnVisible(),
            renderCell: (params) => params.row.examDate ? (F_getLocalTime(params.row.examDate, true)) : ("-")
        },
        {
            field: 'action',
            headerName: '',
            width: 50,
            sortable: false,
            hide: userPermissions.isParent,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderCell: (params) => (
                <IconButton size="small" color="secondary"
                    disabled={false} onClick={() => { navigate(`/examinate/${params.row.eventId}`) }}><BsPencil />
                </IconButton>
            )
        }
    ];


    return (

        <EDataGrid sx={{ px: 2, pt: 0 }}
            rows={rows}
            setRows={setRows}
            columns={columns}
            originalData={homeworksList}
            isVisibleToolbar={false}
        />

    )
}