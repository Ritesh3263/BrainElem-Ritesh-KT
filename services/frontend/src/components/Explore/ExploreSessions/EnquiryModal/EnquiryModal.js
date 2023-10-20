import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import {Button, Checkbox, DialogActions, DialogContent, DialogTitle, Divider} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {now} from "moment";
import Grid from "@material-ui/core/Grid";
import {FormControlLabel} from "@mui/material";
import {KeyboardDatePicker} from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import EnquiryService from "../../../../services/enquiry.service";
import CompanyService from "../../../../services/company.service";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {createTheme, createStyles, makeStyles} from "@material-ui/core/styles";
import { theme } from "../../../../MuiTheme";

const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) =>
        createStyles({
            root: {
                background: theme.palette.neutrals.white
            },
        }),
    { defaultTheme },
);

const enquiryInitialState={
    status: 'New',
    name: "New enquiry from",
    module: '',
    startDate: new Date(now()).toISOString(),
    sessionName: '',
    sessionId:'',
    isAnyStartDate: false,
    traineesLimit: 100,
    additionalQuestion:'',
    timeFormat: 'weekends',
    externalContact:{
        name: '',
        surname: '',
        companyName: '',
        position: '',
        email:'',
        phone:'',
    },
    contact: undefined,
    endDate: undefined,
    company: undefined,
    architect: undefined,
    digitalCode: undefined,
    estimatedStartDate: undefined,
    traineesCount: 0,
    trainees:[],

}

