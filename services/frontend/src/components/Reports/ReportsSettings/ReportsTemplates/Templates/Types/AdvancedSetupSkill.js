import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {IconButton} from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";

export default function AdvancedSetupSkill({item,index}){
    const { t } = useTranslation();
    const [isVisibleAdvancedSettings, setIsVisibleAdvancedSettings] = useState(false);
    return(
        <Grid item className="mt-1 p-2" xs={12} md={6} lg={4} key={index}>
            <Paper elevation={10} className="px-3 pt-3 pb-1">
                <Grid container>
                    <Grid item xs={12} className="d-flex justify-content-between">
                        <Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}><small>{index+1}</small></Avatar>
                        <IconButton size="small"
                                    style={{width:'30px', height: '30px'}}
                                    onClick={()=>setIsVisibleAdvancedSettings(p=>!p)}
                        >
                            <BuildCircleIcon style={{fill: "rgba(82, 57, 112, 1)", width:'30px', height: '30px'}} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label={t("Skill name")} margin="normal"
                                   InputProps={{
                                       readOnly: false,
                                       disableUnderline: false,
                                   }}
                                   name={['session','digitalCode']}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={true}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={item?.name}
                                   onInput={(e) => {

                                   }}
                        />
                    </Grid>
                    {isVisibleAdvancedSettings && (
                        <>
                            <Grid item xs={6} className='pr-2'>
                                <TextField label={t("Default value")} margin="normal"
                                           InputProps={{
                                               readOnly: false,
                                               disableUnderline: false,
                                           }}
                                           name={['session','digitalCode']}
                                           fullWidth
                                           type='number'
                                           style={{maxWidth: "400px"}}
                                           variant='standard'
                                           required={true}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={1}
                                           onInput={(e) => {

                                           }}
                                />
                            </Grid>
                            <Grid item xs={6} className='pl-2'>
                                <TextField label={t("Step")} margin="normal"
                                           InputProps={{
                                               readOnly: false,
                                               disableUnderline: false,
                                           }}
                                           name={['session','digitalCode']}
                                           type='number'
                                           fullWidth
                                           style={{maxWidth: "400px"}}
                                           variant='standard'
                                           required={true}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={0}
                                           onInput={(e) => {

                                           }}
                                />
                            </Grid>
                            <Grid item xs={6} className='pr-2'>
                                <TextField label={t("Min value")} margin="normal"
                                           InputProps={{
                                               readOnly: false,
                                               disableUnderline: false,
                                           }}
                                           name={['session','digitalCode']}
                                           type='number'
                                           fullWidth
                                           style={{maxWidth: "400px"}}
                                           variant='standard'
                                           required={true}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={0}
                                           onInput={(e) => {

                                           }}
                                />
                            </Grid>
                            <Grid item xs={6} className='pl-2'>
                                <TextField label={t("Max value")} margin="normal"
                                           InputProps={{
                                               readOnly: false,
                                               disableUnderline: false,
                                           }}
                                           name={['session','digitalCode']}
                                           type='number'
                                           fullWidth
                                           style={{maxWidth: "400px"}}
                                           variant='standard'
                                           required={true}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={0}
                                           onInput={(e) => {

                                           }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Paper>
        </Grid>
    )
}