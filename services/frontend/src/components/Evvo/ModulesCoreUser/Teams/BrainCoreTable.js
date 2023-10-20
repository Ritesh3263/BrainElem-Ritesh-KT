import React, { useEffect, useState } from 'react';
import { NewEDataGrid } from 'new_styled_components';
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import { BsFillCircleFill } from 'react-icons/bs';

// Components
import WarningCredits from "components/Credits/WarningCredits";

import dayjs from 'dayjs';
import StyledButton from 'new_styled_components/Button/Button.styled';
import BCTestService from '../../../../services/bcTestRegistration.service';
import STATUSES from '../../../../enums/statusEnum';
import { useToasts } from 'react-toast-notifications';
import TeamService from "services/team.service"
import "./teams.scss"
import { useNavigate } from 'react-router-dom';
import BrainCoreTestInvitationCalendar from "components/common/BrainCoreTestInvitationCalendar"

// Services
import ContentService from "services/content.service";

// props.fetchUserData - function to reload data
export default function BrainCoreTable(props) {
    const {trainee, fetchUserData } = props;
    const navigate = useNavigate();
    const { addToast } = useToasts();
    const [value, setValue] = React.useState();
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    const [calendarUserId, setCalendarUserId] = React.useState();
    const [rows, setRows] = useState(trainee);

    const {
        MSRoles = [],
        teamId
    } = props;
    const { t } = useTranslation(['sentinel-MyTeams-Teams', 'common']);

    const MSRoleList = MSRoles.length > 0 ? MSRoles.map((item, index) =>
    ({
        id: index + 1,
        name: item.name,
        picture: item.picture,
        userId: item._id,
    })) : [];

    useEffect(() => {
        let updatedTrainees = trainee?.map((item) => {
            return({...item, username:`${item?.name} ${item?.surname}`})
        })
        setRows(updatedTrainees)
        setValue(updatedTrainees)
    }, [trainee])


    const columns = [
        {
            field: 'username', headerName: t('common:NAME'), width: 120, flex: 1, sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    {params.row.name + " " + params.row.surname}
                </>
            )
        },
        {
            field: 'registerDate', cellClassName: 'tableRowContent', headerName: t('common:DUE DATE'), width: 100, flex: 1,
            renderCell: (params) => (

                <>
                    {params.row?.brainCoreTest?.registerDate && params.row?.brainCoreTest?.status !== STATUSES.NOT_COMPLETED ? dayjs(params.row?.brainCoreTest?.registerDate).format('DD/MM/YYYY HH:mm') :
                         <StyledButton eVariant="primary" eSize="xsmall" className="btnSaveSmall" {...params}
                         onClick={()=>{setCalendarUserId(params.row._id); setCalendarOpen(true)}}
                        >
                            {t("common:SEND_REQUEST")}
                        </StyledButton>

                    }
                </>
            )
        },
        {
            field: 'completionDate', cellClassName: 'tableRowContent', headerName: t('common:COMPLETION DATE'), width: 100, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row?.brainCoreTest?.completionDate ? dayjs(params.row?.brainCoreTest?.completionDate).format('DD/MM/YYYY HH:mm') : '-'}
                </>
            )
        },
        {
            field: 'status', cellClassName: 'tableRowContent', headerName: t('common:STATUS'), width: 80, flex: 1, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <>
                    {params.row?.blockedByCredits && <WarningCredits></WarningCredits>}
                    {params.row?.brainCoreTest?.status === STATUSES.COMPLETED && <div className='btnStatus btnStatusCompleted'><BsFillCircleFill /></div>}
                    {params.row?.brainCoreTest?.status === STATUSES.NOT_COMPLETED && <div className='btnStatus btnStatusNotCompleted'><BsFillCircleFill /></div>}
                    {params.row?.brainCoreTest?.status === STATUSES.REQUEST_SENT && <div className='btnStatus btnStatusSent'><BsFillCircleFill /></div>}
                    {params.row?.brainCoreTest?.status === undefined && <div className='btnStatus btnStatusNoTest'><BsFillCircleFill /></div>}
                </>
            )
        },
        {
            field: 'action', cellClassName: 'tableRowContent', headerName: t('common:ACTIONS'), width: 100, flex: 1,
            renderCell: (params) => (
                <>
                    <StyledButton disabled={params.row?.blockedByCredits || params.row?.brainCoreTest?.status !== STATUSES.COMPLETED} eVariant="primary" eSize="xsmall" onClick={() => {navigate(`/sentinel/myteams/Results?teamId=${teamId}&userId=${params.row._id}`)} }>{t("sentinel-MyTeams-Teams:VIEW_RESULTS")}</StyledButton>
                </>
            )
        },
    ];

    return (
        <div className='tableRoleList' style={{ width: 'auto', height: 'auto' }}>
            <div className="view_results">
            <StyledButton eVariant="primary" eSize="xsmall" onClick={() => {navigate(`/sentinel/myteams/Results?teamId=${teamId}`)} }>{t("sentinel-MyTeams-Teams:VIEW_RESULTS")}</StyledButton>
            </div>
            <NewEDataGrid
                className='tableRL'
                rows={rows}
                setRows={setRows}
                getRowId={(row) => row._id}
                columns={columns}
                originalData={value}
                isVisibleToolbar={true}
            />
            <BrainCoreTestInvitationCalendar 
                calendarOpen={calendarOpen} 
                setCalendarOpen={setCalendarOpen}
                testType={ContentService.getBraincoreTestTypeForInvitation()}
                usersIds={[calendarUserId]}
                callback={props.fetchUserData}
            >
            </BrainCoreTestInvitationCalendar>
        </div>
    );
}
