import React, {lazy, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import {Divider} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import {EButton, EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const ManageClassStudents = lazy(() => import("./ManageClassStudents"));
const ConfirmActionModal = lazy(() => import("components/common/ConfirmActionModal"));
const TraineeDetailsModal = lazy(() => import("components/TrainingModule/Enquires/Trainees/TraineeDetailsModal/TraineeDetailsModal"));


const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

export default function ClassStudents(props){
    const{
        MSClass = {trainees:[]},
        manageStudents=(action)=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [rows,setRows]= useState([]);
    const [swipeableDrawerHelper,setSwipeableDrawerHelper] = useState({isOpen: false});
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, traineeId: undefined});
    const [isOpenTraineeModal,setIsOpenTraineeModal]=useState({isOpen: false, traineeId: undefined});

    const traineesList = MSClass.trainees.length>0 ? MSClass.trainees.map((item,index)=>
        ({  id: index+1,
            name: `${item?.name??'-'} ${item?.surname??'-'}`,
            gender:'',
            language:'',
            city: `${item?.details?.city??'-'}`,
            district:'',
            dateOfBirth: `${item?.details?.dateOfBirth??undefined}`,
            traineeId:item._id,
        })):[];

    useEffect(()=>{
        setRows(traineesList);
    },[MSClass.trainees]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            manageStudents({type:'REMOVE',payload:actionModal.traineeId});
        }
    },[actionModal.returnedValue]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: 'Student name', width: 120, flex: 1 },
        { field: 'gender', headerName: 'Gender', width: 120, flex: 1, hide: true },
        { field: 'language', headerName: 'Language', width: 120, flex: 1, hide: true },
        { field: 'city', headerName: 'City', width: 120, flex: 1 },
        { field: 'district', headerName: 'District', width: 120, flex: 1, hide: true },
        { field: 'dateOfBirth', headerName: 'Date of birth', width: 120, flex: 1,
            renderCell: ({row:{dateOfBirth}})=> dateOfBirth ? (new Date (dateOfBirth).toLocaleDateString()) : ("-")
        },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            hide: false,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{traineeId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                setIsOpenTraineeModal({isOpen: true, traineeId})
                            }}><Visibility/>
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
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{traineeId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                setActionModal({isOpen: true, traineeId})
                            }}><DeleteForeverIcon/>
                </IconButton>
            )
        }
    ];

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("Students")}</small>
                <Divider variant="insert" />
            </Grid>
            <Grid item xs={5}>
                <Paper elevation={11} className='p-2'>
                    <Grid container>
                        <Grid item xs={12} sm={6} className='d-flex align-items-center'>
                            <Typography variant="body1" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Class summary")}
                            </Typography>
                            <AccountBalanceIcon className={`${classes.darkViolet} pl-2`} fontSize='large'/>
                        </Grid>
                        <Grid item xs={12} sm={6} className='d-flex align-items-center'>
                            <Typography variant="body1" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {`${t("Students")}: ${MSClass.trainees.length}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={7} className='d-flex justify-content-end'>
                <EButton eSize="small" eVariant="secondary"
                         startIcon={<AssignmentIcon/>}
                         onClick={()=>{
                            setSwipeableDrawerHelper(p=>({...p,isOpen:true}))
                         }}
                >
                    {MSClass.trainees.length>0 ?  t("Manage trainees") : t("Assign trainees")}
                </EButton>
            </Grid>
            <Grid item xs={12}>
                <div style={{width: 'auto', height: 'auto'}}>
                    <EDataGrid
                        rows={rows}
                        columns={columns}
                        rowsMargin={3}
                        density='compact'
                        isVisibleToolbar={false}
                        setRows={setRows}
                        originalData={traineesList}
                    />
                </div>
            </Grid>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing student from class")}
                                actionModalMessage={t("Are you sure you want to remove student from class? You can add a student back to the class, but you will lose the class-related data!")}
            />
            <ManageClassStudents swipeableDrawerHelper={swipeableDrawerHelper}
                                 setSwipeableDrawerHelper={setSwipeableDrawerHelper}
                                 assignedTrainees={MSClass.trainees}
                                 manageStudents={manageStudents}
                                 setIsOpenTraineeModal={setIsOpenTraineeModal}
            />
            <TraineeDetailsModal isOpenTraineeModal={isOpenTraineeModal}
                                 setIsOpenTraineeModal={setIsOpenTraineeModal}
            />
        </Grid>
    )
}