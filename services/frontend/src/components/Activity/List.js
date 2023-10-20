import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Container from '@mui/material/Container';
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { activityActions } from "app/features/Activity/data";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import Table from "./Table";
import Form from "./Form";
import "./activity.scss";


const useStyles = makeStyles(theme => ({}))

export default function InternShipsList() {
    const { t } = useTranslation();
    const classes = useStyles();
    const { setMyCurrentRoute,
        F_handleSetShowLoader,
    } = useMainContext();
    const dispatch = useDispatch();
    const { editFormHelper, isPending } = useSelector(s => s.activity);

    useEffect(() => {
        setMyCurrentRoute("Activities");
        dispatch(activityActions.fetchActivities());

        if (isPending) {
            F_handleSetShowLoader(true);
        } else {
            F_handleSetShowLoader(false);
        }
    }, [editFormHelper.isOpen]);

    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv mainactivitydiv">
                <Grid container spacing={1} sx={{ mt: 0 }}>
                    <Grid item xs={12} lg={editFormHelper.isOpen ? 5 : 12}>
                        <Table />
                    </Grid>
                    <Grid item xs={12} lg={7} hidden={!editFormHelper.isOpen}>
                        <Paper elevation={10} className="p-0">
                            <Form />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}