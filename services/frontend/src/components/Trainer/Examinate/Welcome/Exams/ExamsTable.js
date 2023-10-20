import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isWidthUp } from "@material-ui/core/withWidth";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { NewEDataGrid } from "new_styled_components";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import ListItemButton from "components/Item/Event/ListItemButton";

export default function ExamsTable(props) {
    const {
        exams = [],
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        currentSession,
    } = useSessionContext() || {};
    
    const { currentScreenSize, F_getHelper, F_getLocalTime } = useMainContext();
    const { userPermissions, user } = F_getHelper();
    const [rows, setRows] = useState([]);

    const isColumnVisible = () => {
        return !isWidthUp('md', currentScreenSize);
    }

    const examsList = exams.length > 0 ? exams.map((item, index) =>
    ({
        id: index + 1,
        name: item?.name ?? "-",
        assignedSubject: item.assignedSubject && item.assignedSubject.name ? item.assignedSubject.name : "-",
        eventType: item.eventType ? item.eventType === 'Exam' ? 'Exam online' : item.row.eventType : '-',
        assignedChapter: item.assignedChapter && item.assignedChapter.name ? item.assignedChapter.name : "-",
        assignedGroup: item.assignedGroup && item.assignedGroup.name ? item.assignedGroup.name : "-",
        examDate: item?.date ?? "-",
        assignedGroupId: item.assignedGroup ? item.assignedGroup._id : "-",
        assignedContentId: item.assignedContent && item.assignedContent._id ? item.assignedContent._id : "-",
        event: item,
        _id: item?._id,
    })) : [];

    useEffect(() => {
        setRows(examsList);
    }, [exams]);

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 50, hide: false, disableColumnMenu: true, sortable: false },
        { field: 'name', headerName: t('Quiz name'), minWidth: 120, flex: 1 },
        { field: 'assignedSubject', headerName: t('Status'), minWidth: 120, flex: 1, hide: isColumnVisible() },
        { field: 'eventType', headerName: t('Exam type '), minWidth: 120, flex: 1, hide: isColumnVisible(), },
        {
            field: 'examDate', headerName: t('Start date'), minWidth: 120, type: 'date', flex: 1, hide: isColumnVisible(),
            renderCell: (params) => params.row.examDate ? (F_getLocalTime(params.row.examDate, true)) : ("-")
        },
        {
            field: 'action',
            headerName: t('Actions'),
            minWidth: 50,
            sortable: false,
            hide: userPermissions.isParent,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderCell: (params) => (
                // <IconButton size="small" onClick={() => { navigate(`/examinate/${params.row.eventId}`) }}>
                //  <ChevronRightIcon style={{height: '30px', width: '30px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '3px'}} />        
                // </IconButton>
                <ListItemButton event={params.row.event} />
            )
        }
    ];

    return (
        <div style={{ width: 'auto', height: 'auto' }}>
            <NewEDataGrid 
                rows={rows}
                setRows={setRows}
                columns={columns}
                isVisibleToolbar={false}
                originalData={examsList}
            />
        </div>

    )
}