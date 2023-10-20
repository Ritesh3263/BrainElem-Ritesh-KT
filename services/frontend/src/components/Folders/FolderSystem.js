import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { Typography, Box,Grid,Divider, Container, ThemeProvider, Button, TextField } from "@mui/material";
import { new_theme } from "NewMuiTheme";

import Folder from './Folder'

const FolderSystem = () => {
  const { t } = useTranslation();

  return (<ThemeProvider theme={new_theme}>
    <Container maxWidth="xl" className="mainContainerDiv">
      <Grid item xs={12}>
          <div className="admin_heading">
              <Grid>
                  <Typography variant="h1" className="typo_h5">{t("Folder System")}</Typography>
                  <Divider variant="insert" className='heading_divider' />
              </Grid>
          </div>
      </Grid>
      <Folder />
    </Container>
  </ThemeProvider>
)}

export default FolderSystem