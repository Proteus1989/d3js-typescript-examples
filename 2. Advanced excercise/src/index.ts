//https://www.elmundo.es/ciencia-y-salud/salud/2020/03/20/5e74b922fc6c839d588b45db.html

import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities, LongLatCommunity } from "./communities";
import { stats, stats21032020, ResultEntry } from "./stats";
import { mapping } from "./mapping";

const maxAffected = (data) => data.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const affectedRadiusScale = (data) => d3
  .scaleLinear()
  .domain([0, maxAffected(data)])
  .range([5, 30]); // 30 pixel max radius, we could calculate it relative to width and height


const calculateRadiusBasedOnAffectedCases = (comunidad: string, data: ResultEntry[]) => {
  const entry = data.find(item => item.name === comunidad);

  return entry ? affectedRadiusScale(data)(entry.value) : 0;
};

const mapCommunity = (community) => {
  return mapping[community];
}

const colorScale = (data) => d3
  .scaleLinear()
  .domain([0, maxAffected(data)])
  .range([10, 90]); // lightness percentage

const getColor = (comunidad: string, data: ResultEntry[]) => {
  const entry = data.find(item => item.name === comunidad);
  return entry ? 100 - parseInt(<any>colorScale(data)(entry.value)) : 100;
};

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

const getColorByFeatureCommunity = (d, data) => {
  const color = getColor(mapCommunity(d["properties"]["NAME_1"]), data);
  return `hsla(360,90%,${color}%,1)`;
};

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any)
  .attr("fill", (d) => getColorByFeatureCommunity(d, stats));

const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const mouseOver = (d, data) => {
  div
    .transition()
    .duration(200)
    .style("opacity", 0.9);

  const infectados = data.find(entry => entry.name === d.name).value
  const tooltipContent = `<span>${d.name} : ${infectados}</span>`;

  div
    .html(tooltipContent)
    .style("left", `${d3.event.pageX}px`)
    .style("top", `${d3.event.pageY - 28}px`);
}

const mouseOut = () => {
  div
    .transition()
    .duration(500)
    .style("opacity", 0);
}

svg
  .selectAll("circle")
  .data<LongLatCommunity>(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "affected-marker")
  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, stats))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1])
  .on("mouseover", function(d) {
    mouseOver(d, stats);
  })
  .on("mouseout", function(d, i) {
    mouseOut();
  });


// Update buttons

const updateChart = (data) => {
  svg
    .selectAll<HTMLDivElement, LongLatCommunity>("circle")
    .on("mouseover", function(d) {
      mouseOver(d, data);
    })
    .on("mouseout", function(d, i) {
      mouseOut();
    })
    .transition().duration(500)
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data))
    ;

  svg
    .selectAll("path")
    .transition().duration(500)
    .attr("fill", (d) => getColorByFeatureCommunity(d, data));
};

document
  .getElementById("old")
  .addEventListener("click", function handleResultsApril() {
    updateChart(stats);
  });

document
  .getElementById("new")
  .addEventListener("click", function handleResultsNovember() {
    updateChart(stats21032020);
  });
