import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from "new_styled_components";
import { Typography, ThemeProvider } from '@mui/material';
import { AiFillDelete } from "react-icons/ai";
import { HiPencil } from "react-icons/hi";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import "./teams.scss"
import TeamService from "services/team.service"
import CommonService from "services/common.service"
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import UserDialog from "./UserDialog";
import { new_theme } from 'NewMuiTheme';
import { useNavigate } from "react-router-dom"


// Components

import StyledMenu from 'new_styled_components/Menu/Menu.styled'

// const useStyles = makeStyles(theme => ({
//     darkViolet: {
//         color: theme.palette.primary.darkViolet
//     },
// }))



function MoreIconForTeam({ teamId, editHandler, deleteHandler }) {
    const { F_showToastMessage, F_getHelper, F_t } = useMainContext();
    const { t, i18n } = useTranslation(['sentinel-MyTeams-Teams', 'common']);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openmenu = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return <>
        <StyledEIconButton
            color="primary"
            size="medium"
            aria-controls={openmenu ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openmenu ? 'true' : undefined}
            disableElevation
            onClick={handleClick}>
            <MoreVertIcon />
        </StyledEIconButton>

        <StyledMenu
            className="teams_togglemenu"
            id="demo-customized-menu"
            MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={openmenu}
            onClose={handleClose}
        >

            <Typography variant="subtitle2" component="h6" sx={{ padding: '8px 8px 0 8px' }}>{F_t("sentinel-MyTeams-Teams:TEAM")}</Typography>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={e => editHandler(teamId)} disableRipple>
                {/* <MoreHorizIcon /> */}
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:EDIT")}</Typography>
            </MenuItem>
            <MenuItem onClick={e => deleteHandler(teamId)} disableRipple>
                {/* <MoreHorizIcon /> */}
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:DELETE")}</Typography>
            </MenuItem>
        </StyledMenu>
    </>

}

export default function TeamTable(props) {
    const { F_showToastMessage, F_hasPermissionTo, F_t, F_getLocalTime} = useMainContext();
    const {
        MSRoles = [],
        setEditFormHelper = () => { },
    } = props;
    const { t } = useTranslation(['sentinel-MyTeams-Teams', 'common']);
    // const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [userIdToDelete, setUserIdToDelete] = useState(0);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [openUsers, setOpenUsers] = useState("0");


    const MSRoleList = MSRoles.length > 0 ? MSRoles.map((item, index) =>
    ({
        id: index + 1,
        name: item.name,
        trainee: item.trainee,
        count: item.trainee.length,
        userId: item._id,
        createdAt: item.createdAt
    })) : [];

    useEffect(() => {
        if (actionModal.returnedValue) {
            remove(userIdToDelete);
        }
    }, [actionModal.returnedValue]);
    useEffect(() => {
        if (!actionModal.isOpen) {
            setUserIdToDelete(0)
        }
    }, [actionModal.isOpen])
    useEffect(() => {
        if (userIdToDelete !== 0) {

            setActionModal({ isOpen: true, returnedValue: false })
        }
    }, [userIdToDelete])

    const remove = (id) => {
        TeamService.deleteTeam(id).then(res => {
            F_showToastMessage(t("sentinel-MyTeams-Teams:TEAM_REMOVED", "success"))
            setEditFormHelper({ isOpen: true, openType: 'PREVIEW', userId: undefined, isBlocking: false })

            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }

    const editHandler = (userId) => {
        if (F_hasPermissionTo('update-user')) {
            setEditFormHelper({ isOpen: true, openType: 'EDIT', userId: userId, isBlocking: false });
        } else {
            F_showToastMessage({ message: t('common:CANT_EDIT_USER'), severity: 'error' });
        }
    }

    const deleteHandler = (userId) => {
        setUserIdToDelete(userId)
    }

    useEffect(() => {
        setRows(MSRoleList);
    }, [MSRoles]);

    const columns = [
        { field: 'id', headerName: 'Sr', flex: 1, minWidth:50, maxWidth:50 , fontWeight: 'bold', hide: false, sortable: true, disableColumnMenu: true },

        { field: 'name', headerName: F_t('sentinel-MyTeams-Teams:TEAM_NAME'), flex: 1, minWidth:200, hide: false, sortable: true, disableColumnMenu: true, },
        {
            field: 'count', headerName: F_t('sentinel-MyTeams-Teams:TOTAL_USERS'), flex: 1, minWidth:200,maxWidth:250, headerAlign: 'right', align:'right',
            renderCell: (params) => (
                <>
                    <UserDialog row={params.row} openUsers={openUsers} setOpenUsers={setOpenUsers} />
                </>
            )
        },
        {
            field: 'createdAt', headerName: t('sentinel-MyTeams-Teams:CREATED_ON'), headerAlign: 'right', align:'right', flex: 1, minWidth:130, maxWidth:200,
            renderCell: (params) => params.row.createdAt ? (F_getLocalTime(params.row.createdAt, true)) : ("-")      
        },

        {
            field: t('common:ACTION'),
            flex: 1, minWidth:150, maxWidth:250,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            filterable: false,
            // renderHeader: () => ('Action'),
            renderCell: (params) => (
                <div className='actionBtns'>
                    <StyledEIconButton size="medium" color="primary"
                        onClick={e => editHandler(params.row.userId)}>
                        <HiPencil />
                    </StyledEIconButton>
                    <StyledEIconButton size="medium" color="primary"
                        onClick={e => deleteHandler(params.row.userId)}
                    >
                        <AiFillDelete />
                    </StyledEIconButton>
                    <MoreIconForTeam teamId={params.row.userId} editHandler={editHandler} deleteHandler={deleteHandler} />
                </div>
            )
        }
    ];

    return (
        <ThemeProvider theme={new_theme}>
            <div className='main-table' style={{ width: 'auto', height: 'auto' }}>
                <NewEDataGrid
                    rows={rows}
                    columns={columns}
                    setRows={setRows}
                    originalData={MSRoleList}
                />
                <ConfirmActionModal actionModal={actionModal}
                    setActionModal={setActionModal}
                    actionModalTitle={F_t("sentinel-MyTeams-Teams:REMOVING_TEAM")}
                    actionModalMessage={F_t("sentinel-MyTeams-Teams:REMOVE_TEAM")}
                />
            </div>
        </ThemeProvider>
    );
}
