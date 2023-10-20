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
import { Divider} from "@mui/material";


export default function MSUsersCsv() {
    const { t } = useTranslation();
    const { F_showToastMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [currentTab, setCurrentTab] = useState(1);
    const navigate = useNavigate();
    const [MSUsers, setMSUsers] = useState([])
    // const [preparedDataToSave,setPreparedDataToSave] =useState([])
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [MSExample, setMSExample] = useState([
        {
            name: "Adjani",
            surname: "Isabella",
            username: "isabella",
            password: "Testing123!",
            role: "Trainee",

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
        },
        {
            name: "Pierre",
            surname: "Almond",
            username: "almond",
            password: "Testing123!",
            role: "Trainer",

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
        },
        {
            name: "Natalie",
            surname: "Portman",
            username: "portman",
            password: "Testing123!",
            role: "Librarian",

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
        },
        {
            name: "James",
            surname: "Hook",
            username: "hook",
            password: "Testing123!",
            role: "Architect",

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
        },
        {
            name: "Alan",
            surname: "Wake",
            username: "wake",
            password: "Testing123!",
            role: "Parent",
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
        },
    ])

    useEffect(() => {
        ModuleService.remainingUserCountInModule(manageScopeIds.moduleId).then(res => {
            setRemainingUserLimit(res.data.count)
        }).catch(error => console.error(error))
    }, [])

    async function prepareDataToSave() {
        let data = MSUsers.filter(user => user.isSelected === true);
        let newData = [];
        newData = data.map(user => {
            if (user.dateOfBirth) {
                let year = user.dateOfBirth.slice(6, 10);
                let month = user.dateOfBirth.slice(3, 5);
                let day = user.dateOfBirth.slice(0, 2);
                user.dateOfBirth = new Date(year, month - 1, day + 0).toISOString();
            }
            return user;
        })
        return newData;
    }


    function saveData() {
        prepareDataToSave().then(data => {
            if (data) {
                ModuleCoreService.uploadUsersFromCsv(data).then(
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
                        F_showToastMessage(`${t('E-mail or username is already taken, please choose another one or write correct characters')}`, "error");
                    }
                })
            }
        })
    }

    const MSUsersList = MSUsers.map((user, index) =>
    (<ListGroup.Item className="p-0 d-flex justify-content-between align-items-center tblRows" key={index} style={{ backgroundColor: user.isSelected ? new_theme.palette.primary.PWhite : new_theme.palette.shades.white30 }}>
        <Col xs={1}><Avatar className="indexAvtar" style={{ width: "25px", height: "25px" }}>{index + 1}</Avatar></Col>
        <Col >{user.username ? user.username : "-"}</Col>
        <Col >{user.role ? user.role : "-"}</Col>
        <Col >{user.name}</Col>
        <Col >{user.surname ? user.surname : "-"}</Col>
        <Col >{user.password ? user.password : "-"}</Col>
        <Col >{user.dateOfBirth??"-"}</Col>

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
                checked={user.isSelected}
                disabled={!user.isSelected && currentCount >= remainingUserLimit}
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
        {/*        <button className="btn" onClick={()=>{navigate(`/modules-core/users/form/${user._id}`)}}><BsPencil/></button>*/}
        {/*    </IconButton>*/}
        {/*</Col>*/}
    </ListGroup.Item>));

    return (
        <ThemeProvider theme={new_theme}>

            <Container maxWidth="xl mainChildDiv">
                <Grid item xs={12} >
                    <div className="admin_content">
                        <div className="admin_heading">
                                <Grid>
                                    <Typography variant="h1" component="h1" >{t("Users")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            <div className="heading_buttons justifyBetween">
                                <div className="pri-btn-wrap">
                                    
                                    <label className="uploadCSVbtn" htmlFor="usersCsvInput">
                                        <input
                                            style={{ display: "none" }}
                                            accept="text/csv"
                                            id="usersCsvInput"
                                            multiple
                                            type="file"
                                            onChange={async () => {
                                                const element = document.getElementById('usersCsvInput').files[0];
                                                // Application should accept only text/csv excel problem is that in different countries the dot and comma decimal operators are used alternately,
                                                // if it is dot ok, if the comma is problem (because csv is comma separated values) and values, each comma separates the value, it causes errors.
                                                // But for now, we can leave it, it remains to be seen what will come of it.

                                                if (element && (element.type === "application/vnd.ms-excel" || element.type === "text/csv")) {
                                                    const importData = await element.text();
                                                    const parsedData = parse(importData, { header: true });
                                                    parsedData.data.map(item => item.isSelected === "TRUE" ? item.isSelected = true : item.isSelected = false);
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
                                        <StyledButton eVariant="secondary" eSize="large">
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
                                <StyledButton eVariant="primary" eSize="small"  disabled={MSUsers.length < 1}
                                    hidden={MSUsers.length < 1}
                                    onClick={() => {
                                        setMSUsers([]);
                                        setCurrentCount(0)
                                    }}>
                                    {t("Clear")}

                                </StyledButton>

                                {/* <Button className="btnClear" variant="contained" size="small" color="secondary"
                                    disabled={MSUsers.length < 1}
                                    hidden={MSUsers.length < 1}
                                    onClick={() => {
                                        setMSUsers([]);
                                        setCurrentCount(0)
                                    }}>
                                    {t("Clear")}
                                </Button> */}
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
                                <ETab label={t("Users List")} classes="tab_style"  onClick={() => { navigate("/sentinel/myusers/users") }} />
                                <ETab label={t("Import CSV")} classes="tab_style"  />
                                <ETab label={t("Users Roles")} classes="tab_style"  onClick={() => { navigate("/sentinel/admin/authorizations") }} />
                            </ETabBar>
                        </div>
                        <div className="usercsc_accordian">
                            <Accordion className="minHeight-60vh" defaultActiveKey="0"  >
                                {MSUsers.length > 0 ?
                                    <Card className="p-0 d-flex flex-column CSVTable" style={{ borderRadius: "8px", backgroundColor: new_theme.palette.primary.PWhite, }}>
                                        <h4 className="text-center mt-2 mb-2 titleCsv">{t("Import data preview")}</h4>
                                        <small className="text-center mt-2 mb-2 subtitleCsv">{t("Selected users")}: {currentCount} </small>
                                        <CardContent className="no-scroll">
                                            <Row className="d-flex justify-content-between tableHeader">
                                                <Col xs={1} className="headTable"><small>No.</small></Col>
                                                <Col className=""><small>{t("Username")}</small></Col>
                                                <Col className=""><small>{t("Role")}</small></Col>
                                                <Col className=""><small>{t("Name")}</small></Col>
                                                <Col className=""><small>{t("Surname")}</small></Col>
                                                <Col className=""><small>{t("Password")}</small></Col>
                                                <Col className=""><small>{t("Date of birth")}</small></Col>
                                                <Col className="text-center"><small className="pl-3">{t("Select")}</small></Col>

                                                {/* <Col xs={1} className="headTable"><small>No.</small></Col>
                                                <Col className=""><small>{t("Name")}</small></Col>
                                                <Col className=""><small>{t("Surname")}</small></Col>
                                                <Col className=""><small>{t("Username")}</small></Col>
                                                <Col className=""><small>{t("Date of birth")}</small></Col>
                                                <Col className=""><small>{t("Password")}</small></Col>
                                                <Col className=""><small>{t("Role")}</small></Col> */}
                                                {/* <Col className="text-center"><small>{t("Select")}</small></Col> */}
                                            </Row>
                                        </CardContent>
                                        {MSUsersList ? MSUsersList : null}
                                        <CardActionArea>
                                            <CardActions>
                                                <Grid container className="gap-20">

                                                    <Grid item className="text-right">
                                                        <StyledButton eVariant="primary" eSize="large" disabled={MSUsers.length < 1} onClick={saveData}>{t("Save")}

                                                        </StyledButton>
                                                    </Grid>
                                                    <Grid item >
                                                        <StyledButton eVariant="secondary" eSize="large"onClick={() => navigate("/modules-core/users")}>{t("Back")}

                                                        </StyledButton>
                                                    </Grid>
                                                </Grid>
                                            </CardActions>

                                        </CardActionArea>
                                    </Card> : <span  className="mt-5 pos-absolute">{t("Download example, then upload correct file (remember to follow the data structure)")}</span>}
                                    {!MSUsers.length >0 ?
                                    <img className="modelUserPic" src="/img/brand/model-userlist.png"></img>:""}
                            </Accordion>
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
                        <ETab label={t("Import from (CSV)")} eSize='small' classes={{ root: classes.buttonRoot }} />
                        <ETab label={t("Users Roles")} eSize='small' onClick={() => { navigate("/modules-core/users/roles") }} classes={{ root: classes.buttonRoot }} />

                    </ETabBar>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={6} className="text-left">
                            <input
                                style={{ display: "none" }}
                                accept="text/csv"
                                id="usersCsvInput"
                                multiple
                                type="file"
                                onChange={async () => {
                                    const element = document.getElementById('usersCsvInput').files[0];
                                    // Application should accept only text/csv excel problem is that in different countries the dot and comma decimal operators are used alternately,
                                    // if it is dot ok, if the comma is problem (because csv is comma separated values) and values, each comma separates the value, it causes errors.
                                    // But for now, we can leave it, it remains to be seen what will come of it.

                                    if (element && (element.type === "application/vnd.ms-excel" || element.type === "text/csv")) {
                                        const importData = await element.text();
                                        const parsedData = parse(importData, { header: true });
                                        parsedData.data.map(item => item.isSelected === "TRUE" ? item.isSelected = true : item.isSelected = false);
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
                            <label htmlFor="usersCsvInput">
                                <Button className="mb-3" size="small" variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                                    {t("Upload csv file")}
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12} md={6} className="d-flex justify-content-end align-items-center">
                            <Button variant="contained" size="small" color="secondary"
                                disabled={MSUsers.length < 1}
                                hidden={MSUsers.length < 1}
                                onClick={() => {
                                    setMSUsers([]);
                                    setCurrentCount(0)
                                }}>
                                {t("Clear")}
                            </Button>
                            <Button size="small" variant="contained" color="primary"
                                startIcon={<SaveAltIcon />}
                                onClick={() => {
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
                            </Button>
                        </Grid>
                    </Grid>

                    <Accordion defaultActiveKey="0"  >
                        {MSUsers.length > 0 ?
                            <Card className="p-0 d-flex flex-column" style={{ borderRadius: "8px", }}>
                                <h4 className="text-center mt-2 mb-2">{t("Import data preview")}</h4>
                                <small className="text-center mt-2 mb-2">{t("Selected users")}: {currentCount} </small>
                                <CardContent>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={1} className=""><small>No.</small></Col>
                                        <Col className=""><small>{t("Name")}</small></Col>
                                        <Col className=""><small>{t("Surname")}</small></Col>
                                        <Col className=""><small>{t("Username")}</small></Col>
                                        <Col className=""><small>{t("Date of birth")}</small></Col>
                                        <Col className=""><small>{t("Password")}</small></Col>
                                        <Col className=""><small>{t("Role")}</small></Col>

                                        <Col className="text-center"><small>{t("Select")}</small></Col>
                                    </Row>
                                </CardContent>
                                {MSUsersList ? MSUsersList : null}
                                <CardActionArea>
                                    <CardActions>
                                        <Grid container>
                                            <Grid item xs={12} md={6}>
                                                <Button className="mr-5 mb-3" variant="contained" size="small" color="secondary" onClick={() => navigate("/modules-core/users")}>{t("Back")}</Button>
                                            </Grid>
                                            <Grid item xs={12} md={6} className="text-right">
                                                <Button variant="contained" color="primary" disabled={MSUsers.length < 1} onClick={saveData}>{t("Save")}</Button>
                                            </Grid>
                                        </Grid>
                                    </CardActions>

                                </CardActionArea>
                            </Card> : <span  >{t("Download example, then upload correct file (remember to follow the data structure)")}</span>}
                    </Accordion>

                </Grid>
            </Grid> */}
        </ThemeProvider>
    )
}