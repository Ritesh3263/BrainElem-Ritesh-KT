import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { baseURL } from "services/axiosSettings/axiosSettings";

// MUI v5
import { Box, Grid, Drawer, MenuItem, IconButton, Typography } from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';

// Components
import { ESelect, EButton } from "styled_components"

// Services
import ContentService from "services/content.service";

// MUI v4
import { theme } from "MuiTheme";

export default function FileDrawer({ open, setOpen, files}) {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState()
    const [selectedFileElement, setSelectedFileElement] = useState()
    // Used only for refreshing <object> element
    const [displayFile, setDisplayFile] = useState(false)

    useEffect(() => {
        setSelectedFile(files[0])
    }, [files])



    useEffect(async () => {
        if (selectedFile){// File changed
            let mimeType = selectedFile.mimeType
            let name = selectedFile.fileOriginalName
            let url = `${baseURL}contents/files/download/${selectedFile._id}`
            let element = await ContentService.getFileElement(name, url, mimeType).then()
            setSelectedFileElement(element)
        }
    }, [selectedFile])


    useEffect(() => {
        if (selectedFile){// File changed
            setDisplayFile(false)
        }
    }, [selectedFile])

    useEffect(() => {
        // This will force refreshing <object> element
        // Otherwise the file is not reloaded
        if (!displayFile){
            setDisplayFile(true)
        }
    }, [displayFile])

    const getHeight = () => {
        if (selectedFile.mimeType.includes('image')) return "unset"
        else return "calc(100% - 162px - 32px)"
    }

    if (!selectedFile) return <></>
    return (
        <Drawer
            anchor={'right'}
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box  sx={{width: {xs: '300px', md: '520px', lg: '643px'}, height: '100%', backgroundColor: theme.palette.neutrals.white}}>
                <Grid container sx={{px: '40px', py: '32px', height: '100%', alignContent: 'flex-start'}}>

                    <IconButton size="small" onClick={() => { setOpen(false) }} sx={{ background: theme.palette.primary.creme, position: 'absolute', top: 32, right: 20, zIndex: 1020}} >
                        < CloseIcon fontSize="small" style={{ fill: theme.palette.primary.darkViolet }} />
                    </IconButton>
                    <Grid container item xs={12}>
                        <ESelect  sx={{maxWidth: 200}} type="round" value={selectedFile?._id} onChange={(event)=>{setSelectedFile(files.find(f=>f._id == event.target.value))}}>
                            {files.map(file=>
                                <MenuItem key={file._id} value={file._id}>
                                    {file.fileOriginalName}
                                </MenuItem>
                            )}

                        </ESelect>
                    </Grid>
                    <Grid container item xs={12}>
                        <Typography sx={{...theme.typography.h3, py: '32px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} >
                            {selectedFile?.fileOriginalName} 
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} sx={{height: getHeight(), alignContent: 'flex-start', flexDirection: 'column', flexWrap: 'nowrap'}}>
                        {displayFile && selectedFileElement}
                    </Grid>
                </Grid>

            </Box>
        </Drawer>
    );
}
