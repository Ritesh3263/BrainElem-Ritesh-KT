import React, { lazy } from 'react';
import { new_theme } from 'NewMuiTheme';
import { ThemeProvider } from '@mui/system';
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Dummy images for EDU version
import dummyEduEn from "../../../../img/sentinel/home_dummy_edu_en.png";
import dummyEduFr from "../../../../img/sentinel/home_dummy_edu_fr.png";
import dummyEduPl from "../../../../img/sentinel/home_dummy_edu_pl.png"

import dummyEn from "../../../../img/sentinel/home_dummy_en.png";
import dummyFr from "../../../../img/sentinel/home_dummy_fr.png";
import dummyPl from "../../../../img/sentinel/home_dummy_pl.png"

import { useTranslation } from "react-i18next";

const CognitiveDashboard = (props) => {
    const { t, i18n } = useTranslation();
    const { F_getHelper } = useMainContext();
    const { } = props;

    return(
        <>
            <ThemeProvider theme={new_theme}>
                <div className='dashboard_dummy' style={{width: '100%'}}>
                    {!F_getHelper().isEdu && <img src={i18n.language=='fr' ? dummyFr : i18n.language=='pl' ? dummyPl : dummyEn} style={{ width: '100%' }} />}
                    {F_getHelper().isEdu && <img src={i18n.language=='fr' ? dummyEduFr : i18n.language=='pl' ? dummyEduPl : dummyEduEn} style={{ width: '100%' }} />}
                
                </div>
            </ThemeProvider>
        </>
    )
}

export default CognitiveDashboard;