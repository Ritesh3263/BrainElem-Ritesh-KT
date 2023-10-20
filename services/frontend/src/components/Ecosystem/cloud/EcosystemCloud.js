import React, {useEffect, useState} from "react";
import FilterDramaOutlinedIcon from '@material-ui/icons/FilterDramaOutlined';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "styled_components/Switch";
import {useNavigate} from "react-router-dom";
import EcosystemService from "services/ecosystem.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


const useStyles = makeStyles(theme=>({}))

export default function EcosystemCloud(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate()
    // setCurrentRoute
    const {
        setMyCurrentRoute,
        F_showToastMessage,
        F_getErrorMessage,
        F_getHelper,
        F_handleSetShowLoader
    } = useMainContext();
    const {manageScopeIds} = F_getHelper();

    const [cloudStatus, setCloudStatus] = useState({})

    function getCloudStatus(){
        EcosystemService.getEcosystems().then(res=>{
            setCloudStatus(res.data[0].isCloudActive);
        }).catch(error=>console.error(error))
    }

    function saveChanges(){
        EcosystemService.enableCloud(manageScopeIds.ecosystemId, cloudStatus).then(res=>{
            F_showToastMessage("Cloud status has been updated.","success")
        }).catch(errors=>console.error(errors))
    }

    useEffect(()=>{
        F_handleSetShowLoader(true)
        getCloudStatus();
        setMyCurrentRoute("Ecosystem cloud")
        F_handleSetShowLoader(false)
    },[])

    return(
      <>
            <CardHeader title={<><FilterDramaOutlinedIcon className="mr-2"/>{t("Cloud")}</>}/>
            <CardContent>
                <Grid container>
                    <Grid item xs={6}>
                        <h5>{cloudStatus ? t("Disable cloud") : t("Enable cloud")}</h5>
                        <p>{t("Clouds may be limited to a single organization (library), or be available to multiple organizations")}</p>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!cloudStatus}
                                    onChange={()=>setCloudStatus(p=>!p)}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label={cloudStatus ? t("On") : t("Off")}
                        />
                        {cloudStatus ?
                            <>
                                {/* <hr className="mt-5"/> */}
                                {/* <Form>
                            <Form.Group as={Row}>
                                <Col xs={8} className="d-flex flex-column align-items-start">
                                    <h5>Assign cloud manager</h5>
                                    <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Quisque porttitor felis sem, nec maximus turpis ultricies nec.
                                        Etiam vitae congue arcu.</p>
                                </Col>
                                <Col xs={4}>
                                    <MultiSelectButton allManagersList={allManagersList} assignedManagers={assignedManagers}
                                                       setAllManagersList={setAllManagersList} setAssignedManagers={setAssignedManagers}
                                                       addNewRoute={"/ecosystems/cloud/managers/form/new"}
                                                       directName={"Add new manager"} />
                                </Col>
                            </Form.Group>
                        </Form> */}
                            </>: null}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center">
                <Grid container>
                    <Grid item xs={6}>
                        <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() =>  {
                            F_showToastMessage("No change",)
                            navigate(-1)
                        }}>
                            {t("Back")}
                        </Button>
                    </Grid>
                    <Grid item xs={6} className="p-0 d-flex justify-content-end">
                        <Button onClick={saveChanges} classes={{root: classes.root}} size="small" variant="contained" color="primary" className="ml-5">
                            {t("Save")}
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
            </CardActionArea>
      </>
    )
}
