// import React, { useEffect, useState } from 'react';
// import { EDataGrid } from "styled_components";
// import IconButton from '@mui/material/IconButton';
// import { useTranslation } from "react-i18next";
// import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
// import Avatar from '@mui/material/Avatar';
// import AddIcon from '@mui/icons-material/Add';
// import { new_theme } from 'NewMuiTheme';
// import Button from 'new_styled_components/Button';
// import { BsFillCircleFill } from 'react-icons/bs';

// export default function TeamTable(props) {
//     const { F_showToastMessage, F_hasPermissionTo } = useMainContext();
//     const {
//         MSRoles = [],
//         setEditFormHelper = () => { },
//     } = props;
//     const { t } = useTranslation();
//     // const classes = useStyles();
//     const [rows, setRows] = useState([]);

//     const MSRoleList = MSRoles.length > 0 ? MSRoles.map((item, index) =>
//     ({
//         id: index + 1,
//         name: item.name,
//         picture: item.picture,
//         userId: item._id,
//     })) : [];

//     useEffect(() => {
//         setRows(MSRoleList);
//     }, [MSRoles]);

//     const columns = [
//         { field: 'expanBtn', headerName: '', cellClassName:'tableRowContent', width: 80, hide: false, sortable: false, disableColumnMenu: true ,
//             renderCell: (params) => (
//                 <>
//                     <div className='actionBtns'>
//                         <IconButton size="small" style={{ backgroundColor: new_theme.palette.primary.MedPurple, width:25, height:25 }}>
//                             <AddIcon  style={{color: new_theme.palette.neutrals.white, padding:1.5}} ></AddIcon>
//                         </IconButton>
//                     </div>
//                 </>
//             )
//         },
//         // { field: 'name', headerName: t('Name'), width: 120, flex: 1, sortable: false, disableColumnMenu: true },
//         {
//             field: 'user', cellClassName:'tableRowContent', headerName: t('User'), width: 100, flex: 1,
//             renderCell: (params) => (
//                 <>
//                     <Avatar src={`/img/user_icons_by_roles/${params.row.picture}`} alt="user-icon-avatar" /> {params.row.name}
//                 </>
//             )
//         },

//         {
//             field: 'rgistration', cellClassName:'tableRowContent', headerName: t('Registration Date'), width: 100, flex: 1,
//             renderCell: (params) => (
//                 <>
//                      {params.row.name}
//                 </>
//             )
//         },

//         {
//             field: 'status', cellClassName:'tableRowContent', headerName: t('STATUS'), width: 80, flex: 1, headerAlign: 'center', align: 'center',
//             renderCell: (params) => (
//                 <>
//                      <Button className='btnStatus'><BsFillCircleFill/>Request Sent</Button>
                     
//                 </>
//             )
//         },

//         // {
//         //     field: 'Action',
//         //     width: 80,
//         //     sortable: false,
//         //     disableColumnMenu: true,
//         //     headerAlign: 'center',
//         //     cellClassName: 'super-app-theme--cell',
//         //     align: 'center',
//         //     // renderHeader: () => ('Action'),
//         //     renderCell: (params) => (
//         //         <div className='actionBtns'>
//         //         <IconButton size="small"
//         //             onClick={() => {
//         //                 //navigate(`/modules-core/users/form/${params.row.userId}`)
//         //                 if (F_hasPermissionTo('update-user')) {
//         //                     setEditFormHelper({ isOpen: true, openType: 'EDIT', userId: params.row.userId, isBlocking: false });
//         //                 } else {
//         //                     F_showToastMessage({ message: t('You do not have permission to edit user'), severity: 'error' });
//         //                 }
//         //             }}>
//         //             <HiPencil />
//         //         </IconButton>
//         //         <IconButton size="small"
//         //         >
//         //             <AiFillDelete />
//         //         </IconButton>

//         //         </div>
//         //     )
//         // }
//     ];

//     return (
//         <div className='tableRoleList' style={{ width: 'auto', height: 'auto' }}>
//             <EDataGrid
//                 className='tableRL'
//                 rows={rows}
//                 columns={columns}
//                 setRows={setRows}
//                 originalData={MSRoleList}
//             />
//         </div>
//     );
// }












