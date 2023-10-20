import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

// MUI v5
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { theme } from "MuiTheme";


const colorActive = 'radial-gradient(47.55% 52.87% at 50% 50%, #8CEDEE 0%, #2CCED0 100%)'

const maxRadius = 150
const maxDiameter = 2 * maxRadius
const angle = 72;

String.prototype.hashCode = function() {
    var hash = 0,
      i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

const StyledPetel = styled(Box)((props) => {
    var animationName  = "grow_"+props.polygon.hashCode()+"_"+props.previouspolygon.hashCode()
    let styles = {
        position: 'absolute',
        width: `${2 * maxRadius}px`,
        height: `${2 * maxRadius}px`,
        filter: `url('#goo')`,
        transform: `rotate(${props.rotate}deg)`,
        '&::before': {
            animation: `${animationName} 0.8s`,
            content: '""',
            display: 'block',
            paddingTop: `${2 * maxRadius}px`,
            background: props.color,
            clipPath: `${props.polygon}`
        }

    }

    styles[`@keyframes ${animationName}`] = {
        "0%": {
            clipPath: props.previouspolygon
        },
        "100%": {
            clipPath: props.polygon
        }
    }

    return (styles)
})

export default function FlowerChart({ activeResults, activeTraitName }) {
    const { t } = useTranslation();

    // When activeResults are changed
    const currentPolygonsRef = useRef({});
    const previousPolygonsRef = useRef({});

    // Calculate size in percentage of flower petal based on value of NAD
    function getSizeFromTrait(trait) {
        // FOR TESTING - RANDOM VALUES
        //return Math.floor(Math.random() * (90 - 30 + 1)) + 30;
        var maxValue = 0;
        ['communication-strategy', 'cooperation', 'self-activation', 'self-confidence', 'regularity'].forEach((traitName) => {
            if (activeResults.traits[traitName].normalizedValue > maxValue) maxValue = activeResults.traits[traitName].normalizedValue
        })
        let value = activeResults.traits[trait].normalizedValue
        let size = (value / maxValue) * 50
        return 30 + size;//50 is minimal 80 is maximal - looks nice
    }

    function getFlowerPetal(rotate, traitName) {
        // Size
        var size = getSizeFromTrait(traitName);
        let polygon;
        // .0,0___________________________________________.100,0
        // |                          |
        // |  p1                      |
        // |  |\                      |
        // |a1| \c1                   |
        // |  |b_\                    |.w0(50%,50%)
        // |  |  /
        // |  | /
        // |  |/
        // |  p2
        // |
        // |.0,100
        let b = (size / 100) * maxRadius;
        let a1 = b * Math.tan((angle / 2) * Math.PI / 180)
        //console.log(`Height of petal is ${size}% of ${maxRadius}px which is ${b}px.`)
        //console.log(`Half of height of triangle is a1=${a1}px which is b=${b} * tang(${angle / 2})`)
        let p1_x = ((maxRadius - b) / maxDiameter) * 100
        let p1_y = ((maxRadius - a1) / maxDiameter) * 100

        let p2_x = p1_x
        let p2_y = (((maxRadius - a1) + 2 * a1) / maxDiameter) * 100
        //console.log(`p1(${p1_x},${p1_y}), p2(${p2_x},${p2_y})`)
        // .0,0___________________________________________.100,0
        // |       w1(w3->5%)      |
        // |      /                |
        // |   w2/(w3->2%)         |
        // |    /                  |
        // | w3/                   .w0(50%,50%)
        // |   \   
        // |  w4\(w3->2%)
        // |     \
        // |      \
        // |       w5(w3->5%)
        // | 
        // |.0,100

        let w0 = `50% 50%`
        let w1 = `${p1_x}% ${p1_y}%`
        let w2 = `${p1_x - 4}% ${p1_y + (1 / 4) * (p2_y - p1_y)}%`
        let w3 = `${p2_x - 5}% ${p1_y + (1 / 2) * (p2_y - p1_y)}%`
        let w4 = `${p2_x - 4}% ${p1_y + (3 / 4) * (p2_y - p1_y)}%`
        let w5 = `${p2_x}% ${p2_y}%`

        polygon = `polygon(${w0}, ${w1}, ${w2}, ${w3}, ${w4}, ${w5})`
        // By default start from smallest flowers
        let previousPolygon = `polygon(50% 50%, 35% 39.10186207991959%, 31% 44.55093103995979%, 30% 50%, 31% 55.44906896004021%, 35% 60.89813792008041%)`
        if (previousPolygonsRef.current[rotate]) previousPolygon = previousPolygonsRef.current[rotate]
        currentPolygonsRef.current[rotate] = polygon;
        let top = -maxRadius + 35
        let left = -maxRadius + 35


        // Color
        var color;
        if (activeTraitName == traitName) color = colorActive;
        else color = `radial-gradient(circle at ${(maxRadius - b / 2)}px ${(maxRadius - b / 2)}px, #E8B0FB, #DC7FFD ${b + 30}px);`



        let stdDeviation = 9;
        return (
            <>
                <StyledPetel
                    onAnimationEnd={() => {
                        previousPolygonsRef.current[rotate] = polygon
                    }}
                    key={activeResults._id}
                    polygon={polygon}
                    previouspolygon={previousPolygon}
                    color={color} rotate={rotate}
                    style={{ 'top': `${top}px`, 'left': `${left}px`, zIndex: -1 }}></StyledPetel>
                <svg style={{ 'visibility': 'hidden', 'position': 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <defs>
                        <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation={stdDeviation} result="blur" colorInterpolationFilters="sRGB" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
                            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                        </filter>
                    </defs>
                </svg>
            </>
        )
    }


    if (!activeResults || !activeTraitName) return <></>
    else return (
        <Box style={{ position: 'relative', height: 70, width: 70, backdropFilter: 'blur(1px)' }}>

            {/* Center of flower */}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', top: -15, left: -15, zIndex: 3, height: 100, width: 100, borderRadius: "50%", background: `radial-gradient(50% 50% at 50% 50%, #9352A8 20%, rgba(223, 139, 253, 0) 100%)` }}>

                <div style={{ height: 70, width: 70, borderRadius: "50%", background: `radial-gradient(50% 50% at 40.58% 36.45%, #FFE52B 11%, #E9A50F 100%)` }}>
                    <p style={{ color: theme.palette.primary.darkViolet, textAlign: 'center', fontSize: 20, fontWeight: 700, fontFamily: 'Nunito', lineHeight: '70px' }}>
                        {Math.round(activeResults.traits['current-performance-indicator'].normalizedValue) + "%"}
                    </p>
                </div>

            </div>

            {/* Left  */}
            {getFlowerPetal(0, 'self-activation')}
            {getFlowerPetal(72, 'self-confidence')}
            {getFlowerPetal(144, 'communication-strategy')}
            {getFlowerPetal(216, 'cooperation')}
            {getFlowerPetal(288, 'regularity')}
        </Box>
    )
}