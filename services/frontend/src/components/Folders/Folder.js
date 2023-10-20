import React, { forwardRef, useEffect, useState } from 'react'
import FolderService from 'services/folder.service'
import LibraryService from 'services/library.service'
import { useTranslation } from "react-i18next";
import { Typography, Grid, Box, Divider, CircularProgress, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
import StyledButton from 'new_styled_components/Button/Button.styled';
import InsertDriveFileTwoToneIcon from '@mui/icons-material/InsertDriveFileTwoTone';
import SearchField from "components/common/Search/SearchField";
import { useNavigate } from "react-router-dom";
import ContentPreview from './ContentPreview'
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddTwoToneIcon from '@mui/icons-material/NoteAddTwoTone';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeselectIcon from '@mui/icons-material/Deselect';


import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ContentListWindow = ({contentListHelper, setContentListHelper}) => {
    console.log("ContentListWindow")
    const [myContnts, setMyContents] = useState([])
    const [searchingText, setSearchingText] = useState('');
    const { t } = useTranslation();
    const [selectedIds, setSelectedIds] = useState([]);
    console.log("🚀 ~ file: Folder.js:18 ~ ContentListWindow ~ myContnts:", myContnts)
    const { F_getHelper, F_getLocalTime, F_showToastMessage, F_handleSetShowLoader } = useMainContext();

    useEffect(() => {
        LibraryService.getMyContents().then(res=>{
            console.log(res.data)
            // hide if available in contentListHelper.currentFolder.files
            let existingIds = contentListHelper.currentFolder?.files.map(file => file._id)
            setMyContents(res.data.filter(content => !existingIds.includes(content._id)))
            F_handleSetShowLoader(false)
        }).catch(error=>console.log(error))
    }, [])

    const saveAddedFiles = () => {
        console.log("addFiles")
        if(selectedIds.length>0){
            F_handleSetShowLoader(true)
            FolderService.addContentsToFolder(contentListHelper.currentFolder._id, selectedIds).then(res=>{
                console.log(res.data)
                setContentListHelper(prev => ({ ...prev, open: false, reload: true }))
                F_handleSetShowLoader(false)
                F_showToastMessage("Files were added", "success")
            }).catch(error=>console.log(error))
        }
        else {
            F_showToastMessage("No file was selected", "info")
        }
    }

    const ContentList = myContnts.length>0 ? myContnts
    .filter(content => content.title.toLowerCase().includes(searchingText.toLowerCase()))
    .map((content, index) => {
        return (
            <Box 
                key={index}
                sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 2, width: '8rem', textAlign: 'center' }}
                onClick={() => {
                if(selectedIds.includes(content._id)){
                    setSelectedIds(prev => prev.filter(id => id!==content._id))
                }
                else {
                    setSelectedIds(prev => [...prev, content._id])
                }
            }}>
                <InsertDriveFileTwoToneIcon sx={{fontSize: 64, color: selectedIds.includes(content._id)?'#7537b8':'#4a9ea6', stroke: "#ffffff", strokeWidth: 1.45, width:'100%'}} />
                <Typography sx={{width:'100%',lineHeight: 1.2, fontSize:16, pl:'6px', color: selectedIds.includes(content._id)?'#7537b8':'initial'}}>{content.title}</Typography>
            </Box>
        )
    }):[]
    return (<>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', gap: 1 }}>
            <StyledButton eSize='xsmall' eVariant="secondary" onClick={() => setContentListHelper(prev => ({ ...prev, open: false }))}>Cancel</StyledButton>
            <SearchField className="text-primary" value={searchingText} onChange={(e)=>{ setSearchingText(e.target.value) }} clearSearch={()=>{ setSearchingText('') }} />
            {/* align last item to right */}
            <StyledButton sx={{ml: 'auto'}} eSize='xsmall' eVariant="primary" onClick={() => saveAddedFiles()}>Add</StyledButton>
        </Box>

        {myContnts.length>0 ? <Grid container spacing={1} sx={{ overflowY: 'auto', pb: 2, mt: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', maxHeight: 'calc(95vh - 160px)' }}>
            {ContentList}
        </Grid> : <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h5" component="h5" sx={{ textAlign: 'center' }}>No content</Typography>
        </Box>}
        {/* a single line info bar saying how many files are selected */}
        <Box>
            <Typography variant="caption1" component="span" sx={{ fontSize: '0.85rem', py:1 }}>{selectedIds.length} {t("files selected")}</Typography>
        </Box>
    </>)
}



const Folder = () => {
    console.log("Folder")
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { F_getHelper, F_getLocalTime, F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const { userPermissions, user } = F_getHelper();
    const [selectedItem, setSelectedItem] = useState(null);
    const [folderTail, setFolderTail] = useState([]);
    const [searchingText, setSearchingText] = useState('');
    const [previewHelper, setPreviewHelper] = useState({open: false, data: null, folderTail })
    const [contentListHelper, setContentListHelper] = useState({open: false, currentFolder: null, folderTail, reload: false})
    const [folderHelper, setFolderHelper] = useState({ open: false, currentFolder: null, type: 'NEW' })
    const [newFolder, setNewFolder] = useState({ name: "New Folder" })

    const getFolderTail = (folderId) => {
        FolderService.getFolderTail(folderId).then(res=>{
            console.log(res.data)
            setFolderTail(res.data)
        }).catch(error=>console.log(error))
    }

    const updateFolder = () => {
        FolderService.editFolder(folderHelper.currentFolder).then(res => {
          console.log(res.data)
          getFolder(res.data._id)
          getFolderTail(res.data._id)
          setFolderHelper(p=>({...p, open: false}))
          F_showToastMessage(t("Folder was renamed"), "success")
        }).catch(error => console.log(error))
      }

    const saveNewFolder = () => {
        FolderService.createFolder({...newFolder, parent: folderHelper.currentFolder._id}).then(res => {
            console.log(res.data)
            // // open newly created folder
            // setFolderHelper({...folderHelper, currentFolder: res.data, open:false}) 
            setNewFolder({ name: "New Folder" })
                
            // add to current folder
            setFolderHelper(prev => {
                prev.currentFolder.children.push(res.data)
                return {...prev, open: false}
            })
          F_showToastMessage(t("Folder was created"), "success")
        }).catch(error => console.log(error))
    }

    const getFolder = (folderId) => {
        FolderService.getFolder(folderId).then(res=>{
            console.log(res.data)
            setFolderHelper(p=>({...p, currentFolder: res.data}))
            selectedItem && setSelectedItem(null)
        }).catch(error=>console.log(error))
    }

    useEffect(() => {
        if(folderHelper.currentFolder){
            console.log(folderHelper, "folderId")
            getFolder(folderHelper.currentFolder._id)
            getFolderTail(folderHelper.currentFolder._id)
        }
        else {
            console.log(folderHelper, "No folderId")
            FolderService.getRootFolder().then(res=>{
                setFolderHelper(p=>({...p, currentFolder: res.data}))
                getFolderTail(res.data._id)
                selectedItem && setSelectedItem(null)
            }).catch(error=>console.log(error))
        }
    }, [])

    useEffect(() => {
        if(contentListHelper.reload){
            // getFolderTail(contentListHelper.currentFolder._id)
            getFolder(contentListHelper.currentFolder._id)
            setContentListHelper(prev => ({ ...prev, reload: false }))
        }
    }, [contentListHelper.reload])



    // Thumbnail like lists
    const FolderList = folderHelper.currentFolder?.children.length>0? folderHelper.currentFolder.children
    .filter(folder => folder.name?.toLowerCase().includes(searchingText.toLowerCase()))
    .map((folder, index) => {
        return (
                <Box 
                    key={index}
                    sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 2, width: '8rem', textAlign: 'center' }}
                    onClick={() => setSelectedItem(folder)} 
                    onDoubleClick={() => {
                    getFolderTail(folder._id)
                    getFolder(folder._id)
                }}>
                    <FolderOpenTwoToneIcon sx={{width:'100%',fontSize: 64, color: selectedItem?._id===folder._id?'#7537b8':'#4a9ea6', stroke: "#ffffff", strokeWidth: 1.45}} />
                    <Typography sx={{width:'100%',lineHeight: 1.2, fontSize:16, pl:'6px', color: selectedItem?._id===folder._id?'#7537b8':'initial'}}>{folder.name}</Typography>
                </Box>
        )
    }):[]
    const FileList = folderHelper.currentFolder?.files.length>0 ? folderHelper.currentFolder.files
    .filter(file => file.title?.toLowerCase().includes(searchingText.toLowerCase()))
    .map((file, index) => {
        return (
            <Box 
                key={index} 
                sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 2, width: '8rem', textAlign: 'center' }}
                onClick={() => setSelectedItem(file)} onDoubleClick={() => {
                setPreviewHelper({open: true, data: file, folderTail})
            }}>
                <InsertDriveFileTwoToneIcon sx={{width:'100%',fontSize: 64, color: selectedItem?._id===file._id?'#7537b8':'#4a9ea6', stroke: "#ffffff", strokeWidth: 1.45}} />
                <Typography sx={{width:'100%',lineHeight: 1.2, fontSize:16, pl:'6px', color: selectedItem?._id===file._id?'#7537b8':'initial'}}>{file.title}</Typography>
            </Box>
        )
    }):[]

  return (<>
  {folderTail.length>0 && <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', gap: '14px', mt: 2}}>
        {folderTail.map((folder, index) => {
            return (<>
                <Typography key={index} variant="caption1" component="span" sx={{cursor: 'pointer', color: '#4a9ea6', fontSize:"14px", fontWeight: index === folderTail.length - 1 ? '700' : '400' }} onClick={() => {
                    if(folder._id!==folderHelper.currentFolder._id) {
                        getFolderTail(folder._id)
                        getFolder(folder._id)
                    }
                }}>{folder.name}</Typography>
                {index < folderTail.length - 1 && '>'}
            </>
            )
        })}
    </Box>}
    {/* folder toolbar here; back button, new folder, new file, upload file, search */}
    {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 1,  }} > */}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', gap: 1.2, borderBottom: '1px dashed #e0e0e0',flexWrap: 'wrap', py:1 }} >
            <Tooltip title={t("Back")} placement="bottom"><span>
            <IconButton aria-label="back" size="large" onClick={() => {
                    if(folderHelper.currentFolder.parent){
                        FolderService.getFolder(folderHelper.currentFolder.parent).then(res=>{
                            console.log(res.data)
                            setFolderHelper(p=>({...p, currentFolder: res.data}))
                        }).catch(error=>console.log(error))
                    }
                }} 
                disabled={!folderHelper.currentFolder?.parent}
                >
                <KeyboardBackspaceIcon fontSize="inherit" sx={{color: !folderHelper.currentFolder?.parent?'#e0e0e0':'#4a9ea6'}} />
            </IconButton>
            </span></Tooltip>
            <Tooltip title={t("Add files")} placement="bottom"><span>
            <IconButton aria-label={t("Add files")} size="large" onClick={() => {
                    F_handleSetShowLoader(true)
                    setContentListHelper({open: true, currentFolder: folderHelper.currentFolder, folderTail})
                }}
                >
                <NoteAddTwoToneIcon fontSize="inherit" sx={{color: '#4a9ea6'}} />
            </IconButton>
            </span></Tooltip>
            <Tooltip title={t("Create new folder")} placement="bottom"><span>
            <IconButton aria-label={t("Create new folder")} size="large" 
                onClick={() => setFolderHelper(p=>({...p, open: true, type: 'NEW'}))} 
                >
                <CreateNewFolderTwoToneIcon fontSize="inherit" sx={{color: '#4a9ea6'}} />
            </IconButton>
            </span></Tooltip>
            <Tooltip title={`Rename "${folderHelper.currentFolder?.name}"`} placement="bottom"><span>
            <IconButton aria-label={`Rename "${folderHelper.currentFolder?.name}"`} size="large" 
            onClick={() => setFolderHelper(p=>({...p, open: true, type: 'EDIT'}))} 
            >
                <DriveFileRenameOutlineIcon fontSize="inherit" sx={{color: '#4a9ea6'}} />
            </IconButton>
            </span></Tooltip>
            <Tooltip title={selectedItem?.name? t("Delete folder"): t("Delete file")} placement="bottom"><span>
            <IconButton aria-label={selectedItem?.name? t("Delete folder"): t("Delete file")} size="large" 
            onClick={() => {
                if(window.confirm(t(`Are you sure you want to delete ${selectedItem.name? selectedItem.name: selectedItem.title}?`))){
                    if(selectedItem.name) {
                        FolderService.deleteFolder(selectedItem._id, 'FOLDER').then(res=>{
                            setFolderHelper(p=>{
                                let index = p.currentFolder.children.findIndex(folder => folder._id===selectedItem._id)
                                p.currentFolder.children.splice(index, 1)
                                return {...p}
                            })
                            setSelectedItem(null)
                            F_showToastMessage(t("Folder was deleted"), "success")
                        }).catch(error => console.log(error))
                    }
                    else if(selectedItem.title) {
                        FolderService.deleteFolder(folderHelper.currentFolder._id, 'FILE', selectedItem._id).then(res=>{
                            setFolderHelper(p=>{
                                let index = p.currentFolder.files.findIndex(file => file._id===selectedItem._id)
                                p.currentFolder.files.splice(index, 1)
                                return {...p}
                            })
                            setSelectedItem(null)
                            F_showToastMessage(t("File was removed"), "success")
                        }).catch(error => console.log(error))
                        console.log("delete content, yet to be implemented")
                    }
                }
            }} 
            disabled={!selectedItem}
            >
                <DeleteForeverTwoToneIcon fontSize="inherit" sx={{color: !selectedItem?'#e0e0e0':'#4a9ea6'}} />
            </IconButton>
            </span></Tooltip>
            <Tooltip title={t("Deselect")} placement="bottom"><span>
            <IconButton aria-label={t("Deselect")} size="large"
            disabled={!selectedItem}
            onClick={() => selectedItem && setSelectedItem(null)}
            >
                <DeselectIcon fontSize="inherit" sx={{color: !selectedItem?'#e0e0e0':'#4a9ea6'}} />
            </IconButton>
            </span></Tooltip>
            {/* <TextField sx={{height:'2rem'}} placeholder={t("Search in this folder...")} label={false} variant="outlined" /> */}
            <Box sx={{ml: 'auto', flexGrow: 1, minWidth: '10rem', maxWidth: '20%'}} component="span">
                <SearchField
                    className="text-primary"
                    value={searchingText}
                    onChange={(e)=>{ setSearchingText(e.target.value) }}
                    clearSearch={()=>{ setSearchingText('') }}
                />
            </Box>
        </Box>

      {/* </Box> */}
    {/* {folderHelper.currentFolder && <Typography variant="h2" component="h2" sx={{textAlign: 'left'}}>{folderHelper.currentFolder.name}</Typography>} */}
    
    {(FolderList.length+FileList.length)>0 ? <Box sx={{maxHeight: 'calc(95vh - 400px)', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', overflowX: 'hidden', justifyContent: 'flex-start', overflowY: 'auto',
        alignItems: 'flex-start', gap: 1, pb:2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider'}}>
        {FolderList}
        {FileList}
    </Box>:<Box sx={{textAlign: 'center', mt: 5, borderBottom: 1, borderColor: 'divider'}}>
        <Typography variant="h5" component="h5" sx={{textAlign: 'center', mb:5
    }}>{t("No content")}</Typography>
        </Box>}
        {/* make info bar: strictly one row, all details: selected file/folder name, date created. all separated small vertical bar */}
        <Box sx={{mb:-5, py:1}} onClick={() => selectedItem && setSelectedItem(null)}>
            <Box sx={{display: 'flex'}}>
                <Box sx={{textAlign: 'center',width: '5rem', mr: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant="h6" component="h6">{t("Info")}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{my: 1}} />
                {(folderHelper.currentFolder ? <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left', pl:2, minWidth: '12.5rem', maxWidth: '30%'}}>
                    <Typography variant="caption1" sx={{fontSize: '1.1rem', fontWeight: '700' }}>{folderHelper.currentFolder.name}</Typography>
                    <Typography variant="caption1" sx={{fontSize: '0.85rem' }}>{`${folderHelper.currentFolder.children.length} folders, ${folderHelper.currentFolder.files.length} files`}</Typography>
                    <Typography variant="caption1" sx={{fontSize: '0.85rem' }}>{t("Created")}: {F_getLocalTime(folderHelper.currentFolder.createdAt)}</Typography>
                </Box>:<CircularProgress color="inherit" />)
                }
                {selectedItem && (<>
                    <Divider orientation="vertical" flexItem sx={{my: 1}} />
                    <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left', pl:2}}>
                        <Typography variant="caption1" sx={{fontSize: '1.1rem', fontWeight: '700' }}>
                            {t("(Selected)")} {selectedItem.name? selectedItem.name: selectedItem.title}
                        </Typography>
                        {selectedItem.name && <Typography variant="caption1" sx={{fontSize: '0.85rem' }}>{`${selectedItem.children.length} folders, ${selectedItem.files.length} files`}</Typography>}
                        {selectedItem.title && <Typography variant="caption1" sx={{fontSize: '0.85rem' }}>{'Document type: '+selectedItem.contentType}</Typography>}
                        <Typography variant="caption1" sx={{fontSize: '0.85rem' }}>{t("Created")}: {F_getLocalTime(selectedItem.createdAt)}</Typography>
                    </Box>
                </>
                )}
            </Box>
        </Box>
        <Dialog open={previewHelper.open}
            aria-labelledby="form-dialog-title"
            onClose={() => setPreviewHelper(prev => ({ ...prev, open: false }))} 
            >
            <DialogContent>
                <ContentPreview data={previewHelper.data} folderTail={previewHelper.folderTail} />
            </DialogContent>
            <DialogActions>
                <StyledButton eSize='xsmall' eVariant="secondary" onClick={() => { setPreviewHelper(prev => ({ ...prev, open: false })) }}>{t("Close")}</StyledButton>
            </DialogActions>
        </Dialog>
        <Dialog open={contentListHelper.open} 
            aria-labelledby="form-dialog-title"
            onClose={() => setContentListHelper(prev => ({ ...prev, open: false }))} 
            fullScreen
            TransitionComponent={Transition}
            >
                <DialogTitle id="form-dialog-title" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
                    <Box>
                        {t(`Add files inside`)} <Box component="span" sx={{color: '#7537b8'}}>{contentListHelper.currentFolder?.name}</Box>
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={() => setContentListHelper(prev => ({ ...prev, open: false }))}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            <DialogContent>
                <ContentListWindow contentListHelper={contentListHelper} setContentListHelper={setContentListHelper} />
            </DialogContent>
            {/* <DialogActions>
                <StyledButton eSize='xsmall' eVariant="secondary" onClick={() => { setContentListHelper(prev => ({ ...prev, open: false })) }}>{t("Cancel")}</StyledButton>
            </DialogActions> */}
        </Dialog>
        <Dialog open={folderHelper.open} 
        aria-labelledby="form-dialog-title"
        onClose={() => setFolderHelper(prev => ({ ...prev, open: false }))} 
        >
        {/* <DialogTitle id="form-dialog-title">
          {folderHelper.type === 'EDIT' ? t("Edit folder") : t("Create new folder")}
        </DialogTitle> */}
        <DialogContent>
          <TextField id="outlined-basic" 
            sx={{mt: 2}}
            variant="outlined" 
            label={t("Name")} 
            value={folderHelper.type === 'EDIT' ? folderHelper.currentFolder.name : newFolder.name}
            onChange={(e) => {
              if (folderHelper.type === 'EDIT'){
                  setFolderHelper(prev => ({ ...prev, currentFolder: { ...prev.currentFolder, name: e.target.value } }))
              }
              else if (folderHelper.type === 'NEW'){
                setNewFolder(prev => ({ ...prev, name: e.target.value }))
              }
              else console.log("what are you doing?")
            }}
          />
        </DialogContent>
        <DialogActions>
          <StyledButton eSize='xsmall' eVariant="secondary" onClick={() => { setFolderHelper(prev => ({ ...prev, open: false })) }}>{t("Cancel")}</StyledButton>
          <StyledButton eSize='xsmall' eVariant="primary" onClick={() => {
            folderHelper.type === 'EDIT' ? updateFolder(): saveNewFolder()
          }}>{t("Save")}</StyledButton>
        </DialogActions>
      </Dialog>
  </>)
}

export default Folder