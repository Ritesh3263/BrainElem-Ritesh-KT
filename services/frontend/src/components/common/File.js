import React, { useEffect, useState, useRef } from "react";

import { useTranslation } from "react-i18next";



// MUI v5

import ImageListItemBar from '@mui/material/ImageListItemBar';
import { InputAdornment } from "@mui/material";

// Styled components
import ETextField from "styled_components/TextField";
import ESvgIcon from "styled_components/SvgIcon";
import EIconButton from "styled_components/EIconButton";

// Icons
import { ReactComponent as AddIcon } from 'icons/icons_32/Add2_32.svg';
import { ReactComponent as DownloadIcon } from 'icons/icons_32/Download_32.svg';
import { ReactComponent as ClearIcon } from 'icons/icons_32/Close_32.svg';

// Context
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v4
import { theme } from "MuiTheme";


export default function FileUpload({ name,// Label name displayed
  value,// Can be an ID of the file or file object {_id: <str>, fileOriginalName: <str> }
  CustomIcon,// Optional custom icon to replace default AddIcon 
  setValue, // Optional callback function to be called it can be called with file object
  // or null if uploaded file is deleted 
  uploadFunction, // Optional function for uploading files as formData
  getFileDetailsFunction,// Optional function to load the name of the file if `value` is just ID 
  removeFunction,// Optional function to be called when user remove/replaced chosen file
  downloadFunction,// Optional function when provided the component willbe the download button 
  acceptTypes,// Optional string for limitiong file types eg. "image/png, image/gif"
  isPreview,// Optional boolean, when true the uploading file will be mocked,
  disabled,
  auto = false,// automatically open the file selection when component loaded
  type = "input"// type of upload - may be input or bar
}) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { F_showToastMessage, F_handleSetShowLoader, F_getErrorMessage } = useMainContext();
  const fileInputRef = useRef(null);
  const [fileOriginalName, setFileOriginalName] = useState()
  const [isUploading, setIsUploading] = useState(0)
  const [isDownloading, setIsDownloading] = useState(0)

  const getText = () => {
    if (isUploading) return t("Uploading") + '...'
    if (isDownloading) return t("Downloading") + '...'
    else return (fileOriginalName ? fileOriginalName : '')
  }

  const getIcon = (event) => {
    if (value && !downloadFunction) return <ESvgIcon viewBox="0 0 32 32" component={ClearIcon} onClick={(event) => {
      event.stopPropagation();
      handleRemove()
    }}
    />
    else if (downloadFunction) return <ESvgIcon viewBox="0 0 32 32" component={DownloadIcon} />
    else if (CustomIcon) return CustomIcon
    else return <ESvgIcon viewBox="0 0 32 32" component={AddIcon} />
  }



  // Handle changing the file
  const handleChange = (event) => {
    if (!event.target.value) return;

    handleRemove()
    F_showToastMessage(t("Uploading file"), 'info')
    setIsUploading(1)

    F_handleSetShowLoader(true);
    var newFileOriginalName = event.target.value.split('\\').pop();

    if (isPreview) {// do not upload as it is just a preview
      F_handleSetShowLoader(false);
      F_showToastMessage(t("File was Uploaded"), 'success')
      return setValue({ _id: 'fake_id', fileOriginalName: newFileOriginalName })
    }

    var formData = new FormData();
    formData.append('file', event.target.files[0], newFileOriginalName)
    uploadFunction(formData).then(
      (response) => {
        setValue(response.data)
        setTimeout(() => {
          setIsUploading(0)
          F_showToastMessage(t("File was Uploaded"), 'success')
          F_handleSetShowLoader(false);
        }, 1000)
      },
      (error) => {
        setIsUploading(0)
        let errorMessage = F_getErrorMessage(error)
        if (error.response.data.toLowerCase().includes("too large")) errorMessage = "File is too large."
        else if (error.response.data.toLowerCase().includes("only images")) errorMessage = "File must be an image"

        F_showToastMessage(errorMessage, 'error')
        F_handleSetShowLoader(false);
      }
    )
  };


  // When removing/replacing old file
  const handleRemove = () => {
    if (isPreview) setValue(null)
    else if (value && removeFunction) {
      // Removing file from database
      console.log('Removing', fileOriginalName)
      removeFunction(value._id || value).then(
        (response) => {
          F_showToastMessage(t("File was removed"), 'info')
          setValue(null)
        },
        (error) => {
          let errorMessage = F_getErrorMessage(error)
          F_showToastMessage(errorMessage, 'error')

        }
      )
    }
    else if (value) setValue(null)

  }


  // When file was changed/added
  useEffect(() => {
    if (value) {
      if (value.fileOriginalName) setFileOriginalName(value.fileOriginalName)
      else if (getFileDetailsFunction) {// Value is just an ID of file, we must download file details
        if (isPreview) setFileOriginalName(t("Uploaded file"))
        else getFileDetailsFunction(value).then(response => {
          setFileOriginalName(response.data.fileOriginalName)
        })


      }
    } else setFileOriginalName('')

  }, [value]);


  // When file was changed/added
  useEffect(() => {
    if (auto) fileInputRef.current.click()
  }, []);

  const handleClick = () => {
    if (value && downloadFunction && !isDownloading) {
      F_showToastMessage(t("Downloading. Please wait."), 'info');
      setIsDownloading(1)
      downloadFunction(value, () => setIsDownloading(0))
    } else if (!downloadFunction && !isUploading) fileInputRef.current.click()
  }

  return (<>
    {type == 'input' && <ETextField
      fullWidth
      disabled={disabled}
      className='mb-2'
      variant="filled"
      label={name}
      value={getText()}
      onClick={handleClick}
      inputProps={
        {
          style: { cursor: 'pointer' },
        }
      }
      InputProps={
        {
          readOnly: true,
          startAdornment:
            (<InputAdornment position="start" style={{ cursor: 'pointer' }}>
              {getIcon()}
            </InputAdornment>)
          ,
        }
      }
    >

    </ETextField>}
    {type == 'bar' && <ImageListItemBar sx={{
      background: theme.palette.shades.white70, borderRadius: "8px",
      '& .css-dasnyc-MuiImageListItemBar-title': {
        color: theme.palette.primary.darkViolet,
        fontSize: "12px",
        fontFamily: 'Roboto'
      },
    }}
      title={name}
      actionIcon={
        <EIconButton sx={{ mr: 2, background: theme.palette.shades.white70 }}
          size="medium" variant="contained"
          disabled={disabled}
          onClick={handleClick}
        >
          {getIcon()}
        </EIconButton>
      }
    />}

    <input
      ref={fileInputRef}
      onChange={handleChange}
      type="file"
      accept={acceptTypes ? acceptTypes : ""}
      hidden
    />
  </>)
}