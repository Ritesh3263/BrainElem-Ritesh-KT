import React from "react";
import "./Loader.css"
import { ThemeProvider, Typography} from "@mui/material";
import { ReactComponent as SpinnerLoader } from "../../img/loader_main.svg";
import {useTranslation} from "react-i18next";
import { new_theme } from "NewMuiTheme";


const Loader = (props) => {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={new_theme}>
      <section className="loader">
          <div className="wc_wrap">
              {/* <div className="wc_circle"></div>
              <div className="wc_circle"></div>
              <div className="wc_circle"></div>
              <div className="wc_shadow"></div>
              <div className="wc_shadow"></div>
              <div className="wc_shadow"></div> */}
              <Typography className="loading_text" variant="body1" component="h4">{t("Loading")+"..."}</Typography>
              <SpinnerLoader className="spinner_loader" />
          </div>
      </section>
    </ThemeProvider>
  );
};

export default Loader;
