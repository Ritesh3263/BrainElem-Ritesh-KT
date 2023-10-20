import React from "react";
import { TextField, InputAdornment } from "@material-ui/core";
import ScheduleIcon from '@material-ui/icons/Schedule';
import { TimePicker } from "@material-ui/pickers";

export default function SimpleTimePicker({ name, value, setValue, disabled }) {



    return (
        <TimePicker
            labelFunc={(date) => {
                let selectedTime = new Date(date)
                let seconds = selectedTime.getSeconds() + selectedTime.getMinutes() * 60 + selectedTime.getHours() * 3600;
                if (!seconds) return 'HH:MM'
                else return date.format('HH:mm')
            }}
            TextFieldComponent={(props) =>
                <TextField
                    disabled={props.disabled}
                    fullWidth
                    label={name}
                    className="mb-2"
                    variant='filled'
                    onClick={props.onClick}
                    value={props.value}
                    onChange={props.onChange}
                    inputProps={{ style: { cursor: 'pointer' } }}
                    InputProps={
                        {
                            endAdornment:
                                (<InputAdornment position="end" style={{cursor: 'pointer'}}>
                                    <ScheduleIcon fontSize='small' />
                                </InputAdornment>)
                        }
                    }


                >

                </TextField>}
            ampm={false}
            openTo="minutes"
            views={["hours", "minutes"]}
            format="HH:mm"
            label="HH:MM"
            value={value}
            onChange={setValue}
            disabled={disabled}
        />

    )
}