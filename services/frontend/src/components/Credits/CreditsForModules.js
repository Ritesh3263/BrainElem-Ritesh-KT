
// Comonent for managing credits

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

//MUIv5u
import { Grid, Divider, Container, Typography } from '@mui/material';

// Custom components
import Navigation from "new_styled_components/Navigation/Navigation.styled";
import { NewEDataGrid } from 'new_styled_components';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';

//Services
import CreditService from "services/credit.service";
import CommonService from "services/common.service";

// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";



// Icons
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
// List of modules
// ############################################################################ 
function ModulesList({ modules }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const navigate = useNavigate()
    const isMdUp = useIsWidthUp("md");

    const columns = [
        { field: 'name', headerName: t('common:MODULE'), flex: 1, },
        { field: 'assignedManagers', headerName: t('common:MANAGER'), flex: 1, hide: !isMdUp,
            renderCell: (params)=> params.row.assignedManagers.map(mgo=>`${mgo?.name} ${mgo?.surname} (${mgo?.username})`)
        },
        { field: 'used', headerName: t('sentinel-Admin-Credits:CREDITS USED'), flex: 1, type: "number", maxWidth: 250, hide: !isMdUp },
        { field: 'available', headerName: t('sentinel-Admin-Credits:CREDITS AVAILABLE'), flex: 1, type: "number", maxWidth: 250, hide: !isMdUp },
        //{ field: 'available', headerName: t('sentinel-Admin-Credits:CREDITS AVAILABLE'), flex: 1, type: "number", maxWidth: 250, hide: !isMdUp },
        {
            field: 'actions', headerName: t('common:ACTIONS'), flex: 1, maxWidth: 150, headerAlign: 'center', align: 'center', sortable: false,

            renderCell: (params) => (
                <StyledEIconButton color="primary" size="large" onClick={()=>{navigate(`/credits/${params.row._id}`)}}>
                    <VisibilityIcon />
                </StyledEIconButton>)


        }
    ]
    return <Grid container item sx={{ flexDirection: 'column', mb: 2 }} >
        <NewEDataGrid
            isVisibleToolbar={false}
            rows={modules}
            columns={columns}
        />

    </Grid>
}


//############################################################################ 
// Credits for modules
//############################################################################ 
export default function CreditsFoModules() {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const navigate = useNavigate()
    const { F_getHelper, F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const { user } = F_getHelper()
    const TABS = ['companies', 'schools']
    const [tab, setTab] = useState('companies');
    const [modules, setModules] = useState([]);
    const isSmUp = useIsWidthUp("sm")

    const loadModules = () => {
        F_handleSetShowLoader(true)
        // Load modules
        CreditService.getCreditsForModules().then(res => {
            let modules = res.data
            modules.sort((a, b) => { return b.used - a.used });
            setModules(modules)
            F_handleSetShowLoader(false)
        }).catch(err => {
            F_showToastMessage(t("common:FAILED TO LOAD DATA"), 'error');
            F_handleSetShowLoader(false)
        });
    }


    useEffect(() => {
        loadModules()
    }, [])

    return (<>
        <Container style={{ padding: '32px', height: '100%' }} maxWidth="xl" className="mainContainerDiv main_results">
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center' }}>
                <StyledEIconButton sx={{ mr: 3 }} color="primary" size="medium"
                    onClick={async () => {
                        navigate(-1)
                    }}>
                    <ChevronLeftIcon />
                </StyledEIconButton>
                <div className="admin_heading">
                    <Typography variant="h1" component="h1">{t("common:MODULES")}</Typography>
                    <Divider variant="insert" className='heading_divider' />
                </div>
            </div>
            <Grid container sx={{ height: 'calc(100% - 65px)', flexWrap: 'nowrap', flexDirection: isSmUp ? 'row' : 'column' }} >
                <Navigation triggerActiveIndex={TABS.indexOf(tab)} items={[
                    { name: t("common:COMPANIES"), onClick: () => { setTab('companies') } },
                    { name: t("common:SCHOOLS"), onClick: () => { setTab('schools') } }
                ]}>
                </Navigation>

                {/* COMPANIES TAB ####################################################################### */}
                {tab == 'companies' && <ModulesList modules={modules.filter(m=>{return !CommonService.isEduModule({modules: [{_id: m._id}]})})}></ModulesList>}

                {/* SCHOOLS TAB ######################################################### */}
                {tab == 'schools' && <ModulesList modules={modules.filter(m=>{return CommonService.isEduModule({modules: [{_id: m._id}]})})}></ModulesList>}
            </Grid>


        </Container>

    </>
    )
}
