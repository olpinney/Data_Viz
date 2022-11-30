// Treemap
//zoom in and zoom out dont work 
//maybe do something special for other
// how can i make gang a better size

function run_treemap(){
let height = 200,
  width = 600,
  margin = ({ top: 10, right: 30, bottom: 10, left: 10});


const svg = d3.select("#treemap")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

// d3.json('treemap-data.json').then(data => { 
d3.json('data/departments_tree.json').then(data => { 
    console.log(data)

    const treemap_dept = data => d3.treemap()
      (d3.hierarchy(data)
        .sum(d => d.value)
        );
  
    console.log(data)
    const x = d3.scaleLinear().rangeRound([margin.left, width-margin.right]);
    const y = d3.scaleLinear().rangeRound([margin.top, height-margin.bottom]);
  
    const format = d3.format(",d");
  
    //grab parent level to form tree map
    let group = svg.append("g")
      .call(render, treemap_dept(data));
  
    function render(group, node) {    
      d3.select('#breadcrumbs')
        .text(node.ancestors().reverse().map(d => d.data.name).join(" > "))
        .on('click', () => {
          if (node.parent) {
            zoomOut(node);
          }
        });
      
      const gNode = group
        .selectAll("g")
        .data(node.children)
        .join("g");
  
      //should use this clicking code elsewhere
      gNode.filter(d => d.children)
        .attr("cursor", "pointer")
        .on("click", (event, d) => zoomIn(d));
     
      gNode.append("rect")
        .attr("fill", d => d.data.color)
        .attr("stroke", "#fff")
        // .attr("opacity",0.8)

        console.log("look here")
        console.log(node.ancestors().reverse().map(d => d.data.name))
        console.log(node.ancestors().map(d=> d.value))
        console.log("look here")


      gNode.append("text")
        .append("tspan") /// THIS IS HARD TO BREAK
        .attr("x", 3)
        .attr("y", "1.1em")
        .attr("font-weight", "bold") 
        .attr('font-size',d => Math.min(8,Math.ceil(300*(+d.value)/(+d.ancestors().map(d=> d.value)[1]))))
        // .text(d => (+d.ancestors().map(d=> d.value)[1]))
        .text(d => d.data.name)
        .append("tspan")
        .attr("x", 3)
        .attr("y", "2.3em")
        .attr("font-weight", "normal")
        .text(d => format(d.value)+" officers");
  
      group.call(position);
    }
  
    function position(group) {
      group.selectAll("g")
        .attr("transform", d => `translate(${x(d.x0)},${y(d.y0)})`)
        .select("rect")
        .attr("width", d => x(d.x1) - x(d.x0))
        .attr("height", d => y(d.y1) - y(d.y0));
    }
  
    function zoomIn(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.append("g").call(render, d);
  
      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);
  
      svg.transition()
        .duration(750)
        .call(t => group0.attr("opacity", 1)
          .transition(t)
          .attr("opacity", 0.1)
          .remove()
          .call(position, d.parent))
        .call(t => group1.attr("opacity", 0)
          .transition(t)
          .attr("opacity", 1)
          .call(position, d));
    }
  
    function zoomOut(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.insert("g", "*").call(render, d.parent);
  
      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);
  
      svg.transition()
        .duration(750)
        .call(t => group0.attr("opacity", 1)
          .transition(t).remove()
          .attr("opacity", 0)
          .call(position, d))
        .call(t => group1.attr("opacity", 0.1)
          .transition(t)
          .attr("opacity", 1)
          .call(position, d.parent));
    }
  });

}
run_treemap()