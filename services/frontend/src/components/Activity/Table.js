import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { NewEDataGrid } from "../../new_styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import { BsPencil } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { activityActions } from "app/features/Activity/data";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import "./activity.scss";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

const Table = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const { data } = useSelector(s => s.activity);
    const [_rows, _setRows] = useState([]);



    useEffect(() => {
        _setRows(activitiesList);
    }, [data]);

    const activitiesList = data.length > 0 ? data.map((item, index) =>
    ({
        id: index + 1,
        user: item?.user && `${item?.user?.name ?? '-'} ${item?.user?.surname ?? '-'}`,
        totalTime: item?.details?.totalTime,
        awayTime: item?.details?.awayTime,
        inTime: item?.details?.inTime,
        action: item?.action,
        itemId: item._id,
        updatedAt: item.updatedAt,
    })) : [];

    const columns = [
        { field: 'id', headerName: 'ID',fontWeight: 'bold', hide: false, disableColumnMenu: true, flex: 1, minWidth: 50, maxWidth: 50},
        { field: 'user', headerName: 'User', minWidth: 200, flex: 1, },
        {
            field: 'totalTime', headerName: 'Total time',  minWidth:150, maxWidth: 150, flex: 1,
            renderCell: ({ row: { totalTime } }) => totalTime ? `${(totalTime / 60).toFixed(1)} min` : ("-")
        },
        {
            field: 'awayTime', headerName: 'Away time',  minWidth:150, maxWidth: 150, flex: 1,
            renderCell: ({ row: { awayTime } }) => awayTime ? `${(awayTime / 60).toFixed(1)} min` : ("-")
        },
        {
            field: 'inTime', headerName: 'In time',  minWidth:150, maxWidth: 150, flex: 1,
            renderCell: ({ row: { inTime } }) => inTime ? `${(inTime / 60).toFixed(1)} min` : ("-")
        },
        {
            field: 'action', headerName: 'Action',  minWidth:150, maxWidth: 150, flex: 1,
            renderCell: ({ row: { action } }) => action ? action : ("-")
        },
        {
            field: 'updatedAt', headerName: 'Last activity', minWidth: 150, type: 'date', flex: 1,
            renderCell: ({ row: { updatedAt } }) => updatedAt ? (new Date(updatedAt).toLocaleString()) : ("-")
        },
        {
            field: 'action-preview',
            minWidth: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: () => (<SettingsIcon />),
            renderCell: ({ row: { itemId } }) => (
                // <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                //     onClick={() => {
                //         dispatch(activityActions.editFormActions({ isOpen: true, openType: 'PREVIEW', itemId }))
                //     }}><Visibility />
                // </IconButton>
                <StyledEIconButton color="primary" size="medium" 
                onClick={() => {
                    dispatch(activityActions.editFormActions({ isOpen: true, openType: 'PREVIEW', itemId }))
                }}>
                    <Visibility />
                </StyledEIconButton>

            )
        },
    ];

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container spacing={1} sx={{ mt: 0 }}>
                <Grid item xs={12} style={{padding: '0'}}>
                    <div className="admin_content">
                        <div className="admin_heading">
                            <div className="teams_header">
                                <Grid>
                                    <Typography variant="h1" component="h1">{t("Activities")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} style={{padding: 0}}>
                    <div style={{ width: 'auto', height: 'auto' }} className="tableintership">
                        <NewEDataGrid
                            rows={_rows}
                            columns={columns}
                            
                            isVisibleToolbar={true}
                            setRows={_setRows}
                            originalData={activitiesList}
                        />
                    </div>
                </Grid>
            </Grid>
        </ThemeProvider>

    )
}

export default Table;