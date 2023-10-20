import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
//Services
import UserService from "../../services/user.service";
// Context
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
// Compoents
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { EButton, ETextField } from "styled_components";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { theme } from "MuiTheme";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 4,
  background: theme.palette.shades.white70,
  borderRadius: "16px",
};

const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function ChangePassword(props) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [error, setError] = useState("");

  const { F_getErrorMessage, F_getHelper, F_showToastMessage } =
    useMainContext();
  const { user } = F_getHelper();

  const isPasswordValid = () => {
    if (!regex.test(password)) return false;
    else return true;
  };

  const handlePasswordChange = (e) => {
    UserService.updatePassword(user.id, password).then(
      (response) => {
        props.onHide();
        F_showToastMessage(t("Password was saved"), "success");
      },
      (error) => {
        let errorMessage = F_getErrorMessage(error);
        F_showToastMessage(errorMessage, "error");
      }
    );
  };
  return (
    <div>
      <Modal open={props.show} onClose={props.onHide}>
        <Box sx={style}>
          <ETextField
            id="new-password"
            inputProps={{ autocomplete: "new-password" }}
            label={t("New password")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={password && !isPasswordValid()}
            type={visiblePassword ? "text" : "password"}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    setVisiblePassword((p) => !p);
                  }}
                  edge="end"
                >
                  {visiblePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              ),
            }}
            helperText={
              isPasswordValid() || !password
                ? ""
                : t(
                    "Password must contain at least 8 characters, 1 capital letter , including 1 digit and 1 special character"
                  )
            }
          ></ETextField>
          <EButton disabled={!isPasswordValid()} onClick={handlePasswordChange}>
            {t("Save")}
          </EButton>
        </Box>
      </Modal>
    </div>
  );
}
