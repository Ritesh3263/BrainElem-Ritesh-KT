import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SettingsIcon from "@material-ui/icons/Settings";
import moduleCoreService from "services/module-core.service";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import {Paper} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {FormControlLabel} from "@material-ui/core";
import Switch from "styled_components/Switch";
import { Divider } from "@mui/material";
import { Typography, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import Container from "@mui/material/Container";
import "./gradingscale.scss";
import Box from "@mui/material/Box";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme=>({}))

export default function MSGradingScalesForm(){
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { gradingScaleId } = useParams();
    const [currentModule, setCurrentModule] = useState({});
    const [scaleIndex, setScaleIndex] = useState(0);
    const [chosenGradingScaleTemplate, setChosenGradingScaleTemplate] = useState({items:[]});
    const [scaleTemplates, setScaleTemplates] = useState([])
    const [MSScale, setMSScale] = useState({items:[]});
    const [currentModuleId, setCurrentModuleId] = useState("");
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [validators, setValidators] = useState({name: false, passPercentage: false });
    const [currentModuleCore, setCurrentModuleCore] = useState({});
    const [checked, setChecked] = useState(false);
    const toggleChecked = () => setChecked(value => !value);
    
    useEffect(()=>{
        if(MSScale._id)
        setChecked(MSScale._id === currentModule?.defaultGradingScale);
    },[MSScale, currentModule]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeScale();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        F_handleSetShowLoader(true)
        setCurrentModuleId(manageScopeIds.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            setCurrentModule(res.data);
        }).catch(error=>console.error(error))

        if(gradingScaleId !== "new"){
            moduleCoreService.getAllGradingScalesForModule(manageScopeIds.moduleId).then(res=>{
                let scaleIndex = res.data.gradingScales.findIndex(cs=>cs._id === gradingScaleId);
                setScaleIndex(scaleIndex);
                if(res.data?.gradingScales.length > 0){
                    setMSScale(res.data.gradingScales[scaleIndex])
                    F_handleSetShowLoader(false);
                    //setScaleTemplates(res.data.gradingScale.defaultGradingScales);
                    //setChosenGradingScaleTemplate(res.data.gradingScale[0]);
                }
            })
        }else {
            setMSScale({
                name:"",
                description:"",
                passPercentage:"",
                grades:[{
                    label: "1",
                    shortLabel: "Very Poor",
                    maxPercentage: 0,
                },
                {
                    label: "2",
                    shortLabel: "...",
                    maxPercentage: 33,
                },
                {
                    label: "4",
                    shortLabel: "...",
                    maxPercentage: 75,
                },
                {
                    label: "6",
                    shortLabel: "Excellent",
                    maxPercentage: 100,
                },
                
            ],
            })
            F_handleSetShowLoader(false)
        }

    },[])

    function saveChanges(){
        if (checked) currentModuleCore.defaultGradingScale = MSScale._id
        else currentModuleCore.defaultGradingScale = "empty"

        if(validateFields()){
            if(gradingScaleId !== "new"){
                moduleCoreService.updateMSScale(MSScale).then(res=>{
                    console.log(res)
                    F_showToastMessage("Data was updated","success");
                    navigate("/modules-core/grading-scales")
                }).catch(error=>console.error(error));
                moduleCoreService.updateModuleCore(manageScopeIds.moduleId,currentModuleCore).then(res=>{
                    F_showToastMessage("Data was updated","success");
                }).catch(error=>console.error(error));
            }else{
                moduleCoreService.addMSScale(currentModuleId,MSScale).then(res=>{
                    F_showToastMessage("Data was created","success");
                    navigate("/modules-core/grading-scales")
                }).catch(error=>console.error(error));
                moduleCoreService.updateModuleCore(manageScopeIds.moduleId,currentModuleCore).then(res=>{
                    F_showToastMessage("Data was updated","success");
                }).catch(error=>console.error(error));
            }
        }else{
            F_showToastMessage("Correct wrong fields then save","warning");
        }
    }

    function validateFields(){
        let isValidate = false;

        if(MSScale.name.length < 3 || MSScale.name.length > 20){
            setValidators(p=>({...p,name: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,name: false}));
            isValidate = true;
        }

        if(MSScale.passPercentage.length < 1 || MSScale.passPercentage.length > 100){
            setValidators(p=>({...p,passPercentage: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,passPercentage: false}));
            isValidate = true;
        }

        return isValidate;
    }

    function removeScale(){
            moduleCoreService.removeMSScale(MSScale).then(res=>{
                if (res.data.message == 1) F_showToastMessage("Grading Scale removed successfully","success");
                else F_showToastMessage("To delete, first select other Grading Scale as default","error");
                navigate("/modules-core/grading-scales")
            }).catch(error=>console.error(error));
    }

    // const scaleTemplatesList = scaleTemplates.map((scale, index)=><MenuItem key={scale._id} value={scale}>{scale.name}</MenuItem>);
    //
    //
    //     const scaleTemplateItemsList = chosenGradingScaleTemplate.items.map((item, index) => (
    //         <TableRow key={item._id}>
    //             <TableCell component="th" scope="row"  align="center">{item.itemName}</TableCell>
    //             <TableCell align="center">{item.itemValue}</TableCell>
    //         </TableRow>
    //     ))

    const editedCustomGradingScale = MSScale.grades ? MSScale.grades.map((item, index) => (
        <TableRow key={index}>
            <TableCell component="th" scope="row" className="">
                <TextField style={{ width:"100%"}} margin="dense"
                           disabled={item.itemName === 'none'}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           value={item.label}
                           onInput={(e) => {

                               setMSScale(p=>{
                                   let val = Object.assign({},p);
                                   val.grades[index].label = e.target.value;
                                   return val;
                               })
                           }}
                />
            </TableCell>
            <TableCell component="th" scope="row" className="">
                <TextField style={{ width:"100%"}} margin="dense"
                           disabled={item.itemName === 'none'}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           value={item.shortLabel}
                           onInput={(e) => {
                               setMSScale(p=>{
                                   let val = Object.assign({},p);
                                   val.grades[index].shortLabel = e.target.value;
                                   return val;
                               })
                           }}
                />
            </TableCell>
            <TableCell align="center">
                <TextField style={{ width:"100%"}} margin="dense"
                           disabled={item.itemName === 'none'}
                           type="number"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           inputProps={{
                               min: "0",
                               max: "100",
                               step: "0.1"
                           }}
                           value={item.maxPercentage}
                           onInput={(e) => {
                               const re = /[0-9]+/g;
                               if(re.test(e.target.value) && e.target.value >= 0 && e.target.value <=100){
                                   setMSScale(p=>{
                                       let val = Object.assign({},p);
                                       val.grades[index].maxPercentage = e.target.value;
                                       return val;
                                   })
                               }else{
                                   setMSScale(p=>{
                                       let val = Object.assign({},p);
                                       val.grades[index].maxPercentage = 0;
                                       return val;
                                   })
                               }

                           }}
                />
            </TableCell>
            <TableCell align="center">
                <IconButton  size="small" style={{color:new_theme.palette.newSupplementary.NSupText}} >
                    <DeleteIcon
                        onClick={()=>setMSScale(p=>{
                            let val = Object.assign({},p);
                            val.grades.splice(index,1);
                            return val;
                        })}
                    />
                    
                </IconButton>
            </TableCell>
        </TableRow>
    )): null

    return(
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv Grading_Module">
                <div className="admin_content">
                    <Grid item xs={12}>
                        <div className="admin_heading">
                            <Grid>
                                <Typography variant="h1" className="typo_h5">{t("Grading Scale")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>
                        </div>

                        <Grid item xs={12} className="role-sec-head">
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Scale Name")}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                            </Grid>
                        </Grid>
                        <Box className="add_scale_grid">
                            <Grid item >
                                <TextField label={t("Scale name")} style={{maxWidth:'400px'}} margin="dense"
                                    variant="filled"
                                    fullWidth={true}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required={true}
                                    helperText={validators.name ? "Incorrect name [3-20 characters]" : null}
                                    error={validators.name}
                                    value={MSScale.name}
                                    onChange={(e) => {
                                        setMSScale(p=>{
                                            let val = Object.assign({},p);
                                            val.name = e.target.value;
                                            return val;
                                        })
                                    }}
                                />
                            </Grid>
                            <Grid item >
                                <TextField label={t("Scale description")} style={{maxWidth:'500px'}} margin="dense"
                                    fullWidth={true}
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={MSScale.description}
                                    multiline={true}
                                    rowsMax={5}
                                    onInput={(e) => {
                                        setMSScale(p=>{
                                            let val = Object.assign({},p);
                                            val.description = e.target.value;
                                            return val;
                                        })
                                    }}
                                />
                            </Grid>
                            <Grid item >
                                <TextField label={`${t("Pass percentage")} [%]`} style={{ maxWidth:'400px'}} margin="dense"
                                    variant="filled"
                                    fullWidth={true}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={MSScale.passPercentage}
                                    inputProps={{
                                        min: "0",
                                        max: "100",
                                        step: "0.1"
                                    }}
                                    required={true}
                                    helperText={validators.passPercentage ? "Incorrect name [1-100%]" : null}
                                    error={validators.passPercentage}
                                    onInput={(e) => {
                                        const re = /[0-9]+/g;
                                        if(re.test(e.target.value) && e.target.value >= 0 && e.target.value <100){
                                            setMSScale(p=>{
                                                let val = Object.assign({},p);
                                                val.passPercentage = e.target.value;
                                                return val;
                                            })
                                        }else{
                                            setMSScale(p=>{
                                                let val = Object.assign({},p);
                                                val.passPercentage = 0;
                                                return val;
                                            })
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item >
                                <StyledButton className="w-100-mb w-100" eVariant="primary" eSize="large" component="span"
                                    onClick={()=>{
                                        setMSScale(p=>{
                                            let val = Object.assign({},p);
                                            val.grades.push({
                                                label: "-",
                                                shortLabel: "-",
                                                maxPercentage: 0,
                                            })
                                            return val;
                                        })
                                    }}
                                >{t("Add New Field")}
                                </StyledButton>
                            </Grid>
                        </Box>
                        {/* <Box sx={{display:'flex', width:'100%', gap:'20px'}}>
                            
                            <div className="heading_buttons" style={{alignSelf:'center'}}>
                                
                            </div>
                        </Box> */}
                        <Grid className="tableGradeList-parent" item xs={12} md={12} lg={12}>
                        {(MSScale)&&

                        <TableContainer component={Paper} style={{maxHeight: "600px"}} className="tableGradeList">
                            <Table size="medium" aria-label="caption table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='borderNone th'><strong>{t("Label (grade)")}</strong></TableCell>
                                        <TableCell className='borderNone th'><strong>{t("Short label")}</strong></TableCell>
                                        <TableCell className='borderNone th'><strong>{t("Min percentage")}</strong></TableCell>
                                        <TableCell align="center" className='borderNone th'><strong>{t("Action")}</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                 {editedCustomGradingScale ? editedCustomGradingScale : ""}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        }  
                       </Grid>

                    </Grid>
                    
                </div>
            </Container>
        </ThemeProvider>

        // <Card className="p-0 d-flex flex-column m-0">
        //     {/*<CardHeader title={` ${MSScale.name ? MSScale.name : t("Scale name")}`}/>*/}
        //     <CardHeader title={(
        //         <Typography variant="h5" component="h2" className="text-left" >
        //             {` ${MSScale?.name || t("Scale name")}`}
        //         </Typography>
        //     )} 
        //     // avatar={<Chip label={gradingScaleId==="new" ? t("Add"):t("Edit")} color="primary" />}
        //     />
        //     <CardContent>
        //         {gradingScaleId !== "new" && (
        //             <Grid container>
        //                 <FormControlLabel
        //                     label={(
        //                         <Typography variant="body1" component="h6" className="text-left" >
        //                             {t("Set it as default")} 
        //                         </Typography>
        //                     )}
        //                     labelPlacement='start'
        //                     control={
        //                         <Switch
        //                             name="show to others"
        //                             color="primary"
        //                             checked={checked}
        //                             onChange={toggleChecked}
        //                         />
        //                     }
        //                 />
        //             </Grid>
        //         )}
        //         <Grid container>
        //             <Grid item xs={12} md={6} lg={4}>
        //                 <TextField label={t("Scale name")} style={{maxWidth:'400px'}} margin="dense"
        //                            variant="filled"
        //                            fullWidth={true}
        //                            InputLabelProps={{
        //                                shrink: true,
        //                            }}
        //                            required={true}
        //                            helperText={validators.name ? "Incorrect name [3-20 characters]" : null}
        //                            error={validators.name}
        //                            value={MSScale.name}
        //                            onChange={(e) => {
        //                                setMSScale(p=>{
        //                                    let val = Object.assign({},p);
        //                                    val.name = e.target.value;
        //                                    return val;
        //                                })
        //                            }}
        //                 />
        //                 <TextField label={`${t("Pass percentage")} [%]`} style={{ maxWidth:'400px'}} margin="dense"
        //                            variant="filled"
        //                            fullWidth={true}
        //                            type="number"
        //                            InputLabelProps={{
        //                                shrink: true,
        //                            }}
        //                            value={MSScale.passPercentage}
        //                            inputProps={{
        //                                min: "0",
        //                                max: "100",
        //                                step: "0.1"
        //                            }}
        //                            required={true}
        //                            helperText={validators.passPercentage ? "Incorrect name [1-100%]" : null}
        //                            error={validators.passPercentage}
        //                            onInput={(e) => {
        //                                const re = /[0-9]+/g;
        //                                if(re.test(e.target.value) && e.target.value >= 0 && e.target.value <100){
        //                                    setMSScale(p=>{
        //                                        let val = Object.assign({},p);
        //                                        val.passPercentage = e.target.value;
        //                                        return val;
        //                                    })
        //                                }else{
        //                                    setMSScale(p=>{
        //                                        let val = Object.assign({},p);
        //                                        val.passPercentage = 0;
        //                                        return val;
        //                                    })
        //                                }
        //                            }}
        //                 />
        //             </Grid>
        //             <Grid item xs={12} md={6} lg={4}>
        //                 {gradingScaleId !== "new" && (
        //                     <>
        //                         <TextField label={t("Created At")} style={{maxWidth:'400px'}} className="ml-3" margin="dense"
        //                                    fullWidth={true}
        //                                    InputLabelProps={{
        //                                        shrink: true,
        //                                    }}
        //                                    InputProps={{
        //                                        readOnly: true,
        //                                        disableUnderline: true,
        //                                    }}
        //                                    value={MSScale.createdAt && new Date(MSScale.createdAt).toLocaleDateString()}
        //                         />
        //                         <TextField label={t("Updated At")} style={{maxWidth:'400px'}} className="ml-3" margin="dense"
        //                                    fullWidth={true}
        //                                    InputLabelProps={{
        //                                        shrink: true,
        //                                    }}
        //                                    InputProps={{
        //                                        readOnly: true,
        //                                        disableUnderline: true,
        //                                    }}
        //                                    value={MSScale.updatedAt && new Date(MSScale.updatedAt).toLocaleDateString()}
        //                         />
        //                     </>
        //                 )}
        //             </Grid>
        //             <Grid item xs={12} md={6} lg={4}>
        //                 <TextField label={t("Scale description")} style={{maxWidth:'500px'}} margin="dense"
        //                            fullWidth={true}
        //                            variant="filled"
        //                            InputLabelProps={{
        //                                shrink: true,
        //                            }}
        //                            value={MSScale.description}
        //                            multiline={true}
        //                            rowsMax={5}
        //                            onInput={(e) => {
        //                                setMSScale(p=>{
        //                                    let val = Object.assign({},p);
        //                                    val.description = e.target.value;
        //                                    return val;
        //                                })
        //                            }}
        //                 />
        //             </Grid>
        //         </Grid>
        //         <hr/>
        //         <Grid container alignItems="center" justifyContent="center">
        //             <Grid item xs={12} md={8} lg={6}>
        //                 {(MSScale)&&
        //                     <TableContainer component={Paper} style={{maxHeight: "600px"}}>
        //                         <Table size="small" aria-label="caption table">
        //                             <caption className="text-center">
        //                                 <Button size="small" variant="contained" color="primary"
        //                                         startIcon={<AddCircleOutlineIcon/>}
        //                                         onClick={()=>{
        //                                             setMSScale(p=>{
        //                                                 let val = Object.assign({},p);
        //                                                 val.grades.push({
        //                                                     label: "-",
        //                                                     shortLabel: "-",
        //                                                     maxPercentage: 0,
        //                                                 })
        //                                                 return val;
        //                                             })
        //                                         }}><small>{t("Add new field")}</small></Button>
        //                             </caption>
        //                             <TableHead>
        //                                 <TableRow >
        //                                     <TableCell align="center" colSpan={4} className="pt-3"><h5>{MSScale.name ? MSScale.name : t("Scale name")}</h5></TableCell>
        //                                 </TableRow>
        //                                 <TableRow style={{backgroundColor:"lightgrey"}}>
        //                                     <TableCell align="center"><strong>{t("Label (grade)")}</strong></TableCell>
        //                                     <TableCell align="center"><strong>{t("Short label")}</strong></TableCell>
        //                                     <TableCell align="center"><strong>{t("Min percentage")}</strong></TableCell>
        //                                     <TableCell align="center"><SettingsIcon/></TableCell>
        //                                 </TableRow>
        //                             </TableHead>
        //                             <TableBody>
        //                                 {editedCustomGradingScale ? editedCustomGradingScale : ""}
        //                             </TableBody>
        //                         </Table>
        //                     </TableContainer>}
        //             </Grid>
        //         </Grid>
        //     </CardContent>
        //     <CardActionArea>
        //     <CardActions className="d-flex justify-content-between align-items-center" >
        //         <Grid container>
        //             <Grid item xs={6}>
        //                 <Button variant="contained" size="small" color="secondary" onClick={() =>  {
        //                     F_showToastMessage(t("No change"),)
        //                     navigate("/modules-core/grading-scales")
        //                 }}>
        //                     {t("Back")}
        //                 </Button>
        //             </Grid>
        //             <Grid item xs={6} className="p-0 d-flex justify-content-end">
        //                 {gradingScaleId !== "new" ?
        //                     <Button variant="contained" size="small" color="inherit" 
        //                             onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
        //                         {t("Remove")}
        //                     </Button> : null}
        //                 <Button onClick={saveChanges} size="small" variant="contained" color="primary" className="ml-5">
        //                     {t("Save")}
        //                 </Button>
        //             </Grid>
        //         </Grid>
        //     </CardActions>
        //     </CardActionArea>
        //     <ConfirmActionModal actionModal={actionModal}
        //                         setActionModal={setActionModal}
        //                         actionModalTitle={t("Removing grading scale")}
        //                         actionModalMessage={t("Are you sure you want to remove grading scale? The action is not reversible!")}
        //     />
        // </Card>
    )
}