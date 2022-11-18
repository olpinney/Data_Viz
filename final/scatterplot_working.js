
function bubbleChart() {
  let height = 900,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });

  // location to centre the bubbles
  const centre = { x: width/2, y: height/2 };

  // strength to apply to the position forces
  const forceStrength = 0.03;

  // these will be set in createNodes and chart functions
  let svg = null;
  let bubbles = null;
  let labels = null;
  let nodes = [];

  // charge is dependent on size of the bubble, so bigger towards the middle
  function charge(d) {
    return Math.pow(d.radius, 2.0) * 0.01
  }

  // create a force simulation and add forces to it
  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(charge))
    .force('center', d3.forceCenter(centre.x, centre.y))
    .force('x', d3.forceX().strength(forceStrength).x(centre.x))
    .force('y', d3.forceY().strength(forceStrength).y(centre.y)) // will remove this eventually
    .force('collision', d3.forceCollide().radius(d => d.radius + 1));

  // force simulation starts up automatically, which we don't want as there aren't any nodes yet
  simulation.stop();

  // data manipulation function takes raw data from csv and converts it into an array of node objects
  // each node will store data and visualisation values to draw a bubble
  // data is expected to be an array of data objects, read in d3.csv
  // function returns the new node array, with a node for each element in the data input
  function createNodes(data) {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    const maxSize = d3.max(data, d => +d.distance);

    console.log("in create node")
    console.log(data)
    console.log(maxSize)
    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([0, 8])//this is what is scaling it, used to be 80

    // use map() to convert raw data into node data
    const myNodes = data.map(d => ({
      ...d,
      radius: radiusScale(+d.distance),
      size: +d.distance,
      x: Math.random() * 900,
      y: Math.random() * 800
    }))

    return myNodes;
  }

  // main entry point to bubble chart, returned by parent closure
  // prepares data for visualisation and adds an svg element to the provided selector and starts the visualisation process
  let chart = function chart(selector, data) {
    // convert raw data into nodes data
    nodes = createNodes(data);

    // create svg element inside provided selector
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    // bind nodes data to circle elements
    const elements = svg.selectAll('.bubble')
      .data(nodes, d => d.id)
      .enter()
      .append('g')

    color = d3.scaleSequential(d3.extent(data, d => d.speed), d3.interpolateOrRd);

    bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('r', d => d.radius)
      .attr('fill', d => color(d.speed))

    // labels
    labels = elements
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', 10)
      .text(d => d.id)

    // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set
    simulation.nodes(nodes)
      .on('tick', ticked)
      .restart();
  }

  // callback function called after every tick of the force simulation
  // here we do the actual repositioning of the circles based on current x and y value of their bound node data
  // x and y values are modified by the force simulation
  function ticked() {
    bubbles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y)
  }

  // return chart function from closure
  return chart;
}



d3.csv('running_cleaned.csv').then(data => {
  
      for (let d of data) {
          d.year = +d.year,
          d.distance = +d.distance,
          d.speed= +d.speed
      }

      console.log(data)
      // new bubble chart instance
      let myBubbleChart = bubbleChart();

      myBubbleChart('#scatter', data)

});

console.log(1)





// // //his definitions
// // splitHeight = 900 // get rid of the split versions
// // noSplitHeight = 500
// // innerWidth = width - margin.left - margin.right

// //new force definitions
// const centre = { x: width/2, y: height/2 };
// const forceStrength = 0.03;
// let bubbles = null;
// let labels = null;
// let nodes = [];

// // charge is dependent on size of the bubble, so bigger towards the middle
// function charge(d) {
//   return Math.pow(d.radius, 2.0) * 0.01
// }

// // create a force simulation and add forces to it
// const simulation = d3.forceSimulation()
//   .force('charge', d3.forceManyBody().strength(charge))
//   // .force('center', d3.forceCenter(centre.x, centre.y))
//   .force('x', d3.forceX().strength(forceStrength).x(centre.x))
//   .force('y', d3.forceY().strength(forceStrength).y(centre.y))
//   .force('collision', d3.forceCollide().radius(d => d.radius + 1));

// // force simulation starts up automatically, which we don't want as there aren't any nodes yet
// simulation.stop();

// // set up colour scale
// // const fillColour = d3.scaleOrdinal()
// // .domain(["1", "2", "3", "5", "99"])
// // .range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);

//   // data manipulation function takes raw data from csv and converts it into an array of node objects
//   // each node will store data and visualisation values to draw a bubble
//   // data is expected to be an array of data objects, read in d3.csv
//   // function returns the new node array, with a node for each element in the data input
//   function createNodes(data) {
//     // use max size in the data as the max in the scale's domain
//     // note we have to ensure that size is a number
//     const maxSize = d3.max(data, d => +d.size);

//     // size bubbles based on area
//     const radiusScale = d3.scaleSqrt()
//       .domain([0, maxSize])
//       .range([0, 80])

//     // use map() to convert raw data into node data
//     const myNodes = data.map(d => ({
//       ...d,
//       radius: radiusScale(+d.size),
//       size: +d.size,
//       x: Math.random() * 900,
//       y: Math.random() * 800
//     }))

