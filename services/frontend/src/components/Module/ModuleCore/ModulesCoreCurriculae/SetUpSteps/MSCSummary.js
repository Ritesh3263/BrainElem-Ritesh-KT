import React, {useEffect, useState} from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import {CardColumns, Col, Row} from "react-bootstrap";
import Card from '@material-ui/core/Card';
import {CardContent, CardHeader} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
        root:{
            overflow: "hidden"
        }
}));

export default function MSCSummary({MSCurriculum}) {
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    function periodNameHandler(periodId, yearObj){
        let periodName = yearObj.periods.find(p=>p._id === periodId);
        return periodName.name;
    }

    const subjectsList = MSCurriculum.trainingModules ? MSCurriculum.trainingModules.map((subject, index)=>(
        <Accordion style={{backgroundColor:`rgba(255,255,255,0.35)`, borderRadius:"8px"}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <h4><span className="mr-5"><small>{t("Original name")}:</small> {subject.originalTrainingModule ? subject.originalTrainingModule.name : "-"}</span><small>{t("New name")}:</small> <span className="text-success">{subject.newName ? subject.newName : "-"}</span></h4>
            </AccordionSummary>
            <AccordionDetails className="d-flex flex-column">
                <Row className="d-flex flex-fill">
                    <Col className="text-muted" >{t("Subject name")}</Col>
                    <Col className="text-muted">{t("Category")}</Col>
                    <Col className="text-muted">{t("Estimated time")}</Col>
                    <Col className="text-muted">{t("Progress")}</Col>
                </Row>
                <Row className="d-flex flex-fill">
                    <Col>{subject.newName ? subject.newName : "-"}</Col>
                    <Col>{subject.originalTrainingModule.category ? subject.originalTrainingModule.category.name : "-"}</Col>
                    <Col>{subject.originalTrainingModule.estimatedTime ? subject.originalTrainingModule.estimatedTime : "-"}</Col>
                    <Col>{`${subject.originalTrainingModule.hours ? subject.originalTrainingModule.hours : "-"}%`}</Col>
                </Row>
                <Row className="my-2">
                    {/*<h4>{t("Chapters")}</h4>*/}
                    <CardHeader className="d-flex flex-fill" title={(
                        <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t("Chapters")}
                        </Typography>
                    )}
                    />
                </Row>
                {subject.chosenChapters ? subject.chosenChapters.map((chapter, index)=>(
                    <Accordion style={{backgroundColor:`rgba(255,255,255,0.65)`, borderRadius:"8px"}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <h4 className="text-success">{chapter.chapter.name ? chapter.chapter.name : "-"}</h4>
                        </AccordionSummary>
                        <AccordionDetails className="d-flex flex-column">
                            <Row className="d-flex flex-fill">
                                <Col className="text-muted">{t("Duration time")}</Col>
                                <Col className="text-muted">{t("Assigned content quantity")}</Col>
                            </Row>
                            <Row className="d-flex flex-fill">
                                <Col>{chapter.chapter.durationTime ? chapter.chapter.durationTime : "-"}</Col>
                                <Col>{chapter.chosenContents ? chapter.chosenContents.length : "-"}</Col>
                            </Row>
                            <Row className="my-2">
                                {/*<h4>{t("Contents")}</h4>*/}
                                <CardHeader className="d-flex flex-fill" title={(
                                    <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Contents")}
                                    </Typography>
                                )}
                                />
                            </Row>
                            {chapter.chosenContents ? chapter.chosenContents.map((content,index)=>(
                                <Accordion style={{backgroundColor:`rgba(255,255,255,0.85)`, borderRadius:"8px"}}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <h4 className="text-danger">{content.content.title ? content.content.title : "-"}</h4>
                                    </AccordionSummary>
                                    <AccordionDetails className="d-flex flex-column">
                                        <Row className="d-flex flex-fill">
                                            <Col className="text-muted">{t("Duration time [hh-mm]")}</Col>
                                            <Col className="text-muted">{t("Level")}</Col>
                                            <Col className="text-muted">{t("Type")}</Col>
                                            {/* <Col className="text-muted">#Co-creators</Col> */}
                                        </Row>
                                        <Row className="d-flex flex-fill">
                                            <Col>{content.content.durationTime ? (`0${(content.content.durationTime/60) / 60 ^ 0}`.slice(-2) + ':' + ('0' + (content.content.durationTime/60) % 60).slice(-2)) : "-"}</Col>
                                            <Col>{content.content.level ? t(content.content.level) : "-"}</Col>
                                            <Col>{content.content.contentType ? t(content.content.contentType) : "-"}</Col>
                                            {/* <Col>{content.content.cocreators ? content.content.cocreators.length : "-"}</Col> */}
                                        </Row>
                                    </AccordionDetails>
                                </Accordion>
                            )) : null}
                        </AccordionDetails>
                    </Accordion>
                )) : null}
            </AccordionDetails>
        </Accordion>
    )) : null;

    return (
        <>
            <Card className="pt-0">
                {/*<h2 className="text-center"><strong className="text-uppercase">{t("Summary")}</strong></h2>*/}
                <CardHeader title={(
                    <Typography variant="h5" component="h2" className="text-left text-uppercase" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("Summary")}
                    </Typography>
                )}
                />
                <CardContent classes={{root: classes.root}}>
                    <h4 className="text-primary">{MSCurriculum.name}</h4>
                    <Row className="d-flex flex-fill">
                        <Col className="text-muted" >{t("Level")}</Col>
                        <Col className="text-muted">{t("Assigned year")}</Col>
                        <Col className="text-muted">{t("Assigned period")}</Col>
                        <Col className="text-muted">{t("Assigned grading scale")}</Col>
                        <Col className="text-muted">{t("Curriculum type")}</Col>
                        <Col className="text-muted">{t("Private / Public")}</Col>
                    </Row>
                    <Row className="d-flex flex-fill mb-4">
                        {console.log("===",MSCurriculum)}
                        <Col>{MSCurriculum.level ? t(MSCurriculum.level.levelName) : "-"}</Col>
                        <Col>{MSCurriculum.assignedYear ? MSCurriculum.assignedYear.name : "-"}</Col>
                        <Col>{MSCurriculum.assignedPeriod ? periodNameHandler(MSCurriculum.assignedPeriod, MSCurriculum.assignedYear) : "-"}</Col>
                        <Col>{MSCurriculum.type ? t(MSCurriculum.type) : "-"}</Col>
                        <Col>{MSCurriculum.isPublic ? "Public" : "Private"}</Col>
                    </Row>
                    <Row className="mb-2">
                        {/*<h4>{t("Subjects")}</h4>*/}
                        <CardHeader className="d-flex flex-fill" title={(
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Subjects")}
                            </Typography>
                        )}
                        />
                    </Row>
                    {subjectsList ? subjectsList : null}
                </CardContent>
            </Card>
        </>
    );
}
