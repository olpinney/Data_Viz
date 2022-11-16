//code from here:https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7a
const height = 400,
width = 700,
margin = ({ top: 25, right: 30, bottom: 35, left: 150 });

function bubbleChart(svg) {

  // location to centre the bubbles
  const centre = { x: width/2, y: height/2 };

  // these will be set in createNodes and chart functions
  let bubbles = null;
  let labels = null;
  let nodes = [];

  // create a force simulation and add forces to it
  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-0.1))
    .force('x', d3.forceX().strength(0.3).x(d=>d.x))
    .force('y', d3.forceY().strength(0.09).y(centre.y)) 
    .force('collision', d3.forceCollide().radius(d => d.radius + 1));

  // force simulation starts up automatically, which we don't want as there aren't any nodes yet
  simulation.stop();

  // function returns the new node array, with a node for each element in the data input
  function createNodes(data) {
    // use max size in the data as the max in the scale's domain
    const maxSize = d3.max(data, d => d.civ_complaint_count);

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([0, 20])//this is what is scaling it, used to be 80 *************

    let x_bubble = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x_var))
      .range([margin.left, width - margin.right])

    // use map() to convert raw data into node data
    const myNodes = data.map(d => ({
      ...d,
      radius: radiusScale(d.size_var),
      size: d.size_var,
      x: x_bubble(d.x_var), 
      y: (Math.random()-.5) * height/2 + height/2 //need this to not mess up the x axis too much. started at 800 ******
    }))
    return myNodes;
  }

  // prepares data for visualisation and adds an svg element to the provided selector and starts the visualisation process
  let chart = function chart(data) {

    let x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x_var)).nice()
      .range([margin.left, width - margin.right])

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x).tickFormat(d => (d) + " unit").tickSize(5))

    // convert raw data into nodes data
    nodes = createNodes(data);

    // bind nodes data to circle elements
    const elements = svg.selectAll('.bubble')
      .data(nodes, d => d.id)
      .enter()
      .append('g')

    color = d3.scaleSequential(d3.extent(data, d => d.color_var), d3.interpolateOrRd);

    bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('r', d => d.radius)
      .attr('fill', d => color(d.color_var))
      .attr('stroke', 'purple');


    // labels
    labels = elements
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', 10)
      .text(d => d.id)

    //******Don't know exactly how this part works************
    
    // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set
    simulation.nodes(nodes)
      .on('tick', ticked)
      .restart();
      //this is where I would control the timing  
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

// //old stuff from penguins
// why isnt this showing up ****************************

  //   //go to div body tag and append a new div
  //   //for this div, add a svg tooltip class!!
  // const tooltip = d3.select("body").append("div")
  //   .attr("class", "svg-tooltip")
  //   .style("position", "absolute")
  //   .style("visibility", "hidden"); //there are two styles to switch between with mouse over

  //   //event listener. wait until someone mouses over, and pass in this function
  // d3.selectAll("circle")
  //   .on("mouseover", function(event, d) { // this event contains the position of the cursor. this is held in event.pageY
  //     d3.select(this).attr("fill", "red");
  //     tooltip
  //       .style("visibility", "visible")
  //       .html(`Species: ${d.speed}<br />Island: ${d.speed}<br />Weight: ${d.speed/1000}kg`);
  //   })
  //   .on("mousemove", function(event) {
  //     tooltip
  //       .style("top", (event.pageY - 10) + "px")
  //       .style("left", (event.pageX + 10) + "px");
  //   })

  //   //when the mouse goes off the circle, we
  //   .on("mouseout", function() {
  //     d3.select(this).attr("fill", "black"); 
  //     tooltip.style("visibility", "hidden");
  //   })
    

    
  return chart;
}

d3.json('data/departments_officers.json').then(data_all => {
    console.log(data_all)
    //dept_cat="AIRPORT LAW ENFORCEMENT SECTION - NORTH"
    dept_cat="DISTRICT 003"

    data=[]
    for (let i=0; i<data_all.length;i++) {i
        if (data_all[i].unit_description==dept_cat){
            data=data_all[i].officers_2017
            break 
        }
    }
    console.log(data)
   
    //do per year, and do across carear 
    for (let d of data){
        d.dept_complaint_cleaned_count=+d.dept_complaint_cleaned_count, 
        d.civ_complaint_count=+d.civ_complaint_count,
        d.civ_complaint_force=+d.civ_complaint_force, 
        d.civ_complaint_detain=+d.civ_complaint_detain, 
        d.civ_complaint_hate=+d.civ_complaint_hate,
        d.civ_complaint_crime=+d.civ_complaint_crime, 
        d.force_count=+d.force_count,
        d.weapon_count=+d.weapon_count,
        //set the variables for the analysis
        d.size_var=d.civ_complaint_count,
        d.x_var=d.weapon_count,
        d.color_var=d.weapon_count

    }
    console.log(data)

    //d.force_count, d.civ_complaint_count

    // //pick chart on html
    const svg = d3.select("#scatter")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

// new bubble chart instance
    let myBubbleChart = bubbleChart(svg);
    myBubbleChart(data)
  
});
