/* D3 Pie Chart */
// how do i put the title on the top, not the middle 
// how do i make yes and no constant colors
// how do I prevent from sorting 

d3.json("data/percent_cat.json").then(data => {
// d3.json("a3cleanedonly2015.json").then(data => {
  console.log(data)
  var dept_selection = "ALL"

  for (let d of data[dept_selection]) {
    console.log(d)
    createRing(d);
  }
  d3.select("#department_category")  
      .on("change", function (event) {
          dept_selection = event.target.value;
          //update will go here
      });

});

function createRing({ name, Values, denom}) {
  const height = 200,
    width = 300,
    innerRadius = 40,
    outerRadius = 65,
    labelRadius = 85;

  const arcs = d3.pie().value(d => d.Totals)(Values);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcColor = d3.pie().value(d => d.Color)(Values);

  console.log("here are the arcs")
  console.log(arcs)

  const svg = d3.select("#pie_chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  colors=["#a63603","#D3D3D3","#e6550d","#fd8d3c","#fdae6b","#fdd0a2","#feedde"]

  svg.append("g")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("fill", (d) => colors[+d.data.Color])
    .attr("d", arc);

  // svg.append("g")
  //   .attr("font-size", 10)
  //   .attr("text-anchor", "middle")
  //   .selectAll("text")
  //   .data(arcs)
  //   .join("text")
  //   .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
  //   .selectAll("tspan")
  //   .data(d => {
  //     return [d.data.Answer, d3.format(".0%")(d.data.Totals / denom)];
  //   })
  //   .join("tspan")
  //   .attr("x", 0)
  //   .attr("y", (d, i) => `${i * 1.1}em`)
  //   .attr("font-weight", (d, i) => i ? null : "bold")
  //   .text(d => d);

  svg.append("text")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "text-after-edge")
    .text(name)
    .style("font-size", 18);

  svg.append("text")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text(d3.format(".0%")(Values[0].Totals/denom))
    .style("font-size", 18);

}

 