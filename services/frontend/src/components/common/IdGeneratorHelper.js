import React from "react";

export default function IdGeneratorHelper(charLength){
    let text = "";
    const possible = "abcdef0123456789";

    for (let i = 0; i < charLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}