import React from "react";
import { useTranslation } from "react-i18next";

// Other components
import DisplayContent from "../DisplayContent";

// Services
import ContentService from "services/content.service";

// Display BrainCore test
export default function DisplayBrainCoreTest() {
    const params = new URLSearchParams(window.location.search)
    const lang = params.get('lang')||undefined
    const type = params.get('type')||undefined

    return (
        <>
            <DisplayContent contentId={ContentService.getBraincoreTestId(type, lang)}></DisplayContent>
        </>
    )
}