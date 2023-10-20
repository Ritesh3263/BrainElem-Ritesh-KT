import React, { useState, useEffect, useRef } from "react";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Services
import AdminService from "services/admin.service";

// MUI v5
import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Styled
import EMenuWithFilters from 'styled_components/MenuWithFilters';
import { EButton } from "styled_components";
import OptionsButton from "components/common/OptionsButton";

// Other
import panzoom from 'panzoom'
import mermaid from "mermaid";

// MUI v4
import { theme } from "MuiTheme";

mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
    themeCSS: ``
});

// Database diagram
const DatabaseDiagram = () => {
    const [diagram, setDiagram] = useState()
    const [diagramLoading, setDiagramLoading] = useState(true)
    const { setMyCurrentRoute, F_handleSetShowLoader, F_showToastMessage } = useMainContext();
    const componentRef = useRef()
    const optionsRef = useRef()

    // Element for opening filters
    const [filtersElement, setFiltersElement] = useState(null);
    const openFilters = Boolean(filtersElement);
    const [filters, setFilters] = useState([])


    const handleDownload = () => {
        var svgData = componentRef.current.children[0].outerHTML;
        var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "database.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        F_showToastMessage("Downloading. This file is large.", 'info')
    };



    const loadDiagram = () => {
        let modelNames = getSelectedModelNames()
        // Load Diagram
        AdminService.getDatabaseDiagram(modelNames).then(
            (response) => {
                setDiagram(response.data.diagram)
            },
            (error) => { console.error(error) }
        )

    }


    const getSelectedModelNames = () => {
        if (!filters.length || !filters[0]?.values.length) return []
        else return filters[0].values.filter(v=>v.selected).map(v=>v.key)
    }

    const loadFilters = () => {
        // Load Diagram
        AdminService.getDatabaseModels().then(
            (response) => {
                let filterValues = []
                response.data.modelNames.forEach((modelName, index) => {
                    if (modelName){
                        filterValues.push({ key: modelName, name: modelName, selected: index==0 })
                    }
                })
                setFilters([{ key: "MODELS", name: "Models", values: filterValues }])


            },
            (error) => { console.error(error) }
        )

    }
    useEffect(() => {
        F_handleSetShowLoader(true)
        setMyCurrentRoute("Database");

        function runPanzoom(event) {
            if (event.target.parentNode.id == 'mermaid') {
                for (const child of componentRef?.current?.children) {
                    panzoom(child)
                    F_handleSetShowLoader(false)
                    setDiagramLoading(false)

                }
            };
        }

        // EventListener for Panzoom
        componentRef.current.addEventListener('DOMNodeInserted', runPanzoom, false);

        loadFilters()
        return () => componentRef.current.removeEventListener("DOMNodeInserted", runPanzoom);

    }, []);

    useEffect(() => {
        if (filters?.length) {

            setDiagramLoading(true)
            F_handleSetShowLoader(true)
            setDiagram('')
            loadDiagram()
        }
    }, [filters]);



    useEffect(() => {
        console.log('changed mermaid')
        if (diagram) {


            if (componentRef.current.getAttribute('data-processed')){
                componentRef.current?.removeAttribute('data-processed');
                mermaid.init(undefined,componentRef.current);
            }
            else mermaid.contentLoaded()
        }
    }, [diagram]);

    return (
        <Grid container spacing={2}  sx={{height: '100%',alignItems: 'flex-start'}}>
            <Grid container item xs={12} sx={{ zIndex: 100, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                <Typography style={{ ...theme.typography.h, fontSize: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{"Models" + ": " + getSelectedModelNames().toString()}</Typography>
                <Box ref={optionsRef}>
                    <OptionsButton btns={[
                        { name: 'Filters', action: () => { setFiltersElement(optionsRef.current) } },
                        { name: 'Download', action: handleDownload }

                    ]} iconButton={true} eSize="small" />
                </Box>
                <EMenuWithFilters
                    filters={filters} setFilters={setFilters}
                    anchorEl={filtersElement}
                    open={openFilters}
                    onClose={() => { setFiltersElement(null) }}
                />
                
            </Grid>

            <Grid item xs={12} sx={{height: diagramLoading ? '0px' : '100%'}}>
                <Box id="mermaid" className="mermaid" ref={componentRef} sx={{ overflow: 'hidden',height: '100%' }}>{diagram}</Box>
            </Grid>
        </Grid>
    )
}

export default DatabaseDiagram;