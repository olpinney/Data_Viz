/* Bar chart for library branch visits */

d3.csv("library_visits_jan22.csv").then(data => {
    /* Data contains three variables: 
    branch: library branch, 
    zip: zip code that the library branch is in,
    num: number of visits to the library branch 
    */

    /* Grab data */
    for (let d of data) {
        d.num = +d.num; //force a number
    };

    /* Create margins for chart*/
    const height = 600,
          width = 800,
          title_height = 40 // added in margin for a title
          margin = ({ top: 25+title_height, right: 30, bottom: 35, left: 50 }); // chart margin accomidates title

    let svg = d3.select("#chart") //important to use let because svg will be modified later
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser

    svg.append("text")
        .attr("x",width/2)
        .attr("y",title_height)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Library Branch Visits")

    /* Assign branches to x axis and visits to y axis */
    let x = d3.scaleBand()
        .domain(data.map(d => d.branch)) // data, returns array
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num)]).nice() // nice rounds the top num
        .range([height - margin.bottom, margin.top]); // subtraction needed because bars are bottom up

    /* Create Axes */
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    /* Create bars for bar chart */
    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "steelblue")
        .attr("x", d => x(d.branch)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element
        .attr("y", d => y(d.num)) // y position attribute
        .attr("height", d => y(0) - y(d.num)); // this height is the height attr on element

    /* Add text to the bars */
    
    let format = d3.format(",") // to format numbers with commas

    bar.append('text') 
        .text(d => format(d.num)) // added commas to text
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        .attr('y', d => y(d.num) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

});