export default function EnquiryModal({isOpenEnquiryDialog, setIsOpenEnquiryDialog, currentItemDetails}){
    const {t} = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const classes = useStyles();

    const [currentEnquiry, setCurrentEnquiry]=useState(enquiryInitialState);
    const [currentCompany, setCurrentCompany]=useState();
    const [myselfAsContact, setMyselfAsContact]=useState(false);

    useEffect(()=>{
        setMyselfAsContact(true);
        if(currentItemDetails?._id){
            setCurrentEnquiry(p=>({
                ...enquiryInitialState,
                sessionName: currentItemDetails?.name,
                sessionId: currentItemDetails?._id,
                module: currentItemDetails?._id,
            }));
        }

        
    },[isOpenEnquiryDialog]);
    
    
    useEffect(()=>{
        if(user){
            CompanyService.readByOwner(user.id).then(res=>{
                setCurrentCompany(res.data[0]); // we shall have only one owner
            }).catch(err=>console.log(err));
        }
    },[user]);

    const save=()=>{
        console.log("save",currentEnquiry);
        EnquiryService.add(currentEnquiry, currentItemDetails?._id).then(res=>{
            console.log("add:",res.data);
            F_showToastMessage('Enquiry was sent','success');
            setIsOpenEnquiryDialog(false);
        }).catch(err=>console.log(err));
    }

    return(
        <Dialog 
            open={isOpenEnquiryDialog}
            onClose={() => {setIsOpenEnquiryDialog(false);}}
            
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle className={`pt-4 ${classes.root}`}  id="alert-dialog-title"  >
                    <Grid item xs={6}>
                        <Typography variant="h3" style={{ fontsize:"32px", color:theme.palette.primary.lightViolet, whiteSpace:'nowrap'}}>
                            {t("Enquiry for Business Client")}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" component="h5" className="text-left mt-1" >
                            {`${t("")} ${currentItemDetails?.name}`}
                        </Typography>
                        <Typography variant="body1" component="h5" className="text-left text-muted" >
                            {`${t("Date")}: ${new Date(now()).toLocaleDateString()}`}
                        </Typography>
                    </Grid>
                
            </DialogTitle>
            <DialogContent className={classes.root}>
            <Grid container className={classes.root}>


            <Grid item xs={6} className='px-2 pr-5'>
                    {/* {!myselfAsContact && ( */}
                        <>
                            <TextField
                                style={{maxWidth: '400px'}}
                                className="mr-1"
                                placeholder="Name"

                                name={['externalContact','name']}
                                fullWidth={true}
                                margin="dense"
                                variant="filled"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={user?.name??''}
                                // value={currentEnquiry?.externalContact?.name}
                                onChange={({target:{value, name}}) =>{
                                    let fields = name.split(',');
                                    setCurrentEnquiry(p=>({...p, [fields[0]]: {...p[fields[0]], [fields[1]]: value} }));
                                }}
                            />
                            <TextField
                            style={{maxWidth: '400px'}}
                            className="mr-1"
                            placeholder="Surname"
                            name={['externalContact','surname']}
                            fullWidth={true}
                            margin="dense"
                            variant="filled"
                            InputLabelProps={{
                            shrink: true,
                        }}
                            value={user?.surname??''}
                            // value={currentEnquiry?.externalContact?.surname}
                            onChange={({target:{value, name}}) =>{
                            let fields = name.split(',');
                            setCurrentEnquiry(p=>({...p, [fields[0]]: {...p[fields[0]], [fields[1]]: value} }));
                        }}
                            />
                       
                    <TextField
                        style={{maxWidth: '400px'}}
                        className="mr-1"
                        placeholder="Company name"
                        name={['externalContact','companyName']}
                        fullWidth={true}
                        margin="dense"
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentCompany?.name}
                        // value={currentEnquiry?.externalContact?.companyName}
                        onChange={({target:{value, name}}) =>{
                            let fields = name.split(',');
                            setCurrentEnquiry(p=>({...p, [fields[0]]: {...p[fields[0]], [fields[1]]: value} }))
                        }}
                    />
                    <TextField
                        style={{maxWidth: '400px'}}
                        className="mr-1"
                        placeholder="Position"
                        name={['externalContact','position']}
                        fullWidth={true}
                        margin="dense"
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentCompany?.ownerPosition}
                        // value={currentEnquiry?.externalContact?.position}
                        onChange={({target:{value, name}}) =>{
                            let fields = name.split(',');
                            setCurrentEnquiry(p=>({...p, [fields[0]]: {...p[fields[0]], [fields[1]]: value} }))
                        }}
                    />
                </>
                {/* )} */}
                    {/* {!myselfAsContact && ( */}
                        <>
                            <TextField
                                style={{maxWidth: '400px'}}
                                className="mr-1"
                                placeholder="Contact e-mail"
                                name={['externalContact','email']}
                                fullWidth={true}
                                margin="dense"
                                variant="filled"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={user?.email??''}
                                // value={currentEnquiry?.externalContact?.email}
                                onChange={({target:{value, name}}) =>{
                                    let fields = name.split(',');
                                    setCurrentEnquiry(p=>({...p, [fields[0]]: {...p[fields[0]], [fields[1]]: value} }))
                                }}
                            />
                            <TextField
                                style={{maxWidth: '400px'}}
                                className="mr-1 pb-1"
                                placeholder="Phone"
                                name={['externalContact','phone']}
                                fullWidth={true}
                                margin="dense"
                                variant="filled"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={user?.phone??''}
                                onChange={({target:{value, name}}) =>{
                                    let fields = name.split(',');
                                    setCurrentEnquiry(p=>({...p, [fields[0]]: {...p[fields[0]], [fields[1]]: value} }))
                                }}
                            />
                        </>
                    {/* )} */}
                    {/* {!myselfAsContact && ( <>
                    <TextField
                        style={{maxWidth: '400px'}}
                        className="mr-1"
                        multiline={true}
                        maxRows={6}
                        rows={4}
                        label="Question"
                        name='additionalQuestion'
                        fullWidth={true}
                        margin="dense"
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentEnquiry?.additionalQuestion}
                        onChange={({target:{value, name}}) =>{
                            setCurrentEnquiry(p=>({...p, [name]: value}));
                        }}
                    />
                    </> )} */}
                </Grid>
              <Grid item xs={6} className='px-2'>
                  {!currentEnquiry?.isAnyStartDate && (
                      <KeyboardDatePicker
                          className="mr-1"
                          style={{maxWidth: '400px'}}
                          InputProps={{
                              readOnly: false,
                              disableUnderline: false,
                          }}
                          rightArrowIcon={null}
                          margin="dense"
                          name='startDate'
                          fullWidth
                          id="date-picker-dialog"
                          label={t("Estimated start date")}
                          format="DD.MM.yyyy"
                          minDate={new Date(now()).toISOString().split("T")[0]}
                          minDateMessage={"It is a past date"}
                          InputLabelProps={{
                              shrink: true,
                          }}
                          inputVariant='filled'
                          value={currentEnquiry.startDate}
                          KeyboardButtonProps={{
                              "aria-label": "change date",
                          }}
                          onChange={(date) => {
                              if (date && date._isValid) {
                                  setCurrentEnquiry(p=>({...p, startDate:new Date(date).toISOString()}))
                              }
                          }}
                      />
                  )}
                  {/* <FormControlLabel label={t('I don\'t have any specific date')}
                                    control={
                                        <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                                                  checked={currentEnquiry?.isAnyStartDate}
                                                  name={"isAnyStartDate"}
                                                  value={currentEnquiry?.isAnyStartDate}
                                                  onChange={({target:{name, value}},val)=>{
                                                     if(value !== val){
                                                         setCurrentEnquiry(p=>({...p, [name]: val}));
                                                     }
                                                  }}
                                        />
                                    }
                  /> */}
                    <TextField
                        style={{maxWidth: '400px'}}
                        variant="filled"
                        className="mr-1"
                        label="Trainees count"
                        type="number"
                        name='traineesLimit'
                        fullWidth={true}
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentEnquiry?.traineesLimit}
                        onChange={({target:{value, name}}) =>{
                            if(value !== ""){
                                if(Number(value)>0 && Number(value)<1000){
                                    setCurrentEnquiry(p=>({...p,[name]:value}))
                                }
                            }
                        }}
                    />
                 {myselfAsContact && ( <>
                    <TextField
                        // style={}
                        style={{maxWidth: '400px'}}
                        multiline={true}
                        maxRows={12}
                        rows={3}
                        placeholder="Additional questions for us"
                        name='additionalQuestion'
                        fullWidth={true}
                        margin="dense"
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={currentEnquiry?.additionalQuestion}
                        onChange={({target:{value, name}}) =>{
                            setCurrentEnquiry(p=>({...p, [name]: value}));
                        }}
                    />
                    </> )}
                </Grid>
                {/* <Grid item xs={12} className='px-2 mt-1'>
                    <FormControlLabel label={t('Assign Yourself as contact person')}
                                      control={
                                          <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                                                    // checked={myselfAsContact}
                                                    checked={true}
                                                    disabled={true}
                                                    name={"myselfAsContact"}
                                                    value={myselfAsContact}
                                                    onChange={({target:{name, value}},val)=>{
                                                        if(value !== val){
                                                            setMyselfAsContact(val);
                                                            if(val){
                                                                setCurrentEnquiry(p=>({...p, contact: user.id}))
                                                            }else{
                                                                setCurrentEnquiry(p=>({...p, contact: undefined}));
                                                            }
                                                        }
                                                    }}
                                          />
                                      }
                    />
                </Grid> */}
            </Grid>
            </DialogContent>
            <DialogActions   className={`justify-content-center p-5 ${classes.root}`} >
                <Button style={{minWidth:"200px"}}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={save}
                >
                    {t("Send")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}