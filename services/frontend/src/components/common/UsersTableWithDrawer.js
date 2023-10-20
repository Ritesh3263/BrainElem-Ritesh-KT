// Simple table with drawer for selecting users

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// MUI v5
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from '@mui/material';

// Styled components
import StyledButton from "new_styled_components/Button/Button.styled";
import { NewEDataGrid } from 'new_styled_components';
import TeamsDialog from "components/common/DrawerForTeams"

// Services
import TeamService from "services/team.service"

// Theme
import { new_theme } from 'NewMuiTheme';


// Simple table with drawer for selecting users
export default function UsersTableWithDrawer({onSelectedUsers}) {
    const { t } = useTranslation(['translations', 'common']);

    // DRAWER FOR SELECTING TEAMS ######################################
    const [drawerForTeamsOpen, setDrawerForTeamsOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    // List of currentlt selected users - before and after confirmation

    const [selectedUsers, setSelectedUsers] = useState([])
    // #################################################################


    // Load all available teams
    useEffect(() => {
        TeamService.readAllTeam().then(res => {
            if (res.status === 200) {
                let teams = res?.data?.data
                setTeams(teams)
            }
        })
    }, []);

    // Update selected users in session
    useEffect(() => {
        onSelectedUsers(selectedUsers)
    }, [selectedUsers]);

    const columns = [
        {
            field: 'name', headerName: t('common:FULL NAME'), minWidth: 120, flex: 1,
            renderCell: (params) => `${params.row.name} ${params.row.surname}`
        },
        {
            field: 'email', headerName: t('common:EMAIL'), minWidth: 120, flex: 1,
            renderCell: (params) => `${params.row.email}`
        },
    ];

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className='enrolled_form_header'>
                            <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>
                                {t("common:USERS")}
                            </Typography>
                            {<StyledButton eVariant="primary" eSize="small"
                                onClick={() => { setDrawerForTeamsOpen(true) }}
                            >
                                {t("common:ADD")}
                            </StyledButton>}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ width: 'auto', height: 'auto' }}>
                            <NewEDataGrid style={{ cursor: "pointer" }}
                                rows={selectedUsers}
                                columns={columns}
                                isVisibleToolbar={true}
                                setRows={setSelectedUsers}
                                getRowId={(row) => row._id}
                            />
                        </div>
                    </Grid>
                </Grid>
                <TeamsDialog
                    teams={teams}
                    open={drawerForTeamsOpen}
                    setOpen={setDrawerForTeamsOpen}
                    onlyWithAvailableResult={false}
                    onConfirm={(users) => {
                        setDrawerForTeamsOpen(false)
                        setSelectedUsers(users)
                    }}

                    onClose={(selected) => {
                        setDrawerForTeamsOpen(false)
                    }}
                />
            </Grid>
        </ThemeProvider>
    )
}