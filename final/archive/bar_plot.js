const height = 400,
width = 700,
margin = ({ top: 25, right: 30, bottom: 35, left: 30 });

d3.json('data/departments_officers.json').then(data_all => {
    console.log(data_all)
    var dept_selection="DISTRICT 001" //modify this 
    var bar_var_selection="force_count_persons_with"
    // var data=[]

    // for (let i=0; i<data_all.length;i++) {
    //     if (data_all[i].unit_description==dept_selection){
    //         data=data_all[i]
    //         break 
    //     }
    // }
    data=data_all
    console.log(data)
    for (let d of data){
        //set the variables for the analysis
        d.y_var=+d[bar_var_selection]
        // d.x_var=+d.force_count,
        // d.color_var=+d.x_var 
    }
    

    //pick chart on html
    const svg = d3.select("#bar")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let x = d3.scaleBand() //these are going to be different types of bars
        .domain(data.map(d => d.unit_description)) // Use array from line 8 (data) and Gender from data
        .range([margin.left, width - margin.right]) 
        .padding(0.1);
    
    let y = d3.scaleLinear() //totals go here
        .domain([0, d3.max(data, d => d.y_var)]).nice() // uses data as data and Totals from data
        .range([height - margin.bottom, margin.top]); 
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data) // Update data to data
        .join("g")
        .attr("class", "bar");

    bar.append("rect") 
        .attr("fill", "steelblue")
        .attr("x", d => x(d.unit_description)) // Gender
        .attr("width", x.bandwidth()) 
        .attr("y", d => y(d.y_var)) // Totals
        .attr("height", d => y(0) - y(d.y_var)); // Totals
    
    bar.append('text') 
        .text(d => d.y_var) // Totals
        .attr('x', d => x(d.unit_description) + (x.bandwidth()/2)) // Gender
        .attr('y', d => y(d.y_var) - 5) // Totals
        .attr('text-anchor', 'middle')
        .style('fill', 'black');

});
