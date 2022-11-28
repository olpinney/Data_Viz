function run_matrix(){
const height = 400,
    width = 600,
    margin = ({ top: 25, right: 10, bottom: 50, left: 10 }),
    padding = 1;

let svg = d3.select("#force_off")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

//d3.json('data/total_force.json').then((data) => {      
d3.csv("covid.csv").then(data => {

        for (let d of data) {
            d.cases = +d.cases; //force a number
        };
    

    console.log("here")
    console.log(data)

    //this is the number of dots
    var dots = data["force_count"]

    let x = d3.scaleLinear()
    .domain(d3.extent([0,10])).nice()
    .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
      .domain(d3.extent([0,10])).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
      .call(d3.axisBottom(x));
  
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "steelblue")
        .attr("x", 5) // x position attribute
        .attr("width", 2) // this width is the width attr on the element
        .attr("y", 5) // y position attribute
        .attr("height", 5); // this height is the height attr on element
    
    console.log("starting")
    

});
}
run_matrix()
