//got the bubble plot code from :https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7abubbleChart

//create the bubbles with animation attached
function bubbleChart(svg,height,width,margin) {

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
    const maxSize = d3.max(data, d => d.size_var);

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([-0.1, maxSize])
      .range([-0.1, height/25])

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
  let chart = function chart(data,dept_selection,bubble_var_selection,legend_id,legend_title) {

    add_circle_legend(svg,data,legend_id,legend_title,height,width,margin)

    data
    //create x axis
    let x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x_var))
      .range([margin.left, width - margin.right])
      
    // convert raw data into nodes data
    nodes = createNodes(data); //this is what needs to be updated with new data

    // bind nodes data to circle elements
    const elements = svg.selectAll('.bubble')
      .data(nodes, d => d.id)
      .enter()
      .append('g')
        .attr("id","officer-bubble")

    bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('id','the_bubble')
      .attr('r', d => d.radius)
      .attr('fill', d => color(d.color_var))
      .attr('stroke', 'grey');

    // labels for bubbles
    labels = elements
      .append('text')
      .attr('dy', '.3em' )
      .style('text-anchor', 'middle')
      .style('font-size', d => d.radius/2.5)
      .attr("font-weight",900)
      .text(d => d.last_name) //maybe scale it to be only first 8 letters 

    // simulation starts running automatically once nodes are set
    simulation.nodes(nodes)
      .on('tick', ticked)
      .restart();
  }
  // callback function called after every tick of the force simulation
  // here we do the actual repositioning of the circles based on current x and y value of their bound node data
  function ticked() {
    bubbles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y)
  }

  return chart;
}


//helper function for creating bubble legend
function add_circle_legend(svg,data,legend_id,legend_title,height,width,margin){

    // size bubbles based on area
    var maxSize = d3.max(data, d => d.size_var);
    var size_bubble = d3.scaleSqrt()
      .domain([-0.1, maxSize])  
      .range([-0.1, height/25])  // This was set earlier in the code. 
  
    var title_buffer = 2
    var valuesToShow = [1, Math.round(maxSize/3), Math.round(maxSize)]
    var xCircle = 20
    var xLabel = xCircle + 20
    var yCircle = margin.top + title_buffer
        
    svg.append("text")
      .attr("class", "title")
      .attr("text-anchor", "start")
      .attr("x", 0)
      .attr("y", margin.top + title_buffer -5)
      .style('font-size',10)
      .text(legend_title)
  
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return yCircle + size_bubble(d) } )
        .attr("r", function(d){ return size_bubble(d) })
        .style("fill", "none")
        .attr("stroke", "black")
    
    svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
          .attr('x1', function(d){ return xCircle + size_bubble(d) } )
          .attr('x2', xLabel)
          .attr('y1', function(d){ return yCircle + size_bubble(d) } )
          .attr('y2', function(d){ return yCircle + size_bubble(d) } )
          .attr('stroke', 'black')
          .style('stroke-dasharray', ('2,2'))
      
      // Add legend: bubbles
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
          .attr('x', xLabel)
          .attr('y', function(d){ return yCircle + size_bubble(d)} )
          .text( function(d){ return d } )
          .style("font-size", 8)
          .attr('alignment-baseline', 'middle')
  }

  

