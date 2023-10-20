import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormCheck, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import moduleCoreService from "services/module-core.service"
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";

export default function MSUsersPermissions() {
    const { t, i18n, translationsLoaded } = useTranslation();
    const navigate = useNavigate();
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [currentModuleCore, setCurrentModuleCore] = useState({});
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
    const [rolePermissions, setRolePermissions] = useState([
        {
            role: "",
            permissions: [],
        }
    ])

    useEffect(() => {
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            setCurrentModuleCore(res.data)
            if (res.data.rolePermissions) {
                setRolePermissions(res.data.rolePermissions);

            }
        }).catch(error => console.error(error))
    }, [])

    const permissionsList = rolePermissions[currentRoleIndex].permissions.map((permission, index) => {
        return (<ListGroupItem className="pl-0 d-flex" key={index}>
            <Col xs={5}>
                <h6>{permission.name}</h6>
                <small className="text-muted">{permission.descriptions}</small>
            </Col>
            <Col xs={1} className="d-flex align-items-center justify-content-center">
                <FormCheck>
                    <FormCheckInput checked={permission.access} onChange={() => {
                        setRolePermissions(p => {
                            let val = Object.assign([], p);
                            val[currentRoleIndex].permissions[index].access = !val[currentRoleIndex].permissions[index].access;
                            return val;
                        })
                    }} />
                </FormCheck>
            </Col>
            <Col xs={1} className="d-flex align-items-center justify-content-center">
                <FormCheck>
                    <FormCheckInput checked={permission.edit} onChange={() => {
                        setRolePermissions(p => {
                            let val = Object.assign([], p);
                            val[currentRoleIndex].permissions[index].edit = !val[currentRoleIndex].permissions[index].edit;
                            return val;
                        })
                    }} />
                </FormCheck>
            </Col>
        </ListGroupItem>)
    })

    const rolePermissionsList = rolePermissions.map((role, index) => {
        console.log(role)
        return (<MenuItem key={index} value={role}>{role.name}</MenuItem>)
    })

    async function updateData() {
        await setCurrentModuleCore(p => {
            let val = Object.assign({}, p);
            val.rolePermissions = rolePermissions;
            return val;
        })
    }

    function saveChanges() {
        updateData().then(() => {
            moduleCoreService.updateModuleCore(manageScopeIds.moduleId, currentModuleCore).then(res => {
                //display res.message in toast
                console.log(res)
                F_showToastMessage("Data was updated", "success");
                navigate("/modules-core/users")
            }).catch(error => console.error(error));
        }).catch()
    }

    return (
        <Card className="p-0 fluid m-0">
            <Card.Header>
                <Row>
                    <Col># User permissions</Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Form as={Row}>
                    <Col md={6} className="d-flex flex-column">
                        <FormControl style={{ width: "50%" }} >
                            <InputLabel id="demo-simple-select-label">Select user role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={rolePermissions[currentRoleIndex]}
                                renderValue={p => p.role}
                                input={<Input />}
                                onChange={(e) => {
                                    setCurrentRoleIndex(p => {
                                        let val = Object.assign({}, p);
                                        val = rolePermissions.findIndex(role => role._id === e.target.value._id);
                                        return val;
                                    })
                                }}
                            >
                                {rolePermissionsList}
                            </Select>
                        </FormControl>
                    </Col>
                </Form>
                <Form as={Row} className="mt-5">
                    <Col xs={5} className="d-flex flex-column">
                        <h5>Part of the system</h5>
                    </Col>
                    <Col xs={1} className="d-flex flex-column justify-content-center align-items-center">
                        <h5>Access</h5>
                    </Col>
                    <Col xs={1} className="d-flex flex-column justify-content-center align-items-center">
                        <h5>Edit</h5>
                    </Col>
                </Form>
                <ListGroup as={Row}>
                    {permissionsList}
                </ListGroup>

            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center" >
                <Col className="p-0">
                    <Button variant="outline-primary" onClick={() => {
                        F_showToastMessage("No change",)
                        navigate("/modules-core/users")
                    }}>
                        {t("Back")}
                    </Button>
                </Col>
                <Col className="p-0 d-flex justify-content-end">
                    <Button onClick={saveChanges} variant="success" className="ml-5">
                        {t("Save")}
                    </Button>
                </Col>
            </Card.Footer>
        </Card>
    )
}