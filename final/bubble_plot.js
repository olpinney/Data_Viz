//code from here:https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7abubbleChart

//need help with legend adding colors, fixing animation time, getting tooltip in the top right
// architecutre of the chart: structuring it so that I can refresh the data, and not lose the tooltip 

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
    const maxSize = d3.max(data, d => d.size_var);

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([-0.01, maxSize])
      .range([-0.01, height/25])//this is what is scaling it, used to be 80 *************

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
  let chart = function chart(data,size_axis_title,x_axis_title) {
//remove old nodes from last chart
    svg.selectAll('.bubble').remove()
    svg.selectAll('text').remove()
    svg.selectAll('g').remove()
    svg.selectAll('legend').remove()
    svg.selectAll('line').remove()
    svg.selectAll('circle').remove()


//"Self-Reported Uses of Force" /// maybe look here to change it 
    let x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x_var))
      .range([margin.left, width - margin.right])

    svg.append("g")
      .attr("transform", `translate(0,${+ margin.top})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x).tickFormat(d => (d)).tickSize(5))
    
    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", margin.top)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .style('font-size', d => 12)
      .text(x_axis_title);
      

    // convert raw data into nodes data
    nodes = createNodes(data);

    // bind nodes data to circle elements
    const elements = svg.selectAll('.bubble')
      .data(nodes, d => d.id)
      .enter()
      .append('g')

    bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('r', d => d.radius)
      .attr('fill', d => color(d.color_var))
      .attr('stroke', 'purple');

    // size bubbles based on area
    const maxSize = d3.max(data, d => d.size_var); //should probably set a minimum at 5
    var size_bubble = d3.scaleSqrt()
      .domain([-0.01, maxSize])  
      .range([-0.01, height/20])  // This was set earlier  in the code. Do not change
 
    // Add legend: circles
    var valuesToShow = [1, Math.round(maxSize/3), Math.round(maxSize)]
    
    var xCircle = margin.right
    var xLabel = margin.right+30
    var yCircle = margin.top

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
          .attr('y', function(d){ return yCircle + size_bubble(d) } )
          .text( function(d){ return d } )
          .style("font-size", 8)
          .attr('alignment-baseline', 'middle')
            
    svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "start")
            .attr("x", 1)
            .attr("y", margin.top)
            .attr("dx", "0.5em")
            .attr("dy", "-0.5em") 
            .style('font-size', d => 12)
            .text(size_axis_title);


    // labels for bubbles
    labels = elements
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', d => d.radius/2.5)
      .attr("font-weight",900)
      .text(d => d.last_name) //maybe scale it to be only first 8 letters 

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
    
  return chart;
}

d3.json('data/departments_officers.json').then(data_all => {
    console.log(data_all)
    //dept_cat="AIRPORT LAW ENFORCEMENT SECTION - NORTH"
    var dept_selection="DISTRICT 001" //modify this 
    var bubble_var_selection="force_count"
    var data=[]

    for (let i=0; i<data_all.length;i++) {
        if (data_all[i].unit_description==dept_selection){
            data=data_all[i].officers
            break 
        }
    }
   
    for (let d of data){
        //set the variables for the analysis
        d.size_var=+d[bubble_var_selection],
        d.x_var=+d.force_count,
        d.color_var=+d.x_var 

    }
    console.log(data)

    //color = d3.scaleSequential(d3.extent(data, d => d.color_var*1.5), d3.interpolateOrRd); // this should be bucketed
    color = d3.scaleQuantize()
        .domain(d3.extent(data, d => d.color_var))
        .range(["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d"])


    //pick chart on html
    const svg = d3.select("#scatter")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

    // new bubble chart instance 
    let myBubbleChart = bubbleChart(svg);
    myBubbleChart(data,"Complaints","Self-Reported Use of Force Incidents")

    //Listeners
    d3.select("#department")  
        .on("change", function (event) {
            dept_selection = event.target.value;
            console.log(dept_selection)

            for (let i=0; i<data_all.length;i++) {
                if (data_all[i].unit_description==dept_selection){
                    data=data_all[i].officers
                    console.log("found_data")
                    break 
                }
            }
            for (let d of data){
                d.size_var=+d[bubble_var_selection],
                d.x_var=+d.force_count,
                d.color_var=+d.x_var    
            }
            let myBubbleChart = bubbleChart(svg);
            myBubbleChart(data,"Complaints","Self-Reported Use of Force Incidents")
        });

    d3.select("#bubble_variable") //make sure it is targetting specific button 
        .on("change", function (event) {
            bubble_var_selection = event.target.value;

            for (let d of data){
                d.size_var=+d[bubble_var_selection],
                d.x_var=+d.force_count,
                d.color_var=+d.x_var    
            }

            let myBubbleChart = bubbleChart(svg);
            myBubbleChart(data,"Complaints","Self-Reported Use of Force Incidents")
        });

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");

    d3.selectAll("circle")
        .on("mouseover", function(event, d) { // this event contains the position of the cursor. this is held in event.pageY
          d3.select(this).attr('stroke', 'grey')
          tooltip
            .style("visibility", "visible")
            .html(`NAME: ${d.full_name} <br /> TENURE: ${-1 +d.years_in_2016} YEAR(S) <br /> RANK: ${d.current_rank} <br /> INCIDENTS: ${d[bubble_var_selection+'_desc']}`);
        })
        .on("mousemove", function(event) {
            tooltip
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
            // .style("top", (margin.top - 100))
            // .style("left", (event.pageX + 10) + "px");

          })
          .on("mouseout", function() {
            d3.select(this).attr("stroke", "purple");
            tooltip.style("visibility", "hidden");
          })


});
