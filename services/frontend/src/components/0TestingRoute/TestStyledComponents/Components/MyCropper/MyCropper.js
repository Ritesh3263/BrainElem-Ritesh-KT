import React, {useEffect, useState} from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Container} from "@mui/material";

const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg';
export default function MyCropper(){
    const [image, setImage] = useState(defaultSrc); // img src
    const [cropData, setCropData] = useState("#"); // after cropped
    const [cropper, setCropper] = useState(); // curren cropped object

    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
        }
    };

    return(
        <Container>
            <Cropper
                src={image}
                style={{ height: 400, width: "100%" }}
                // Cropper.js options
                initialAspectRatio={16 / 9}
                responsive={true}
                guides={false}
                preview=".img-preview"
                onInitialized={(instance) => {
                    setCropper(instance);
                }}
                modal={true}
                zoomable={true}
                minCropBoxWidth={200}
                minCropBoxHeight={200}
            />
            <br/>
            <input type="file" onChange={onChange} />
            <br/><br/>
            <button style={{ float: "left" }} onClick={getCropData}>Crop Image</button>
            <button style={{ float: "left" }} onClick={()=>cropper.zoom(0.1)}>zoom +</button>
            <button style={{ float: "left" }} onClick={()=>cropper.zoom(-0.1)}>zoom -</button>
            <button style={{ float: "left" }} onClick={()=>{cropper.setDragMode('move')}}>drag mode</button>
            <button style={{ float: "left" }} onClick={()=>{cropper.rotate(90)}}>rotate -></button>
            <button style={{ float: "left" }} onClick={()=>{console.log("--->",cropper.getData())}}>getData</button>
            <br/>
            <br/><br/>
            {/*<h1>Preview</h1>*/}
            {/*<div style={{width:'400px', height:'400px', backgroundColor:'pink'}}>*/}
            {/*<div*/}
            {/*    className="img-preview"*/}
            {/*    style={{ width: "100%", float: "left", height: "300px" }}*/}
            {/*/>*/}
            {/*</div>*/}
            <br/><br/>
            <h3>Cropped</h3>
            <img style={{ width: "100%" }} src={cropData} alt="cropped" />
        </Container>
    )
}