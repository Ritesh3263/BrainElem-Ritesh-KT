
import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// MUI v5

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

// MUI v4
import { theme } from "../../MuiTheme";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";

const palette = theme.palette;


// Dispaly PDF based on provided URL
// url - url of the pdf file to be displayed - required
// onLoad - function to be called when PDF is loaded
// onError - function to be called on error
// renderTimeout - render timeout - usefull for PDF report
const PdfComponent = ({ url, onError=()=>{}, onLoad=()=>{}, renderTimeout=0, ...props }) => {
    const { t } = useTranslation(['sentinel-MyUsers-BCTestRegistration', 'sentinel-Admin-Credits']);
    const [pdf, setPdf] = useState()
    const [pages, setPages] = useState([])

    const [loadingPercentage, setLoadingPercentage] = useState(0)
    const pagesRef = useRef([])

    const containerRef = useRef()
    // Detect resize
    const resizeDetectorRef = useRef()
    const resizeTimeOutId = useRef()

    // setCurrentRoute
    const { F_showToastMessage, F_handleSetShowLoader } = useMainContext();

    // Load PDF file
    const loadPdf = async () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//'+window.location.hostname+'/node_modules/pdfjs-dist/build/pdf.worker.min.js';
        // Asynchronous download of PDF
        try{
            var pdf = await pdfjsLib.getDocument(url).promise;
            setPdf(pdf)
        }catch (error){
            console.log(error)
            if (error?.status == 404) F_showToastMessage(t("sentinel-MyUsers-BCTestRegistration:NO RESULTS"), 'error')
            if (error?.status == 403) F_showToastMessage(t("sentinel-Admin-Credits:RESULTS BLOCKED BY CREDITS"), 'error')
            else if (error) F_showToastMessage(t("sentinel-MyUsers-BCTestRegistration:COULD NOT DOWNLAD RESULTS"), 'error')
            F_handleSetShowLoader(false)
            onError()

        }
    }

    //Function to dynamically add an input box: 
    function addInput(e) {
        //F_showToastMessage(t("This document is not interactive."))


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
        pagesRef.current = []
        for (let i = 0; i < pdf.numPages; i++) {
            let page = await pdf.getPage(i + 1)

            var viewport = getViewport(page)
            //We'll create a canvas for each page to draw it on
            var canvas =  <canvas
                        key={`canvas-parent-${i}-${(Math.random() + 1).toString(36).substring(7)}`}
                        id={`canvas-parent-${i}-${(Math.random() + 1).toString(36).substring(7)}`}
                        ref={ref => { pagesRef.current[i] = ref }}
                        style={{ display: 'block' }}
                        height={viewport.height}
                        width={viewport.width}>
                    </canvas>


            pages.push(canvas)
        }
        onLoad(pages)
        setPages(pages)
    }


    // Render pages of the PDF one by one
    const renderPages = async () => {
        for (let i = 0; i < pdf.numPages; i++) {
            //if (percantage>=100) continue
            if (!pagesRef.current[i]) return
            let percantage = parseInt(100 * (i + 1) / pdf.numPages)
            setLoadingPercentage(percantage)
            let page = await pdf.getPage(i + 1)
            var viewport = getViewport(page)
            var context = pagesRef.current[i].getContext('2d');

            //Draw it on the canvas
            await page.render({ canvasContext: context, viewport: viewport, renderTextLayer: true }).promise
            
            if (percantage>=10) F_handleSetShowLoader(false)
            

        }
    }


    // Trigger downolad PDF file 
    useEffect(() => {
        if (!url) return
        F_handleSetShowLoader(true)
        setLoadingPercentage(0)
        pagesRef.current = []
        loadPdf()
    }, [url]);

    useEffect(() => {
        return () => {
            F_handleSetShowLoader(false)
        }
    }, [])

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
        const timer = setTimeout(() =>{
            if (pdf && pages && pagesRef) renderPages()
        }
        , renderTimeout)
        return () => clearTimeout(timer)
    }, [pdf, pages, pagesRef])

    return (<>
        <ThemeProvider theme={new_theme}>
            <Box ref={resizeDetectorRef} style={{ width: '100%', height: '0px' }}></Box>
            <Grid {...props} ref={containerRef} container sx={{ overflowX: 'hidden', justifyContent: 'center', overflowY: 'auto', minWidth: '1px', minHeight: '1px'}}>
                {pages}
            </Grid>
        </ThemeProvider>
    </>)
}

export default PdfComponent;