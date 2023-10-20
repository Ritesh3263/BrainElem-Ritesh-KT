import React from "react";
import {Col, Form, ListGroup, Row} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArchitectAssignCurriculum2a_details from "./ArchitectAssignCurriculum2a_details"
import {useTranslation} from "react-i18next";

export default function ArchitectAssignCurriculum2({MSClass,setMSClass, firstSetup,basicValidators}){
    const { t, i18n, translationsLoaded } = useTranslation();
    function findTrainingPath(currentPeriodId, needReturn){
        let found = "-";
        let some = MSClass.program.find(cl=> cl.period === currentPeriodId);
        // handle case whe "some" is undefined
        if(some){
            if (some.trainingPath && some.trainingPath.name ) // in case original curriculum was deleted
            {
                if(needReturn === "name"){
                    found = some ? some.trainingPath.name : t("no assigned curriculum")
                }else{
                    found = some ? some.trainingPath._id : null;
                }
            }
            else found = null;
        } else found = null;

        return found;
    }


    const periodsList = MSClass.academicYear.periods ? MSClass.academicYear.periods.map((period, index)=>(
        <Accordion style={{backgroundColor:`rgba(255,255,255,0.35)`, borderRadius:"8px"}} className="mb-2">
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`panel${index+1}a-content`}
                id={`panel${index+1}a-header`}
                className="d-flex justify-content-center align-items-center"
            >
                <Col xs={1} className="p-0 m-0 d-flex align-items-center"><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
                <Col xs={6} className="d-flex align-items-center">{period.name ? period.name : "-"}</Col>
                <Col xs={5} className="d-flex align-items-center">
                    <span>
                        {findTrainingPath(period._id,"name")}
                    </span>
                </Col>
            </AccordionSummary>
            <ArchitectAssignCurriculum2a_details MSClass={MSClass} setMSClass={setMSClass} selectedPathId={findTrainingPath(period._id,"id")}
                                                 selectedPeriodId={period._id} currentIndex={index} firstSetup={firstSetup}/>
        </Accordion>
    )) : null;

    return(
        <Form as={Row} className="mb-5">
            <Col>
                <ListGroup>
                    <h5 className="text-center mb-5">{t("Year name")}: {MSClass.academicYear ? MSClass.academicYear.name : "-"}</h5>
                    {basicValidators.allPeriodHasCurriculum &&(
                        <span className="text-danger text-center">{t("You haven't assigned curriculum to all periods")}</span>
                    )}
                    {basicValidators.allClassHasManager &&(
                        <span className="text-danger text-center">{t("You haven't assigned all teacher to subjects")}</span>
                    )}
                    <div className="pl-2 pr-2 pb-1 d-flex justify-content-between align-items-center">
                        <Col xs={1} className=" p-0 m-0"><small>No.</small></Col>
                        <Col xs={6} className=""><small>{t("Period name")}</small></Col>
                        <Col xs={5} className=""><small>{t("Assigned curriculum")}</small></Col>
                    </div>
                    {periodsList}
                </ListGroup>
            </Col>
        </Form>
    )
}