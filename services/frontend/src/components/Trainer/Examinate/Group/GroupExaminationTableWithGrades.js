import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { now } from "moment";

// Styled components
import { ETab, ETabBar, EDataGrid } from "new_styled_components";
import EIconButton from 'styled_components/EIconButton'

// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Icons
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI v5
import { styled } from '@mui/material/styles';

// MUI v4
import { theme } from 'MuiTheme'
import { NewEDataGrid } from 'new_styled_components';
import { new_theme } from 'NewMuiTheme';
const palette = theme.palette


function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

export default function GroupExaminationTableWithGrades({ examinedAttendeesResultsPreview, event, content }) {
    const [pageSize, setPageSize] = React.useState(5);
    const { F_getHelper } = useMainContext();
    const { userPermissions } = F_getHelper();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const isMdUp = useIsWidthUp("md");

    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const StyledDataGrid = styled(EDataGrid)({
        "& .MuiDataGrid-row": {
            border: "none",
            background: "transparent",
        },
    })
    console.log(examinedAttendeesResultsPreview);
    const examinedAttendeesResultsPreviewList = examinedAttendeesResultsPreview.length > 0 ? examinedAttendeesResultsPreview.map((item, index) =>
    ({
        id: index + 1,
        name: item.user && item.user.name ? `${item.user.name} ${item.user.surname}` : "-",
        status: item.status,
        grade: item.grade ? item.grade : "-",
        percentage: item.percentage ? item.percentage : "-",
        points: item.points ? item.points : "-",
        verifiedDate: item.grade ? (new Date(now())) : "-",
        traineeId: item.user._id,
        resultId: item?._id ?? "-",
    })) : [];

    useEffect(() => {
        setRows(examinedAttendeesResultsPreviewList);
    }, [examinedAttendeesResultsPreview]);

    const columns = [
        { field: 'id', headerName: t('No.'), width: 20, disableColumnMenu: true },
        { field: 'name', headerName: t('Full name'), width: 120 },
        { field: 'grade', headerName: t('Grade'), type: "number", width: 120, flex: 1, sortable: false, disableColumnMenu: true },
        { field: 'percentage', headerName: t('Percentage'), type: "number", width: 120,  sortable: false, disableColumnMenu: true, flex: 1, renderCell: (params) => (params.row.percentage !== "-") ? `${params.row.percentage.toFixed(2)}%` : "-" },
        { field: 'points', headerName: t('Points'), type: "number", width: 120, flex: 1, sortable: false, disableColumnMenu: true },

        {
            field: 'action',
            headerName: '',
            width: 150,
            sortable: false,
            hide: userPermissions.isInspector,
            disableColumnMenu: false,
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: () => (""),
            renderCell: (params) => (
                <>
                    <EIconButton size="small" onClick={() => {
                        if (event) navigate(`/examinate/${event._id}/${params.row.traineeId}`)
                        else if (content) navigate(`/examinate/content/${content._id}/${params.row.traineeId}`)
                    }}  >
                        <ChevronRightIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
                        {/* TODO: add authorization for seeing results of attendees as trainer, same view as: http://localhost/results/444444444444444444444444 (for classmanager1)  */}
                    </EIconButton>
                </>
            )
        }
    ];

    return (
        <div >
            {/* <ETabBar sx={{ mt: 5, marginLeft: "auto", marginRight: "auto", width: "300px" }}
                value={activeTab}
                onChange={(e, i) => setActiveTab(i)}
                eSize='xsmall'
            >
                <ETab label='Top grade students' style={{ minWidth: "150px" }} eSize='xsmall' />
                <ETab label='Low grade students' style={{ minWidth: "150px" }} eSize='xsmall' />
            </ETabBar> */}
            {/* <div style={{ height: 400, borderRadius: "8px", backgroundColor: theme.palette.shades.white30 }} > */}
                <NewEDataGrid sx={{ p: 2, pb: 0, mt: 2 }}
                    isVisibleToolbar={false}
                    initialState={{
                        sorting: { sortModel: [{ field: "grade", sort: (activeTab === 1 ? "asc" : "desc") }] }
                    }}
                    rows={rows}
                    autoHeight={false}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    columnVisibilityModel={{
                        // Hide columns when screen is small
                        percentage: Boolean(isMdUp && content),
                        points: Boolean(isMdUp && content),
                        action: Boolean(content)
                    }}
                />
            {/* </div> */}



        </div>
    );
}
