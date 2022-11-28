let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
//his definitions
splitHeight = 900 // get rid of the split versions
noSplitHeight = 500
innerWidth = width - margin.left - margin.right

//pick chart on html
const svg = d3.select("#scatter")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

    // body mass x by flipper length y 
d3.csv('running.csv').then(data => {
  
    for (let d of data) {
        d.year = +d.year,
        d.distance = +d.distance,
//        speed = +d['average_speed'] // I dont understand this line
        d.speed= +d.speed
    }

    //his definitions
    color = d3.scaleSequential(d3.extent(data, d => d.speed), d3.interpolateOrRd);

    // creating the x scale: domain is the data. range is the space it takes
  let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.speed)).nice()
    .range([margin.left, width - margin.right]);

    // extent returns values
  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.distance)).nice()
    .range([height - margin.bottom, margin.top]);
//for removing the height axis
    // .domain(['All'])
    // .range([noSplitHeight, 0])

//for adding radius size 
let r = d3.scaleSqrt()
    .domain(d3.extent(data, d => d.distance))
    .range([1, 10])

// for adding point distribution
force = d3.forceSimulation(data)
    .force('charge', d3.forceManyBody().strength(0))
    .force('x', d3.forceX().x(d => x(d.speed)))
    .force('y', d3.forceY(d => y(d.year)))  
    .force('collision', d3.forceCollide().radius(d => r(d.distance) + 1))


    //create x and y axes. 
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickFormat(d => (d/1000) + "kg").tickSize(-height + margin.top + margin.bottom))
//this tick format can be used for data and year, etc. 
// tick size can be changed - tick size of 0 will get rid of them all together

//will need to redo y axis - this is the old code
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

    
    //select all circles before we put them on the page, then joining the data, then putting them on the page
  svg.append("g")
    .attr("fill", "black")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.speed)) // how we position circles
    .attr("cy", d => y(0+0)) // need to update this to be like line below
    //.attr('y', d => y(d.year) + y.bandwidth() / 2)

    .attr("r", d => r(d.distance))
    .attr('fill', d => color(d.speed))
    .attr('stroke', 'purple')
    .attr("opacity", 0.75); // likes to have some opacity


    force.on('tick', () => {
        circles
        .transition()
        .ease(d3.easeLinear)
        // .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    })

    d3.timeout(() => {
        for (var i = 0, n = Math.ceil(Math.log(force.alphaMin()) / 
                                        Math.log(1 - force.alphaDecay())); i < n; ++i) {
        force.tick();
        
        circles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        }
    })
    
    force.on('tick', () => {
        circles
        .transition()
        .ease(d3.easeLinear)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    })

    invalidation.then(() => force.stop());

    


    // let split = False
    // force.force('y', split ? d3.forceY(d => y(d.year) + y.bandwidth() / 2) : // If split by year align by year
    // d3.forceY((noSplitHeight - margin.top - margin.bottom) / 2)); // If not split align to middle
    // //force.nodes(data);
    // force.alpha(1).restart();


    //go to div body tag and append a new div
    //for this div, add a svg tooltip class!!
  const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden"); //there are two styles to switch between with mouse over

    //event listener. wait until someone mouses over, and pass in this function
  d3.selectAll("circle")
    .on("mouseover", function(event, d) { // this event contains the position of the cursor. this is held in event.pageY
      d3.select(this).attr("fill", "red");
      tooltip
        .style("visibility", "visible")
        .html(`Species: ${d.species}<br />Island: ${d.island}<br />Weight: ${d.speed/1000}kg`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })

    //when the mouse goes off the circle, we
    .on("mouseout", function() {
      d3.select(this).attr("fill", "black"); 
      tooltip.style("visibility", "hidden");
    })
    
    // to make a nice tooltip, we will need .svg-tooltip 
    // we connected it in javascript, but the actual tooltip is in a css file

    
});