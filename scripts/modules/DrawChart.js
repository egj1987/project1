import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { line } from "d3-shape";

const d3 = {
    select,
    scaleLinear,
    max,
    axisBottom,
    axisLeft,
    format,
    line
};


function drawChart(div, country, data, variables, labels, xLabel, yLabel, title, margin, colours) {
    div.append("h3")
        .text(title);
    let divWidth = parseInt(div.style("width"));
    if(divWidth > 700){
        divWidth = 700;
    } else if(divWidth < 300){
        divWidth = 300;
    }
    let ticksChange = 0;
    if(divWidth < 450){
        ticksChange = 2
    }
    
    const width = divWidth - margin.right - margin.left;
    const height = divWidth * 0.6 - margin.top - margin.bottom;
    //const width = 600 - margin.right - margin.left;
    const Year = data.map(d => d.Perioden.substring(0, 4));
    let maxValueArray = [];
    for (let i = 0; i < variables.length; i++) {
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
        .tickValues(Year.filter( (d,i) => !((Year.length - 1 - i)%ticksChange) ))
        .tickFormat(d3.format("1000"));


    const formatValue = d3.format("~s");

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => formatValue(d).replace('G', ''));;


    const svg = div
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#282C34");


    const chart = svg
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    for (let i = 0; i < variables.length; i++) {

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
            .attr("transform", "translate(" + width + "," + (yScale(data[data.length - 1][variables[i]] * 1000) - 5) + ")")
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

    chart.append("text")
        .attr("x", (width / 2))
        .attr("y", (height + margin.bottom * 0.75))
        .style("fill", "white")
        .style("font-size", fontSize)
        .style("font-family", fontFamily)
        .text(xLabel)

    chart.append("text")
        .attr("y", 0 - (margin.left * 0.65))
        .attr("x", 0 - ((height + margin.bottom + margin.top) / 2))
        .attr("transform", "rotate(-90)")
        .style("fill", "white")
        .style("font-size", fontSize)
        .style("font-family", fontFamily)
        .text(yLabel)


}

export { drawChart }