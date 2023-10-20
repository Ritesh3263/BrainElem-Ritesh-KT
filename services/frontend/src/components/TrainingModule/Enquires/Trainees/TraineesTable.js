import  React,{useEffect, useState}  from 'react';
import {EDataGrid} from "styled_components";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableSearch from "components/common/Table/TableSearch";
import Visibility from "@material-ui/icons/Visibility";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useEnquiryContext} from "components/_ContextProviders/EnquiryProvider/EnquiryProvider";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function TraineesTable({handleRemoveTrainee, traineeDetailsHandler}) {
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const {F_showToastMessage} = useMainContext();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeId: undefined});

    /** EnquiryContext ------------------------------------------**/
    const {
        currentEnquiry,
    } = useEnquiryContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(actionModal.returnedValue){
            handleRemoveTrainee(actionModal.removeId);
            F_showToastMessage('Data was removed')
        }
    },[actionModal.returnedValue]);

    const TrainingModulesList = currentEnquiry?.trainees?.length>0 ? currentEnquiry?.trainees.map((item,index)=>
        ({  id: index+1,
            name: `${item?.name??'-'} ${item?.surname??'-'}`,
            companyName: item?.companyName??'-',
            createdAt: item?.createdAt??undefined,
            traineeId: item?._id,
        })) : [];

    useEffect(()=>{
        setRows(TrainingModulesList);
    },[currentEnquiry?.trainees]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Student name'), width: 120, flex: 1 },
        { field: 'companyName', headerName: t('Company name'), width: 120, flex: 1},
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<Visibility/>),
            renderCell: (params) =>(
                <IconButton size="small" className={`${classes.darkViolet}`} onClick={()=>traineeDetailsHandler('OPEN',params.row.traineeId)}>
                    <Visibility className="m-2"/>
                </IconButton>
            )
        },
        { field: 'action-remove',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            hide: true,
            renderHeader: ()=>(<RemoveCircleOutlineIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" className={`${classes.darkViolet}`} onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeId: params.row.traineeId})}}>
                    <DeleteForeverIcon className="m-2"/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{height:'auto'}}>
            <EDataGrid rows={rows}
                      columns={columns}
                      disableSelectionOnClick={true}
                      onPageSizeChange={(e)=>setPageSize(e.pageSize)}
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
                                actionModalTitle={t("Removing student from enquiry")}
                                actionModalMessage={t("Are you sure you want to remove student from enquiry? The action is not reversible!")}
            />
        </div>
    );
}
