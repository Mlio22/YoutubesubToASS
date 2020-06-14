function nullCheck(para, def) {
    // mencek nilai apakah null / undefined
    // kalo 0 tetap diterima

    if (para == null || para == undefined) {
        return def;
    } else {
        return para;
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
            return "DejaVu Sans Mono";
        case 5:
            return "Comic Sans MS";
        case 6:
            return "Monotype Corsiva";
        case 7:
            return "Carrois Gothic SC";
    }
}

function setColor(color = 0, maxNumber = 4) {
    // console.log(colors);
    let colorHex = "";
    for (let i = maxNumber; i >= 0; i--) {
        let number = Math.pow(16, i);

        if (color > number) {
            let result = Math.floor(color / number);
            colorHex += result.toString(16);
            color -= number * result;
        } else {
            colorHex += '0';
        }
    }

    if (colorHex.length == 5) {
        colorHex += "0";
    }

    // HEX color -> ASS color
    // HEX (ABCDEF) -> ASS (EFCDAB)


    if (colorHex.length == 6) {
        colorHex = colorHex.substring(4, 6) + colorHex.substring(2, 4) + colorHex.substring(0, 2);
    } else if (colorHex.length == 3) {
        colorHex = colorHex[2] + colorHex[1] + colorHex[0];
    }

    return `&H${colorHex.toUpperCase()}&`;
}

function convertTime(time) {
    let [jam, menit, detik] = [0, 0, 0];

    if ((time / 60000) >= 60) {
        jam = Math.floor(time / 3600000);
        time -= jam * 3600000;
    }

    if ((time / 1000) >= 60) {
        menit = Math.floor(time / 60000);
        time -= menit * 60000;
    }

    if ((time / 1000) >= 1) {
        detik = Math.floor(time / 1000);
        time -= detik * 1000;
    }

    time += "";
    if (time.length < 3) {
        time = "0" + time;
    }

    if (time.length == 3) {
        time = time.substring(0, time.length - 1)
    }

    detik += "";
    if (detik.length < 2) {
        detik = "0" + detik;
    }

    menit += "";
    if (menit.length < 2) {
        menit = "0" + menit;
    }


    return `${jam}:${menit}:${detik}.${time}`;
}

function setTime(startMs, durationMs) {
    // aegisub hanya mendukung ketelitian sampai 10ms

    let endMs = startMs + durationMs;

    return [convertTime(startMs), convertTime(endMs)];
}

function getPos(total, percentage, alignment) {

    let result = ((percentage * total) / 100);
    // console.log(result);

    return result;
}

function getPenStyles(penObj) {

    //  untested Bois
    let u = penObj.uAttr || 0; //  underline
    let s = penObj.sAttr || 0; //  striketrough
    let of = penObj.ofOffset || 2; //  Offset (subscript/superscript)
    let et = penObj.etEdgeType || 0;

    // rubyText is still unknown


    // Text Styles 
    let b = penObj.bAttr || 0;
    let i = penObj.iAttr || 0; //  tested

    // Text Properties
    let sz = penObj.szPenSize || 100;
    let fs = penObj.fsFontStyle || 4; // default : Roboto
    let fc = nullCheck(penObj.fcForeColor, 16777215); //   default youtube : 	16777215 (255,255,255)
    let fo = nullCheck(penObj.foForeAlpha, 254);
    let bc = nullCheck(penObj.bcBackColor, 526344); //  default youtube : 526344 (8, 8, 8)
    let bo = nullCheck(penObj.boBackAlpha, 191);
    let ec = nullCheck(penObj.ecEdgeColor, 0);

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
            "ec": ec,
            "et": et
        }
    }
}

function getWinStyles(wsObj) {
    //  text aligns
    let ju = wsObj.juJustifCode == null ? 2 : wsObj.juJustifCode;

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

    let ap = wpObj.apPoint == null ? 7 : wpObj.apPoint;
    let ah = wpObj.ahHorPos == null ? 50 : wpObj.ahHorPos;
    let av = wpObj.avVerPos == null ? 100 : wpObj.avVerPos;

    return {
        "ap": ap,
        "ah": ah,
        "av": av,
    }
}


function getEvents(eventObj) {
    // semua data Wajib ada!

    let t = eventObj.tStartMs;
    let d = eventObj.dDurationMs;

    let wp = eventObj.wpWinPosId;
    let ws = eventObj.wsWinStyleId;

    // kalo false berarti karaoke atau default
    let p = eventObj.pPenId || 0;

    return {
        "time": {
            "t": t,
            "d": d
        },
        "segs": eventObj.segs,
        "win": {
            "wp": wp,
            "ws": ws
        },
        "p": p
    }
}

function getAlign(number) {
    if (number < 3) {
        return number + 7;
    } else if (number < 6) {
        return number + 1;
    } else {
        return number - 5;
    }
}

