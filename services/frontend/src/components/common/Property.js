import TextField from '@mui/material/TextField';

import { theme } from "../../MuiTheme";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';


import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function Property({ label, value, copyIcon = false, textareaStyle = {} }) {
    const { F_showToastMessage } = useMainContext();
    const { t, i18n, translationsLoaded } = useTranslation();


    function copyText(text) {
        if (typeof (navigator.clipboard) == 'undefined') {
            console.log('navigator.clipboard');
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";  //avoid scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                F_showToastMessage('Copied to clipboard', 'success');
            } catch (err) {
                F_showToastMessage('Could not copy text', 'error');
            }

            document.body.removeChild(textArea)
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            F_showToastMessage('Copied to clipboard', 'success');
        }, function (err) {
            F_showToastMessage('Could not copy text', 'error');
        });

    }

    return (
        <TextField
            label={label}
            value={value}
            margin="normal"
            InputProps={{
                readOnly: true,
                disableUnderline: true,
                endAdornment: (copyIcon ? <IconButton
                    size="small"
                    onClick={() => {copyText(value)}}
                    edge="end"
                >
                    {<ContentCopyIcon style={{fontSize: 16}} />}
                </IconButton> : undefined)


            }}
            name='description'
            fullWidth
            multiline={true}
            style={{ marginTop: -4, marginBottom: 0 }}
            variant='standard'
            required={false}
            InputLabelProps={{
                shrink: true,
            }}
            sx={{
                "& textarea": {
                    maxWidth: value ? `${value.toString().length}ch` : '0',
                    fontFamily: 'Nunito',
                    letterSpacing: '0em',
                    color: theme.palette.neutrals.almostBlack,
                    fontWeight: 'bold',
                    ...textareaStyle
                },
                "& label": {
                    top: 7,
                    fontFamily: 'Nunito',
                    letterSpacing: '0em',
                    color: theme.palette.neutrals.darkestGrey,
                    whiteSpace: 'nowrap',
                },
                "& label.Mui-focused": {
                    color: theme.palette.neutrals.darkestGrey,
                },
            }}
            onInput={(e) => { }}
        />
    )
}