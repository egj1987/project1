import { select } from "d3-selection";
import { json } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { line } from "d3-shape";
import { saveAs } from "file-saver"
import { drawChart } from "./modules/DrawChart"


const d3 = {
    select,
    json,
    scaleLinear,
    max,
    axisBottom,
    axisLeft,
    format,
    line
};

const url_cn = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '720'"
const url_uk = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '006'"

Promise.all([
    d3.json(url_cn),
    d3.json(url_uk)
])
.then(([data_cn, data_uk]) => {
   

    const IDsmall = "#chartsmall";
    const IDmedium = "#chartmedium";
    const IDlarge = "#chartlarge";
    const divsmall = d3.select(IDsmall)
    const divmedium = d3.select(IDmedium)
    const divlarge = d3.select(IDlarge)
    
    const variables = ["Invoerwaarde_1", "Uitvoerwaarde_2"];
    const labels = ["Import", "Export"];
    const xLabel = "Year"
    const yLabel = "Euro(Billions)"
    const country = "uk"
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const colours = ["#005EB8", "#ff7f00"]

    divsmall.html("");
    divmedium.html("");
    divlarge.html("");
    drawChart(divsmall, country + "sm", data_uk.value, variables, labels, xLabel, yLabel, "Dutch import and export in Goods - UK", margin, colours);
    drawChart(divmedium, country + "md", data_uk.value, variables, labels, xLabel, yLabel, "Dutch import and export in Goods - UK", margin, colours);
    drawChart(divlarge, country + "lg", data_uk.value, variables, labels, xLabel, yLabel, "Dutch import and export in Goods - UK", margin, colours);

    let button = document.getElementById("savesvg");
    let svgsm = document.getElementById("svguksm")
    let svgmd = document.getElementById("svgukmd")
    let svglg = document.getElementById("svguklg")

    var blobsm = new Blob([svgsm.outerHTML], { type: "image/svg+xml" });
    var blobmd = new Blob([svgmd.outerHTML], { type: "image/svg+xml" });
    var bloblg = new Blob([svglg.outerHTML], { type: "image/svg+xml" });
    button.addEventListener("click", () => {
        saveAs(blobsm, "thumbnail-sm.svg");
        saveAs(blobmd, "thumbnail-md.svg");
        saveAs(bloblg, "thumbnail-lg.svg");
    
    });
    
    

    
    (function () {
        var throttle = function (type, name, obj) {
            obj = obj || window;
            var running = false;
            var func = function () {
                if (running) { return; }
                running = true;
                requestAnimationFrame(function () {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                });
            };
            obj.addEventListener(type, func);
        };

        /* init - you can init any event */
        throttle("resize", "optimizedResize");
    })();

    // handle event
    window.addEventListener("optimizedResize", function () {
        div.html("");
        drawChart(div, "uk", data_uk.value, variables, labels, xLabel, yLabel, "Dutch import and export in Goods - UK", margin, colours);
        drawChart(div, "cn", data_cn.value, variables, labels, xLabel, yLabel, "Dutch import and export in Goods- China", margin, colours);
    });
     
    
});

