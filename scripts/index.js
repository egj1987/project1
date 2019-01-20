import { select } from "d3-selection";
import { json } from "d3-fetch";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { axisBottom } from "d3-axis";
import { format } from "d3-format";

const d3 = {
    select,
    json,
    scaleLinear,
    max,
    axisBottom,
    scaleBand,
    format
};
 console.log(d3);
const url_cn = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '720'"
const url_uk = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '006'"

Promise.all([
    d3.json(url_cn),
    d3.json(url_uk)
])
.then(([data_cn, data_uk]) => {
    console.log(d3.select("#chart"));
    const ID = "#chart";
    const div = d3.select(ID)
    const variables = ["Invoerwaarde_1", "Uitvoerwaarde_2"];
    console.log(data_cn)
    console.log(data_uk);
    function drawChart(div, country, data, variables, title) {
        const margin = { top: 10, right: 20, bottom: 30, left: 30 };
        const height = 400 - margin.top - margin.bottom;
        const width = 600 - margin.right - margin.left;

        const Year = data.map( d => d.Perioden.substring(0,4));
        const xScale = d3.scaleLinear()
            .domain([Year[0], Year[Year.length - 1]])
            .range([0, width]);
            

        const maxValue = d3.max(data, (d) => d[variables[0]]) * 1.15;

        const xAxis = d3.axisBottom(xScale)
                        .tickValues(Year)
                        .tickFormat(d3.format("1000"))

        const yScale = d3.scaleLinear()
            .range([0, width])
            .domain([maxValue, 0])
        
        const svg = div
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .style("background-color", "#282C34");


        const chart = svg
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        chart.append('g')
             .attr("class", "x-axis " + country)
             .style("color", "white")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis);
        
 
    }
    drawChart(div, "uk", data_uk.value, variables, "NL import from UK");

     
    
 console.log([data_cn, data_uk.value]);
});

