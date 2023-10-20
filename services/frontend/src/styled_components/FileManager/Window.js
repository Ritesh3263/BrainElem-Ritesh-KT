import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import Breadcrumb from 'styled_components/FileManager/Breadcrumb';
import CommonDataService from "../../services/commonData.service"
import { EButton, EDataGrid2, EIconButton } from 'styled_components';
import { useTranslation } from 'react-i18next';
import StyledContentDetails from 'styled_components/DataGrid2/ContentDetails';
import { useNavigate, useSearchParams } from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import {ReactComponent as FolderIcon} from "icons/set/Folder.svg";
import {ReactComponent as LessonIcon} from "icons/other/lesson.svg";
import {ReactComponent as ExamIcon} from "icons/other/exam.svg";
import {ReactComponent as AssetIcon} from "icons/other/asset.svg";
import {ReactComponent as ForwardIcon} from 'icons/icons_48/Arrow small R.svg';
import ESvgIcon from "styled_components/SvgIcon";
import { theme } from 'MuiTheme';

const palette = theme.palette;
const sx = {
    p12: {
        color: palette.neutrals.almostBlack,
        fontSize: '12px',
        lineHeight: 1.9,
    },
    p14: {
        color: palette.neutrals.almostBlack,
        fontSize: '14px',
        lineHeight: 1.7,
    },
    p16: {
        color: palette.neutrals.almostBlack,
        fontSize: '16px',
    },
} 
const getStatusColor = (status) => {
    switch (status) {
        case 'AWAITING': return palette.semantic.warning;
        case 'ACCEPTED': return palette.semantic.success;
        case 'REJECTED': return palette.semantic.error;
        case 'PRIVATE': return palette.semantic.info;
        default: return palette.semantic.info;
    }
}
const getStatusText = (status) => {
    switch (status) {
        case 'AWAITING': return 'Awaiting for verification';
        case 'ACCEPTED': return 'Verified';
        case 'REJECTED': return 'Rejected';
        case 'PRIVATE': return 'Private';
        default: return '';
    }
}


