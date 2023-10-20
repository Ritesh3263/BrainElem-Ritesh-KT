import React, { useEffect, useState } from 'react';
import { Grid, ThemeProvider } from "@mui/material";
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from "react-i18next";
import CognitiveSpace from "../../../services/cognative-space.service"
// import { ReactComponent as HatIcon } from '../../../img/cognitive_space/icon_hat.svg';
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import { new_theme } from 'NewMuiTheme';

const Question = ({ opportunity, opprtunities, setOpportunities, yesCounter, setYesCounter, cIndex, setCIndex, totalCount }) => {
    const { F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const [data, setData] = useState(null);


    const handleChange = (event) => {
        const req = {
            '_id': opportunity._id,
            'confirmed': event.target.value == "Yes",
        }
        F_handleSetShowLoader(true);
        CognitiveSpace.storeFeedBack('opportunities', req).then((resp) => {
            F_showToastMessage(t("mySpace-virtualCoach:ANSWER SAVED"), "success");
            console.log("event", event.target.value)

            if (event.target.value == "Yes") {
    
                let counter = yesCounter;
                counter = counter + 1;
                setYesCounter(counter);
            }
            if (totalCount != cIndex - 1) {
                let cindex = cIndex;
                cindex = cindex + 1;
                setCIndex(cindex)
            }
            let opps = opprtunities.map((opp) => {
                if (opp._id == opportunity._id) {
                    return { ...opp, "value": event.target.value }
                } else {
                    return opp;
                }
            })
            setOpportunities(opps);
        });

        F_handleSetShowLoader(false)
          

    };
    const { t } = useTranslation(['mySpace-virtualCoach']);

    return (
        <ThemeProvider theme={new_theme}>
            <div className="feedback_box">
                <Typography variant="body2" component="p" sx={{ textAlign: 'center', fontWeight: '500', mt: 6, mb: 2 }}>{t("mySpace-virtualCoach:DO YOU THINK THAT TEXT")}</Typography>
                {/* <div className="header" style={{ marginBottom: "15px" }}>
                <HatIcon />
            </div> */}
                <div className="content" style={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                    {/* <Typography variant="subtitle3" component="p" sx={{ mb: 2 }}>{t("mySpace-virtualCoach:DO YOU THINK THAT TEXT")}</Typography> */}
                    <Typography variant="body1" component="p" sx={{fontWeight: '700', textAlign: 'center'}}>{opportunity.text}</Typography>
                </div>
                <div className="bottom_button">
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name={"radio_group_" + cIndex}
                        value={opportunity.value}
                        defaultValue={"No"}
                        onChange={handleChange}
                        sx={{justifyContent: 'center'}}
                    >
                        <div className="btns">
                            <FormControlLabel value="No" control={<Radio />} label={t("mySpace-virtualCoach:NO")} className={opportunity.value === "No" ? "radio_active" : undefined} />
                        </div>
                        <div className="btns">
                            <FormControlLabel value="Yes" control={<Radio />} label={t("mySpace-virtualCoach:YES")} className={opportunity.value === "Yes" ? "radio_active" : undefined} />
                        </div>
                    </RadioGroup>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Question;