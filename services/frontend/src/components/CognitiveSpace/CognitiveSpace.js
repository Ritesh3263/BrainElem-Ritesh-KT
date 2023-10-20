import React, { useState, useEffect, lazy } from "react";
import { useLocation } from "react-router-dom";


// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

//Services
import ContentService from "services/content.service";

// Components
const Welcome = lazy(() => import("./Welcome/Welcome"));
const Results = lazy(() => import("./Results/Results"));

// Parent component for congitive space 
export default function CongintiveSpace() {
    // List with all results for BrainCore Test
    const [results, setResults] = useState(undefined)
    // Load variables from main context
    const { setMyCurrentRoute, F_showToastMessage, F_getErrorMessage, F_handleSetShowLoader, activeNavigationTab, setActiveNavigationTab, setNavigationTabs } = useMainContext();
    const [isHistory, setHistory] = useState(false);
    const location = useLocation();

    const loadResults = () => {
        F_handleSetShowLoader(true)
        // Load overview to get results
        ContentService.getBrainCoreTestResults().then(
            (response) => {
                setResults(response.data)
                F_handleSetShowLoader(false)
            },
            (error) => {
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
                F_handleSetShowLoader(false)
            }
        )
    }

    // When component is loaded
    useEffect(() => {
        // Load results from database
        loadResults()
    }, []);



    return (
        <>
            {results !== undefined &&
                <>
                    {results.length == 0 && <Welcome />}
                    {results.length !== 0 && <Results isHistory={isHistory} setHistory={setHistory} results={results} setResults={setResults} tabIndex={location.state?.tabIndex ? location.state?.tabIndex : 0} loadResults={loadResults} activeNavigationTab={activeNavigationTab} />}
                </>
            }
        </>
    )
}