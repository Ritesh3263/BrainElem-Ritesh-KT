import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Components
import { EButton } from "styled_components"
import CircularProgress from '@mui/material/CircularProgress';

// Services
import ResultService from "services/result.service";

// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function DownloadResultsButton({ activeResults, results, setResults }) {
    const { t } = useTranslation(['translation', 'traits']);

    // Full PDF raport from BrainCore
    const [fullRaportUrl, setFullRaportUrl] = useState()
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadingFailed, setDownloadingFailed] = useState(false)
    const { F_showToastMessage, F_handleSetShowLoader, F_getLocalTime } = useMainContext();

    const fullRaportRequest = useRef();

    function getButtonText() {
        if (fullRaportUrl) return t("Open full results")
        else if (downloadingFailed) return t("Try again")
        else if (isDownloading) return t("Downloading")
        else return t("Download full results")
    }

    function openFullRaport() {
        window.open(fullRaportUrl, '_blank').focus()
    }

    function download(file, callback) {
        //F_showToastMessage("Generating and downloading results...")
        let request = new XMLHttpRequest();

        request.responseType = 'blob';
        request.open('GET', file);

        // Check if there was redirect to page other than braincore
        // If BrainCore server fails, it reeturns 302 and redirects to current page
        request.onreadystatechange = function () {
            if (this.readyState === this.DONE) {
                if (this.responseURL.length && !this.responseURL.includes('braincore')) {
                    setDownloadingFailed(true)
                    this.abort() // This seems to stop the response
                }
            }
        }

        request.addEventListener('load', function () {
            if (request.status == 200) callback(request.response);
            else setDownloadingFailed(true)
        });
        fullRaportRequest.current = request
        request.send();
    }

    // Function called after downloading a file
    function downloadCallback(myBlob) {
        console.log("download callback - Calling callback", myBlob, myBlob.size)
        if (myBlob.size < 10000) {
            setDownloadingFailed(true)
        }
        else {
            var objectURL = URL.createObjectURL(myBlob);
            setFullRaportUrl(objectURL)
            F_handleSetShowLoader(false)
            // Save url in results 
            let index = results.indexOf(activeResults)
            // 1. Make a shallow copy of the items
            let updatedResults = [...results];
            // 2. Make a shallow copy of the item you want to mutate
            let result = { ...results[index] };
            // 3. Replace the property you're intested in
            result.fullRaportUrl = objectURL;
            // 4. Put it back into our array
            updatedResults[index] = result;
            // 5. Set the state to our new copy
            setResults(updatedResults);
            //F_showToastMessage(t("Loaded full raport from BrainCore"), 'success')
            setIsDownloading(false)
            setDownloadingFailed(false)


            // ################################
            // For downloading use those lines:
            // var a = document.createElement('a');
            // a.href = objectURL;
            // a.download =  `BrainCore Results - ${F_getLocalTime(activeResults.createdAt, true)}.pdf`
            // a.click();


        }



    }

    const handleDownload = () => {
        setIsDownloading(true)
        setDownloadingFailed(false)
        // Reset values
        fullRaportRequest.current = undefined;

        ResultService.generate(activeResults, 'student', 'long_educational').then(
            (response) => {
                download(response.data, downloadCallback)
            },
            (error) => {
                F_showToastMessage("Could not download results.", 'error')
                F_handleSetShowLoader(false)
                setDownloadingFailed(true)
            }
        )

    }

    // When active results are changed/selected
    useEffect(() => {
        if (activeResults) {
            setDownloadingFailed(false)
            setIsDownloading(false)
            if (activeResults.fullRaportUrl) setFullRaportUrl(activeResults.fullRaportUrl)
            else {
                setFullRaportUrl(undefined);
                fullRaportRequest.current = undefined;
                return () => {// In case results are switched - stop downoading and processing old results
                    if (fullRaportRequest.current) {
                        fullRaportRequest.current.abort()

                    }
                }
            }
        }
    }, [activeResults]);

    return (
        <EButton style={{ marginLeft: "50px" }}
            disabled={isDownloading && !downloadingFailed}
            eSize='small'
            onClick={() => fullRaportUrl ? openFullRaport() : handleDownload()}
            startIcon={isDownloading && !downloadingFailed && <CircularProgress size={20} sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
        >{getButtonText()}
        </EButton>
    )
}