function getFontSize(fs) {
    if (fs == 100) {
        return 15;
    } else if (fs < 100) {
        return (15 - Math.floor((100 - fs) / 26.5));
    } else if (fs > 100) {
        return (15 + Math.floor((fs - 100) / 26.5));
    }
}


function addTag(textObj, pens, winPos, winStyle, videoSize) {

    let startTags = "";
    let endTags = "";

    let p = pens[textObj.p];

    let wp = winPos[textObj.wp];
    let ws = winStyle[textObj.ws];

    // bagian penStyles

    if (p.styles.b) {
        startTags += "\\b1";
        endTags += "\\b0";
    }

    if (p.styles.i) {
        startTags += "\\i1";
        endTags += "\\i0";
    }

    // if (p.u) {
    //     startTags += "\\u1";
    //     endTags += "\\u0";
    // }

    if (p.properties.sz != 100) {
        p.properties.sz = p.properties.sz || 100;

        let fs = getFontSize(p.properties.sz);

        startTags += `\\fs${fs}`;
    }

    if (p.properties.fs != 4 && p.properties.fs != 0) {
        startTags += `\\fn${getFontType(p.properties.fs)}`;
    }

    if (p.properties.fc != 16777215) {
        startTags += `\\c${setColor(p.properties.fc,4)}`;
    }

    startTags += `\\1a${setColor(Math.abs(p.properties.fo - 255),1)}`;

    if (p.properties.bc != 0) {
        startTags += `\\4c${setColor(p.properties.bc,4)}`;
    }

    // console.log(p.properties.bo);

    startTags += `\\4a${setColor(Math.abs(p.properties.bo - 255),1)}`;

    // todo : cari tentang edge color
    // todo : test underine, striketrough, and offset text on youtube
    // todo : cari tentang ruby, superscript, dan subscript

    // bagian winPos
    let al = getAlign(wp.ap);
    let [posX, posY] = [getPos(videoSize[0], wp.ah, al), getPos(videoSize[1], wp.av, al)];

    startTags += `\\an${al}\\pos(${posX},${posY})`;

    // bagian winStyle
    // todo : cari tentang vertical text
    // gatau mau isi apa

    startTags = startTags === "" ? "" : `{${startTags}}`;
    endTags = endTags === "" ? "" : `{${endTags}}`;

    return `${startTags}${textObj.text}${endTags}`;
}

function writeEvents(penArray, winPosArray, winStyleArray, eventSegs, eventTime, penNumber = 0, winposNumber = 0, winStyleNumber = 0) {
    // Video size dibutuhkan untuk /pos
    const videoSize = [384, 288]; //  testing

    let [start, end] = setTime(eventTime.t, eventTime.d);
    let eventSeg = [];

    eventSegs.forEach(seg => {

        let newWord = "";
        for (let i = 0; i < seg.utf8.length; i++) {
            // console.log(seg.utf8[i].charCodeAt(0));

            if (seg.utf8[i].charCodeAt(0) == 10) {
                newWord += "\\N";
            } else {
                newWord += seg.utf8[i];
            }
        }

        // console.log(newWord);

        eventSeg.push({
            "text": newWord,
            "p": seg.pPenId || penNumber,
            "wp": winposNumber,
            "ws": winStyleNumber
        });

    });

    let taggedSeg = "";
    let style = '';
    eventSeg.forEach(segChild => {
        if (penArray.length == winPosArray.length && winPosArray.length == winPosArray.length && penArray.length == 1) {
            taggedSeg += segChild.text;
            style = "Youtube Default";
        } else {
            taggedSeg += addTag(segChild, penArray, winPosArray, winStyleArray, videoSize);
            style = "Default";
        }
    })


    let layer = 0; //  default
    let [name, marginL, marginR, marginV, effect] = ["", 0, 0, 0, ""];

    return `Dialogue: ${layer},${start},${end},${style},${name},${marginL},${marginR},${marginV},${effect},${taggedSeg}\n`

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

    let eventRaw = [];
    jsonObj.events.forEach(e => {
        eventRaw.push(getEvents(e));
    });

    // console.log(eventRaw);

    let stylesSub = `[V4+ Styles]
    Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n`;

    //  setting style default

    if (pens.length == winPositions.length && winPositions.length == winStyles.length && pens.length == 1) {
        // youtube default
        stylesSub += "Style: Youtube Default,Roboto,15,&H00FFFFFF,&H000000FF,&H3F000000,&HFF000000,0,0,0,0,100,100,1,0,3,2,0,2,10,10,10,1";
    } else {
        // styled subs
        stylesSub += "Style: Default,Roboto,15,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0.5,2,2,10,10,10,1\n";
    }

    let eventsSub = `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
    eventRaw.forEach(eventItem => {
        eventsSub += writeEvents(pens, winPositions, winStyles, eventItem.segs, eventItem.time, eventItem.p, eventItem.win.wp, eventItem.win.ws);
    });

    // console.log(stylesSub);
    // console.log(eventsSub);

    return ([stylesSub, eventsSub]);
}