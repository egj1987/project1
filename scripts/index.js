import { select } from "d3-selection";
import { json } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { line } from "d3-shape";

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
 console.log(d3);
const url_cn = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '720'"
const url_uk = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '006'"

Promise.all([
    d3.json(url_cn),
    d3.json(url_uk)
])
.then(([data_cn, data_uk]) => {
    console.log(data_cn);

    const ID = "#chart";
    const div = d3.select(ID)
    const variables = ["Invoerwaarde_1", "Uitvoerwaarde_2"];
    const labels = ["Import", "Export"];
    const xLabel = "Year"
    const yLabel = "Euro(Billions)"
   
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const colours = ["#005EB8", "#ff7f00"]

    function drawChart(div, country, data, variables, labels, title, margin, colours) {
        div.append("h3")
            .text(title);
        const height = 400 - margin.top - margin.bottom;
        const width = 600 - margin.right - margin.left;
        const Year = data.map( d => d.Perioden.substring(0,4));
        let maxValueArray = [];
        for(let i = 0; i < variables.length; i++){
           maxValueArray[i] = d3.max(data, (d) => d[variables[i]] * 1000); 
        }
        const maxValue = d3.max(maxValueArray, (d) => d) * 1.10;
        const fontSize = "0.9rem";
        const fontFamily = "BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,'Helvetica Neue',sans-serif"
        
        const xScale = d3.scaleLinear()
            .domain([Year[0], Year[Year.length - 1]])
            .range([0, width]);
            
        const yScale = d3.scaleLinear()
            .domain([maxValue, 0])
            .range([0, height])
      

        const xAxis = d3.axisBottom(xScale)
                        .tickValues(Year)
                        .tickFormat(d3.format("1000"));


        const formatValue = d3.format("~s");

        const yAxis = d3.axisLeft(yScale)
                        .tickFormat( d => formatValue(d).replace('G', ''));;


        const svg = div
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .style("background-color", "#282C34");


        const chart = svg
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        for(let i=0; i < variables.length; i++) {

            const linedata = d3.line()
                .x((d, i) => xScale(Year[i]))
                .y(d => yScale(d[variables[i]] * 1000));


            chart.append("path")
                .data([data])
                .attr("class", "line " + country + " " + i)
                .style("stroke", colours[i])
                .style("stroke-width", "3px")
                .style("fill", "none")
                .attr("d", linedata);
            
            chart.append("text")
                .attr("transform", "translate(" + width + "," + (yScale(data[data.length - 1][variables[i]] * 1000 ) - 5) + ")")
                .style("font-size", fontSize)
                .style("font-family", fontFamily)
                .attr("text-anchor", "end")
                .style("fill", "white")
                .text(labels[i]);
        }
        

        chart.append('g')
             .attr("class", "x-axis " + country)
             .style("color", "white")
             .style("font-size", fontSize)
             .style("font-family", fontFamily)
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis);
        
        chart.append("g")
             .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom * 0.5) + ")")
             .attr("class", "x-label " + country)
             .style("text-anchor", "middle")
             .text("xLabel");
             
        
        chart.append('g')
             .attr("class", "y-axis " + country)
             .style("color", "white")
             .style("font-size", fontSize)
             .style("font-family", fontFamily)
             .call(yAxis);

 
    }
    drawChart(div, "uk", data_uk.value, variables, labels, "NL import from UK", margin, colours);
    drawChart(div, "cn", data_cn.value, variables, labels, "NL import from China", margin, colours);

     
    
});

