import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@mui/material/styles';
import { Card, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import moduleCoreService from "services/module-core.service"
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import { isWidthUp } from '@material-ui/core/withWidth';
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { theme } from 'MuiTheme';
import { ETab, ETabBar } from "styled_components";
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from '@mui/icons-material/Info';
import Container from '@mui/material/Container';
import { new_theme } from "NewMuiTheme";
import { Typography, ThemeProvider } from "@mui/material";
import "./UserList.scss"

const useStyles = makeStyles({
    card: {
        marginTop: "25px",
        marginLeft: "40px",
        paddingBottom: "5px",
        background: theme.palette.glass.medium,
        borderRadius: "8px",

    },
    buttonItem: {
        fontSize: "16px",
        fontFamily: "Nunito",
        fontWeight: "bold",
        background: `${new_theme.palette.shades.white30} !important`,
        borderRadius: "8px",
        color: `${theme.palette.primary.darkViolet} !important`
    },
    text: {
        fontSize: "18px",
        fontFamily: "Nunito",
        color: `${theme.palette.primary.darkViolet} !important`,
        whiteSpace: "nowrap"
    },
    toptext: {
        fontSize: "22px",
        fontWeight: "bold",
        fontFamily: "Nunito",
        color: `${theme.palette.primary.darkViolet} !important`,
        whiteSpace: "nowrap"
    },
    buttonRoot: {
        minWidth: "98px",
        margin: "0",
        padding: "0",
        overflowY: "none",
    }
});

export default function FolderList() {

    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(2);
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const { t } = useTranslation();
    const classes = useStyles();
    const [currentModuleCore, setCurrentModuleCore] = useState({});
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
    const { currentScreenSize } = useMainContext();

    const [rolePermissions, setRolePermissions] = useState([])
    const { user } = F_getHelper();

    useEffect(() => {
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            if (res.data?.rolePermissions) {
                setRolePermissions(res.data.rolePermissions);
            }
            setCurrentModuleCore(res.data)
        }).catch(error => console.error(error))
    }, [])

    const permissionsList = rolePermissions[currentRoleIndex]?.permissions.map((permission, index) => {
        return (
            <ListGroupItem className="pl-2 d-flex bg-transparent " style={{ border: "none", height: "55px" }} key={index} >
                <Col xs={5} >
                    {permission.permissionName}
                    <h5 className={`mt-2 ${classes.text}`}>   {permission.name}  <InfoIcon style={{ fontSize: "medium", color: theme.palette.neutrals.white }} /></h5>
                </Col>
                <Col xs={3} >
                    <Checkbox style={{ color: theme.palette.primary.darkViolet }}
                        icon={<CheckIcon style={{ display: "none" }} />}
                        checkedIcon={<CheckIcon />}
                        size="small"
                        checked={permission.access}
                        inputProps={{ 'aria-label': 'controlled' }} disabled
                    />
                </Col>
                <Col xs={3} >
                    <Checkbox style={{ color: theme.palette.primary.darkViolet }}
                        icon={<CheckIcon style={{ display: "none" }} />}
                        checkedIcon={<CheckIcon />}
                        size="small"
                        checked={permission.edit}
                        inputProps={{ 'aria-label': 'controlled' }} disabled
                    />
                </Col>
            </ListGroupItem>)
    })
    const rolePermissionsList = rolePermissions.map((role, index) =>
        <ListItem classname="ml-3" style={{ marginTop: "10px", background: theme.palette.shades.white70, borderRadius: "8px" }} button
            className={currentRoleIndex === index ? classes.buttonItem : classes.text}
            onClick={(e) => {
                setCurrentRoleIndex(index)
            }}
            key={index}
            value={role}><Avatar className="mr-3" src={`/img/user_icons_by_roles/${role?.picture}`} alt="user-icon-avatar" />{role?.name} <span style={{ marginLeft: "auto" }}><VisibilityIcon /> </span>
        </ListItem>)

    async function updateData() {
        await setCurrentModuleCore(p => {
            let val = Object.assign({}, p);
            val.rolePermissions = rolePermissions;
            return val;
        })
    }

    return (
        <>
            <ThemeProvider theme={new_theme}>
                <Container maxWidth="xl" className="mainUserDiv">
                    <Grid item xs={12}>
                        <div className="admin_content">
                            <div className="admin_heading">
                                <Typography variant="h1" component="h1" >{t("Users")}</Typography>
                            </div>
                            <div className="content_tabing">
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    onChange={(e, i) => setCurrentTab(i)}
                                    aria-label="tabs example"
                                    eSize='small'
                                    className="tab_style"
                                >

                                    <ETab label={t("Users List")} eSize='small' onClick={() => { navigate("/sentinel/myusers/users") }} classes="tab_style" />
                                    <ETab label={t("Import from (CSV)")} eSize='small' onClick={() => { navigate("/sentinel/myusers/users/import-export") }} classes="tab_style" />
                                    <ETab label={t("Users Roles")} eSize='small' classes="tab_style" />
                                </ETabBar>
                            </div>
                            <div style={{ width: "100%" }}>
                                <FormControl>
                                    <Col xs={10} style={{ minWidth: isWidthUp('md', currentScreenSize) ? "460px" : "0" }}>
                                        <List><h6>Roles inside the system</h6>
                                            <h8 style={{ fontSize: "12px", fontFamily: "Nunito" }}>Learn more about the roles inside the system and permission users can have</h8>
                                            {rolePermissionsList}
                                        </List>
                                    </Col>
                                </FormControl>
                                <div style={{ minWidth: isWidthUp('md', currentScreenSize) ? "600px" : "0" }}>
                                    <Card.Body sx={{pl:1}}>

                                        <Avatar sx={{mr:3}} className="mr-3" src={`/img/user_icons_by_roles/${rolePermissions[currentRoleIndex]?.picture}`} style={{ width: '60px', height: '60px', float: "left" }} alt="user-icon-avatar" />
                                        <p>Permissions</p>
                                        <p>{rolePermissions[currentRoleIndex]?.name}</p>
                                        <Col xs={12} style={{ color: theme.palette.primary.darkViolet }} className=" d-flex justify-content-center align-items-center  ">
                                            <Col xs={3} >
                                                <small style={{marginLeft:"15px"}}> Access </small>
                                            </Col>
                                            <Col xs={1} >
                                                <small > Edit</small>
                                            </Col>
                                        </Col>

                                        <ListGroup as={Row}>
                                            {permissionsList}
                                        </ListGroup>

                                    </Card.Body>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Container>
                {/* <Grid container spacing={1}>
                <Grid item xs={12} className="d-flex justify-content-center mt-2">
                    <ETabBar
                        style={{ minWidth: "280px" }}
                        value={currentTab}
                        textColor="primary"
                        variant="fullWidth"
                        onChange={(e, i) => setCurrentTab(i)}
                        aria-label="tabs example"
                        eSize='small'
                    >
                        <ETab label={t("Users List")} eSize='small' onClick={() => { navigate("/modules-core/users") }} classes={{ root: classes.buttonRoot }} />
                        <ETab label={t("Import from (CSV)")} eSize='small' onClick={() => { navigate("/modules-core/users/import-export") }} classes={{ root: classes.buttonRoot }} />
                        <ETab label={t("Users Roles")} eSize='small' classes={{ root: classes.buttonRoot }} />
                    </ETabBar>
                </Grid>

                <div className={isWidthUp('lg', currentScreenSize) && "d-flex"} style={{ width: "100%" }}>
                    <FormControl className={isWidthUp('md', currentScreenSize) && "d-flex"} >
                        <Col xs={10} style={{ minWidth: isWidthUp('md', currentScreenSize) ? "460px" : "0" }}>
                            <List className={`mt-1 ${classes.text}`}><h6>Roles inside the system</h6>
                                <h8 style={{ fontSize: "12px", fontFamily: "Nunito" }}>Learn more about the roles inside the system and permission users can have</h8>
                                {rolePermissionsList}
                            </List>
                        </Col>
                    </FormControl>
                    <div className={`pl-4 ${classes.card}`} style={{ minWidth: isWidthUp('md', currentScreenSize) ? "600px" : "0" }}>
                        <Card.Body className="pl-1" >

                            <Avatar className="mr-3" src={`/img/user_icons_by_roles/${rolePermissions[currentRoleIndex]?.picture}`} style={{ width: '60px', height: '60px', float: "left" }} alt="user-icon-avatar" />
                            <p className={`mb-0 ml-4 ${classes.toptext}`}>Permissions</p>
                            <p className={`ml-4 ${classes.text}`}>{rolePermissions[currentRoleIndex]?.name}</p>
                            <Col xs={12} style={{ color: theme.palette.primary.darkViolet }} className=" d-flex justify-content-center align-items-center  ">
                                <Col xs={3} >
                                    <small className="ml-4"> Access </small>
                                </Col>
                                <Col xs={1} >
                                    <small className="ml-5"> Edit</small>
                                </Col>
                            </Col>

                            <ListGroup as={Row}>
                                {permissionsList}
                            </ListGroup>

                        </Card.Body>
                    </div>
                </div>
            </Grid> */}
            </ThemeProvider>
        </>



    )
}
