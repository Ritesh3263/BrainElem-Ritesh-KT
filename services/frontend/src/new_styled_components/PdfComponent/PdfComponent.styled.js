
import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { useTranslation } from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// MUI v5

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

// MUI v4
import { theme } from "../../MuiTheme";

const palette = theme.palette;


// Dispaly PDF based on provided URL
const PdfComponent = ({ url }) => {
    const { t } = useTranslation();
    const [pdf, setPdf] = useState()
    const [pages, setPages] = useState([])

    const [loadingPercentage, setLoadingPercentage] = useState(0)
    const pagesRef = useRef([])

    const containerRef = useRef()
    // Detect resize
    const resizeDetectorRef = useRef()
    const resizeTimeOutId = useRef()

    // setCurrentRoute
    const { F_showToastMessage } = useMainContext();

    // Load PDF file
    const loadPdf = async () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.js';
        // Asynchronous download of PDF
        var pdf = await pdfjsLib.getDocument(url).promise;
        setPdf(pdf)

    }

    //Function to dynamically add an input box: 
    function addInput(e) {
        F_showToastMessage(t("This document is not interactive."))
        

        // var rect = e.currentTarget.getBoundingClientRect();
        // var x = e.clientX - rect.left; //x position within the element.
        // var y = e.clientY - rect.top;  //y position within the element.

        // let width = rect.right - rect.left
        // if ((width - x) < 200) x = width - 200

        // var input = document.createElement('input');
        // input.addEventListener('click', (e) => { e.stopPropagation() })
        // input.addEventListener('input', (e) => { if (!e.currentTarget.value) e.currentTarget.remove() })
        // input.addEventListener('blur', (e) => { if (!e.currentTarget.value) e.currentTarget.remove() })

        // input.type = 'search';

        // input.style.position = 'absolute';
        // input.style.left = (x - 4) + 'px';
        // input.style.top = (y - 4) + 'px';
        // input.style.width = '200px';

        // e.currentTarget.appendChild(input)

        // input.focus();
    }

    // Get PDF viewport with proper sizes 
    const getViewport = (page) => {
        // Get width of container 
        let containerWidth = containerRef.current.clientWidth

        // Max width is 1000px
        if (containerWidth > 1000) containerWidth = 1000;
        let initialWidth = page.getViewport({ scale: 1 }).width

        var viewport = page.getViewport({ scale: containerWidth / initialWidth });

        return viewport
    }


    // Prepare place for rendering PDF pages
    const preparePages = async () => {
        var pages = []
        for (let i = 0; i < pdf.numPages; i++) {
            let page = await pdf.getPage(i + 1)

            var viewport = getViewport(page)
            //We'll create a canvas for each page to draw it on
            let canvasParentId = `canvas-parent-${i}`
            var canvas =
                <div
                    key={canvasParentId}
                    id={canvasParentId}
                    style={{ position: 'relative', cursor: 'pointer', overflow: 'auto' }}
                    onClick={(e) => addInput(e)}
                >
                    <canvas
                        ref={ref => { pagesRef.current[i] = ref }}
                        style={{ display: 'block' }}
                        height={viewport.height}
                        width={viewport.width}>
                    </canvas>
                </div>


            pages.push(canvas)
        }
        setPages(pages)
    }


    // Render pages of the PDF one by one
    const renderPages = async () => {
        for (let i = 0; i < pdf.numPages; i++) {
            if (!pagesRef.current[i]) return
            setLoadingPercentage(100 * (i + 1) / pdf.numPages)
            let page = await pdf.getPage(i + 1)
            var viewport = getViewport(page)
            var context = pagesRef.current[i].getContext('2d');

            //Draw it on the canvas
            await page.render({ canvasContext: context, viewport: viewport, renderTextLayer: true }).promise

        }
    }


    // Trigger downolad PDF file 
    useEffect(() => {
        setLoadingPercentage(0)
        pagesRef.current = []
        loadPdf()
    }, [url]);


    // Trigger preparing place for rendering PDF pages
    // Trigger on each change of window size by using resizeDetectorRef
    // While using containerRef the ResizeObserver was triggered on each page render
    // resizeDetectorRef is independant from PDF and has fixed height
    useEffect(() => {
        if (pdf && containerRef && resizeDetectorRef?.current) {
            const observer = new ResizeObserver(function () {

                // RUN ONCE PER 500 ms
                clearTimeout(resizeTimeOutId.current)
                resizeTimeOutId.current = setTimeout(async () => {
                    preparePages()
                }, 500);
            });
            observer.observe(resizeDetectorRef?.current);

            return () => {
                observer.disconnect()
            }
        }


    }, [resizeDetectorRef?.current, containerRef, pdf]);


    // Trigger rendering pages
    useEffect(() => {
        if (pdf && pages && pagesRef) renderPages()
    }, [pdf, pages, pagesRef])

    return (<>
        <Box ref={resizeDetectorRef} style={{ width: '100%', height: '0px' }}></Box>
        <Grid ref={containerRef} container sx={{ justifyContent: 'center' }}>
            {pages}
            {loadingPercentage != 100 && <Typography sx={{ ...theme.typography.p, fontSize: 14 }}>{t("Loading pages") + `: ${loadingPercentage}%`}</Typography>}
        </Grid>
    </>)
}

export default PdfComponent;