const Window = ({ activeContent, setActiveContent, folders, setFolders }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);  
    let [searchParams, setSearchParams] = useSearchParams();

    function getFolderByName(name) {
        // search in 1st layer
        for(var prop in folders) {
            if(prop === name) return folders[prop];
        }
        // search in 2nd layer
        for(var prop1 in folders) {
            if(['_folder','_mixed','_id','_parent','_name'].includes(prop1)) continue;
            for(var prop2 in folders[prop1]) {
                if(prop2 === name) return folders[prop1][prop2];
            }
        }
        // search in 3rd layer
        for(var prop1 in folders) {
            if(['_folder','_mixed','_id','_parent','_name'].includes(prop1)) continue;
            for(var prop2 in folders[prop1]) {
                if(['_folder','_mixed','_id','_parent','_name'].includes(prop2)) continue;
                for(var prop3 in folders[prop1][prop2]) {
                        if(prop3 === name) return folders[prop1][prop2][prop3];
                    }
                }
        }
        return null;
    }
    function getFolderById(id) {
        // search in 3rd layer
        for(var prop1 in folders) {
            if(['_folder','_mixed','_id','_parent','_name'].includes(prop1)) continue;
            for(var prop2 in folders[prop1]) {
                if(['_folder','_mixed','_id','_parent','_name'].includes(prop2)) continue;
                for(var prop3 in folders[prop1][prop2]) {
                    if(['_folder','_mixed','_id','_parent','_name'].includes(prop3)) continue;
                    if(prop3 === id) {
                        return {
                            folder: folders[prop1][prop2],
                            content: folders[prop1][prop2][prop3]
                        }
                    } 
                }
            }
        }
        // search in 2nd layer
        for(var prop1 in folders) {
            if(['_folder','_mixed','_id','_parent','_name'].includes(prop1)) continue;
            for(var prop2 in folders[prop1]) {
                if(['_folder','_mixed','_id','_parent','_name'].includes(prop2)) continue;
                for(var prop3 in folders[prop1][prop2]) {
                    if(folders[prop1][prop2][prop3].hasOwnProperty('contentType')) continue;
                    if(['_folder','_mixed','_id','_parent','_name'].includes(prop3)) continue;
                    for(var prop4 in folders[prop1][prop2][prop3]) {
                        if(['_folder','_mixed','_id','_parent','_name'].includes(prop4)) continue;
                        if(folders[prop1][prop2][prop3][prop4]._id === id) {
                            return {
                                folder: folders[prop1][prop2][prop3],
                                content: folders[prop1][prop2][prop3][prop4]
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    function callOnFocus() {
        let folder = searchParams.get('folder');
        let content = searchParams.get('content');
        if (folder) {
            let folderData = getFolderByName(folder);
            if (folderData) {
                setFolders(folderData);
                setActiveContent(null);
            }
        }
        else if (content) {
            let contentData = getFolderById(content);
            if (contentData) {
                setFolders(contentData.folder);
                setActiveContent(contentData.content);
            }
        }
    }


    const handleOnCellClick = (params) => {
        if(params.row.type === "folder"){
            setFolders(params.row.value)
            setSearchParams({folder: params.row.name });
        } else {
            let data = params.row.value
            setSearchParams({content: params.row.contentId });
            CommonDataService.countProgramsByContent(params.row.contentId).then((response) => {
                data.assignedToPrograms = response.data.count
                setActiveContent(data)
            })
        }
    }

    let folderList = []
    if(folders && Array.isArray(folders)){
        folderList = folders.map((item, index)=>{
            return {
                id: index+1,
                name: item.title,//
                type: item.contentType,
                author: item.owner.name+' '+item.owner.surname,//
                level: item.level,//
                modified: (new Date(item.updatedAt)).toLocaleDateString(),//
                status: item.libraryStatus,//
                contentId: item._id,//
                _folder: item._folder||false,
                value: item,
            }
        })
    }
    else if (folders.hasOwnProperty('_mixed')) {
        folderList = Object.keys(folders).filter(item=>!['_folder','_mixed','_id','_parent','_name'].includes(item)).map((item, index)=>{
            return {
                id: index+1,
                name: folders[item].title??item,//
                type: folders[item].contentType??'folder',
                author: folders[item].contentType?folders[item].owner.name+' '+folders[item].owner.surname:null,//
                level: folders[item].contentType?folders[item].level:null,//
                modified: folders[item].contentType?(new Date(folders[item].updatedAt)).toLocaleDateString():null,//
                status: folders[item].contentType?folders[item].libraryStatus:null,//
                inside: folders[item].contentType?null:Object.keys(folders[item]).filter(item=>!['_folder','_mixed','_id','_parent','_name'].includes(item)).length,//
                [folders[item].contentType?'contentId':'itemId']: folders[item]._id,//
                _folder: folders[item]._folder||false,
                value: folders[item],
            }
        })
    }
    else if (folders.hasOwnProperty('_folder')) {
        folderList = Object.keys(folders).filter(item=>!['_folder','_id','_parent','_name'].includes(item)).map((item, index)=>{
            return {
                id: index+1,
                name: item,//
                type: 'folder',
                inside: Object.keys(folders[item]).filter(item=>!['_folder','_id','_parent','_name'].includes(item)).length,//
                itemId: folders[item]._id,//
                _folder: folders[item]._folder||false,
                value: folders[item],
            }
        })
    }
    

    useEffect(()=>{
        setRows(folderList);
    },[folders])

    // may have issue in some case while returning to view using back button as component is reloaded from the cahche and do not call useEffect?
    useEffect(()=>{
        callOnFocus();
    },[])

    // callOnFocus();

    let columns = []
    let columnsM = []
    if(folders && Array.isArray(folders)){
        columns = [
            { field: 'id', headerName: 'ID', width: 1, hide: true },
            { field: 'icon', headerName: '', headerAlign: 'center', width: 1, disableColumnMenu: true, // sortable: false, 
                renderCell: (params)=>(<EIconButton onClick={()=>{
                    CommonDataService.countProgramsByContent(params.row.contentId).then((response) => {
                        params.row.value.assignedToPrograms = response.data.count
                        setActiveContent(params.row.value)
                    })
                }}>
                    {params.row.type==='ASSET' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={AssetIcon}/>: params.row.type==='TEST' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={ExamIcon}/> : <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={LessonIcon}/>}
                </EIconButton>) },
            { field: 'name', headerName: 'Name', minWidth: 180, flex: 5 },
            { field: 'type', headerName: 'Type', flex: 1, hide: true },
            { field: 'author', headerName: 'Author', flex: 3 },
            { field: 'level', headerName: 'Level', width: 1, },
            { field: 'modified', headerName: 'Modified', flex: 2 },
            { field: 'status', headerName: 'Status', width: 1, renderCell: (params)=>(<CircleIcon sx={{ fontSize:10, color: getStatusColor(params.row.status), mx: '10px' }}></CircleIcon>) },
            { field: 'action', headerName: '', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<>
                    <EIconButton onClick={() => {navigate(`/content/display/${params.row.contentId}`)}} size="medium" color="secondary" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}}>
                        <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox={"17 17 14 14"} component={ForwardIcon} />
                    </EIconButton>
                </>) },
        ];
        columnsM = [
            { field: 'id', headerName: 'ID', width: 1, hide: true },
            { field: 'icon', headerName: '', headerAlign: 'center', width: 1, disableColumnMenu: true, // sortable: false, 
                renderCell: (params)=>(<EIconButton onClick={()=>{
                    CommonDataService.countProgramsByContent(params.row.contentId).then((response) => {
                        params.row.value.assignedToPrograms = response.data.count
                        setActiveContent(params.row.value)
                    })
                }}>
                    {params.row.type==='ASSET' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={AssetIcon}/>: params.row.type==='TEST' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={ExamIcon}/> : <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={LessonIcon}/>}
                </EIconButton>) },
            { field: 'name', headerName: 'Name', flex: 1, 
                renderCell: (params)=>(<Box>
                {/* title, author, modified, status */}
                    <Typography sx={{...sx.p14}} >{params.row.name}</Typography>
                    <Typography sx={{...sx.p12}}>{params.row.author}</Typography>
                    <Typography sx={{...sx.p12}}>{params.row.modified}</Typography>
                    <Typography sx={{...sx.p14}}>
                        {t("Status")}
                        <Typography sx={{...sx.p16}} component="span">
                            {<CircleIcon sx={{ fontSize:10, color: getStatusColor(params.row.status), mx: '10px' }}></CircleIcon>}
                            {t(getStatusText(params.row.status))}
                        </Typography>
                    </Typography>
                </Box>)},
            { field: 'action', headerName: '', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<>
                    <EIconButton onClick={() => {navigate(`/content/display/${params.row.contentId}`)}} size="medium" color="secondary" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}}>
                        <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox={"17 17 14 14"} component={ForwardIcon} />
                    </EIconButton>
                </>) },
        ];
    }
    else if (folders.hasOwnProperty('_mixed')) {
        columns = [
            { field: 'id', headerName: 'ID', width: 1, hide: true },
            { field: 'icon', headerName: '', headerAlign: 'center', width: 1, disableColumnMenu: true, // sortable: false, 
                renderCell: (params)=>(<EIconButton onClick={()=>{
                    if (params.row.value.contentType) {
                        CommonDataService.countProgramsByContent(params.row.contentId).then((response) => {
                            params.row.value.assignedToPrograms = response.data.count
                            setActiveContent(params.row.value)
                        })
                    }
                    else setFolders(params.row.value);
                }}>
                    {params.row.type==='folder' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-1 -1 52 52" sx={{width:'36px', height:'36px'}} component={FolderIcon}/>:params.row.type==='ASSET' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={AssetIcon}/>: params.row.type==='TEST' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={ExamIcon}/> : <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={LessonIcon}/>}
                </EIconButton>) },
            { field: 'name', headerName: 'Name', minWidth: 180, flex: 5 },
            { field: 'type', headerName: 'Type', flex: 1, hide: true },
            { field: 'author', headerName: 'Author', flex: 3 },
            { field: 'level', headerName: 'Level', width: 1, },
            { field: 'modified', headerName: 'Modified', flex: 2 },
            { field: 'status', headerName: 'Status', width: 1, renderCell: (params)=>(params.row.type!=='folder' && <CircleIcon sx={{ fontSize:10, color: getStatusColor(params.row.status), mx: '10px' }}></CircleIcon>) },
            { field: 'inside', headerName: 'Inside', width: 1, },
            { field: 'action', headerName: '', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<>
                <EIconButton onClick={() => {
                    if (params.row.value.contentType) {
                        navigate(`/content/display/${params.row.contentId}`);
                    }
                    else setFolders(params.row.value);
                        }} size="medium" color="secondary" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}}>
                    <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox={"17 17 14 14"} component={ForwardIcon} />
                </EIconButton>
            </>) },
        ];
        columnsM = [
            { field: 'id', headerName: 'ID', width: 1, hide: true },
            { field: 'icon', headerName: '', headerAlign: 'center', width: 1, disableColumnMenu: true, // sortable: false, 
                renderCell: (params)=>(<EIconButton onClick={()=>{
                    if (params.row.value.contentType) {
                        CommonDataService.countProgramsByContent(params.row.contentId).then((response) => {
                            params.row.value.assignedToPrograms = response.data.count
                            setActiveContent(params.row.value)
                        })
                    }
                    else setFolders(params.row.value);
                }}>
                    {params.row.type==='folder' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-1 -1 52 52" sx={{width:'36px', height:'36px'}} component={FolderIcon}/>:params.row.type==='ASSET' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={AssetIcon}/>: params.row.type==='TEST' ? <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={ExamIcon}/> : <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox="-2 -1 28 28" sx={{width:'36px', height:'36px'}} component={LessonIcon}/>}
                </EIconButton>) },
            { field: 'name', headerName: 'Name', flex: 1, height: (params)=>(params.row.inside? 64 : 112),
                renderCell: (params)=>(<Box>
                    {/* inside */}
                    {params.row.inside ? <>
                        <Typography sx={{...sx.p14}} >{params.row.name}</Typography>
                        <Typography sx={{...sx.p12}}>{`${params.row.inside} ${t("items")}`}</Typography>
                    </>:<>
                        <Typography sx={{...sx.p14}} >{params.row.name}</Typography>
                        <Typography sx={{...sx.p12}}>{params.row.author}</Typography>
                        <Typography sx={{...sx.p12}}>{params.row.modified}</Typography>
                        <Typography sx={{...sx.p14}}>
                            {t("Status")}
                            <Typography sx={{...sx.p16}} component="span">
                                {<CircleIcon sx={{ fontSize:10, color: getStatusColor(params.row.status), mx: '10px' }}></CircleIcon>}
                                {t(getStatusText(params.row.status))}
                            </Typography>
                        </Typography>
                    </>}
                </Box>)},
            { field: 'action', headerName: '', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<>
                <EIconButton onClick={() => {
                    if (params.row.value.contentType) {
                        navigate(`/content/display/${params.row.contentId}`);
                    }
                    else setFolders(params.row.value);
                        }} size="medium" color="secondary" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}}>
                    <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox={"17 17 14 14"} component={ForwardIcon} />
                </EIconButton>
            </>) },
        ];
    }
    else if (folders.hasOwnProperty('_folder')) {
        columns = [
            { field: 'id', headerName: 'ID', width: 1, hide: true },
            { field: 'icon', headerName: '', headerAlign: 'center', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<EIconButton size="medium" onClick={()=>setFolders(params.row.value)}><ESvgIcon color={`${palette.neutrals.almostBlack}`}  viewBox="-1 -1 52 52" sx={{width:'36px', height:'36px'}} component={FolderIcon}/></EIconButton>) },
            { field: 'name', headerName: 'Name', minWidth: 180, flex: 5 },
            { field: 'type', headerName: 'Type', flex: 1, hide: true },
            { field: 'inside', headerName: 'Inside', flex: 1 },
            // { field: 'modified', headerName: 'Modified', flex: 1 },
            { field: 'action', headerName: '', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<>
                <EIconButton onClick={()=>setFolders(params.row.value)} size="medium" color="secondary" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}}>
                    <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox={"17 17 14 14"} component={ForwardIcon} />
                </EIconButton>
            </>) },
        ];
        columnsM = [
            { field: 'id', headerName: 'ID', width: 1, hide: true },
            { field: 'icon', headerName: '', headerAlign: 'center', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<EIconButton size="medium" onClick={()=>setFolders(params.row.value)}><ESvgIcon color={`${palette.neutrals.almostBlack}`}  viewBox="-1 -1 52 52" sx={{width:'36px', height:'36px'}} component={FolderIcon}/></EIconButton>) },
            { field: 'name', headerName: 'Name', flex: 1, 
                renderCell: (params)=>(<Box>
                    <Typography sx={{...sx.p14}} >{params.row.name}</Typography>
                    <Typography sx={{...sx.p12}}>{`${params.row.inside} ${t("items")}`}</Typography>
                </Box>)},
            { field: 'action', headerName: '', width: 1, disableColumnMenu: true, sortable: false,
                renderCell: (params)=>(<>
                <EIconButton onClick={()=>setFolders(params.row.value)} size="medium" color="secondary" sx={{borderRadius: '50%', width: 40, height: 40, p: 0, mx: 0}}>
                    <ESvgIcon color={`${palette.neutrals.almostBlack}`} viewBox={"17 17 14 14"} component={ForwardIcon} />
                </EIconButton>
            </>) },
        ];
    }

  return (<EDataGrid2
            style={{cursor: "pointer"}}
            rows={rows}
            setRows={setRows}
            columns={columns}
            columnsM={columnsM}
            originalData={folderList}
            onCellClick={handleOnCellClick}
            folders={folders}
            setFolders={setFolders}
            activeContent={activeContent}
            setActiveContent={setActiveContent}
            PreviewTile={<StyledContentDetails activeContent={activeContent} setActiveContent={setActiveContent} folders={folders} setFolders={setFolders} />}
            navOptions={{title:t("Catalogue"), btnUrl:"/create-content", btnLabel:t("Create new")}}
            // NavComponent={<EButton onClick={()=>{navigate("/create-content")}} eVariant='primary' eSize='small'>{t("Create new")}</EButton>}
            Breadcrumb={<Breadcrumb folders={folders} setFolders={setFolders} setActiveContent={setActiveContent} />}
        />)
}

export default Window