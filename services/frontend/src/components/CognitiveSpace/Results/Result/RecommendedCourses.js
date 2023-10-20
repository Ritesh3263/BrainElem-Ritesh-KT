import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Components
import ImageList from '@mui/material/ImageList';
import Typography from '@mui/material/Typography';

import { ECard} from "styled_components";
import ImageListItem from "components/Item/ImageListItem"

// Colors
import { theme } from "MuiTheme";

const item1 =  {
    name: "Employee Wellness and Stress Management",
    img: '/api/v1/coursePaths/images/623a1262e461d60038626c10/download',
    paymentEnabled: true,
    price: 29.99,
    currency: '$',
    createdAt: "2022-12-1",
    startDate: "2022-12-1",
    endDate: "2022-12-4",
    enrollmentStartDate: "2022-12-1",
    enrollmentEndDate: "2028-12-1",
    certificate: 'xxx',
    format: {name: "WEEKENDS"},
    trainingManager: {name: "Bob", surname: "Pitte" },
    category: {name: 'Self development'}
}

const item2 =  {
    name: "Negotiation strategies",
    img: '/api/v1/coursePaths/images/623a1252e461d60038626c00/download',
    paymentEnabled: false,
    createdAt: "2022-12-1",
    startDate: "2022-12-1",
    endDate: "2022-12-3",
    trainingManager: {name: "Bob", surname: "Pitte" },
    category: {name: 'Self development'}
}

export default function RecommendedCourses({ activeResults }) {
    const { t } = useTranslation(['translation', 'cognitiveSpace', 'traits']);

    return (
        <ECard className="card-bg" sx={{background: theme.palette.glass.opaque, display:"block", p:"16px"}}>
            <Typography sx={theme.typography.sh3} style={{lineHeight:"36px", fontSize: "24px", color:theme.palette.primary.darkViolet, fontWeight:"bold" }} >
                {t('cognitiveSpace:Recommended courses')} 
            </Typography>
            <Typography sx={{pr:1, display: 'inline', lineHeight:"24px", pt:"8px", pb:"16px", fontFamily:"Roboto", fontSize: "14px", color: theme.palette.primary.darkViolet}} >
                {t('cognitiveSpace:You might be interested in')+":"} 
            </Typography>
            <Typography sx={{fontWeight: 600, display: 'inline', lineHeight:"24px", pt:"8px", pb:"16px", fontFamily:"Nunito", fontSize: "16px", color: theme.palette.primary.green}} >
                {t('cognitiveSpace:Developing skills in recognizing and expressing emotions')} 
            </Typography>
            <ImageList sx={{ width: '100%', height: 300, justifyItems: 'start' }} cols={3} gap={16}>
                <ImageListItem element={item1}></ImageListItem>
                <ImageListItem element={item2}></ImageListItem>

            </ImageList>
        </ECard>
    )
}