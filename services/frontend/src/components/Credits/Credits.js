
// Comonent for managing credits
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//MUIv5u
import { Grid, Divider, Container, Typography, MenuItem } from '@mui/material';

// Custom components
import Navigation from "new_styled_components/Navigation/Navigation.styled";
import { NewEDataGrid } from 'new_styled_components';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import StyledMenu from 'new_styled_components/Menu/Menu.styled'

// Other components
import ModalTransferCredits from 'components/Credits/ModalTransferCredits'
import ModalReviewRequestCredits from "./ModalReviewRequestCredits";
import WarningCredits from "components/Credits/WarningCredits";

//Services
import CreditService from "services/credit.service";

// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


import { styled } from "@mui/system";
import { new_theme } from "NewMuiTheme";

const Text = styled(Typography)({
    fontFamily: 'Nunito',
    fontSize: '18px !important'
})



function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

//############################################################################ 
// Menu used for actions in each row with user
//############################################################################ 
function ActionsMenu({ row, othersCredits, myCredits, menuAnchorEl, openActionsMenu, handleCloseActionsMenu, loadCredits }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const [showModal, setShowModal] = useState(false)
    const [transferFrom, setTransferFrom] = useState();
    const [transferTo, setTransferTo] = useState();

    return <>
        <StyledMenu
            className="teams_togglemenu"
            anchorEl={menuAnchorEl}
            open={openActionsMenu}
            onClose={handleCloseActionsMenu}
        >
            <MenuItem disabled={myCredits[0]?.available <= 0} onClick={() => {
                setTransferFrom(myCredits[0]);
                setTransferTo(row);
                setShowModal(true)
                handleCloseActionsMenu()
            }} disableRipple>
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("sentinel-Admin-Credits:ASSIGN CREDITS")}</Typography>
            </MenuItem>
            <MenuItem disabled={row?.available < 1} onClick={() => {
                setTransferFrom(row);
                setShowModal(true);
                handleCloseActionsMenu()
            }} disableRipple>
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("sentinel-Admin-Credits:TRANSFER CREDITS")}</Typography>
            </MenuItem>
        </StyledMenu>
        <ModalTransferCredits
            list={myCredits.concat(othersCredits)}
            transferTo={transferTo}
            transferFrom={transferFrom}
            open={showModal}
            onClose={() => {
                setShowModal(false)
                loadCredits()
                setTransferFrom(undefined)
                setTransferTo(undefined);
            }}

        >
        </ModalTransferCredits>
    </>
}




