import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Form} from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import moduleCoreService from "services/module-core.service";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Container from '@mui/material/Container';
import "./catagories.scss"
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import "./catagories.scss";

const useStyles = makeStyles(theme=>({}))

export default function MSCategoriesForm(){
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const [currentModuleId, setCurrentModuleId] = useState("");
    const [currentModule, setCurrentModule] = useState({});
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [MSCategory, setMSCategory] = useState({
        name: "",
        description: "",
    });

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeCategory();
        }
        F_handleSetShowLoader(false);
    },[actionModal.returnedValue]);

    useEffect(()=>{
        F_handleSetShowLoader(true)
        setCurrentModuleId(manageScopeIds.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            setCurrentModule(res.data)
            if(res.data.categories && categoryId !== "new"){
                setCategoryIndex(res.data.categories.findIndex(sy=> sy._id === categoryId));
                let editedCategory = res.data.categories.filter(sy=> sy._id === categoryId);
                setMSCategory(editedCategory[0]);
                F_handleSetShowLoader(false)
            }else{
                F_handleSetShowLoader(false);
            }
        }).catch(error=>console.error(error))
    },[])


    async function removeData(){
        await setCurrentModule(p=>{
            let val = Object.assign({},p);
            val.categories.splice(categoryIndex,1);
            return val;
        })
    }

    async function updateData(){
        await setCurrentModule(p=>{
            let val = Object.assign({},p);
            val.categories[categoryIndex] = MSCategory;
            return val;
        })
    }


    async function addNewData(){
        await setCurrentModule(p=>{
            let val = Object.assign({},p);
            let newCategory = {
                name: MSCategory.name,
                description: MSCategory.description,
                subjectsCounter: 0,
            }
            val.categories.push(newCategory);
            return val;
        })
    }

    function saveChanges(){
        if(categoryId !== "new"){
                moduleCoreService.updateMSCategory(MSCategory).then(res=>{
                    console.log(res)
                    F_showToastMessage(t("Data was updated"),"success");
                    navigate("/modules-core/subjects-categories")
                }).catch(error=>console.error(error));
        }else{
                moduleCoreService.addMSCategory(currentModuleId,MSCategory).then(res=>{
                    console.log(res)
                    F_showToastMessage(t("Data was created"),"success");
                    navigate("/modules-core/subjects-categories")
                }).catch(error=>console.error(error));
        }
    }


    function removeCategory() {
            moduleCoreService.removeMSCategory(MSCategory).then(res => {
                //display res.message in toast
                console.log(res)
                F_showToastMessage(t("Data was removed"), "success");
                navigate("/modules-core/subjects-categories")
            }).catch(error => console.error(error));
    }
    // const subjectsList = subjects.map((subject, index)=>{
    //     return(
    //     <ListItem key={subject._id}>
    //         <ListItemText>{subject.name}</ListItemText>
    //         <ListItemSecondaryAction>
    //             <Checkbox
    //                 edge="end"
    //                 checked={subject.isSelected}
    //                 onChange={()=>{
    //                     setSubjects(p=>{
    //                         let val = Object.assign([],p);
    //                         val[index].isSelected = !val[index].isSelected;
    //                         return val;
    //                     })
    //                 }}
    //             />
    //         </ListItemSecondaryAction>
    //     </ListItem>)
    // })

    return(
      <ThemeProvider theme={new_theme}>
        <Container maxWidth="xl" className="mainContainerDiv mainCategoryDiv">

          <Grid item xs={12}>
            <div className="admin_content" style={{ paddingTop: "0" }}>
              <div className="admin_heading" style={{marginBottom:0}} >
                  <Grid>
                      <Typography variant="h1" component="h1" style={{ inlineSize: 'max-content' }}>{t("Category")}</Typography>
                      <Divider variant="insert" className='heading_divider' />
                  </Grid>
              </div>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Grid container className="account-grid" sx={{ mt: 3 }}>
                  <Grid item xs={12} className="role-sec-head">
                      <Grid item xs={12} sx={{ mt: 3 }}>
                          <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Category Name")}</Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                      </Grid>
                      
                  </Grid>
                  <Box className="cat-form-box" >
                  <Grid item xs={12} sm={6} md={3} style={{display:'flex', alignItems:'center', gap:'20px'}}>

                      <TextField label={t("Category Name")} margin="dense"
                          fullWidth={true}
                          name='subjectname'
                          variant='filled'
                          InputLabelProps={{
                                shrink: true,
                            }}
                            value={MSCategory.name}
                            onChange={({target:{value}}) => {
                                setMSCategory(p=>({...p,name:value}))
                            }}
                      />
                      
                       
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} style={{display:'flex', alignItems:'center', gap:'20px'}}>
                    <TextField label={t("Category Description")} margin="dense"
                        fullWidth={true}
                        name='subjectname'
                        variant='filled'
                        multiline={true}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={MSCategory.description}
                        onChange={({target:{value}}) => {
                            setMSCategory(p=>({...p,description:value}))
                        }}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={3} style={{display:'flex', alignItems:'center', gap:'20px'}}>
                    <div className="heading_buttons">
                      <StyledButton eVariant="primary" eSize="large" >
                          {t("Add")}
                      </StyledButton>
                    </div>
                  </Grid> */}
                  </Box>
                </Grid>
              </Grid>
              <Grid container className="btn-flex btn-grid-mb">
                  <Grid item className="text-right">
                      <StyledButton eVariant="secondary" eSize="medium" onClick={() =>  {
                             F_showToastMessage(t("No change"),)
                             navigate("/modules-core/subjects-categories")
                         }}>
                          {t("Back")}
                      </StyledButton>
                  </Grid>
                  <Grid item className="text-right">
                    {categoryId !== "new" ?
                        <StyledButton eVariant="secondary" eSize="medium" onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                        {t("Remove")}
                        </StyledButton>
                        : null}
                        <StyledButton eVariant="primary" eSize="medium" onClick={saveChanges}>
                            {t("Submit")}
                        </StyledButton>
                      
                  </Grid>
              </Grid>
            </div>
          </Grid>
        </Container>  
      </ThemeProvider>


        // <Card className="p-2 d-flex flex-column m-0">
        //     {/*<CardHeader title={` ${MSCategory.name ? MSCategory.name : "Category name"}`}/>*/}
        //     <CardHeader title={(
        //         <Typography variant="h3" component="h3" className="text-left" >
        //             {` ${MSCategory?.name || t("Category name")}`}
        //         </Typography>
        //     )} 
        //     />
        //     <CardContent>
        //         {/*<Form>*/}
        //             <Grid container >
        //                 <Grid item xs={12} md={6}>
        //                     <TextField label={t("Category name")} style={{ maxWidth:"400px"}} margin="normal"
        //                                fullWidth={true}
        //                                variant="filled"
        //                                InputLabelProps={{
        //                                    shrink: true,
        //                                }}
        //                                value={MSCategory.name}
        //                                onChange={({target:{value}}) => {
        //                                    setMSCategory(p=>({...p,name:value}))
        //                                }}
        //                     />
        //                 </Grid>
        //                 <Grid item xs={12} md={6}>
        //                     <TextField label={t("Category description")} style={{ maxWidth:"400px"}} margin="normal"
        //                                fullWidth={true}
        //                                variant="filled"
        //                                multiline={true}
        //                                InputLabelProps={{
        //                                    shrink: true,
        //                                }}
        //                                value={MSCategory.description}
        //                                onChange={({target:{value}}) => {
        //                                    setMSCategory(p=>({...p,description:value}))
        //                                }}
        //                     />
        //                 </Grid>
        //             </Grid>
        //         {/*</Form>*/}

        //     </CardContent>
        //     <CardActionArea className='fixed-bottom'>
        //     <CardActions className="d-flex justify-content-between align-items-center" >
        //         <Grid container>
        //             <Grid item xs={6}>
        //                 <Button variant="contained" size="small" color="secondary" onClick={() =>  {
        //                     F_showToastMessage(t("No change"),)
        //                     navigate("/modules-core/subjects-categories")
        //                 }}>
        //                     {t("Back")}
        //                 </Button>
        //             </Grid>
        //             <Grid item xs={6} className="p-0 d-flex justify-content-end">
        //                 {categoryId !== "new" ?
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
        //                         actionModalTitle={t("Removing category")}
        //                         actionModalMessage={t("Are you sure you want to remove category? The action is not reversible!")}
        //     />
        // </Card>
    )
}