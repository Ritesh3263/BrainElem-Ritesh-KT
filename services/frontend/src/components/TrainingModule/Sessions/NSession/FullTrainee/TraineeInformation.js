import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Box, Container, Divider, FormControl, InputLabel, Menu, MenuItem, Select, TextField } from "@mui/material";
import CollapsibleTable from "./TraineeTbl";
import Typography from '@mui/material/Typography';
import { KeyboardDatePicker } from "@material-ui/pickers";



export default function TraineeInformation(userData) {
    const { t } = useTranslation();


    return (

        <>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px' }}>

                <Box className="mb-colum" sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: { md: 'flex-start', xs: 'stretch' }, gap: '60px' }}>
                    <Grid item xs={12} md={4}>

                        <Typography sx={{ mt: 3 }} variant="subtitle0" component="h2" >{t("General")}</Typography>

                        <TextField label={t("First name")} margin="normal"
                            // InputProps={{
                            //     readOnly: (formHelper.openType === 'PREVIEW'),
                            //     disableUnderline: (formHelper.openType === 'PREVIEW'),
                            // }}
                            variant="filled"
                            name='description'
                            fullWidth
                            style={{ maxWidth: "400px" }}
                            // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                            required={false}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userData?.userData?.name}
                        // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                        />

                        <TextField label={t("Last name")} margin="normal"
                            // InputProps={{
                            //     readOnly: (formHelper.openType === 'PREVIEW'),
                            //     disableUnderline: (formHelper.openType === 'PREVIEW'),
                            // }}
                            name='description'
                            fullWidth
                            variant="filled"
                            style={{ maxWidth: "400px" }}
                            // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                            required={false}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userData?.userData?.surname}
                        // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                        />
                        <KeyboardDatePicker
                            // InputProps={{
                            //     readOnly: (formHelper.openType === 'PREVIEW' ),
                            //     disableUnderline: (formHelper.openType === 'PREVIEW'),
                            // }}
                            // readOnly={(formHelper.openType === 'PREVIEW')}
                            className="datePickerH"
                            fullWidth
                            inputVariant="filled"
                            style={{ maxWidth: "400px" }}
                            name='date'
                            margin="normal"
                            id="date-picker-dialog"
                            label={t("Date of birth")}
                            format="DD.MM.yyyy"
                            // minDate={new Date(now()).toISOString().split("T")[0]}
                            minDateMessage={"It is a past date"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            // inputVariant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                            value={userData?.userData?.createdAt}
                            KeyboardButtonProps={{
                                "aria-label": "change date",
                            }}
                        // onChange={(date) => {
                        //     if (date && date._isValid) {
                        //         updateValueHandler('date', new Date(date).toISOString())
                        //     }
                        // }}
                        />

                        <Typography sx={{ mt: 6 }} variant="subtitle0" component="h2" >{t("Contact")}</Typography>
                        <TextField label={t("Mobile number")} margin="normal"
                            // InputProps={{
                            //     readOnly: (formHelper.openType === 'PREVIEW'),
                            //     disableUnderline: (formHelper.openType === 'PREVIEW'),
                            // }}
                            variant="filled"
                            name='description'
                            fullWidth
                            style={{ maxWidth: "400px" }}
                            // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                            required={false}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userData?.userData?.details?.phone}
                        // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                        />
                        <TextField label={t("Street name")} margin="normal"
                            // InputProps={{
                            //     readOnly: (formHelper.openType === 'PREVIEW'),
                            //     disableUnderline: (formHelper.openType === 'PREVIEW'),
                            // }}
                            variant="filled"
                            name='description'
                            fullWidth
                            style={{ maxWidth: "400px" }}
                            // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                            required={false}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userData?.userData?.details?.street}
                        // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                        />
                        <div className="displayFlex" style={{ gap: "20px" }}>
                            <Grid item xs={12} md={6}>
                                <TextField label={t("Building number")} margin="normal"

                                    variant="filled"
                                    name='description'
                                    fullWidth
                                    style={{ maxWidth: "400px" }}
                                    // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                                    required={false}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={userData?.userData?.details?.buildNr}
                                // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label={t("Flat number")} margin="normal"

                                    variant="filled"
                                    name='description'
                                    fullWidth
                                    style={{ maxWidth: "400px" }}
                                    // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                                    required={false}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                // value={userData?.userData?.details}
                                // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                                />
                            </Grid>
                        </div>
                        <div className="displayFlex" style={{ gap: "20px" }}>
                            <Grid item xs={12} md={6}>
                                <TextField label={t("Post code")} margin="normal"

                                    variant="filled"
                                    name='description'
                                    fullWidth
                                    style={{ maxWidth: "400px" }}
                                    // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                                    required={false}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={userData?.userData?.details?.postcode}
                                // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label={t("City")} margin="normal"

                                    variant="filled"
                                    name='description'
                                    fullWidth
                                    style={{ maxWidth: "400px" }}
                                    // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                                    required={false}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={userData?.userData?.details?.city}
                                // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                                />
                            </Grid>
                        </div>

                        <TextField label={t("Country")} margin="normal"

                            variant="filled"
                            name='description'
                            fullWidth
                            style={{ maxWidth: "400px" }}
                            // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                            required={false}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userData?.userData?.details?.country}
                        // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                        />


                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography sx={{ mt: 3 }} variant="subtitle0" component="h2" >{t("Other")}</Typography>
                        {/* <FormControl fullWidth margin="normal" variant="filled" required={true} style={{maxWidth: "400px"}}
                                error={false}
                                hidden={(userPermissions.isTrainer)}
                                variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                                >
                            <InputLabel shrink={true} id="assignedTrainer-select-label">{t("Language")}</InputLabel>
                            <Select
                                name='assignedTrainer'
                                labelId="assignedTrainer-select-label"
                                id="assignedTrainer-select"
                                value={currentEvent?.assignedTrainer}
                                readOnly={(formHelper.openType === 'PREVIEW')}
                                disableUnderline={(formHelper.openType === 'PREVIEW')}
                                onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                            >
                                {trainersList}
                            </Select>
                        </FormControl>  */}
                        <TextField label={t("Language")} margin="normal"

                            variant="filled"
                            name='description'
                            fullWidth
                            style={{ maxWidth: "400px" }}
                            // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                            required={false}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={userData?.userData?.settings?.language}
                        // onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                        />

                        <Typography sx={{ mt: 6 }} variant="subtitle0" component="h2" >{t("Roles and permissions")}</Typography>

                        <FormControl fullWidth margin="normal" variant="filled" required={true} style={{ maxWidth: "400px" }}
                            error={false}
                        //hidden={(userPermissions.isTrainer)}
                        // variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                        >
                            <InputLabel shrink={true} id="assignedTrainer-select-label">{t("Role")}</InputLabel>
                            <Select
                                name='assignedTrainer'
                                labelId="assignedTrainer-select-label"
                                id="assignedTrainer-select"
                            // value={currentEvent?.assignedTrainer}
                            // readOnly={(formHelper.openType === 'PREVIEW')}
                            // disableUnderline={(formHelper.openType === 'PREVIEW')}
                            // onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                            >
                                {/* {trainersList} */}
                            </Select>
                        </FormControl>

                    </Grid>


                </Box>
            </Box>
        </>

    )
}