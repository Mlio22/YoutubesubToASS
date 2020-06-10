function getPenStyles(penObj) {

    //  untested Bois
    let u = penObj.uAttr || 0; //  underline
    let s = penObj.sAttr || 0; //  striketrough
    let of = penObj.ofOffset || 2; //  Offset (subscript/superscript)
    // rubyText is still unknown


    // Text Styles 
    let b = penObj.bAttr || 0;
    let i = penObj.iAttr || 0; //  tested

    // Text Properties
    let sz = penObj.szPenSize || 100;
    let fs = penObj.fsFontStyle || 4;
    let fc = penObj.fcForeColor || 15790320;
    let fo = penObj.foForeAlpha || 254;
    let bc = penObj.bcBackColor || 0;
    let bo = penObj.boBackAlpha || 254;
    let et = penObj.etEdgeType || 0;

    return {
        "styles": {
            "b": b,
            "i": i,
        },
        "properties": {
            "sz": sz,
            "fs": fs,
            "fc": fc,
            "fo": fo,
            "bc": bc,
            "bo": bo,
            "et": et
        }
    }
}

function getWinStyles(wsObj) {
    //  text aligns
    let ju = wsObj.juJustifCode || 2;

    // vertical text
    let pd = wsObj.pdPrintDir || 0;
    let sd = wsObj.sdScrollDir || 0;

    return {
        "align": {
            "ju": ju
        },
        "vertical": {
            "pd": pd,
            "sd": sd
        }
    }
}

function getWinPos(wpObj) {

    let ap = wpObj.apPoint;
    let ah = wpObj.ahHorPos;
    let av = wpObj.avVerPos;

    return {
        "ap": ap,
        "ah": ah,
        "av": av
    }
}

function getEvents(eventObj) {
    // semua data Wajib ada!

    let t = eventObj.tStartMs;
    let d = eventObj.dDurationMs;

    let s = [];
    eventObj.segs.forEach(seg => {
        s.push(getSegments(seg));
    });

    let wp = eventObj.wpWinPosId;
    let ws = eventObj.wsWinStyleId;

    // kalo false berarti karaoke atau default
    let p = eventObj.pinId || false;

    return {
        "time": {
            "t": t,
            "d": d
        },
        "seg": s,
        "win": {
            "wp": wp,
            "ws": ws
        },
        "p": p
    }
}

function getSegments(wsSegment) {
    let utf8 = wsSegment.utf8;

    // kalo ada berarti karaoke
    let penId = wsSegment.pinId || false;

    return {
        "utf8": utf8,
        "pId": penId
    }
}

function getFontType(fontNumber) {
    switch (fontNumber) {
        case 0:
        case 4:
        default:
            return "Roboto";
        case 1:
            return "Courier New";
        case 2:
            return "Times New Roman";
        case 3:
            return "Deja Vu Sans Mono";
        case 5:
            return "Comic Sans MS";
        case 6:
            return "Monotype Corsiva";
        case 7:
            return "Carrois Gothic SC";
    }
}

function setColor(color = 0, opacity = 0) {
    // console.log(colors);

    colorHEX = color.toString(16).toUpperCase();
    opactityHEX = color ? opacity.toString(16).toUpperCase() : "";

    return `&H${opactityHEX}${colorHEX}`;
}

function writeStyles(name, styleItem, winPosItem) {
    // todo cari tentang styling outlineColor, secondaryColor, dll

    console.log(winPosItem);


    let fontSize = styleItem.properties.fs;

    let foreColor = styleItem.properties.fc;
    let foreOpacity = styleItem.properties.fo;
    let backColor = styleItem.properties.bc;
    let backOpacity = styleItem.properties.bo;

    let primaryColor = setColor(foreColor, foreOpacity);
    let secondaryColor = "&H000000FF"; //  default
    let outlineColor = "&H000000FF"; //  default
    let backgroundColor = setColor(backColor, backOpacity);

    let fontType = styleItem.properties.fs;
    fontType = getFontType(fontType);

    let b = styleItem.styles.b;
    let i = styleItem.styles.i;
    let u = styleItem.u || 0;
    let s = styleItem.s || 0;

    let sx = 100; //  scaleX
    let sy = 100; //  scaleY
    let sp = 0; //  Spacing
    let an = 0; //  Angle
    let bs = 0; //  BorderStyle
    let ol = 2; //  outline
    let sh = 2 //  shadow

    let al = winPosItem.ap || 7; //  alignment
    let ml = winPosItem.ah;
    let mr = winPosItem.ah;
    let mv = winPosItem.av;

    let en = 1 // encoding

    // let edgeColor = styleItem.et;
    return `Style: ${name},${fontType},${fontSize},${primaryColor},${secondaryColor},${outlineColor},${backgroundColor},${b},${i},${u},${s},${sx},${sy},${sp},${an},${bs},${ol},${sh},${al},${ml},${mr},${mv},${en}\n`;
}


// bungkus ke satu fungsi 
function convert(jsonObj) {
    let pens = [];
    jsonObj.pens.forEach(pen => {
        pens.push(getPenStyles(pen));
    });

    let winStyles = [];
    jsonObj.wsWinStyles.forEach(ws => {
        winStyles.push(getWinStyles(ws));
    });

    let winPositions = [];
    jsonObj.wpWinPositions.forEach(wp => {
        winPositions.push(getWinPos(wp));
    });

    let styles = `Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n`;

    let i = 0;
    styles += writeStyles(i, pens[1], winPositions[1]);

    console.log(styles);
}