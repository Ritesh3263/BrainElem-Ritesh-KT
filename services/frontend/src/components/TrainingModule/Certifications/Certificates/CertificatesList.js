import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Container, Paper, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CertificateService from "services/certificate.service";
import CertificatesTable from "./CertificatesTable";
import CertificateForm from "./CertificateForm";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ETabBar, ETab, EButton } from "new_styled_components";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Divider } from "@mui/material";

export default function CertificatesList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(1);
  const [certificates, setCertificates] = useState([]);
  const [formIsOpen, setFormIsOpen] = useState({
    isOpen: false,
    isNew: true,
    certificateId: "",
  });
  const {
    setMyCurrentRoute,
    F_handleSetShowLoader,
    F_showToastMessage,
    F_hasPermissionTo,
  } = useMainContext();
  useEffect(() => {
    setMyCurrentRoute("Certificate");
  }, []);

  useEffect(() => {
    F_handleSetShowLoader(true);
    CertificateService.readAll()
      .then((res) => {
        setCertificates(res.data);
        F_handleSetShowLoader(false);
      })
      .catch((error) => console.log(error));
  }, [formIsOpen.isOpen]);

  return (
    <ThemeProvider theme={new_theme}>
      <Container maxWidth="xl" className="mainContainerDiv">
        {!formIsOpen.isOpen ?
        <>
            <Grid item xs={12}>
                <div className="admin_content">
                    <div className="admin_heading">
                    <Grid>
                        <Typography variant="h1" component="h1">
                        {t("Certificate Templates")}
                        </Typography>
                        <Divider variant="insert" className="heading_divider" />
                    </Grid>

                    <div className="heading_buttons">
                        <StyledButton
                            eVariant="primary" eSize="large"
                            
                            disabled={formIsOpen.isOpen}
                            onClick={() => {
                                if (F_hasPermissionTo("create-competences"))
                                setFormIsOpen({
                                    isOpen: true,
                                    isNew: true,
                                    certificateId: "",
                                });
                                else
                                F_showToastMessage(
                                    "You don't have permission to add certificate template",
                                    "error"
                                );
                            }}
                            >
                            {t("Add certificate template")}
                            </StyledButton>
                    </div>
                    </div>
                    <div className="content_tabing">
                    <ETabBar
                        style={{ minWidth: "280px" }}
                        variant="fullWidth"
                        value={currentTab}
                        eSize="small"
                        textColor="primary"
                        className="tab_style"
                    >
                        <ETab
                        label={t("Competence blocks")}
                        eSize="small"
                        classes="tab_style"
                        onClick={() => {
                            navigate("/certifications/competenceBlocks");
                        }}
                        />
                        <ETab
                        label={t("Certificates")}
                        eSize="small"
                        classes="tab_style"
                        onClick={() => {
                            navigate("/certifications/certificates");
                        }}
                        />
                    </ETabBar>
                    </div>
                </div>
            </Grid>
        
        <div className="tabing_table">
            <Grid item xs={12} lg={formIsOpen.isOpen ? 12 : 12}>
            <CertificatesTable
                certificates={certificates}
                setFormIsOpen={setFormIsOpen}
            />
            </Grid>
        </div>
        </>
        :
        <>
        <Grid item xs={12} hidden={!formIsOpen.isOpen}>
            <Paper elevation={10} className="p-0" sx={{boxShadow:'none'}} >
                <CertificateForm
                formIsOpen={formIsOpen}
                setFormIsOpen={setFormIsOpen}
                />
            </Paper>
        </Grid>
        </>
        }
          
       
      </Container>
    </ThemeProvider>
  );
}
