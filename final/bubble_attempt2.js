//https://observablehq.com/d/880a53d2f9888395
console.log("1")

height = 400 // initial height
margin = ({top: 50, right: 100, bottom: 50, left: 200})

data = d3.json("data2.json").then(data => data.map((d, i) => ({id: i + 1, ...d}))) // why isnt this working?

console.log(data)

continents = [...new Set(data.map(d => d.continent))]

x = d3.scaleLinear()
  .domain(d3.extent(data, d => d.year))
  .range([margin.left, width - margin.right])

y = d3.scaleBand()
  .domain(continents)
  .range([height / 2, height / 2])

xAxis = g =>
  g
    .attr("transform", `translate(0, ${margin.top})`)
    .call(d3.axisTop(x).ticks(10))
    .call(g => g.select(".domain").remove())
    .call(g =>
      g
        .append("text")
        .attr("x", width - margin.right)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Years →")
    )

yAxis = (g, scale = y, ticks = y.domain()) =>
    g
      .attr("transform", `translate(${30}, 0)`)
      .call(d3.axisLeft(scale).tickValues(ticks))
      .call(g => g.style("text-anchor", "start"))
      .call(g => g.select(".domain").remove())

r = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.emission))
      .range([6, 20])


colour = d3.scaleSequential(d3.extent(data, d => d.year), d3.interpolatePlasma)