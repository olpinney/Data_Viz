//https://observablehq.com/@ch-bu/bubble-chart-split-my-data-by-year
console.log("1")


//OP put these in here
height = 400 
width = 800, //was missing so OP added
margin = ({top: 50, right: 100, bottom: 50, left: 200})


//his definitions
splitHeight = 900
noSplitHeight = 500
innerWidth = width - margin.left - margin.right
margin = ({top: 30, right: 30, left: 120, bottom: 30})

//definitions from his code

//pullin in data
d3.csv("running_cleaned.csv").then(data => {
    console.log(data)

    
    for (let d of data) {
        d.year = +d.year,
        d.distance = +d.distance,
        d.speed = +d.speed //this is the one that isnt working 
    };

    color = d3.scaleSequential(d3.extent(data, d => d.speed), d3.interpolateOrRd);
    //yearGroups = d3.group(data, d => d.year)
    yearGroups = d3.group(data, d => Math.random() * 10) //here effect the random


    //look here to get the range of x. the scatter has correct axes
    x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.speed))
      .range([0, innerWidth])
    
    const y = d3.scaleBand().domain(yearGroups.keys()).range([noSplitHeight, 0]);

    // y = d3.scaleBand()
    //   .domain(['All'])
    //   .range([noSplitHeight, 0])
    
    r = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.distance))
      .range([1, 10])

  // charge is dependent on size of the bubble, so bigger towards the middle
  function charge(d) {
    return Math.pow(d.radius, 2.0) * 0.01
  }

    force = d3.forceSimulation(data)
        .force('charge', d3.forceManyBody().strength(-3*r(d=>d.distance)))
      .force('x', d3.forceX().x(d => x(d.speed)))
      .force('y', d3.forceY(d => y(d.year)))
      .force('collision', d3.forceCollide().radius(d => r(d.distance) + 1))
    
    groups = d3.group(data, d => d.year)
    
    xAxis = g => g
      .call(d3.axisTop(x)
              .tickFormat(d => `${d} km/h`))
      .call(g => g.select('.domain').remove())
      .call(g => g.append('text')
            .attr('x', innerWidth)
            .attr('y', 20)
            .attr('font-weight', 'bold')
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'end')
            .text('How fast I ran →'))
    
    yAxis = g => g
        .call(d3.axisLeft(y).ticks(8))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').remove())
    

console.log("2")

let svg = d3.select("#bubble")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]); // for resizing element in browser;

const wrapper = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

    
//Add x-Axis
wrapper.append('g')
    .call(xAxis);

// Add median speed
const medianLine = wrapper.append('line')
    .attr('x1', x(median))
    .attr('x2', x(median))
    .attr('y1', 10)
    .attr('y2', noSplitHeight)
    .attr('stroke', '#ccc');

// Add median text
const medianText = wrapper.append('text')
    .attr('x', x(median) + 5)
    .attr('y', 25)
    .attr('font-size', '11px')
    .text('Median speed');

// add yAxis
const yAxisContainer = wrapper.append('g')
    .attr('transform', `translate(-10,0)`);

const circles = wrapper.append('g')
    .attr('className', 'circles')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('r', d => r(d.distance))
    .attr('fill', d => color(d.speed))
    .attr('x', d => x(d.speed))
    .attr('y', d => y(d.year) + y.bandwidth() / 2)
    .attr('stroke', 'purple');

d3.timeout(() => {
    for (var i = 0, n = Math.ceil(Math.log(force.alphaMin()) / 
                                    Math.log(1 - force.alphaDecay())); i < n; ++i) {
    force.tick();
    
    circles
        .attr('x', d => d.x)
        .attr('y', d => d.y);
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

return Object.assign(svg.node(), {
    update(split) {
    let height = split ? splitHeight : noSplitHeight;
    let years = [...yearGroups.keys()].sort()
    
    // Update height of svg object
    const t = d3.transition().duration(750);
    svg.transition(t).attr('viewBox', [0, 0, width, height]);
    
    // Update domain of y-Axis
    y.domain(split ? years : ['All']);
    y.range(split ? [splitHeight - margin.top - margin.bottom, 0] : [noSplitHeight - margin.top - margin.bottom, 0]);
    yAxisContainer.call(yAxis, y, split ? years : ['All'])
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').remove());
    
    // Update simulation
    force.force('y', split ? d3.forceY(d => y(d.year) + y.bandwidth() / 2) : // If split by year align by year
                                d3.forceY((noSplitHeight - margin.top - margin.bottom) / 2)); // If not split align to middle
    //force.nodes(data);
    force.alpha(1).restart();
    
    // Update median line
    medianLine.transition(t).attr('y2', split ? splitHeight - 20 : noSplitHeight);
    }
});

});