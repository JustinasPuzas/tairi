"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processHEX(val) {
    //does the hex contain extra char?
    var hex = (val.length > 6) ? val.substr(1, val.length - 1) : val;
    // is it a six character hex?
    if (hex.length > 3) {
        //scrape out the numerics
        var r = hex.substr(0, 2);
        var g = hex.substr(2, 2);
        var b = hex.substr(4, 2);
        // if not six character hex,
        // then work as if its a three character hex
    }
    else {
        // just concat the pieces with themselves
        var r = hex.substr(0, 1) + hex.substr(0, 1);
        var g = hex.substr(1, 1) + hex.substr(1, 1);
        var b = hex.substr(2, 1) + hex.substr(2, 1);
    }
    // return our clean values
    return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16)
    ];
}
function* ColorGradient(startColor, endColor, steps) {
    //attach start value
    var val1RGB = processHEX(startColor);
    var val2RGB = processHEX(endColor);
    //the number of steps in the gradient
    //the percentage representation of the step
    var stepsPercent = 100 / (steps + 1);
    // diffs between two values 
    var valClampRGB = [
        val2RGB[0] - val1RGB[0],
        val2RGB[1] - val1RGB[1],
        val2RGB[2] - val1RGB[2]
    ];
    // build the color array out with color steps
    for (let i = 0; i < steps; i++) {
        let clampedR = (valClampRGB[0] > 0)
            ? (Math.round(valClampRGB[0] / 100 * (stepsPercent * (i + 1)))).toString(16).padEnd(2, '0')
            : (Math.round((val1RGB[0] + (valClampRGB[0]) / 100 * (stepsPercent * (i + 1))))).toString(16).padEnd(2, '0');
        let clampedG = (valClampRGB[1] > 0)
            ? (Math.round(valClampRGB[1] / 100 * (stepsPercent * (i + 1)))).toString(16).padEnd(2, '0')
            : (Math.round((val1RGB[1] + (valClampRGB[1]) / 100 * (stepsPercent * (i + 1))))).toString(16).padEnd(2, '0');
        let clampedB = (valClampRGB[2] > 0)
            ? (Math.round(valClampRGB[2] / 100 * (stepsPercent * (i + 1)))).toString(16).padEnd(2, '0')
            : (Math.round((val1RGB[2] + (valClampRGB[2]) / 100 * (stepsPercent * (i + 1))))).toString(16).padEnd(2, '0');
        yield ['#', clampedR, clampedG, clampedB].join('');
    }
}
exports.default = ColorGradient;
