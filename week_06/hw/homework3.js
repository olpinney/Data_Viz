/* Line chart by Year */

/* D3 Line Chart */

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart1")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.json("a3cleanedonly2015.json").then(data => {
    // Always start by console.logging the data
    console.log(data);
    let timeParse = d3.timeParse("%m/%d/%Y"); // parse time to JS format so code can read it

    for (let d of data) {
        d.Date = timeParse(d.Date); // using timeParse function we created above
    }

    // Create a new object to transform data
    const years = [...new Set(data.map(x => x.Date))]
    //years = 

    let newData = []
    console.log(years)

    cum_sum=0
    for (let i=0; i<years.length; i++){ 
        var temp_dict={Date: "",Value: cum_sum};
        temp_dict.Date = years[i]
        for (let d of data) {
            if (d.Date === years[i]) {
            temp_dict.Value += 1;}
        }
        newData.push(temp_dict)
        cum_sum=temp_dict.Value
    };

    console.log(newData); // view transformed data

  newData => {
    for (let d of data) {
      createRing(d);
    }
  });
  
  function createRing({ year, values }) {
    const height = 250,
      width = 300,
      innerRadius = 40,
      outerRadius = 65,
      labelRadius = 85;
  
    const arcs = d3.pie().value(d => d.amount)(values);
  
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d, i) => d3.schemeCategory10[i])
      .attr("d", arc);
  
    svg.append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .selectAll("tspan")
      .data(d => {
        return [d.data.category, d.data.amount];
      })
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i) => `${i * 1.1}em`)
      .attr("font-weight", (d, i) => i ? null : "bold")
      .text(d => d);
  
    svg.append("text")
      .attr("font-size", 16)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(year)
      .style("font-size", 20);
  }