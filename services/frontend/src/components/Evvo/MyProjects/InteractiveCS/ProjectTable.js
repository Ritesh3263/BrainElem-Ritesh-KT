import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from "new_styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/core/styles";
import { BsPencil} from "react-icons/bs";
import {AiFillDelete} from "react-icons/ai";
import {HiPencil} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { Badge, Box, Checkbox, ThemeProvider, Tooltip, Typography } from "@mui/material";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import './Project.scss';
import moduleCoreService from "services/module-core.service";
import ProjectService from "services/project.service";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import { new_theme } from 'NewMuiTheme';
import { BsFillCircleFill } from 'react-icons/bs';

const palette = new_theme.palette;

export default function ProjectTable(props) {
    const { F_showToastMessage, F_hasPermissionTo } = useMainContext();
    const {
        projects = [],
        editFormHelper = {},
        setEditFormHelper = () => { },
    } = props;
    const { t ,i18n} = useTranslation(['common', 'mySpace-myResources', 'sentinel-MyProjects-AutomatedProjects']);
    const [rows, setRows] = useState([]);
    const [projectIdToDelete,setProjectIdToDelete]=useState(0);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const projectList = projects.length > 0 ? projects.map((item, index) =>({
      index:index,
      id:item._id,
      selection: false,
      name: item.name,
      // count number of unique users inside cognitiveBlockCollection[].users[]
      // teamName: item.cognitiveBlockCollection.length > 0 ? item.cognitiveBlockCollection.map((item, index) => item.users.length).reduce((a, b) => a + b) : 0,
      // show `deadline: "2023-12-31T23:59:59.000Z"` date in yyyy/mm/dd format
      numberOfParticipants: item.numberOfParticipants,
      deadline: item.deadline ? new Date(item.deadline).toLocaleDateString() : '',
      progress: item.progress,
      status: item.status,
    })) : [];

    const renderProjectStatus = (status,progress) => {
        // force: if progress is within 100 and 0, send 'in_progress' like status
        if(progress>0 && progress<100){
            status='in_progress'
        }

        switch (status) {
            case 'todo':
                return <>
                <BsFillCircleFill size={12} style={{color: new_theme.palette.secondary.DarkPurple}}/>
                <Typography variant="body4" sx={{ pl: 2, color: palette.newSupplementary.NSupText }}>{t('mySpace-myResources:TO DO')}</Typography>
              </>
            case 'in_progress':
                return <>
                <BsFillCircleFill size={12} style={{color: new_theme.palette.info.main}}/>
                <Typography variant="body4" sx={{ pl: 2, color: palette.newSupplementary.NSupText }}>{t('mySpace-myResources:IN PROGRESS')}</Typography>
              </>
            case 'done':
                return <>
                <BsFillCircleFill size={12} style={{color:palette.secondary.SLightGreen}}/>
                <Typography variant="body4" sx={{ pl: 2, color: palette.newSupplementary.NSupText }}>{t('mySpace-myResources:DONE')}</Typography>
              </>
            case 'delayed':
                return <>
                <BsFillCircleFill size={12} style={{color: new_theme.palette.error.main}}/>
                <Typography variant="body4" sx={{ pl: 2, color: palette.newSupplementary.NSupText }}>{t('sentinel-MyProjects-AutomatedProjects:DELAYED')}</Typography>
              </>
            default:
                return <>
                <BsFillCircleFill size={12} style={{color: new_theme.palette.secondary.DarkPurple}}/>
                <Typography variant="body4" sx={{ pl: 2, color: palette.newSupplementary.NSupText }}>{t('mySpace-myResources:TO DO')}</Typography>
              </>
        }
    }

    useEffect(() => {
        setRows(projectList);
    }, [projects]);
    useEffect(()=>{
        if(projectIdToDelete!==0){

            setActionModal({ isOpen: true, returnedValue: false })
        }
    },[projectIdToDelete])

    const remove = (id) => {
        ProjectService.remove(id).then(res => {
            F_showToastMessage("sentinel-MyProjects-AutomatedProjects:PROJECT_REMOVED", "success")
            setEditFormHelper({ isOpen: true, openType: 'PREVIEW', projectId: undefined, isBlocking: false })
             
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', projectId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }
    const columns = [
        // { field: 'name', headerName: t('Name'), width: 120, flex: 1, sortable: false, disableColumnMenu: true },
        { field: 'selection', cellClassName:'tableRowContent', headerName: t(''), minWidth: 80, maxWidth: 80, sortable: false, disableColumnMenu: true, 
          renderCell: (params) => (<>
            <Checkbox color="primary" checked={params.row.selection} onChange={(e) => { 
              let newRows = [...rows];
              newRows[params.row.index].selection = e.target.checked;
              setRows(newRows);
              }} />
          </>) },
        { field: 'id', cellClassName:'tableRowContent', headerName: t('common:ID'), minWidth: 50, maxWidth: 50, disableColumnMenu: true, 
          renderCell: (params) => (<>{params.row.index+1}</>) },
        { field: 'name', cellClassName:'tableRowContent', headerName: t('sentinel-MyProjects-AutomatedProjects:PROJECT'), flex: 2, minWidth: 160, renderCell: (params) => (<>{params.row.name}</>) },
        // { field: 'teamName', cellClassName:'tableRowContent', headerName: t('Team'), flex: 2, minWidth: 100, 
        //   renderCell: (params) => (<>
        //     {params.row.teamName} {params.row.teamName > 1 ? t('members') : t('member')}
        //   </>) },
        { field: 'numberOfParticipants', cellClassName:'tableRowContent', headerName: t('sentinel-MyProjects-AutomatedProjects:PARTICIPANTS'), flex: 2, minWidth: 120,
          renderCell: (params) => (<>
            {params.row.numberOfParticipants}
          </>) },
        { field: 'deadline', cellClassName:'tableRowContent', headerName: t('sentinel-MyProjects-AutomatedProjects:DEADLINE'), flex: 2, minWidth: 120, headerAlign: 'right', align: 'right',
          renderCell: (params) => (<> {params.row.deadline} </>) },
        { field: 'progress', cellClassName:'tableRowContent', headerName: t('sentinel-MyProjects-AutomatedProjects:PROGRESS'), flex: 2, minWidth: 150,  headerAlign: 'center', align: 'center',
          renderCell: (params) => (<>
            <div className={`progressBar ${params.row.progress>0? 'ongoing':''}`}>
              <div className={`progressBarValue ${params.row.progress>=100? 'max':''}`} style={{ width: `${params.row.progress}%`}}></div>
            </div>
          </>) },
        { field: 'status', cellClassName:'tableRowContent', headerName: t('common:STATUS'), flex: 1, minWidth: 160, headerAlign: 'center', align: 'center',
          renderCell: (params) => renderProjectStatus(params.row.status,params.row.progress) },
        // { field: 'action', cellClassName:'tableRowContent', headerName: t('Actions'), flex: 1, minWidth: 200, renderCell: (params) => (<>{params.row.action}</>) },
        {
            field: 'Action',
            cellClassName: 'super-app-theme--cell',
            minWidth: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            filterable:false,
            renderHeader: () => t('common:ACTIONS'),
            renderCell: (params) => (
                <div className='actionBtns'>
                    <StyledEIconButton color="primary" size="medium" 
                            onClick={() => {
                                console.log("Inside Edit")
                                //navigate(`/modules-core/users/form/${params.row.projectId}`)
                                if (F_hasPermissionTo('update-user')) {
                                    setEditFormHelper({ isOpen: true, openType: 'EDIT', projectId: params.row.id, isBlocking: false });
                                } else {
                                    F_showToastMessage({ message: t('common:CANT_EDIT_USER'), severity: 'error' });
                                }
                            }}>
                        <HiPencil />
                    </StyledEIconButton> 
                    <StyledEIconButton color="primary" size="medium" 
                        onClick={()=>{
                            console.log("id",params.row.id)
                            setProjectIdToDelete(params.row.id)
                            }}
                        >
                        <AiFillDelete />
                    </StyledEIconButton>
                </div>
            )
        }
    ];

    return (<ThemeProvider theme={new_theme}>
        <div className='tableRoleList' style={{ width: 'auto', height: 'auto' }}>
            <NewEDataGrid
                className='tableRL'
                rows={rows}
                columns={columns}
                setRows={setRows}
                originalData={projectList}
            />
             <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("sentinel-MyProjects-AutomatedProjects:REMOVING_PROJECT")}
                actionModalMessage={t("sentinel-MyProjects-AutomatedProjects:ARE_YOU_SURE")}
                confirmAction={()=>remove(projectIdToDelete)}
                cancelAction={()=>setProjectIdToDelete(0)}
            />
        </div>
    </ThemeProvider>);
}
