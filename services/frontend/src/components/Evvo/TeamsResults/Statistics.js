import React, { useState, useEffect, lazy } from "react";
import { useTranslation } from "react-i18next";
import { NewEDataGrid } from 'new_styled_components';
import Checkbox from '@mui/material/Checkbox'; // Import Checkbox component from Material-UI
import StyledButton from "new_styled_components/Button/Button.styled";
import Grid from "@mui/material/Grid";
import ProjectService from "services/project.service"
import { useNavigate } from 'react-router-dom';
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function Statistics(props) {
  const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);
  const navigate = useNavigate();
  const { F_showToastMessage, F_formatSeconds, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();

  // Define a state to keep track of selected checkboxes
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const headerCheckboxIds = ['header-checkbox-1', 'header-checkbox-2', 'header-checkbox-3', 'header-checkbox-4', 'header-checkbox-5'];
  const [checkAllCheckboxes, setCheckAllCheckboxes] = useState(false);
  const [headerCheckbox1, setHeaderCheckbox1] = useState(false);
  const [headerCheckbox2, setHeaderCheckbox2] = useState(false);
  const [headerCheckbox3, setHeaderCheckbox3] = useState(false);
  const [headerCheckbox4, setHeaderCheckbox4] = useState(false);
  const [headerCheckbox5, setHeaderCheckbox5] = useState(false);
  // to allow on adding Projects: 
  const [isCheckboxClicked, setIsCheckboxClicked] = useState(false);
  const [opportunitiesData, setOpportunitiesData] = useState(null);
  const [rows, setRows] = useState(props.rows);


  useEffect(() => {
    // send checkboxes for request
    const transformedData = selectedCheckboxes.reduce((acc, item) => {
      const [checkbox, userId] = item.split('_');
      const area = checkbox.replace('checkbox', '');

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

  useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const sendDataToNewProject = () => {
    if (!isCheckboxClicked) {
      F_showToastMessage(t("To add project, select some values."), 'warning');
      return;
    }
    if (!opportunitiesData?.length > 0) {
      F_showToastMessage(t("To add a project, prioritize NAD indicators with lower values to capture opportunities."), 'warning');
      return;
    }
    if (opportunitiesData) {
      localStorage.setItem('project-data', JSON.stringify({opportunitiesData, selectedTeamsId: props.selectedTeamsId}))
      navigate('/my-projects/interactive-cs/automated-projects-cs');
    }
  };


  useEffect(() => {
    setIsCheckboxClicked(selectedCheckboxes.length > 0);
  }, [selectedCheckboxes]);

  const handleCheckboxChange = (event, checkboxId) => {
    setIsCheckboxClicked(true);
    const isChecked = event.target.checked;

    // fist checkbox in the first row allowing on selecting all checkboxes in the table
    if (checkboxId === 'check-all-checkboxes') {
      setCheckAllCheckboxes(isChecked);
      setSelectedCheckboxes((prevState) => {
        if (isChecked) {
          const allCheckboxIds = rows.flatMap((row) =>
            ['checkbox0', 'checkbox1', 'checkbox2', 'checkbox3', 'checkbox4', 'checkbox5'].map((prefix) => `${prefix}_${row._id}`)
          );
          return allCheckboxIds;
        } else { return []; }
      });
    }
    setSelectedCheckboxes((prevState) => {
      //checkboxes in columns header: to check all checkboxes in the corresponding column 
      if (headerCheckboxIds.includes(checkboxId)) {
        const isChecked = event.target.checked;
        const columnNumber = checkboxId.split('-')[2];
        const setHeaderCheckboxState = `setHeaderCheckbox${columnNumber}`;
        eval(`${setHeaderCheckboxState}(isChecked)`); // Using eval() for dynamic function calls

        setSelectedCheckboxes((prevState) => {
          const rowIds = rows.map((row) => row._id);
          const checkboxIdsInColumn = rowIds.map((rowId) => `checkbox${columnNumber}_${rowId}`);

          if (isChecked) {
            return [...prevState, ...checkboxIdsInColumn];
          } else {
            return prevState.filter((id) => !checkboxIdsInColumn.includes(id));
          }
        });
      }
      //checkboxes in first column: check all checkboxes in corresponding row 
      if (checkboxId.startsWith('checkbox0_')) {
        const rowId = checkboxId.split('_')[1];
        const checkboxIdsInRow = [`checkbox0_${rowId}`, `checkbox1_${rowId}`, `checkbox2_${rowId}`, `checkbox3_${rowId}`, `checkbox4_${rowId}`, `checkbox5_${rowId}`];

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


  const columns = [
    {
      field: 'check-all-checkboxes',
      headerClassName:'sticky-header',
      cellClassName:'sticky-cell',
      headerName: (
        <Checkbox
          checked={checkAllCheckboxes}
          onChange={(event) => handleCheckboxChange(event, 'check-all-checkboxes')}
          style={{ padding: '0'}}

        />
      ),
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={selectedCheckboxes.includes(`checkbox0_${params.row._id}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox0_${params.row._id}`)}
            style={{ padding: '0'}}
          />
        </>
      ),
    },
    {
      field: 'name', headerName: t('NAME'), minWidth: 200, sortable: true, disableColumnMenu: true, headerClassName:'sticky-header1',
      cellClassName:'sticky-cell1',
      valueGetter: (params) =>
      `${params.row.name} ${params.row.surname}`,
    },

    {
      field: 'checkbox1-header',
      headerName: (
        <Checkbox
          checked={headerCheckbox1}
          onChange={(event) => handleCheckboxChange(event, 'header-checkbox-1')}
          style={{ padding: '0'}}
        />
      ),
      width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={selectedCheckboxes.includes(`checkbox1_${params.row._id}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox1_${params.row._id}`)}
            style={{ padding: '0'}}
          />
        </>
      ),
    },
    {
      field: 'self-activation',
      headerName: t(`traits:self-activation-short-name`),
      minWidth: 200, sortable: true, disableColumnMenu: true,
      valueGetter: (params) => params.row['self-activation'].normalizedValue,
    },
    {
      field: 'checkbox2-header',
      headerName: (
        <Checkbox
          checked={headerCheckbox2}
          onChange={(event) => handleCheckboxChange(event, 'header-checkbox-2')}
          style={{ padding: '0'}}
        />
      ),
      width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={selectedCheckboxes.includes(`checkbox2_${params.row._id}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox2_${params.row._id}`)}
            style={{ padding: '0'}}
          />
        </>
      ),
    },
    {
      field: 'self-confidence',
      cellClassName: 'tableRowContent',
      headerName: t(`traits:self-confidence-short-name`),
      minWidth: 200, sortable: true, disableColumnMenu: true,
      valueGetter: (params) => params.row['self-confidence'].normalizedValue,
    },
    {
      field: 'checkbox3-header',
      headerName: (
        <Checkbox
          checked={headerCheckbox3}
          onChange={(event) => handleCheckboxChange(event, 'header-checkbox-3')}
          style={{ padding: '0'}}
        />
      ),
      width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={selectedCheckboxes.includes(`checkbox3_${params.row._id}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox3_${params.row._id}`)}
            style={{ padding: '0'}}
          />
        </>
      ),
    },
    {
      field: 'communication-strategy',
      cellClassName: 'tableRowContent',
      headerName: t(`traits:communication-strategy-short-name`),
      minWidth: 200, sortable: true, disableColumnMenu: true,
      valueGetter: (params) => params.row['communication-strategy'].normalizedValue,
    },
    {
      field: 'checkbox4-header',
      headerName: (
        <Checkbox
          checked={headerCheckbox4}
          onChange={(event) => handleCheckboxChange(event, 'header-checkbox-4')}
          style={{ padding: '0'}}
        />
      ),
      width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={selectedCheckboxes.includes(`checkbox4_${params.row._id}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox4_${params.row._id}`)}
            style={{ padding: '0'}}
          />
        </>
      ),
    },
    {
      field: 'cooperation',
      cellClassName: 'tableRowContent',
      headerName: t(`traits:cooperation-short-name`),
      minWidth: 200, sortable: true, disableColumnMenu: true,
      valueGetter: (params) => params.row['cooperation'].normalizedValue,
    },
    {
      field: 'checkbox5-header',
      headerName: (
        <Checkbox
          checked={headerCheckbox5}
          onChange={(event) => handleCheckboxChange(event, 'header-checkbox-5')}
          style={{ padding: '0'}}
        />
      ),
      width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={selectedCheckboxes.includes(`checkbox5_${params.row._id}`)}
            onChange={(event) => handleCheckboxChange(event, `checkbox5_${params.row._id}`)}
            style={{ padding: '0'}}
          />
        </>
      ),
    },
    {
      field: 'D',
      cellClassName: 'tableRowContent',
      headerName: t(`traits:regularity-short-name`),
      minWidth: 200, sortable: true, disableColumnMenu: true,
      valueGetter: (params) => params.row.regularity.normalizedValue,
    },
    {
      field: 'motivation', cellClassName: 'tableRowContent', headerName: t('traits:motivation-short-name'), minWidth: 150,
      valueGetter: (params) =>
        params.row['motivation'].normalizedValue,
    },
    {
      field: 'personal-engagement', cellClassName: 'tableRowContent', headerName: t('traits:personal-engagement-short-name'), minWidth: 200,
      valueGetter: (params) =>
        params.row['personal-engagement'].normalizedValue,
    },
    {
      field: 'communication', cellClassName: 'tableRowContent', headerName: t('traits:communication-short-name'), minWidth: 200,
      valueGetter: (params) =>
        params.row['communication'].normalizedValue,
    },
    {
      field: 'collaboration', cellClassName: 'tableRowContent', headerName: t('traits:collaboration-short-name'), minWidth: 200,
      valueGetter: (params) =>
        params.row['collaboration'].normalizedValue,
    },
    {
      field: 'creativity', cellClassName: 'tableRowContent', headerName: t('traits:creativity-short-name'), minWidth: 200,
      valueGetter: (params) =>
        params.row['creativity'].normalizedValue,
    },
    {
      field: 'critical-thinking', cellClassName: 'tableRowContent', headerName: t('traits:critical-thinking-short-name'), minWidth: 200,
      valueGetter: (params) =>
        params.row['critical-thinking'].normalizedValue,
    },
    {
      field: 'leadership', cellClassName: 'tableRowContent', headerName: t('traits:leadership-short-name'), minWidth: 200,
      valueGetter: (params) =>
        params.row['leadership'].normalizedValue,
    },
    {
      field: 'risk-taking', cellClassName: 'tableRowContent', headerName: t('traits:risk-taking-short-name'), minWidth: 200,
      valueGetter: (params) =>
        params.row['risk-taking'].normalizedValue,
    },
    {
      field: 'stress-management', cellClassName: 'tableRowContent', headerName: t('traits:stress-management-short-name'), minWidth: 220,
      valueGetter: (params) =>
        params.row['stress-management'].normalizedValue,
    },
    {
      field: 'respect', cellClassName: 'tableRowContent', headerName: t('traits:respect-short-name'), minWidth: 220,
      valueGetter: (params) =>
        params.row['respect'].normalizedValue,
    },
    {
      field: 'empathy', cellClassName: 'tableRowContent', headerName: t('traits:empathy-short-name'), minWidth: 150,
      valueGetter: (params) =>
        params.row['empathy'].normalizedValue,
    },
    {
      field: 'emotional-intelligence-in-relation-with-others', cellClassName: 'tableRowContent', headerName: t('traits:emotional-intelligence-in-relation-with-others-short-name'), minWidth: 300,
      valueGetter: (params) =>
        params.row['emotional-intelligence-in-relation-with-others'].normalizedValue,
    },
    {
      field: 'emotional-intelligence-in-relation-with-oneself', cellClassName: 'tableRowContent', headerName: t('traits:emotional-intelligence-in-relation-with-oneself-short-name'), minWidth: 300,
      valueGetter: (params) =>
        params.row['emotional-intelligence-in-relation-with-oneself'].normalizedValue,
    },
    {
      field: 'emotional-intelligence-global', cellClassName: 'tableRowContent', headerName: t('traits:emotional-intelligence-global-short-name'), minWidth: 250,
      valueGetter: (params) =>
        params.row['emotional-intelligence-global'].normalizedValue
    },


  ];
  return (
    <div className="stats_table" style={{ width: 'auto', height: 'auto' }}>
      <Grid container alignItems="center" justifyContent="flex-end" style={{ marginBottom: '20px' }}>
        <StyledButton
          eVariant="primary"
          eSize="large"
          className="btn_primary"
          component="span"
          onClick={sendDataToNewProject}
        >
          {t("Add project")}
        </StyledButton>
      </Grid>

      <NewEDataGrid
        className='table_stats'
        rows={rows?.map(({ _id, name, surname, traits }) => ({
          name, surname, _id, ...traits,
        }))}
        getRowId={(row) => row._id}
        columns={columns}
        setRows={setRows}
        originalData={props.rows}
        isVisibleToolbar={true}
        defaultRowsPerPage = '50'
      />
    </div>


  );
}