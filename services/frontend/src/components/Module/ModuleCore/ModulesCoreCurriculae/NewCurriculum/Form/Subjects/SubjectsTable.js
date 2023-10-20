import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableToolbar from "../../../../../../common/Table/TableToolbar";
import TableSearch from "../../../../../../common/Table/TableSearch";
import CustomNoRowsOverlay from "../../../../../../common/Table/CustomNoRowsOverlay";
import {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmActionModal from "../../../../../../common/ConfirmActionModal";
import {useMainContext} from "../../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useCurriculumContext} from "../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function SubjectsTable({handleRemoveSubject}) {
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const {F_showToastMessage} = useMainContext();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeIndex: undefined});

    /** CurriculumContext ------------------------------------------**/
    const {
        setSubjectDisplayMode,
        trainingModules,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(actionModal.returnedValue){
            handleRemoveSubject(actionModal.removeIndex);
            F_showToastMessage('Data was removed')
        }
    },[actionModal.returnedValue]);

    const TrainingModulesList = trainingModules?.length>0 ? trainingModules.map((item,index)=>
        ({  id: index+1,
            name: item.newName,
            originalName: item?.originalTrainingModule?.name,
            chapters: item?.chosenChapters?.length??0,
            category: item?.originalTrainingModule?.category?.name,
            durationTime: item?.originalTrainingModule?.estimatedTime??0,
            filledTime: item?.originalTrainingModule?.hours??1,
            completed: item?.originalTrainingModule?.estimatedTime,
            subjectId: item?.originalTrainingModule?._id,
        })) : [];

    useEffect(()=>{
        setRows(TrainingModulesList);
    },[trainingModules]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Subject name'), width: 120, flex: 1 },
        { field: 'originalName', headerName: t('Original name'), width: 120, flex: 1, hide: true },
        { field: 'chapters', headerName: t('Chapters'), width: 120, flex: 1},
        { field: 'category', headerName: t('Category'), width: 120, flex: 1, hide: true },
        { field: 'durationTime', headerName: t('Duration [h]'), width: 120, flex: 1 },
        { field: 'completed', headerName: t('Completed [%]'), width: 120, flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderCell: (params) =>(
                <Box sx={{width: '100%'}} className="d-flex align-items-center m-0 p-0">
                    <Box >
                        <LinearProgress variant="determinate"  value={`${(params.row.filledTime).toFixed(2)}`} />
                    </Box>
                    <Box minWidth={35}>
                        {/*<small className="">{`${((params.row.filledTime*100)/(params.row.durationTime)).toFixed(2)}%`}</small>*/}
                        <small className="">{`${(params.row.filledTime).toFixed(2)}%`}</small>
                    </Box>
                </Box>
            )
        },
        { field: 'action-remove',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<RemoveCircleOutlineIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" className={`${classes.darkViolet}`} onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeIndex: params.row.id-1})}}>
                    <DeleteForeverIcon className="m-2"/>
                </IconButton>
            )
        },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`} onClick={()=>setSubjectDisplayMode({mode:'FORM-EDIT', subjectId: params.row.subjectId})}>
                    <BsPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div className={classes.root} >
            <EDataGrid rows={rows}
                      autoHeight={true}
                      columns={columns}
                      isVisibleToolbar={false}
                      rowsPerPageOptions={[5, 10, 25]}
                      disableSelectionOnClick={true}
                      classes={{root: classes.root}}
                      pageSize={pageSize}
                      onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                      components={{ Toolbar: TableToolbar, NoRowsOverlay: CustomNoRowsOverlay, }}
                      componentsProps={{
                          toolbar: {
                              value: searchText,
                              onChange: (e) => TableSearch(e.target.value,TrainingModulesList,setSearchText, setRows),
                              clearSearch: () => TableSearch('',TrainingModulesList,setSearchText, setRows),
                          },
                      }}
            />
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing subject from curriculum")}
                                actionModalMessage={t("Are you sure you want to remove subject from curriculum? The action is not reversible!")}
            />
        </div>
    );
}