//############################################################################ 
// Tab with users credits
//############################################################################ 
function UsersCreditsTab() {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const { F_getHelper, F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const isMdUp = useIsWidthUp("md");
    const { user } = F_getHelper()
    // Optional as parameter - when not provided it will use id of current module
    let { moduleId } = useParams();
    if (!moduleId) moduleId = user?.moduleId

    const [myCredits, setMyCredits] = useState([]);
    const [othersCredits, setOthersCredits] = useState([]);

    // ICON WITH ACTIONS FOR EACH ROW
    const [activeRow, setActiveRow] = useState()
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const openActionsMenu = Boolean(menuAnchorEl)
    const handleOpenActionsMenu = (event, row) => {// OPEN
        setActiveRow(row)
        setMenuAnchorEl(event.currentTarget);
    }
    const handleCloseActionsMenu = (event) => {// CLOSE
        setMenuAnchorEl(null);
    }


    const loadCredits = () => {
        F_handleSetShowLoader(true)

        CreditService.getCreditsForUser().then(response => {
            let my = response.data
            setMyCredits([my])

            // Load others credits
            CreditService.getCreditsForModule(moduleId).then(res => {
                let others = res.data
                others = others.filter(u => u.id != my?.id)
                others.sort((a, b) => { return b.percentage - a.percentage });
                setOthersCredits(others)
                F_handleSetShowLoader(false)
            }).catch(err => {
                console.error(err)
                F_showToastMessage(t("common:FAILED TO LOAD DATA"), 'error');
                F_handleSetShowLoader(false)
            });

        }).catch(err => {
            console.error(err)
            F_showToastMessage(t("common:FAILED TO LOAD DATA"), 'error');
            F_handleSetShowLoader(false)
        });


        //######################################
    }


    useEffect(() => {
        loadCredits()
    }, [])

    const columns = [
        {
            field: 'user', headerName: t('common:FULL NAME'), flex: 1, hide: !isMdUp,
            renderCell: (params) => {
                if (params.row.blockedByCredits > 0) return <>
                    {params.row.user}
                    <WarningCredits text={t("sentinel-Admin-Credits:THIS USER HAS {{number}} BLOCKED RESULTS", { number: params.row.blockedByCredits })}></WarningCredits>
                </>
                return <>{params.row.user}</>
            }
        },
        { field: 'used', headerName: t('sentinel-Admin-Credits:CREDITS USED'), flex: 1, type: "number", maxWidth: 250, hide: !isMdUp },
        { field: 'available', headerName: t('sentinel-Admin-Credits:CREDITS AVAILABLE'), flex: 1, type: "number", maxWidth: 250, hide: !isMdUp },
        {
            field: 'percentage', headerName: t('sentinel-Admin-Credits:CREDITS USAGE'), flex: 1, maxWidth: isMdUp ? 240 : undefined, headerAlign: 'center', align: 'center',
            renderCell: (params) => (<>
                <Grid container sx={{ justifyContent: 'center' }}>
                    {!isMdUp && <Typography className="txt-ellipses" sx={{ width: '100%', fontFamily: "Roboto" }} variant="body1">{params.row.user}</Typography>}
                    {!isMdUp && <Typography sx={{ fontFamily: "Roboto" }} variant="subtitle2">{params.row.used + "/" + params.row.available}</Typography>}
                    <div className={`progressBar ${params.row.percentage > 0 ? 'ongoing' : ''}`}>
                        <div className={`progressBarValue ${params.row.percentage >= 100 ? 'max' : ''}`} style={{ width: `${params.row.percentage}%` }}></div>
                    </div>
                </Grid>
            </>)
        },
        {
            field: 'actions', headerName: t('common:ACTIONS'), flex: 1, maxWidth: 150, headerAlign: 'center', align: 'center', sortable: false,
            renderHeader: isMdUp ? undefined : () => <></>,
            renderCell: (params) => (
                <StyledEIconButton onClick={(event) => handleOpenActionsMenu(event, params.row)} color="primary" size="large">
                    <MoreVertIcon />
                </StyledEIconButton>)
        }

    ]
    return <Grid container item sx={{ flexDirection: 'column', mb: 4, flexWrap: 'nowrap' }} >
        {/* MY CREDITS */}
        <Typography variant="body2">{t("sentinel-Admin-Credits:MY CREDITS")}</Typography>
        <NewEDataGrid

            rows={myCredits}
            columns={columns.slice(0, -1)}

            // originalData={updatedUsers}
            hideFooter={true}
            isVisibleToolbar={false}
        />
        {/* OTHERS CREDITS */}
        <Typography variant="body2">{t("sentinel-Admin-Credits:MANAGE CREDITS FOR OTHERS")}</Typography>

        <NewEDataGrid
            //checkboxSelection={true}
            rows={othersCredits}
            columns={columns}
        />

        {/* MENU ############################################################################ */}
        <ActionsMenu
            row={activeRow}
            loadCredits={loadCredits}
            myCredits={myCredits}
            othersCredits={othersCredits}
            menuAnchorEl={menuAnchorEl}
            openActionsMenu={openActionsMenu}
            handleCloseActionsMenu={handleCloseActionsMenu}
        ></ActionsMenu>
    </Grid>


}

//############################################################################ 
// Tab with users requests
// ############################################################################ 
function UsersRequestsTab() {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const isMdUp = useIsWidthUp("md");
    const { F_getHelper, F_showToastMessage, F_handleSetShowLoader, F_getLocalTime } = useMainContext();
    const { user } = F_getHelper()
    // Optional as parameter - when not provided it will use id of current module
    let { moduleId } = useParams();
    if (!moduleId) moduleId = user?.moduleId

    const [requests, setRequests] = useState([]);
    const [requestToReview, setRequestToReview] = useState();
    const [myCredits, setMyCredits] = useState([]);

    const loadMyCredits = () => {
        CreditService.getCreditsForUser().then(response => {
            setMyCredits(response.data)
        }).catch(err => {
            console.error(err)
            F_showToastMessage(t("common:FAILED TO LOAD DATA"), 'error');
            F_handleSetShowLoader(false)
        });
    }

    const loadRequests = () => {
        F_handleSetShowLoader(true)
        CreditService.getCreditsRequestsForModule(moduleId).then(response => {
            setRequests(response.data)
            F_handleSetShowLoader(false)
        }).catch(err => {
            console.error(err)
            F_showToastMessage(t("common:FAILED TO LOAD DATA"), 'error');
            F_handleSetShowLoader(false)
        });
    }


    useEffect(() => {
        loadRequests()
        loadMyCredits()
    }, [])

    const columns = [
        { field: 'user', headerName: t('common:FULL NAME'), flex: 1},
        { field: 'number', type: 'number', headerName: t('sentinel-Admin-Credits:REQUESTED CREDITS NUMBER'), flex: 1},
        { field: 'createdAt', headerName: t('common:DATE'), flex: 1, hide: !isMdUp, renderCell: (params) => { return <>{F_getLocalTime(params.row.createdAt, true)}</> } },
        {
            field: 'status', headerName: t('common:STATUS'), flex: 1, hide: !isMdUp, renderCell: (params) => {
                if (params.row.status == 'AWAITING') return <>{t("common:STATUS_AWAITING")}</>
                else if (params.row.status == 'ACCEPTED') return <>{t("common:STATUS_ACCEPTED")}</>
                else if (params.row.status == 'REJECTED') return <>{t("common:STATUS_REJECTED")}</>
            }
        },
        {
            field: 'actions', headerName: t('common:ACTIONS'), flex: 1, maxWidth: 150,
            renderHeader: isMdUp ? undefined : () => <></>,
            headerAlign: 'center', align: 'center', sortable: false,

            renderCell: (params) => (
                <StyledEIconButton
                    disabled={params.row.status != "AWAITING" || params.row.userId == myCredits.id}
                    color="primary" size="large"
                    onClick={() => { setRequestToReview(params.row) }}>
                    <VisibilityIcon />
                </StyledEIconButton>)


        }
    ]
    return <Grid container item sx={{ flexDirection: 'column', flexWrap: 'nowrap', mb: 2 }} >
        <NewEDataGrid
            //checkboxSelection={true}
            rows={requests}
            columns={columns}
        />
        {requestToReview &&
            <ModalReviewRequestCredits myCredits={myCredits} request={requestToReview}
                open={requestToReview ? true : false} 
                onClose={() => { setRequestToReview(undefined); loadRequests(); }}>
            </ModalReviewRequestCredits>
        }

    </Grid>
}


//############################################################################ 
// Main comonent for managing credits
//############################################################################ 
// isMarketingManager - if true it means that this is marketing manager
//                    otherwise it wil be classical view in Sentinel
export default function Credits({ isMarketingManager = false }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const navigate = useNavigate()
    const TABS = ['credits', 'requests']

    const [tab, setTab] = useState('credits');
    const isSmUp = useIsWidthUp("sm");




    return (<>
        <Container maxWidth='xl' style={{  padding: isMarketingManager?'32px':'' }} className="mainContainerDiv main_results">
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center' }}>
                {isMarketingManager && <StyledEIconButton sx={{ mr: 3 }} color="primary" size="medium"
                    onClick={async () => {
                        navigate(-1)
                    }}>
                    <ChevronLeftIcon />
                </StyledEIconButton>}
                <div className="admin_heading">
                    <Typography variant="h1" component="h1">{t("sentinel-Admin-Credits:CREDITS")}</Typography>
                    <Divider variant="insert" className='heading_divider' />
                </div>
            </div>
            <Grid container sx={{ height: 'calc(100% - 65px)', flexWrap: 'nowrap', flexDirection: isSmUp ? 'row' : 'column' }} >
                <Navigation triggerActiveIndex={TABS.indexOf(tab)} items={[
                    { name: t("sentinel-Admin-Credits:TAB USERS CREDITS"), onClick: () => { setTab('credits') } },
                    { name: t("sentinel-Admin-Credits:TAB USERS REQUESTS"), onClick: () => { setTab('requests') } }
                ]}>
                </Navigation>

                {/* USERS TAB ####################################################################### */}
                {tab == 'credits' && <UsersCreditsTab ></UsersCreditsTab>}

                {/* REQUESTS/MANAGEMENT TAB ######################################################### */}
                {tab == 'requests' && <UsersRequestsTab ></UsersRequestsTab>}
            </Grid>


        </Container>

    </>
    )
}