//     return myNodes;
//   }


// //pick chart on html
// const svg = d3.select("#scatter")
//     .append("svg")
//     .attr("viewBox", [0, 0, width, height]);

//     // body mass x by flipper length y 
// d3.csv('running.csv').then(data => {
  
//     for (let d of data) {
//         d.year = +d.year,
//         d.distance = +d.distance,
// //        speed = +d['average_speed'] // I dont understand this line
//         d.speed= +d.speed
//     }

//     //his definitions
//     color = d3.scaleSequential(d3.extent(data, d => d.speed), d3.interpolateOrRd);

//     // creating the x scale: domain is the data. range is the space it takes
//   let x = d3.scaleLinear()
//     .domain(d3.extent(data, d => d.speed)).nice()
//     .range([margin.left, width - margin.right]);

//     // extent returns values
//   let y = d3.scaleLinear()
//     .domain(d3.extent(data, d => d.distance)).nice()
//     .range([height - margin.bottom, margin.top]);
// //for removing the height axis
//     // .domain(['All'])
//     // .range([noSplitHeight, 0])

// //for adding radius size 
// let r = d3.scaleSqrt()
//     .domain(d3.extent(data, d => d.distance))
//     .range([1, 10])

// // // for adding point distribution
// // force = d3.forceSimulation(data)
// //     .force('charge', d3.forceManyBody().strength(0))
// //     .force('x', d3.forceX().x(d => x(d.speed)))
// //     .force('y', d3.forceY(d => y(d.year)))  
// //     .force('collision', d3.forceCollide().radius(d => r(d.distance) + 1))

//     //create x and y axes. 
//   svg.append("g")
//     .attr("transform", `translate(0,${height - margin.bottom})`)
//     .attr("class", "x-axis")
//     .call(d3.axisBottom(x).tickFormat(d => (d/1000) + "kg").tickSize(-height + margin.top + margin.bottom))
// //this tick format can be used for data and year, etc. 
// // tick size can be changed - tick size of 0 will get rid of them all together

// //will need to redo y axis - this is the old code
//   svg.append("g")
//     .attr("transform", `translate(${margin.left},0)`)
//     .attr("class", "y-axis")
//     .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

    
//     //select all circles before we put them on the page, then joining the data, then putting them on the page
//   svg.append("g")
//     .attr("fill", "black")
//     .selectAll("circle")
//     .data(data)
//     .join("circle")
//     .attr("cx", d => x(d.speed)) // how we position circles
//     .attr("cy", d => y(0+0)) // need to update this to be like line below
//     //.attr('y', d => y(d.year) + y.bandwidth() / 2)
//     .attr("r", d => r(d.distance))
//     .attr('fill', d => color(d.speed))
//     .attr('stroke', 'purple')
//     .attr("opacity", 0.75); // likes to have some opacity


//     // force.on('tick', () => {
//     //     circles
//     //     .transition()
//     //     .ease(d3.easeLinear)
//     //     .attr('cx', d => d.x)
//     //     .attr('cy', d => d.y);
//     // })

//     // d3.timeout(() => {
//     //     for (var i = 0, n = Math.ceil(Math.log(force.alphaMin()) / 
//     //                                     Math.log(1 - force.alphaDecay())); i < n; ++i) {
//     //     force.tick();
        
//     //     circles
//     //         .attr('cx', d => d.x)
//     //         .attr('cy', d => d.y);
//     //     }
//     // })
    
//     // invalidation.then(() => force.stop());

//     // let split = False
//     // force.force('y', split ? d3.forceY(d => y(d.year) + y.bandwidth() / 2) : // If split by year align by year
//     // d3.forceY((noSplitHeight - margin.top - margin.bottom) / 2)); // If not split align to middle
//     // //force.nodes(data);
//     // force.alpha(1).restart();



//     //old stuff from penguins

//     //go to div body tag and append a new div
//     //for this div, add a svg tooltip class!!
//   const tooltip = d3.select("body").append("div")
//     .attr("class", "svg-tooltip")
//     .style("position", "absolute")
//     .style("visibility", "hidden"); //there are two styles to switch between with mouse over

//     //event listener. wait until someone mouses over, and pass in this function
//   d3.selectAll("circle")
//     .on("mouseover", function(event, d) { // this event contains the position of the cursor. this is held in event.pageY
//       d3.select(this).attr("fill", "red");
//       tooltip
//         .style("visibility", "visible")
//         .html(`Species: ${d.species}<br />Island: ${d.island}<br />Weight: ${d.speed/1000}kg`);
//     })
//     .on("mousemove", function(event) {
//       tooltip
//         .style("top", (event.pageY - 10) + "px")
//         .style("left", (event.pageX + 10) + "px");
//     })

//     //when the mouse goes off the circle, we
//     .on("mouseout", function() {
//       d3.select(this).attr("fill", "black"); 
//       tooltip.style("visibility", "hidden");
//     })
    
//     // to make a nice tooltip, we will need .svg-tooltip 
//     // we connected it in javascript, but the actual tooltip is in a css file

    
// });