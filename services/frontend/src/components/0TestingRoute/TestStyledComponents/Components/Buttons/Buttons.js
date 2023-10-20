import React from "react";
import Grid from "@material-ui/core/Grid";
import {EButton} from "../../../../../styled_components";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

export default function Buttons(){
    return(
        <Grid container>
            <Grid item xs={3} className='d-flex flex-column'>
                <h5>Size primary</h5>

                <EButton
                    style={{width:'120px'}}
                    eSize='xsmall'
                    startIcon={<PersonAddIcon/>}
                >xsmall</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eSize='small'
                    startIcon={<PersonAddIcon/>}
                >small</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eSize='medium'
                    startIcon={<PersonAddIcon/>}
                >medium</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eSize='large'
                    disabled
                    startIcon={<PersonAddIcon/>}
                >large</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eSize='xlarge'
                    startIcon={<PersonAddIcon/>}
                >xlarge</EButton>

            </Grid>
            <Grid item xs={3} className='d-flex flex-column'>
                <h5>Size secondary</h5>

                <EButton
                    style={{width:'120px'}}
                    eVariant='secondary'
                    eSize='xsmall'
                    startIcon={<PersonAddIcon/>}
                >xsmall</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eVariant='secondary'
                    eSize='small'
                    startIcon={<PersonAddIcon/>}
                >small</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eVariant='secondary'
                    eSize='medium'
                    startIcon={<PersonAddIcon/>}
                >medium</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eVariant='secondary'
                    eSize='large'
                    disabled
                    startIcon={<PersonAddIcon/>}
                >large</EButton>
                <hr/>
                <EButton
                    style={{width:'120px'}}
                    eVariant='secondary'
                    eSize='xlarge'
                    startIcon={<PersonAddIcon/>}
                >xlarge</EButton>

            </Grid>
            <Grid item xs={3} className='d-flex flex-column'>
                <h5>Loading</h5>
                <EButton onClick={()=>console.log("test")}
                         eSize='xsmall'
                         isLoading={true}>
                    Loading xsamll
                </EButton>
                <hr/>
                <EButton onClick={()=>console.log("test")}
                         eSize='xlarge'
                         isLoading={true}>
                    Loading xlarge
                </EButton>
                <hr/>
                <EButton onClick={()=>console.log("test")}
                         eVariant='secondary'
                         eSize='xsmall'
                         isLoading={true}>
                    Loading xsamll
                </EButton>
                <hr/>
                <EButton onClick={()=>console.log("test")}
                         eVariant='secondary'
                         eSize='xlarge'
                         isLoading
                >
                    Loading xlarge
                </EButton>
            </Grid>
        </Grid>
    )
}