import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import Button from 'new_styled_components/Button';
import { BsFillCircleFill } from 'react-icons/bs';
import StyledButton from 'new_styled_components/Button/Button.styled';
import { new_theme } from 'NewMuiTheme';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { display } from '@mui/system';
import { Checkbox } from '@mui/material';
import { useTranslation } from "react-i18next";

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        user: 'User 1',
        regDate: '2020-01-05',
        cmpDate: '2020-01-05',
      },
      {
        user: 'User 2',
        regDate: '2020-01-05',
        cmpDate: '2020-01-05',
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <TableRow className='rowAlt' sx={{ '& > *': { border: 'none' } }}>
        <TableCell>

          <IconButton onClick={() => setOpen(!open)} size="small" style={{ backgroundColor: new_theme.palette.primary.MedPurple, width:25, height:25 }}>
            {open ? <RemoveIcon style={{color: new_theme.palette.neutrals.white, padding:1.5}} /> : <AddIcon style={{color: new_theme.palette.neutrals.white, padding:1.5}} />}
          </IconButton>

        </TableCell>
        <TableCell className='tableRowContent' component="td" scope="row">
          {row.name}
        </TableCell>
        <TableCell className='tableRowContent' >{row.calories}</TableCell>
        <TableCell className='tableRowContent' >{row.fat}</TableCell>
        <TableCell className='tableRowContent' >{row.carbs}</TableCell>
      </TableRow>
      <TableRow className='rowAltIn'>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems:"center"}} >
                    <div>
                        <StyledButton className="btnSmall" eVarient='primary' eSize='medium' >{t('Send Request')}</StyledButton>
                        <StyledButton className="btnSmall" eVarient='primary' eSize='medium'style={{backgroundColor: new_theme.palette.primary.MedPurple, borderColor: new_theme.palette.primary.MedPurple}}> {t('Send Reminder')}</StyledButton>
                    </div>
                    <div style={{display:"contents"}}>
                        <Typography variant="h6" gutterBottom component="div">
                            TEAM STATUS
                        </Typography>
                        <div>
                            <Button className='btnStatus btnStatusSent btnSmall'><BsFillCircleFill/>{t("sentinel-MyUsers-BCTestRegistration:STATUS_REQUEST_SENT")}</Button><span style={{fontWeight:"600"}}>2</span>
                        </div>
                        <div>
                            <Button className='btnStatus btnStatusCompleted btnSmall'><BsFillCircleFill/>{t("sentinel-MyUsers-BCTestRegistration:STATUS_COMPLETED")}</Button><span style={{fontWeight:"600"}}>2</span>
                        </div>
                        <div>
                            <Button className='btnStatus btnStatusNotCompleted btnSmall'><BsFillCircleFill/>{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_COMPLETED")}</Button><span style={{fontWeight:"600"}}>2</span>
                        </div>
                    </div>
                </div>
                <Table size="small" aria-label="purchases" >
                    <TableHead>
                    <TableRow >
                        <TableCell className='MuiDataGrid-columnHeaderTitle'>
                            <Checkbox></Checkbox>
                        </TableCell>
                        <TableCell className='MuiDataGrid-columnHeaderTitle MuiDataGrid-columnHeader--sortable MuiDataGrid-columnHeader--sorted' >User xcc</TableCell>
                        <TableCell className='MuiDataGrid-columnHeaderTitle MuiDataGrid-columnHeader--sortable'>{t('Due Date')}</TableCell>
                        <TableCell className='MuiDataGrid-columnHeaderTitle MuiDataGrid-columnHeader--sortable'>{t('Completion Date')}</TableCell>
                        <TableCell align='center' className='MuiDataGrid-columnHeaderTitle MuiDataGrid-columnHeader--sortable'>{t('Status')}</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody className='tableRoleList'>
                    {row.history.map((historyRow) => (
                        
                        <TableRow key={historyRow.date} className="rowAltIn">
                            <TableCell className='MuiDataGrid-columnHeaderTitle' style={{width:"90px"}}>
                                <Checkbox></Checkbox>
                            </TableCell>
                            <TableCell component="td" scope="row">
                                {historyRow.user}
                            </TableCell>
                            <TableCell>{historyRow.regDate}</TableCell>
                            <TableCell >{historyRow.cmpDate}</TableCell>
                            <TableCell align='center'><BsFillCircleFill/></TableCell>
                        
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.string.isRequired,
    carbs: PropTypes.string.isRequired,
    fat: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.string.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  }).isRequired,
};

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 1.5),
];

export default function CollapsibleTable() {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper} className="tableRoleList" style={{boxShadow:'none'}}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell className='borderNone' />
            <TableCell className='MuiDataGrid-columnHeaderTitle borderNone'>{t('User')}</TableCell>
            <TableCell className='MuiDataGrid-columnHeaderTitle borderNone'>{t('Due Date')}</TableCell>
            <TableCell className='MuiDataGrid-columnHeaderTitle borderNone'>{t('Completion Date')}</TableCell>
            <TableCell className='MuiDataGrid-columnHeaderTitle borderNone'>{t('Status')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='tableRoleList'>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}