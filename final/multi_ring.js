/* D3 Pie Chart */

d3.json("data/percent_cat.json").then(data => {
  console.log(data)
  var dept_selection = "ALL"

  for (let d of data[dept_selection]) {
    console.log(d)
    createRing(d)
  }
});

function createRing({ name, Values, denom}) {
  const height = 200,
    width = 300,
    innerRadius = 40,
    outerRadius = 65,
    labelRadius = 85;

  const arcs = d3.pie().value(d => d.Totals).sort(null)(Values);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  const arcColor = d3.pie().value(d => d.Color)(Values);

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

  svg.append("text")
    .text(name)
    .attr("font-size", 18)
    .attr("font-weight", "bold")
    .attr("x", 0)
    .attr("text-anchor", "middle")
    .attr("y", -outerRadius-10)

  svg.append("text")
    .attr("font-size", 18)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text(d3.format(".0%")(Values[0].Totals/denom))

}

 