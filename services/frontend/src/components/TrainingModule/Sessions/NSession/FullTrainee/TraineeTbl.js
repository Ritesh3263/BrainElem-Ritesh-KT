import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
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
import { BsFillCircleFill } from 'react-icons/bs';
import StyledButton from 'new_styled_components/Button/Button.styled';
import { new_theme } from 'NewMuiTheme';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Checkbox, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import STATUSES from '../../../enums/statusEnum';
import { useToasts } from 'react-toast-notifications';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TableSortLabel from '@mui/material/TableSortLabel';

import {FormControl} from '@mui/material';
import {InputLabel} from '@mui/material';
import {NativeSelect} from '@mui/material';
import {TextField} from '@mui/material';

import BCTestService from '../../../../../services/bcTestRegistration.service';


function Row(props) {
  const { t } = useTranslation();
  const { addToast } = useToasts();
  const { row, index, selectedIds } = props;
  const [open, setOpen] = React.useState(false);
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const [users,setUsers] = React.useState([]);
  const [value, setValue] = React.useState(new Date());

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  console.log(users);

  const selectAll =(e)=>{  
    if(e.target.checked){
       let trainee = row.trainee;
       console.log(trainee);
       let ids = [];
       trainee.forEach((t)=> {ids=[...ids, t._id]})
       console.log(ids);
       setUsers(ids);        
       setIsCheckAll(true); 
    }else{
      setUsers([]);
      setIsCheckAll(false);
    }
  }

  const onChangeHandler = (e, id) => {
    setIsCheckAll(false)
    const trainee = row.trainee.find((t)=>t._id===id);
    if(!trainee) return;
    if(e.target.checked){
      if(!users.includes(id))
      setUsers(pre=>[...pre ,id])
    }else{
      setUsers(pre=> pre.filter( item=> item !==id))
    }
    // if (e.target.name === 'selectAll') {
    //   props.selectAll(e, index, 'selectAll');
    // } else {
    //   props.selectAll(e, index, id);
    // }
  }
  const closeHandler = (row) => {
    const payLoad = {
      userId: users,
      registerDate: value
    }
    BCTestService.bcTestRegister(payLoad).then((res) => {
      addToast(t('Request sent successfully.'), { appearance: 'success', autoDismiss: true });
      props.fetchTeamsData()
    }).catch((err) => {
      addToast(err.message, { appearance: 'error', autoDismiss: true });
    })
  }
  return (
    <ThemeProvider theme={new_theme}>
      <React.Fragment>

        <TableRow className='rowAlt' sx={{ '& > *': { border: 'none' } }} >
          <TableCell style={{padding:props.css}}>
            <IconButton className='tbl_icon' onClick={() => setOpen(!open)} size="small" sx={open ? { backgroundColor: new_theme.palette.primary.PWhite, border: `1px solid ${new_theme.palette.newSupplementary.NSupText}` } : { backgroundColor: new_theme.palette.primary.PWhite, border: `1px solid ${new_theme.palette.newSupplementary.NSupText}` }} style={{ width: 25, height: 25 }}>
              {open ? <RemoveIcon style={{ color: new_theme.palette.newSupplementary.NSupText, padding: 1.5 }} /> : <AddIcon style={{ color: new_theme.palette.newSupplementary.NSupText, padding: 1.5 }} />}
            </IconButton>
          </TableCell>
          <TableCell className='tableRowContent'  hidden={!props.userColumn} style={{padding:props.css}}>

            {row.name}</TableCell>

          <TableCell style={{padding:props.css}} className='tableRowContent' hidden={!props.registrationDateColumn}>{row?.registerDate ? dayjs(row?.registerDate).format('DD/MM/YYYY HH:mm') : '-'}</TableCell>
          <TableCell style={{padding:props.css}} className='tableRowContent' hidden={!props.completionDateColumn}>{row?.completionDate ? dayjs(row.completionDate).format('DD/MM/YYYY HH:mm') : '-'}</TableCell>

          <TableCell style={{padding:props.css}} align='center' className='tableRowContent' hidden={!props.statusColumn}>
            {
              row?.status != undefined ?
                <Button

                  eSize="xsmall"
                  className={`sts_fill btnStatus`}><BsFillCircleFill className='statusFill' />
                  {/* row?.brainCoreTest?.status */}
                </Button>
                :
                <>
                  <Button

                    eSize="xsmall"
                    className='sts_fill btnStatus btnStatusNoTest'>
                    <BsFillCircleFill className='statusFill' />
                    {/* STATUSES.NO_TEST_TAKEN */}
                  </Button>
                </>
            }
          </TableCell>
        </TableRow>

        <TableRow className='rowAltIn'>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0 }} className='innerBcTable'>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 20px 0" }} >
                  <div style={{ display: "flex", width: '100%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                      <Box sx={{ width: '75px', paddingLeft: '10px' }}>
                        <Checkbox name='selectTrainee'onChange={selectAll} checked={isCheckAll} ></Checkbox>
                      </Box>
                      <Stack spacing={3} >


                        <MobileDatePicker
                          className="btnSaveSmall"
                          label="Date mobile"
                          inputFormat="DD/MM/YYYY"
                          value={value}
                          onChange={handleChange}
                          onAccept={e => closeHandler(row)}
                          minDate={new Date()}
                          renderInput={(params) => <StyledButton eVariant="primary" eSize="xsmall" className="btnSaveSmall" {...params} disabled={row.requestSent > 0 || users.length === 0}>{t("Send Request")}</StyledButton>}
                        />
                      </Stack>
                    </LocalizationProvider>
                    {/* <StyledButton className="btnSmall" eVarient='primary' eSize='xsmall' style={{ backgroundColor: new_theme.palette.primary.MedPurple, borderColor: new_theme.palette.primary.MedPurple }}> {t("Send Reminder")}</StyledButton> */}
                  </div>
                  {/* <div style={{ display: "flex", gap: '20px', alignItems: "center" }}>
                    <Typography variant="subtitle1" gutterBottom component="h6" sx={{ fontWeight: 'bold', marginBottom: '0' }}>
                      {t("TEAM STATUS")}
                    </Typography>
                    <div>
                      <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusNoTest'><BsFillCircleFill />{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_INVITED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>{row?.brainCoreTest?.noTestTaken || 0}</Typography>
                    </div>
                    <div>
                      <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusSent'><BsFillCircleFill />{("Request Sent")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>{row?.brainCoreTest?.requestSent || 0}</Typography>
                    </div>
                    <div>
                      <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusCompleted'><BsFillCircleFill />{t("sentinel-MyUsers-BCTestRegistration:STATUS_COMPLETED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>{row?.brainCoreTest?.completed || 0}</Typography>
                    </div>
                    <div>
                      <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusNotCompleted'><BsFillCircleFill />{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_COMPLETED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>{row?.brainCoreTest?.notCompleted || 0}</Typography>
                    </div>

                  </div> */}
                </div>
                <Table size="small" aria-label="purchases" >
                  {/* <TableHead>
                    <TableRow >
                      <TableCell className='MuiDataGrid-columnHeaderTitle'>
                        <Checkbox name='selectAll' onChange={e => onChangeHandler(e)}></Checkbox>
                      </TableCell>
                      <TableCell className='MuiDataGrid-columnHeaderTitle MuiDataGrid-columnHeader--sortable'>{t("User")}</TableCell>
                      <TableCell className='MuiDataGrid-columnHeaderTitle'>{t("Registration Date")}</TableCell>
                      <TableCell className='MuiDataGrid-columnHeaderTitle'>{t("Completion Date")}</TableCell>
                      <TableCell align='center' className='MuiDataGrid-columnHeaderTitle'>{t("Status")}</TableCell>
                    </TableRow>
                  </TableHead> */}
                  <TableBody className='tableRoleList '>
                    {row.trainee.map((trainee) => (

                      <TableRow key={trainee.date} className="rowAltIn2">
                        <TableCell className='MuiDataGrid-columnHeaderTitle' style={{ width: "50px", paddingLeft: '0', paddingLeft: '10px' }}>
                          <Checkbox name='selectTrainee' onChange={e => onChangeHandler(e, trainee._id)} checked={users?.includes(trainee._id)}></Checkbox>
                        </TableCell>
                        <TableCell sx={{ width: '25%' }} component="td" scope="row">
                          {trainee.name + " " + trainee.surname}
                        </TableCell>
                        <TableCell sx={{ width: '25%' }}>{trainee?.brainCoreTest?.registerDate ? dayjs(trainee?.brainCoreTest?.registerDate).format('DD/MM/YYYY HH:mm') : '-'}</TableCell>
                        <TableCell sx={{ width: '25%' }}>{trainee.brainCoreTest?.completionDate ? dayjs(trainee.brainCoreTest?.completionDate).format('DD/MM/YYYY HH:mm') : '-'}</TableCell>

                        


                        {/* {trainee?.brainCoreTest?.status === STATUSES.COMPLETED && <TableCell align='center'><BsFillCircleFill className='completed' style={{ color: new_theme.palette.secondary.SGreen }} /></TableCell>}
                        {trainee?.brainCoreTest?.status === STATUSES.NOT_COMPLETED && <TableCell align='center'><BsFillCircleFill className='not_completed' style={{ color: new_theme.palette.secondary.SRed }} /></TableCell>}
                        {trainee.brainCoreTest?.status === STATUSES.REQUEST_SENT && <TableCell align='center'><BsFillCircleFill className='request_sent' style={{ color: new_theme.palette.secondary.Turquoise }} /></TableCell>}
                        {trainee?.brainCoreTest?.status === "" && <TableCell align='center'><BsFillCircleFill className='no_test_taken' style={{ color: new_theme.palette.newSupplementary.NSupText }} /></TableCell>}
                        {console.log(trainee?.brainCoreTest)} */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>

      </React.Fragment>
    </ThemeProvider>
  );
}

export default function CollapsibleTable({openFilter,setOpenFilter,openColumn,css,searchText}) {
  const { addToast } = useToasts();
  const { t } = useTranslation(['translation', 'sentinel-MyUsers-BCTestRegistration']);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('user');
  const [column,setColumn]=React.useState('name');
  const [operator,setOperator]=React.useState('equals');
  const [filterKey,setFilterKey]=React.useState('');

  const [userColumn,setUserColumn]=React.useState(true);
  const [registrationDateColumn,setRegistrationDateColumn]=React.useState(true);
  const [completionDateColumn,setCompletionDateColumn]=React.useState(true);
  const [statusColumn,setStatusColumn]=React.useState(true);

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const onSelectAllHandler = (event, index, type) => {
    if (type === 'selectAll') {
      if (event.target.checked) {
        setSelected(prevSelected => {
          const newIds = rows[index].trainee.map(element => element._id)
          const uniqueIds = new Set([...prevSelected, ...newIds])
          return Array.from(uniqueIds)
        })
        return;
      }
      setSelected([]);
    } else {
      if (event.target.checked) {
        setSelected([...selected, type])
      } else {
        const filteredIds = selected.filter((id) => id !== type);
        setSelected(filteredIds);
      }
    }
  }

  function fetchTeamsData() {
    BCTestService.getBCTestTeams().then((res) => {
      const temp = res.data.data.map((dat) => {
        return { '_id': dat._id, 'name': dat.name, 'registerDate': dat.brainCoreTest.registerDate, 'completionDate': dat.brainCoreTest.completionDate, 'status': dat.brainCoreTest.status, 'trainee': dat.trainee, 'requestSent': dat.brainCoreTest.requestSent }
      })
      setRows(temp);
      addToast(t('Team(s) fetched successfully.'), { appearance: 'success', autoDismiss: true });
    }).catch((err) => {
      addToast(t('Something went wrong. Please, try again later.'), { appearance: 'error', autoDismiss: true });
    });
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const headCells = [
    {
      id: '',
      width: true,
      visible:true
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'User',
      width: false,
      visible:userColumn,
    },
    {
      id: 'registerDate',
      numeric: false,
      disablePadding: false,
      label: 'Due Date	',
      width: false,
      visible:registrationDateColumn,
    },
    {
      id: 'completion_date',
      numeric: false,
      disablePadding: false,
      label: 'Completion date',
      width: false,
      visible:completionDateColumn,
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
      width: false,
      visible:statusColumn,
    },

  ];
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    console.log('order,', order, stabilizedThis)
    return stabilizedThis.map((el) => el[0]);
  }
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };


    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'center' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              width={headCell.width ? '5%' : '25%'}
              hidden={!headCell.visible}
              style={{padding:css}}
            >
              <TableSortLabel
                className='icon'
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  function filter(value){
    let temp=rows;
    switch(operator){
      case 'equals':
         temp=rows.filter((row)=>row[column]===value);
      case 'contains':
         temp = rows.filter((row)=>row[column].includes(value));
      case 'startsWith':
        temp = rows.filter((row)=>row[column].startsWith(value));
      case 'endsWith':
          temp = rows.filter((row)=>row[column].endsWith(value));
    }
    setFilteredRows(temp);
  }
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  useEffect(()=>{
      search(searchText)
  },[searchText])
  function search(value){
    console.log(rows,"000")
    const temp=rows.filter((row)=>(row.name?.toLowerCase().includes(value.toLowerCase()) || row.registerDate?.toLowerCase().includes(value.toLowerCase()) ||  row.status?.toLowerCase().includes(value.toLowerCase())   ));
    setFilteredRows(temp);
  }
  function showOrHide(name){
    if(name=="showAll"){
      setUserColumn(true);
      setRegistrationDateColumn(true)
      setCompletionDateColumn(true)
      setStatusColumn(true)
    }
    if(name=="hideAll"){
      setUserColumn(false);
      setRegistrationDateColumn(false)
      setCompletionDateColumn(false)
      setStatusColumn(false)
    }
  }
 

  return (
    <TableContainer component={Paper} className="tableRoleList position_relative" style={{ boxShadow: 'none' }}>
      <Table aria-label="collapsible table" className='mainBcTable'>
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}

          onRequestSort={handleRequestSort}
        />
        <TableBody className='tableRoleList'>
          {(rows.length > 0 && filterKey=='' && searchText=='') && stableSort(rows, getComparator(order, orderBy)).map((row, i) => {
            return <Row key={row._id} row={row} selectAll={onSelectAllHandler} index={i} selectedIds={selected} fetchTeamsData={fetchTeamsData} userColumn={userColumn} registrationDateColumn={registrationDateColumn} completionDateColumn={completionDateColumn} statusColumn={statusColumn} css={css}/>
          })}
           {(filteredRows.length > 0 && (filterKey!='' || searchText!='')) && stableSort(filteredRows, getComparator(order, orderBy)).map((row, i) => {
            return <Row key={row._id} row={row} selectAll={onSelectAllHandler} index={i} selectedIds={selected} fetchTeamsData={fetchTeamsData} userColumn={userColumn} registrationDateColumn={registrationDateColumn} completionDateColumn={completionDateColumn} statusColumn={statusColumn} css={css}/>
          })}
        </TableBody>
      </Table>
     {openFilter &&  <div
  role="tooltip"
  class="MuiDataGrid-panel css-n3z9fz-MuiPopper-root-MuiDataGrid-panel MuiPopperUnstyled-root"
  style={{position: 'absolute',inset: "0px auto auto 0px", margin: "0px", top: '0', left:'10px'}}
  data-popper-placement="bottom-start"
>
  <div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiDataGrid-paper css-154sxbz-MuiPaper-root-MuiDataGrid-paper">
    <div tabindex="0" data-testid="sentinelStart"></div>
    <div
      tabindex="-1"
      class="MuiDataGrid-panelWrapper css-1miuj5f-MuiDataGrid-panelWrapper"
    >
      <div class="MuiDataGrid-panelContent css-1sjjn1c-MuiDataGrid-panelContent">
        <div class="MuiDataGrid-filterForm css-1t5wrdm-MuiDataGrid-filterForm filters-desc" style={{alignItems:'baseline'}}>
          <div class="MuiFormControl-root MuiDataGrid-filterFormDeleteIcon css-rne967-MuiFormControl-root-MuiDataGrid-filterFormDeleteIcon">
            <button
              class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root"
              tabindex="0"
              type="button"
              aria-label="Delete"
              title="Delete"
              onClick={()=>setOpenFilter(!openFilter)}
            >
              <svg
                style={{width:'1.25rem', margin:'0 5px'}}
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-ptiqhd-MuiSvgIcon-root"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="CloseIcon"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
              <span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
            </button>
          </div>
          {/* <div class="MuiFormControl-root MuiDataGrid-filterFormLinkOperatorInput css-7kyykm-MuiFormControl-root-MuiDataGrid-filterFormLinkOperatorInput">
            <div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary Mui-disabled MuiInputBase-formControl  css-1rcj80e-MuiInputBase-root-MuiInput-root-MuiSelect-root">
              <select
                class="MuiNativeSelect-select MuiNativeSelect-standard Mui-disabled MuiInputBase-input MuiInput-input Mui-disabled css-1dmqq7i-MuiNativeSelect-select-MuiInputBase-input-MuiInput-input"
                disabled=""
                aria-invalid="false"
                aria-label="Logic operator"
              >
                <option value="and">And</option>
                <option value="or">Or</option>
              </select>
              <svg
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiNativeSelect-icon MuiNativeSelect-iconStandard Mui-disabled css-10bey84-MuiSvgIcon-root-MuiNativeSelect-icon"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="ArrowDropDownIcon"
              >
                <path d="M7 10l5 5 5-5z"></path>
              </svg>
            </div>
          </div> */}
          <FormControl>
            <InputLabel variant="standard" htmlFor="uncontrolled-native" sx={{fontSize:'18px'}}>
              Columns
            </InputLabel>
            <NativeSelect
              onChange={(e)=>setColumn(e.target.value)}
              inputProps={{
                name: 'age',
                id: 'uncontrolled-native',
              }}
              
            >
              <option value="name">{t("USER")}</option>
              <option value="registration_date">{t("DUE DATE")}</option>
              <option value="completion_date">{t("COMPLETION DATE")}</option>
              <option value="status">{t("STATUS")}</option>
            </NativeSelect>
          </FormControl>
          {/* <div class="MuiFormControl-root MuiDataGrid-filterFormColumnInput css-q68e8e-MuiFormControl-root-MuiDataGrid-filterFormColumnInput">
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-standard MuiFormLabel-colorPrimary MuiFormLabel-filled css-4h6sbg-MuiFormLabel-root-MuiInputLabel-root"
              data-shrink="true"
              for="mui-247"
              id="mui-248"
            >
              Columns
            </label>
            <div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-formControl  css-1rcj80e-MuiInputBase-root-MuiInput-root-MuiSelect-root">
              <select
                class="MuiNativeSelect-select MuiNativeSelect-standard MuiInputBase-input MuiInput-input css-1dmqq7i-MuiNativeSelect-select-MuiInputBase-input-MuiInput-input"
                aria-invalid="false"
                id="mui-247"
                onChange={(e)=>setColumn(e.target.value)}
              >
                <option value="name">USER</option>
                <option value="registration_date">REGISTRATION DATE</option>
                <option value="completion_date">COMPLETION DATE</option>
                <option value="status">STATUS</option>
              </select>
              <svg
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiNativeSelect-icon MuiNativeSelect-iconStandard css-10bey84-MuiSvgIcon-root-MuiNativeSelect-icon"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="ArrowDropDownIcon"
              >
                <path d="M7 10l5 5 5-5z"></path>
              </svg>
            </div>
          </div> */}
            <FormControl>
              <InputLabel variant="standard" htmlFor="uncontrolled-native" sx={{fontSize:'18px'}}>
                Operator
              </InputLabel>
              <NativeSelect
                onChange={(e)=>setOperator(e.target.value)}
                inputProps={{
                  name: 'age',
                  id: 'uncontrolled-native',
                }}
                
              >
                <option value="contains">{t("containsnew")}</option>
                <option value="equals">{t("equals")}</option>
                <option value="startsWith">{t("starts with")}</option>
                <option value="endsWith">{t("ends with")}</option>
              </NativeSelect>
            </FormControl>

          {/* <div class="MuiFormControl-root MuiDataGrid-filterFormOperatorInput css-17vwkjt-MuiFormControl-root-MuiDataGrid-filterFormOperatorInput">
            <label
              class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-standard MuiFormLabel-colorPrimary MuiFormLabel-filled css-4h6sbg-MuiFormLabel-root-MuiInputLabel-root"
              data-shrink="true"
              for="mui-249"
              id="mui-250"
            >
              Operator
            </label>
            <div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-formControl  css-1rcj80e-MuiInputBase-root-MuiInput-root-MuiSelect-root">
              <select
                class="MuiNativeSelect-select MuiNativeSelect-standard MuiInputBase-input MuiInput-input css-1dmqq7i-MuiNativeSelect-select-MuiInputBase-input-MuiInput-input"
                aria-invalid="false"
                id="mui-249"
                onChange={(e)=>setOperator(e.target.value)}

              >
                <option value="contains">contains</option>
                <option value="equals">equals</option>
                <option value="startsWith">starts with</option>
                <option value="endsWith">ends with</option>
              </select>
              <svg
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiNativeSelect-icon MuiNativeSelect-iconStandard css-10bey84-MuiSvgIcon-root-MuiNativeSelect-icon"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="ArrowDropDownIcon"
              >
                <path d="M7 10l5 5 5-5z"></path>
              </svg>
            </div>
          </div> */}
          {/* <TextField
            label="Filter value"
            placeholder='Filterrrrr'
            value={filterKey}
            onChange={(e)=>{
              setFilterKey(e.target.value)
              filter(e.target.value)}}
            variant="standard"
          /> */}
          <TextField
            className='filter_search_bar'
            label="Value"
            defaultValue="Filter value"
            variant="standard"
            onChange={(e)=>{
              setFilterKey(e.target.value)
              filter(e.target.value)}}
            
          />
          {/* <div class="MuiFormControl-root MuiDataGrid-filterFormValueInput css-1h08ml-MuiFormControl-root-MuiDataGrid-filterFormValueInput">
            <div class="MuiFormControl-root MuiTextField-root css-1u3bzj6-MuiFormControl-root-MuiTextField-root">
              <label
                class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-standard MuiFormLabel-colorPrimary css-4h6sbg-MuiFormLabel-root-MuiInputLabel-root"
                data-shrink="true"
                for="mui-246"
                id="mui-246-label"
              >
                Value
              </label>
              <div class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-formControl css-wkhrtp-MuiInputBase-root-MuiInput-root">
                <input
                  aria-invalid="false"
                  placeholder="Filter value"
                  type="text"
                  class="MuiInputBase-input MuiInput-input css-1x51dt5-MuiInputBase-input-MuiInput-input"
                  value={filterKey}
                  id="mui-246"
                  onChange={(e)=>{
                    setFilterKey(e.target.value)
                    filter(e.target.value)}}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    <div tabindex="0" data-testid="sentinelEnd"></div>
  </div>
</div>}
{
  openColumn && <div
  role="tooltip"
  class="MuiDataGrid-panel css-n3z9fz-MuiPopper-root-MuiDataGrid-panel MuiPopperUnstyled-root"
  data-popper-placement="bottom-start"
  style={{position: 'absolute', 'inset': '0px auto auto 0px', margin: '0px', top: '0', left:'151px'}}
  data-popper-reference-hidden=""
  data-popper-escaped=""
>
  <div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiDataGrid-paper css-154sxbz-MuiPaper-root-MuiDataGrid-paper" style={{padding:'10px'}}>
    <div tabindex="0" data-testid="sentinelStart"></div>
    <div
      tabindex="-1"
      class="MuiDataGrid-panelWrapper css-1miuj5f-MuiDataGrid-panelWrapper"
    >
      
      <div class="MuiDataGrid-panelContent css-1sjjn1c-MuiDataGrid-panelContent">
        <div class="MuiDataGrid-columnsPanel css-atkep4-MuiDataGrid-columnsPanel">
          <div class="MuiDataGrid-columnsPanelRow css-1g7tkkg-MuiDataGrid-columnsPanelRow">
             <FormControlLabel control={<Switch className='toggle-green' checked={userColumn} />} label="User" onChange={(e)=>setUserColumn(e.target.checked)}/>
          </div>
          
          <div class="MuiDataGrid-columnsPanelRow css-1g7tkkg-MuiDataGrid-columnsPanelRow">
           <FormControlLabel control={<Switch className='toggle-green' checked={registrationDateColumn} />} label="Due Date" onChange={(e)=>setRegistrationDateColumn(e.target.checked)}/>
          </div>
          <div class="MuiDataGrid-columnsPanelRow css-1g7tkkg-MuiDataGrid-columnsPanelRow">
           <FormControlLabel control={<Switch className='toggle-green' checked={completionDateColumn} />} label="Completion Date" onChange={(e)=>setCompletionDateColumn(e.target.checked)}/>
           
          </div>
          <div class="MuiDataGrid-columnsPanelRow css-1g7tkkg-MuiDataGrid-columnsPanelRow">
          <FormControlLabel control={<Switch className='toggle-green' checked={statusColumn} />} label="Status" onChange={(e)=>setStatusColumn(e.target.checked)}/>
            
          </div>
        </div>
      </div>
      <div class="MuiDataGrid-panelFooter css-4rdffl-MuiDataGrid-panelFooter">
        <button
          class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-1e6y48t-MuiButtonBase-root-MuiButton-root"
          tabindex="0"
          type="button"
          onClick={()=>showOrHide("hideAll")}
        >
          {t("Hide all")}
          <span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
        </button>
        <button
          class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-1e6y48t-MuiButtonBase-root-MuiButton-root"
          tabindex="0"
          type="button"
          onClick={()=>showOrHide("showAll")}

        >
          {t("Show all")}
          <span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
        </button>
      </div>
    </div>
    <div tabindex="0" data-testid="sentinelEnd"></div>
  </div>
</div>

}


    </TableContainer>
  );
}