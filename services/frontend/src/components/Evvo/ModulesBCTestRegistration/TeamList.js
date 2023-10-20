import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Divider,
    Typography,
} from "@mui/material";
import ModuleCoreService from "services/module-core.service"
import Grid from "@mui/material/Grid";
import Container from '@mui/material/Container';
import CollapsibleTable from "./TeamTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import "./BCTestRegistration.scss"
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from 'new_styled_components/Button/Button.styled';
import { BsFillCircleFill } from 'react-icons/bs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BCTestService from '../../../services/bcTestRegistration.service';

import { parse, unparse } from "papaparse"


export default function MSAuthorizationsList() {
    const { t } = useTranslation(['sentinel-MyUsers-BCTestRegistration', 'sentinel-MyTeams-Teams', 'sentinel-MyTeams-Results', 'common']);
    const { isConfirmed } = Confirm();
    // const classes = useStyles();
    const [currentTab, setCurrentTab] = useState(1);
    const [openModuleList, setOpenModuleList] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openColumn, setOpenColumn] = useState(false);
    const [openDensity, setOpenDensity] = useState(null);
    const [isExport, setIsExport] = useState(null);
    const [css, setCss] = useState('16px');
    const [searchText, setSearchText] = useState('');
    const open = Boolean(openDensity);
    const exportOpen = Boolean(isExport);

    const handleClick = (event) => {
        setOpenDensity(event.currentTarget);
    };

    const handleClickExport = (event) => {
        setIsExport(event.currentTarget);
    };
    const handleClose = (type) => {
        switch (type) {
            case 'compact':
                setCss('0px')
                break;
            case 'comfortable':
                setCss('20px')
                break;
            case 'standered':
                setCss('16px')
                break;
            default:
                setOpenDensity(null)
        }
        console.log(css)
        setOpenDensity(null);
    };

    const navigate = useNavigate();
    const [MSRoles, setMSRoles] = useState([]);
    const handleExport = (type) => {
        if (type == "csv") {
            const csv = unparse(MSRoles, { header: true });
            const blob = new Blob([csv]);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob, { type: "text/csv" });
            a.download = "teams.csv"
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        if (type == "print") {
            var content = document.getElementById("divcontents");
            var pri = document.getElementById("ifmcontentstoprint").contentWindow;
            pri.document.open();
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();
        }
        setIsExport(null)
    }
    // const [module, setModule] = useState(null);
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    // setCurrentRoute
    const { setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader, F_t } = useMainContext();
    const { manageScopeIds, user } = F_getHelper();

    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false })
    const onClickFilter = () => {
        setOpenFilter(!openFilter);
    }
    const onClickColumn = () => {
        setOpenColumn(!openColumn)
    }
    useEffect(() => {
        F_handleSetShowLoader(true)
        BCTestService.getBCTestTeams().then((res) => {
            const temp = res.data.data.map((dat) => {
                return { 'name': dat.name, 'registerDate': dat.brainCoreTest.registerDate, 'completionDate': dat.brainCoreTest.completionDate, 'status': dat.brainCoreTest.status, }
            })
            setMSRoles(temp);
            F_handleSetShowLoader(false)
        }).catch((err) => {
        });
    }, [editFormHelper.isOpen])

    useEffect(() => {
        if (openModuleList) return;
        F_handleSetShowLoader(true)
        ModuleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            setMSRoles(res.data.rolePermissions)

        }).catch(error => console.error(error))
    }, [openModuleList])

    async function switchTabHandler(i) {
        if (editFormHelper.isBlocking) {
            let confirm = await isConfirmed(t("common:ARE_YOU_SURE_TO_LEAVE"));
            if (!confirm) return;
        }
        setEditFormHelper(prev => ({ ...prev, isBlocking: false }))
        setCurrentTab(i)
    }

    useEffect(() => {
        switch (currentTab) {
            case 0:
                navigate("/sentinel/myteams/BC-test-registrations/users")
                break;
            case 1:
                break;
                // navigate("/BC-test-registrations/users")
            default:
                break;
        }
    }, [currentTab])

    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv mainBcDiv">
                <Grid container spacing={1}>
                    {(!editFormHelper.isOpen) && (
                        <Grid item xs={12}>
                            <div className="admin_content">
                                <div className="admin_heading">
                                    <div className="teams_header">
                                        <div className="admin_heading">
                                        <Grid >
                                            <Typography variant="h1" component="h1" style={{ marginRight: "3rem" }}>{t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")}</Typography>
                                            <Divider variant="insert" className='heading_divider' />
                                        </Grid>
                                        </div>
                                        <div className="statuses" style={{ display: "flex", gap: '20px', alignItems: "center", justifyContent: "flex-end" }}>
                                            {/* <Typography variant="subtitle1" gutterBottom component="h6" sx={{ fontWeight: 'bold', marginBottom: '0' }}>
                                {t("TEAM STATUS")}
                            </Typography> */}
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusNoTest'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_INVITED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.noTestTaken || 0} */}
                                                </Typography>
                                            </div>
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusSent'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_REQUEST_SENT")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.requestSent || 0} */}
                                                </Typography>
                                            </div>
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusCompleted'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_COMPLETED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.completed || 0} */}
                                                </Typography>
                                            </div>
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusNotCompleted'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_COMPLETED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.notCompleted || 0} */}
                                                </Typography>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Grid item xs={12} className="content_tabing" style={{ display: "flex", marginTop: ".5rem" }}>
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    onChange={(e, i) => { switchTabHandler(i) }}
                                    aria-label="tabs example"
                                    className="tab_style"
                                >
                                    <ETab label={F_t("common:USERS")} eSize='small' />
                                    <ETab label={F_t("sentinel-MyTeams-Results:TEAMS")} eSize='small' />
                                </ETabBar>

                            </Grid>

                            <div class="filter">
                                <div class="filterRight-sec">
                                    <button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-sizeSmall MuiButton-textSizeSmall css-13fou1l-MuiButtonBase-root-MuiButton-root filter-btns" tabindex="0" type="button" aria-label="Show filters" data-mui-internal-clone-element="true" onClick={onClickFilter}>
                                        <span class="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon">
                                            <span class="MuiBadge-root BaseBadge-root css-1c32n2y-MuiBadge-root">
                                                <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FilterListIcon">
                                                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>
                                                </svg>
                                            </span>
                                        </span>
                                        {t("common:FILTERS")}<span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
                                    </button>
                                    <button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-sizeSmall MuiButton-textSizeSmall css-1b2yp87-MuiButtonBase-root-MuiButton-root filter-btns" tabindex="0" type="button" aria-label="Select columns" onClick={onClickColumn}>
                                        <span class="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon">
                                            <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ColumnIconIcon">
                                                <path d="M6 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm14 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-7 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"></path>
                                            </svg>
                                        </span>
                                        {t("common:COLUMNS")}<span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
                                    </button>
                                    <Button id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick} class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-sizeSmall MuiButton-textSizeSmall css-1b2yp87-MuiButtonBase-root-MuiButton-root filter-btns" tabindex="0" type="button" aria-label="Density" >
                                        <span class="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon">
                                            <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="TableRowsIcon">
                                                <path d="M21,8H3V4h18V8z M21,10H3v4h18V10z M21,16H3v4h18V16z"></path>
                                            </svg>
                                        </span>
                                        {t("common:DENSITY")}<span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
                                    </Button>
                                    <Menu style={{ marginTop: '10px' }}
                                        id="basic-menu"
                                        anchorEl={openDensity}
                                        open={open}
                                        onClose={() => handleClose('standered')}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem selected={css == "0px"} onClick={() => handleClose('compact')}>{t("Compact")}</MenuItem>
                                        <MenuItem selected={css == "16px"} onClick={() => handleClose('standered')}>{t("Standered")}</MenuItem>
                                        <MenuItem selected={css == "20px"} onClick={() => handleClose('comfortable')}>{t("Comfortable")}</MenuItem>
                                    </Menu>
                                    <input aria-invalid="false" placeholder={t("common:SEARCH_VALUE")} type="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense filter-search" value={searchText} onChange={(e) => {
                                        setSearchText(e.target.value)
                                        console.log("hi")
                                    }}></input>
                                </div>

                                <div class="exportBtn">

                                    <StyledButton id="export-button"
                                        aria-controls={exportOpen ? 'export-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={exportOpen ? 'true' : undefined} onClick={handleClickExport} className="filter-export" eVariant="secondary" eSize="small">
                                        <span class="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon">
                                            <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SaveAltIcon">
                                                <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"></path>
                                            </svg>
                                        </span>
                                        {t("common:EXPORT")}</StyledButton>
                                    <Menu
                                        id="export-menu"
                                        anchorEl={isExport}
                                        open={isExport}
                                        onClose={() => handleExport('')}
                                        MenuListProps={{
                                            'aria-labelledby': 'export-button',
                                        }}
                                    >
                                        <MenuItem onClick={() => handleExport('csv')}>{t("common:EXPORT_AS_CSV")}</MenuItem>
                                        <MenuItem onClick={() => handleExport('print')}>{t("common:PRINT")}</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                            <div id="divcontents">
                                <CollapsibleTable className="tableIn1" MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} openFilter={openFilter} openColumn={openColumn} setOpenColumn={setOpenColumn} setOpenFilter={setOpenFilter} openDensity={openDensity} css={css} searchText={searchText} />
                            </div>

                        </Grid>
                    )}
                    <iframe id="ifmcontentstoprint" style={{ height: " 0px", width: "0px", position: "absolute" }}></iframe>

                    {/* {(editFormHelper.isOpen && editFormHelper.openType == 'ADD') && (
                <Grid item xs={12} >
                    <NewRoleForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                </Grid>
            )} */}

                    {/* {(editFormHelper.isOpen && editFormHelper.openType == 'CreatePermission') && (
                <Grid item xs={12} >
                    <NewPermissionForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                </Grid>
            )} */}

                </Grid>
            </Container>
        </ThemeProvider>
    )
}
