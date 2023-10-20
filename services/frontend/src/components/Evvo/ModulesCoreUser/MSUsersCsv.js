import React, { useEffect, useState } from "react";
import { Accordion, Col, ListGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Checkbox from '@mui/material/Checkbox';
import { parse, unparse } from "papaparse"
import ModuleCoreService from "services/module-core.service"
import ModuleService from "services/module.service"
import Button from '@mui/material/Button';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ETab, ETabBar } from "styled_components";
import Container from '@mui/material/Container';
import "./UserList.scss"
import StyledButton from "new_styled_components/Button/Button.styled";

import { Typography } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import { Divider } from "@mui/material";
import moduleCoreService from "../../../services/module-core.service";


export default function MSUsersCsv() {
    const { t } = useTranslation();
    const { F_showToastMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds,user } = F_getHelper();
    const [currentTab, setCurrentTab] = useState(1);
    const navigate = useNavigate();
    const [MSUsers, setMSUsers] = useState([])
    // const [preparedDataToSave,setPreparedDataToSave] =useState([])
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [MSExample, setMSExample] = useState([
        {
            name: "Adjani",
            surname: "Isabella",
            username: "isabella",
            password: "Testing123!",
            role: user?.role=="Other"?"Other":"Trainee",
            roleMaster: user?.role=="Other"?"Trainee":"",
            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "13",
            Building: "Tower A",
            city: "Paris",
            postCode: "43002",
            country: "Country 1",
            dateOfBirth: "11.01.1992",
            // gender: "F", // we should have this info, but not currently in the model
            email: "isabella@test.com",
            isSelected: "FALSE",
            isActive: "FALSE",
            teamName: "Developers",
            '':'',
        },
        {
            name: "Pierre",
            surname: "Almond",
            username: "almond",
            password: "Testing123!",
            role: user?.role=="Other"?"Other":"Trainer",
            roleMaster: user?.role=="Other"?"Trainee":"",
            language: "PL", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "16/2",
            Building: "PMK building",
            city: "Paris",
            postCode: "32352",
            country: "Country 2",
            dateOfBirth: "11.12.1967",
            // gender: "M", // we should have this info, but not currently in the model
            email: "almond@test.com",
            isSelected: "TRUE",
            isActive: "FALSE",
            teamName: "",
            '':'Note:',
        },
        {
            name: "Natalie",
            surname: "Portman",
            username: "portman",
            password: "Testing123!",
            role: user?.role=="Other"?"Other":"Librarian",
            roleMaster: user?.role=="Other"?"Trainee":"",
            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "11/A",
            Building: "Sunflower",
            city: "Paris",
            postCode: "3242",
            country: "Country 3",
            dateOfBirth: "09.06.1981",
            // gender: "F", // we should have this info, but not currently in the model
            email: "portman@test.com",
            isSelected: "TRUE",
            isActive: "FALSE",
            teamName: "Sales",
            '':user.role=="Other"?"1. For Column 'E' please keep only 'Others' as a mandatory role.":"1. For Column E' please enter the Roles which is available in User Creation as its a mandatory field."
        },
        {
            name: "James",
            surname: "Hook",
            username: "hook",
            password: "Testing123!",
            role: user?.role=="Other"?"Other":"Architect",
            roleMaster: user?.role=="Other"?"Trainee":"",
            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "11/A",
            Building: "Sunflower",
            city: "Paris",
            postCode: "3242",
            country: "Country 3",
            dateOfBirth: "09.06.1981",
            // gender: "F", // we should have this info, but not currently in the model
            email: "hook@test.com",
            isSelected: "TRUE",
            isActive: "FALSE",
            teamName: "C1",
            '':user.role=="Other"?"2. In Column 'F' can insert any Role which is available in the User Creation.":"2. Please leave Column 'F' empty to pass the Role."
        },
        {
            name: "Alan",
            surname: "Wake",
            username: "wake",
            password: "Testing123!",
            role: user?.role=="Other"?"Other":"Parent",
            roleMaster: user?.role=="Other"?"Trainee":"",
            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "11/A",
            Building: "Sunflower",
            city: "Paris",
            postCode: "3242",
            country: "Country 3",
            dateOfBirth: "09.06.1981",
            // gender: "F", // we should have this info, but not currently in the model
            email: "wake@test.com",
            isSelected: "TRUE",
            isActive: "FALSE",
            teamName: "C1",
        },
    ])
    const [rows, setRows] = useState([]);

    useEffect(() => {
        F_handleSetShowLoader(true)
        moduleCoreService.readAllRoles().then(res => {
            setRows(res.data.data)
            F_handleSetShowLoader(false)
        }).catch(error => console.error(error))
    }, [])
    useEffect(() => {
        ModuleService.remainingUserCountInModule(manageScopeIds.moduleId).then(res => {
            setRemainingUserLimit(res.data.count)
        }).catch(error => console.error(error))
    }, [])

    async function prepareDataToSave() {
        const data = MSUsers.map((Singleuser,index) => {
            if (Singleuser.dateOfBirth && Singleuser.isSelected === true) {
                let year = Singleuser.dateOfBirth.slice(6, 10);
                let month = Singleuser.dateOfBirth.slice(3, 5);
                let day = Singleuser.dateOfBirth.slice(0, 2);
                Singleuser.dateOfBirthForReq = new Date(year, month - 1, day + 0).toISOString();
            }
            return Singleuser;
        })
        return data;
    }


    function saveData() {
        prepareDataToSave().then(data => {
            if (data) {
                const req = data.filter((u)=>u.isSelected===true);
                ModuleCoreService.uploadUsersFromCsv(req,rows).then(
                    res => {
                        F_showToastMessage(res.data.message, 'success');
                        navigate("/sentinel/myusers/users");
                    },
                    error => {
                        F_showToastMessage(JSON.stringify(error.response.data.message.writeErrors.map(x => x.errmsg)), 'error');
                    }
                ).catch(error => {
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if (re1.test(error?.response?.data?.message) || error?.response?.data?.message?.keyValue?.username) {
                        F_showToastMessage(`${t('Username is already taken, please choose another one or write correct characters')}`, "error");
                    }
                    if (re2.test(error?.response?.data?.message) || error?.response?.data?.message?.keyValue?.email) {
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`, "error");
                    }
                    else {
                        F_showToastMessage(`${t('Failed to add users. Please ensure that the provided data is valid. Prevent duplications of usernames and emails, and make sure that all roles and team are correct.')}`, "error");
                    }
                })
            }
        })
    }

    const MSUsersList = MSUsers.map((u, index) =>
    (<ListGroup.Item className="tblRows" key={index} style={{ backgroundColor: u.isSelected ? new_theme.palette.primary.PWhite : new_theme.palette.shades.white30 }}>
        <Col xs={1}><Avatar className="indexAvtar" style={{ width: "25px", height: "25px" }}>{index + 1}</Avatar></Col>
        <Col >{u.username ? u.username : "-"}</Col>
        <Col >{u.role ? u.role : "-"}</Col>
        <Col >{u.name}</Col>
        <Col >{u.surname ? u.surname : "-"}</Col>
        <Col >{u.password ? u.password : "-"}</Col>
        <Col >{u.dateOfBirth ?? "-"}</Col>

        {/* <Col >{user.name}</Col>
        <Col >{user.surname ? user.surname : "-"}</Col>
        <Col >{user.username ? user.username : "-"}</Col>
        <Col >{user.dateOfBirth ?? "-"}</Col>
        <Col >{user.password ? user.password : "-"}</Col>
        <Col >{user.role ? user.role : "-"}</Col> */}
        {/* optional */}
        {/* <Col >{user.gender ? user.gender : "-"}</Col> */}
        {/* <Col >{user.language ? user.language : "-"}</Col>
            <Col >{user.phone ? user.phone : "-"}</Col>
            <Col >{user.street ? user.street : "-"}</Col>
            <Col >{user.Building ? user.Building : "-"}</Col>
            <Col >{user.city ? user.city : "-"}</Col>
            <Col >{user.postCode ? user.postCode : "-"}</Col>
            <Col >{user.country ? user.country : "-"}</Col>
            <Col >{user.dateOfBirth ? user.dateOfBirth : "-"}</Col>
            <Col >{user.email ? user.email : "-"}</Col> */}
        <Col className="text-center">
            <Checkbox
                edge="end"
                className="chkboxUserCSVPreview"
                checked={u.isSelected}
                disabled={!u.isSelected && currentCount >= remainingUserLimit}
                onChange={() => {
                    
                    setMSUsers(p => {
                        let val = Object.assign([], p);
                        val[index].isSelected = !val[index].isSelected;
                        setCurrentCount(currentCount + (val[index].isSelected ? 1 : -1))
                        return val;
                    })
                }}
            />
        </Col>
        {/*<Col  md={1} className="text-right">*/}
        {/*    <IconButton size="small">*/}
        {/*        <button className="btn" onClick={()=>{navigate(`/new-modules-core/users/form/${user._id}`)}}><BsPencil/></button>*/}
        {/*    </IconButton>*/}
        {/*</Col>*/}
    </ListGroup.Item>));

    return (
        <ThemeProvider theme={new_theme}>

            <Container maxWidth="xl mainUserDiv">
                <Grid item xs={12} >
                    <div className="admin_content">
                        <div className={`admin_heading ${MSUsers.length > 1 ? 'three_btn_heading': ''}`}>
                            <Grid>
                                <Typography variant="h1" component="h1" >{t("Users")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>
                            <div className={`heading_buttons justifyBetween  ${MSUsers.length > 1 ? 'three_btn_top': ''}`}>
                                <div className={`pri-btn-wrap  ${MSUsers.length > 1 ? 'three_btn_top_inner': ''}`}>
                                    <input
                                        style={{ display: "none" }}
                                        accept="text/csv"
                                        id="usersCsvInput"
                                        multiple
                                        type="file"
                                        key={fileInputKey} // Add a key prop to the file input
                                        onChange={async () => {
                                            const element = document.getElementById('usersCsvInput').files[0];
                                            // Application should accept only text/csv excel problem is that in different countries the dot and comma decimal operators are used alternately,
                                            // if it is dot ok, if the comma is problem (because csv is comma separated values) and values, each comma separates the value, it causes errors.
                                            // But for now, we can leave it, it remains to be seen what will come of it.

                                            if (element && (element.type === "application/vnd.ms-excel" || element.type === "text/csv")) {
                                                const importData = await element.text();
                                                const parsedData = parse(importData, { header: true });
                                                parsedData.data.map(item => item.isSelected === "TRUE" ? item.isSelected = true : item.isSelected = false);
                                                parsedData.data = parsedData.data.filter(u=>u.email||u.username)
                                                // Trim whitespaces
                                                parsedData.data = parsedData.data.map(u=>{return {...u, email: u.email.trim(),username: u.username.trim()}})
                                                let currentCount = parsedData.data.filter(x => x.isSelected).length
                                                if ((currentCount - remainingUserLimit) > 0) parsedData.data.map(item => {
                                                    if ((currentCount - remainingUserLimit) > 0 && item.isSelected) {
                                                        item.isSelected = false
                                                        currentCount--
                                                    }
                                                    return item
                                                });
                                                setCurrentCount(currentCount)
                                                setMSUsers(parsedData.data);
                                                //setTimeout(()=> loadCSVFile(),400);
                                            } else {
                                                // valid -> user csv file
                                            }
                                        }}
                                    />
                                    <label htmlFor="usersCsvInput" style={{ marginBottom: 0 }}>
                                        <StyledButton className="w-100" htmlFor="usersCsvInput" eVariant="secondary" eSize="large" component="span">
                                            {t("Upload csv file")}
                                        </StyledButton>
                                    </label>
                                    <StyledButton eVariant="secondary" eSize="large" onClick={() => {
                                        const csv = unparse(MSExample, { header: true });
                                        const blob = new Blob([csv]);
                                        const a = document.createElement('a');
                                        a.href = URL.createObjectURL(blob, { type: "text/csv" });
                                        a.download = "sample.csv"
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                    }}>
                                        {t("Download example CSV")}
                                    </StyledButton>


                                </div>
                                <StyledButton eVariant="primary" eSize="large" disabled={MSUsers.length < 1}
                                    hidden={MSUsers.length < 1}
                                    onClick={() => {
                                        setMSUsers([]);
                                        setCurrentCount(0);
                                        setFileInputKey(prevKey => prevKey + 1);
                                    }}>
                                    {t("Clear")}

                                </StyledButton>

                            </div>
                        </div>
                        <div className="content_tabing">
                            <ETabBar
                                // style={{ minWidth: "280px" }}
                                value={currentTab}
                                textColor="primary"
                                variant="fullWidth"
                                onChange={(e, i) => setCurrentTab(i)}
                                aria-label="tabs example"

                                className="tab_style"
                            >
                                <ETab label={t("Users List")} classes="tab_style" onClick={() => { navigate("/sentinel/myusers/users") }} />
                                <ETab label={t("Import CSV")} classes="tab_style" />
                                <ETab label={t("Users Roles")} classes="tab_style"  onClick={() => { navigate("/sentinel/admin/authorizations") }} />
                            </ETabBar>
                        </div>
                        <div className="usercsc_accordian">
                            <Accordion className="minHeight-60vh" defaultActiveKey="0"  >
                                {MSUsers.length > 0 ?
                                <>
                                    <Card className="p-0 displayFlex flex-column CSVTable overflow-x-scroll" style={{ borderRadius: "8px", backgroundColor: new_theme.palette.primary.PWhite, }}>
                                        <CardContent className="no-scroll w-tab-200">
                                            <Row className="displayFlex justifyBetween tableHeader">
                                                <Col xs={1} className="headTable"><small>No.</small></Col>
                                                <Col className=""><small>{t("Username")}</small></Col>
                                                <Col className=""><small>{t("Role")}</small></Col>
                                                <Col className=""><small>{t("Name")}</small></Col>
                                                <Col className=""><small>{t("Surname")}</small></Col>
                                                <Col className=""><small>{t("Password")}</small></Col>
                                                <Col className=""><small>{t("Date of birth")}</small></Col>
                                                <Col className="text-center"><small className="pl-3">{t("Select")}</small></Col>

                                            </Row>
                                            {MSUsersList ? MSUsersList : null}
                                        </CardContent>
                                        
                                        
                                        
                                    </Card>
                                    <Grid container className="btn-flex btn-grid-mb">

                                        <Grid item className="text-right">
                                            <StyledButton  eVariant="primary" eSize="large" disabled={MSUsers.length < 1} onClick={saveData}>{t("Save")}

                                            </StyledButton>
                                        </Grid>
                                        <Grid item >
                                            <StyledButton eVariant="secondary" eSize="large" onClick={() => navigate("/sentinel/myusers/users")}>{t("Back")}

                                            </StyledButton>
                                        </Grid>

                                    </Grid>
                                </>
                                    :
                                    <Typography variant="subtitle1" component="span" className="pos-absolute" sx={{ mt: 5 }}>{t("Download example, then upload correct file (remember to follow the data structure)")}</Typography>
                                    
                                }
                                
                                {!MSUsers.length > 0 ?
                                    <img className="modelUserPic" src="/img/brand/model-userlist.png"></img> : ""}
                            </Accordion>
                        </div>
                        
                    </div>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}