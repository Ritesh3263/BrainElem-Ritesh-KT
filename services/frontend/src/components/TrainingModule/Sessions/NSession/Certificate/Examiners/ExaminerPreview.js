import React, { useEffect, useState } from "react";
import { ThemeProvider, Typography, Grid, Box, Paper, TextField } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { useTranslation } from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import UserService from "../../../../../../services/user.service"
import { new_theme } from "NewMuiTheme";
import "../Certificate.scss";

export default function ExaminerPreview({ examinerPreviewHelper, setExaminerPreviewHelper, currentSession }) {
    const { t } = useTranslation();
    const [currentExaminer, setCurrentExaminer] = useState()
    useEffect(() => {
        UserService.read(examinerPreviewHelper.examinerId).then(res => {
            if (res.status === 200) {
                setCurrentExaminer(res.data)
            }
        }).catch(error => console.log(error));
    }, [examinerPreviewHelper]);

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container>
                <Grid item xs={12}>
                    <Box sx={{ borderBottom: `1px solid ${new_theme.palette.primary.PBorderColor}`, pb: 1 }}>
                        <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>
                            {t("User information")}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={8} sx={{ mt: 3 }}>
                    <Grid container>
                        <Grid item xs={12} className='mt-2'>
                            <Box className="avtar_main_details">
                                <Avatar src={`/img/user_icons_by_roles/ClassMan.png`} alt="user-icon-avatar" style={{ width: '150px', height: '150px' }} />
                                <div className="avtar_details">
                                    <Typography variant="body1" component="span" sx={{ fontWeight: '600' }}>
                                        {`${currentExaminer?.name} ${currentExaminer?.surname}`}
                                    </Typography>
                                    <Typography variant="body4" component="p">
                                        {`${t("Created")} : ${currentExaminer?.details.createdAt?.split('T')[0]}`}
                                    </Typography>
                                    <Typography variant="subtitle1" component="p">
                                        {t(`(${currentSession || "-"})`)}
                                    </Typography>

                                    <p className={currentExaminer?.settings.isActive ? 'text-success' : 'text-danger'}>{currentExaminer?.isActive ? 'Active' : 'InActive'}</p>
                                    {/* <Chip label={currentSession || "-"}
                                        size="medium" variant="outlined"
                                        
                                    /> */}
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sx={{mt: 2}}>
                            <TextField label={t("e-mail")} margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                name='filed'
                                fullWidth
                                variant='filled'
                                required={false}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentExaminer?.email}
                                onInput={(e) => { }}
                            />

                        </Grid>
                        <Grid item xs={6}>
                            <TextField label={t("Phone")} margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                name='filed'
                                fullWidth
                                variant='filled'
                                required={false}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentExaminer?.details.phone}
                                onInput={(e) => { }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label={t("Gender")} margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                name='filed'
                                fullWidth
                                variant='filled'
                                required={false}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentExaminer?.gender}
                                onInput={(e) => { }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label={t("Language")} margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                name='filed'
                                fullWidth
                                variant='filled'
                                required={false}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentExaminer?.settings?.language?.toUpperCase()}
                                onInput={(e) => { }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sx={{mt: 4, display: 'flex', justifyContent: 'right'}}>
                            <StyledButton eVariant="secondary" eSize="small" onClick={() => {
                                    setExaminerPreviewHelper({ isOpen: false, examinerId: undefined });
                                }}>
                                {t("Dismiss")}
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}