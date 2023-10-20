import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";


// MUI v5
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles';

//MUI v4
import { theme } from "MuiTheme";

// Component for displaying table
// # data - contains all elements to be displayed in the table. it has 2 fields `header` and `rows`
// ## data.header - array of columns in table header, each header column has:
// - key - string used for identification
// - verticalValue - component/string which will be displayed vertically
// - value - component/string which will be displayed under vertically name
// ## data.rows - array of rows for table, each row contains array of element which have:
// - key - string used for identification
// - value - component/string to display
//
// firstWidth - width in px of the first colum
export default function Table({ data, firstWidth = 140 }) {

    const Cell = styled(Grid)({
        padding: '2px',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.neutrals.fadeViolet}`
    })

    const getHeaderColumn = (column) => {
        if (column.key == 'first') {
            return <Box sx={{ height: '84px', width: firstWidth, background: theme.palette.neutrals.lightGrey }}></Box>
        } else {
            let verticalColor = theme.palette.primary.violet
            let verticalBackground = theme.palette.shades.white50
            if (column.key == 'all') {
                verticalColor = theme.palette.neutrals.darkestGrey
                verticalBackground = theme.palette.neutrals.white

            }
            return <Grid sx={{ width: '36px', }}>
                <Cell item xs={12} container
                    sx={{

                        height: '64px',
                        background: verticalBackground,
                    }}>
                    <Typography sx={{ ...theme.typography.p, writingMode: 'vertical-lr', fontSize: '10px', maxHeight: '100%', transform: 'rotate(-180deg)', color: verticalColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {column.verticalValue}
                    </Typography>

                </Cell>
                <Cell item xs={12} container
                    sx={{
                        height: '20px',
                        background: theme.palette.neutrals.white
                    }}>
                    <Typography sx={{ ...theme.typography.p, fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {column.value}
                    </Typography>
                </Cell>
            </Grid>
        }

    }

    const getRowColumn = (column) => {
        if (column.key == 'first') {
            return <Cell sx={{ width: firstWidth, background: theme.palette.neutrals.white }}>
                <Typography sx={{ ...theme.typography.p, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {column.value}
                </Typography>
            </Cell>
        } else {
            if (column.value) {
                return <Cell container sx={{ width: '36px', background: theme.palette.shades.white70 }}>
                    <Typography sx={{ ...theme.typography.p, fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {column.value}
                    </Typography>
                </Cell>
            } else {
                return <Cell container sx={{ width: '36px', background: theme.palette.neutrals.grey }}></Cell>
            }

        }
    }


    return (
        <>
            <Grid container sx={{ flexWrap: 'nowrap' }}>
                {data.header.map(c => { return getHeaderColumn(c) })}
            </Grid>
            {data.rows.map(row =>
                <Grid container sx={{ flexWrap: 'nowrap' }}>
                    {row.map(rc => { return getRowColumn(rc) })}
                </Grid>
            )}
        </>
    )
}