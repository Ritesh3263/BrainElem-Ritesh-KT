import AdminService from "services/admin.service";
import React, {useEffect, useState} from "react";
import {Row} from "react-bootstrap";
import Button from '@material-ui/core/Button';
import ConfirmActionModal from "../common/ConfirmActionModal";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";


export default function Script(){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_showToastMessage, F_handleSetShowLoader, setMyCurrentRoute} = useMainContext();
    const [actionModal2, setActionModal2] = useState({isOpen: false, returnedValue: false});
    const [actionModal6, setActionModal6] = useState({isOpen: false, returnedValue: false});
    // const [actionModal1, setActionModal1] = useState({isOpen: false, returnedValue: false});

    useEffect(() => {
        setMyCurrentRoute("Script")
    }, [])

    useEffect(()=>{
        if(actionModal2.returnedValue){
           ChangePasswords();
           runMigration('toEnglish')
           runMigration('fillInterest')
        }
    },[actionModal2.returnedValue])    

    useEffect(()=>{
        if(actionModal6.returnedValue){
           RemoveDatabase();
        }
    },[actionModal6.returnedValue])

    function ChangePasswords(){
            AdminService.changePasswords().then(res=>{
                F_showToastMessage("Password changed to Testing123! for all users","success")
            }).catch(errors=>console.error(errors));
    }

    function PublishGrades(){
            AdminService.publishGrades().then(res=>{
                F_showToastMessage("All results before 25.08 changed to published","success")
            }).catch(errors=>console.error(errors));
    }

    function RemoveDatabase(){
        AdminService.removeDatabase().then(res=>{
            F_showToastMessage("Database removed","success")
        }).catch(errors=>console.error(errors));
    }

    function updateRoles(){
        AdminService.updateRoles().then(res=>{
            F_showToastMessage("Roles updated","success")
        }).catch(errors=>console.error(errors));
    }


    // Run migration on database
    function runMigration(name){
        F_handleSetShowLoader(true);

        AdminService.runMigration(name).then(res=>{
            F_showToastMessage(res.data.message||"Migration sucessful","success")
            F_handleSetShowLoader(false);
        }).catch(err=>{ 
            F_showToastMessage("Could not run migration","error")
            console.error(err)
            F_handleSetShowLoader(false);
        });

    }


    return (
        <>
        TEMPORARY SCRIPTS:


        <Row className="mt-4">
            <Button onClick={()=>runMigration('combineAccessedURLLogs')} size="small" variant="contained" color="primary" className="ml-5">
            {"Combine `accessedURLs` in all logs (Adrian 16.09.22, Issue #1083)"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('replace_same_duplicated_contents')} size="small" variant="contained" color="primary" className="ml-5">
            {"replace same duplicated contents)"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('fix_duplicate_chapter')} size="small" variant="contained" color="primary" className="ml-5">
            {"Fix duplicate chapter (08.11.22, Issue #mm)"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('add_deleted_courses')} size="small" variant="contained" color="primary" className="ml-5">
            {"Add courses which were deleted on 08.01.2023"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('fixTypo_BEGGINER')} size="small" variant="contained" color="primary" className="ml-5">
            {"Fix 'BEGGINER' typo for level in CertificationSession"}
            </Button>
        </Row> 
        <Row className="mt-4">
            <Button onClick={()=>runMigration('setModuleManagerScope')} size="small" variant="contained" color="primary" className="ml-5">
            {"Assign free module scope for module manager"}
            </Button>
        </Row>  
        <Row className="mt-4">
            <Button onClick={()=>runMigration('manageTrainersChapters')} size="small" variant="contained" color="primary" className="ml-5">
            {"Manage Trainer's chapters (03.10.22 Issue#1108)"}
            </Button>
        </Row> 
        <Row className="mt-4">
            <Button onClick={()=>runMigration('team2teams')} size="small" variant="contained" color="primary" className="ml-5">
            {"Change from User.team to User.teams (8.8.23 COG-487)"}
            </Button>
        </Row>  
        {/* <Row className="mt-4">
            <Button onClick={()=>runMigration('displayListOfAllContent')} size="small" variant="contained" color="primary" className="ml-5">
            {"SHOW all Nemesis content"}
            </Button>
        </Row>   */}
        {/* <Row className="mt-4">
            <Button onClick={()=>UpdateStudentsLevels()} size="small" variant="contained" color="primary" className="ml-5">
            {"Update student levels"}
            </Button>
        </Row> */}

        {/* <Row className="mt-4">
            <Button onClick={()=>updateRoles()} size="small" variant="contained" color="primary" className="ml-5">
            {"Update Roles"}
            </Button>
        </Row>

        <Row className="mt-4">
            <Button onClick={()=>runMigration('updateContentPageElements')} size="small" variant="contained" color="primary" className="ml-5">
            {"Run migration from 01.12.2021 (Adrian)"}
            </Button>
        </Row>

        <Row className="mt-4">
            <Button onClick={()=>runMigration('runTextExtractionForAllFiles')} size="small" variant="contained" color="primary" className="ml-5">
            {"Run text extraction for all files (Adrian)"}
            </Button>
        </Row> */}
        

        {/* <Row className="mt-4">
            <Button onClick={()=>UpdateContentLevels()} size="small" variant="contained" color="primary" className="ml-5">
            {"Update content levels"}
            </Button>
        </Row>

        <Row className="mt-4">
            <Button onClick={()=>insertDefaultCoefficientToExams()} size="small" variant="contained" color="primary" className="ml-5">
            {"Update examCoefficients"}
            </Button>
        </Row> */}
        <Row className="mt-4">
            <Button onClick={()=>runMigration('setIsDeleted')} size="small" variant="contained" color="primary" className="ml-5">
            {"Set isDeleted false to all users (05.01.23 COG-32)"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('permissionsListChange')} size="small" variant="contained" color="primary" className="ml-5">
            {"Permissions List Changes according to Headers (10.04.23 COG-404)"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('addReadScopeForBrainElemTrainingCenter')} size="small" variant="contained" color="primary" className="ml-5">
            {"Add scope to read Universal BrainElem Training Center for all trainees (17.04.23 GLOB-29)"}
            </Button>
        </Row>
        <br/><br/><br/><br/>
        <div>BEFORE SEPTEMBER 2022:</div>
        
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        NORMAL SCRIPTS:
        <Row className="mt-4">
            <Button onClick={()=>runMigration('processNewResults')} size="small" variant="contained" color="primary" className="ml-5">
            {"Process new Braincore test results which were not processed yet"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('processResults')} size="small" variant="contained" color="primary" className="ml-5">
            {"Process all Braincore test results for all users, and calculate new traits/profiles/tips/opportunities"}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button onClick={()=>runMigration('fixBrainCoreStatuses')} size="small" variant="contained" color="primary" className="ml-5">
            {"Fix BrainCore statuses for users imported from TM or invited with old invitation for team."}
            </Button>
        </Row>
        <Row className="mt-4">
            <Button className="ml-5" onClick={()=>setActionModal2({isOpen: true, returnedValue: false})} size="small" variant="contained" color="primary">
            {"Change, passwords to Testing123!, language to English, fill interests for all users."}
            </Button>
        </Row>


        <Row className="mt-4">
            <Button className="my-5 ml-5" onClick={()=>setActionModal6({isOpen: true, returnedValue: false})} size="small" variant="contained" color="primary">
            {"Clear WHOLE DATABASE!!!"}
            </Button>
        </Row>

            <ConfirmActionModal actionModal={actionModal2}
                                setActionModal={setActionModal2}
                                actionModalTitle={t("Change password")}
                                actionModalMessage={t("Are you sure you want to change password to Testing123!, language to English, fill interests for all users? The action is not reversible!")}
                                btnText={"Change All"}
                            />
            
    
            
            
            <ConfirmActionModal actionModal={actionModal6}
                                setActionModal={setActionModal6}
                                actionModalTitle={t("CLEAR DATABASE!!!")}
                                actionModalMessage={t("Are you sure you want to Remove WHOLE DATABASE?")}
                                btnText={"Remove All"}
                            />
            
            
        </>
    )

}