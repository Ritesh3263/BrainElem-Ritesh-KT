import { Typography, ThemeProvider } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState, lazy } from "react";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import "./teams.scss"
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import { NewEDataGrid } from 'new_styled_components';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import BCTestService from '../../../../services/bcTestRegistration.service';
import ProjectService from "services/project.service"
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


export default function TeamsStats() {
  const { F_showToastMessage, F_formatSeconds, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader, F_t } = useMainContext();
  const {userPermissions} = F_getHelper();
  const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ', 'sentinel-MyTeams-Statistics', 'sentinel-MyTeams-Teams']);
  const navigate = useNavigate();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [opportunitiesData, setOpportunitiesData] = useState(null);
  const [isCheckboxClicked, setIsCheckboxClicked] = useState(false);
  const [teamIds, setTeamIds] = useState([]);

  useEffect(() => {
    fetchTeamsData();
  }, []);

  useEffect(() => {
    // send checkboxes for request
    const transformedData = selectedCheckboxes.reduce((acc, item) => {
      const parts = item.split('_');
      const checkbox = parts[0];
      const userId = parts[1];
      const teamId = parts[2];
      const area = checkbox.replace('checkbox', '');
      setTeamIds((prevState) => [... new Set([...prevState, teamId])]);

      // Skip checkbox0 as it is not an "area", also skip headers and "select-all" checkbox
      if (area === '0' || area.includes("header") || area.includes("all")) return acc;
      const existingUser = acc.find(user => user._id === userId);
      if (existingUser) existingUser.areas.push(area);
      else {
        acc.push({
          _id: userId,
          areas: [area]
        });
      }
      return acc;
    }, []);

    const result = { users: transformedData };
    ProjectService.getOpportunitiesForUsers(transformedData)
      .then((res) => {
        setOpportunitiesData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedCheckboxes]);

  const sendDataToNewProject = () => {
    if (!isCheckboxClicked) {
      F_showToastMessage(t("sentinel-MyTeams-Statistics:SELECT_SOME_VALUE"), 'warning');
      return;
    }
    if (!opportunitiesData?.length > 0) {
      F_showToastMessage(t("sentinel-MyTeams-Statistics:PRIORITIZE_NAD_INDICATORS"), 'warning');
      return;
    }
    if (opportunitiesData) {
      localStorage.setItem('project-data', JSON.stringify({opportunitiesData, selectedTeamsId: teamIds}))
      // localStorage.setItem('project-data', JSON.stringify(opportunitiesData))
      navigate('/my-projects/interactive-cs/automated-projects-cs');
    }
  };

  function fetchTeamsData() {
    F_handleSetShowLoader(true)
    BCTestService.getBCTestTeamsWithTraits()
      .then((res) => {
        const temp = res.data.data
        .filter((dat) => dat.trainee.length > 0) // Filter out teams without trainees
        .map((dat) => {
          const trainees = dat.trainee
            .filter((trainee) => trainee.traits && trainee.traits['self-activation'] && trainee.traits['self-activation'].normalizedValue)
            .map((trainee) => ({
              id: `${trainee._id}`,
              name: trainee.name + ' ' + trainee.surname,
              type: 'user',
              traits: trainee.traits,
            }));
        
          return {
            id: dat._id,
            name: dat.name,
            users: trainees,
            expanded: false,
          };
        });
        setTeams(temp);
        F_handleSetShowLoader(false)
      })
      .catch((err) => {
        console.log(err);
        F_handleSetShowLoader(false)
      });
  }

  const handleTeamExpand = (teamId) => {
    setTeams((prevState) =>
      prevState.map((team) =>
        team.id === teamId ? { ...team, expanded: !team.expanded } : team
      )
    );
  };

  useEffect(() => {
    setIsCheckboxClicked(selectedCheckboxes.length > 0);
  }, [selectedCheckboxes]);

  const handleCheckboxChange = (event, checkboxId) => {
    setIsCheckboxClicked(true)
    const isChecked = event.target.checked;
  
    setSelectedCheckboxes((prevState) => {
      if (checkboxId.startsWith('checkbox0_')) {
        const rowId = checkboxId.split('_')[1];
        const checkboxIdsInRow = [`checkbox0_${rowId}`, `checkbox1_${rowId}`, `checkbox2_${rowId}`];
  
        if (isChecked) {
          // If checkbox0 is checked, update the state for checkboxes in the same row
          return [...prevState, ...checkboxIdsInRow];
        } else {
          // If checkbox0 is unchecked, remove checkboxes in the same row from the state
          return prevState.filter((id) => !checkboxIdsInRow.includes(id));
        }
      } else {
        // For other checkboxes, handle them individually
        if (isChecked) {
          return [...prevState, checkboxId];
        } else {
          return prevState.filter((id) => id !== checkboxId);
        }
      }
    });
  };
  
  
  const flattenedData = [];
  teams.forEach((team) => {
    flattenedData.push({
      id: team.id,
      name: team.name,
      type: 'team',
      expanded: team.expanded,
    });
    if (team.expanded) {
      team.users.forEach((user) => {
        flattenedData.push({
          id: user.id,
          name: user.name,
          type: user.type,
          traits: user.traits,
          teamId: team.id,
        });
      });
    }
  });
  
  const renderTraitCell = (traitKey) => (params) =>
  params.row.type === 'user' ? (
    <Typography>{params.row.traits[traitKey].normalizedValue}</Typography>
  ) : null;


  const columns = [
    {
      field: 'team',
      headerName: F_t('sentinel-MyTeams-Teams:TEAM'),
      minWidth: 300,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {params.row.type === 'team' && (
            <span
              style={{
                cursor: 'pointer',
                marginRight: '4px',
                transform: params.row.expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
              onClick={() => handleTeamExpand(params.row.id)}
            >
              {params.row.expanded ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
            </span>
          )}
          {params.row.name}
        </div>
      ),
    },
    {
        field: '',
        width: 50,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) =>
          params.row.type === 'user' ? (
            <Checkbox
            checked={selectedCheckboxes.includes(`checkbox1_${params.row.id}_${params.row.teamId}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox1_${params.row.id}_${params.row.teamId}`)}
            style={{ padding: '0'}}
          />
          ) : null,
      },
    {
      field: 'self-activation',
      headerName: t(`traits:self-activation-short-name`),
      minWidth: 180,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.type === 'user' ? (
          <Typography>{params.row.traits['self-activation'].normalizedValue}</Typography>
        ) : null,
    },
    {
        field: ' ', width: 50, sortable: false, disableColumnMenu: true,
        renderCell: (params) => {
          if (params.row.type === 'user') {
            return (
              <Checkbox
              checked={selectedCheckboxes.includes(`checkbox2_${params.row.id}_${params.row.teamId}`)}
              onChange={(event) => handleCheckboxChange(event, `checkbox2_${params.row.id}_${params.row.teamId}`)}
              style={{ padding: '0'}}
            />
            );  }  return null;
        },
    },
    {
      field: 'self-confidence',
      headerName: t(`traits:self-confidence-short-name`),
      minWidth: 180,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.type === 'user' ? (
          <Typography>{params.row.traits['self-confidence'].normalizedValue}</Typography>
        ) : null,
    },
    {
      field: '  ', width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.type === 'user') {
          return (
            <Checkbox
            checked={selectedCheckboxes.includes(`checkbox3_${params.row.id}_${params.row.teamId}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox3_${params.row.id}_${params.row.teamId}`)}
            style={{ padding: '0'}}
          />
          );  }  return null;
      },
  },
  {
    field: 'communication-strategy',
    headerName: t(`traits:communication-strategy-short-name`),
    minWidth: 180,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) =>
      params.row.type === 'user' ? (
        <Typography>{params.row.traits['communication-strategy'].normalizedValue}</Typography>
      ) : null,
  },
  {
    field: '   ', width: 50, sortable: false, disableColumnMenu: true,
    renderCell: (params) => {
      if (params.row.type === 'user') {
        return (
          <Checkbox
          checked={selectedCheckboxes.includes(`checkbox4_${params.row.id}_${params.row.teamId}`)}
          onChange={(event) => handleCheckboxChange(event, `checkbox4_${params.row.id}_${params.row.teamId}`)}
          style={{ padding: '0'}}
        />
        );  }  return null;
    },
  },
  {
    field: 'cooperation',
    headerName: t(`traits:cooperation-short-name`),
    minWidth: 180,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) =>
      params.row.type === 'user' ? (
        <Typography>{params.row.traits['cooperation'].normalizedValue}</Typography>
      ) : null,
  },
    {
      field: '    ', width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.type === 'user') {
          return (
            <Checkbox
            checked={selectedCheckboxes.includes(`checkbox5_${params.row.id}_${params.row.teamId}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox5_${params.row.id}_${params.row.teamId}`)}
            style={{ padding: '0'}}
          />
          );  }  return null;
      },
  },
  {
    field: 'D',
    headerName: t(`traits:regularity-short-name`),
    minWidth: 180,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) =>
      params.row.type === 'user' ? (
        <Typography>{params.row.traits['regularity'].normalizedValue}</Typography>
      ) : null,
  },
  {
    field: 'motivation', cellClassName: 'tableRowContent', headerName: t('traits:motivation-short-name'), minWidth: 150,
      renderCell: renderTraitCell('motivation'),
  },
  {
    field: 'personal-engagement', cellClassName: 'tableRowContent', headerName: t('traits:personal-engagement-short-name'), minWidth: 180,
      renderCell: renderTraitCell('personal-engagement'),
  },
  {
    field: 'communication', cellClassName: 'tableRowContent', headerName: t('traits:communication-short-name'), minWidth: 180,
      renderCell: renderTraitCell('communication'),
  },
  {
    field: 'collaboration', cellClassName: 'tableRowContent', headerName: t('traits:collaboration-short-name'), minWidth: 180,
      renderCell: renderTraitCell('collaboration'),
  },
  {
    field: 'creativity', cellClassName: 'tableRowContent', headerName: t('traits:creativity-short-name'), minWidth: 180,
      renderCell: renderTraitCell('creativity'),
  },
  {
    field: 'critical-thinking', cellClassName: 'tableRowContent', headerName: t('traits:critical-thinking-short-name'), minWidth: 180,
      renderCell: renderTraitCell('critical-thinking'),
  },
  {
    field: 'leadership', cellClassName: 'tableRowContent', headerName: t('traits:leadership-short-name'), minWidth: 180,
      renderCell: renderTraitCell('leadership'),
  },
  {
    field: 'risk-taking', cellClassName: 'tableRowContent', headerName: t('traits:risk-taking-short-name'), minWidth: 180,
      renderCell: renderTraitCell('risk-taking'),
  },
  {
    field: 'stress-management', cellClassName: 'tableRowContent', headerName: t('traits:stress-management-short-name'), minWidth: 220,
      renderCell: renderTraitCell('stress-management'),
  },
  {
    field: 'respect', cellClassName: 'tableRowContent', headerName: t('traits:respect-short-name'), minWidth: 220,
      renderCell: renderTraitCell('respect'),
  },
  {
    field: 'empathy', cellClassName: 'tableRowContent', headerName: t('traits:empathy-short-name'), minWidth: 150,
      renderCell: renderTraitCell('empathy'),
  },
  {
    field: 'emotional-intelligence-in-relation-with-others', cellClassName: 'tableRowContent', headerName: t('traits:emotional-intelligence-in-relation-with-others-short-name'), minWidth: 300,
      renderCell: renderTraitCell('emotional-intelligence-in-relation-with-others'),
  },
  {
    field: 'emotional-intelligence-in-relation-with-oneself', cellClassName: 'tableRowContent', headerName: t('traits:emotional-intelligence-in-relation-with-oneself-short-name'), minWidth: 300,
      renderCell: renderTraitCell('emotional-intelligence-in-relation-with-oneself'),
  },
  {
    field: 'emotional-intelligence-global', cellClassName: 'tableRowContent', headerName: t('traits:emotional-intelligence-global-short-name'), minWidth: 250,
      renderCell: renderTraitCell('emotional-intelligence-global'),
  },
  ];

  return (
    <ThemeProvider theme={new_theme}>
        <Container maxWidth="xl" className="mainContainerDiv team_list">
            <Grid container spacing={1}>
                    <Grid item xs={12} className="minHeight-60vh">
                        <div className="admin_content">
                           
                          <Grid className="admin_heading" container alignItems="center" justifyContent="space-between">
                              <Grid>
                                  <Typography variant="h1" component="h1" >
                                      {t("sentinel-MyTeams-Statistics:STATISTICS")}
                                  </Typography>
                                  <Divider variant="insert" className='heading_divider' />
                              </Grid>
                              { userPermissions.myProjects.access && <div className="heading_buttons w-100-mb">
                                  <div className="displayFlex pri-btn-wrap w-100-mb">
                                      <label className="uploadCSVbtn w-100-mb" htmlFor="usersCsvInput">
                                          <input
                                              style={{ display: "none" }}
                                              accept="text/csv"
                                              multiple
                                              type="file"
                                          />
                                          <StyledButton
                                            eVariant="primary"
                                            eSize="large"
                                            className="btn_primary"
                                            component="span"
                                            onClick={sendDataToNewProject}
                                          >
                                            {t("sentinel-MyTeams-Statistics:ADD_PROJECT")}
                                          </StyledButton>
                                      </label>
                                  </div>
                              </div>}
                          </Grid>
                            
                        </div>
                        <div className="stats_table" style={{ width: 'auto', height: 'auto' }}>
                            <NewEDataGrid
                                className="table_stats"
                                rows={flattenedData}
                                columns={columns}
                                isVisibleToolbar={false}
                                // defaultRowsPerPage = '50'
                                disableRowSelectionOnClick
                                getRowId={(row) => row.id}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
  );
}