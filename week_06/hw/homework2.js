/* Bar chart totals by gender */

d3.json("a3cleanedonly2015.json").then(data => {
    // Always start by console.logging the data
    console.log(data);

    // Create a new object to transform data

    const races = [...new Set(data.map(x => x.Race))]
    let newData = []

    for (let i=0; i<races.length; i++){ 
        var temp_dict={Race: "",Totals: 0};
        if (races[i] == ""){
            temp_dict.Race = "Unknown"}
        else {
            temp_dict.Race = races[i]}
        for (let d of data) {
            if (d.Race === races[i]) {
            temp_dict.Totals += 1;}
        }
        newData.push(temp_dict)
    };

    console.log(newData); // view transformed data

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 })
          padding = 1;

    let svg = d3.select("#chart2")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); 
    
    let x = d3.scaleBand()
        .domain(newData.map(d => d.Race)) // Use array from line 8 (newData) and Gender from newData
        .range([margin.left, width - margin.right]) 
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(newData, d => d.Totals)]).nice() // uses newData as data and Totals from newData
        .range([height - margin.bottom, margin.top]); 
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(newData) // Update data to newData
        .join("g")
        .attr("class", "bar");

    bar.append("rect") 
        .attr("fill", "steelblue")
        .attr("x", d => x(d.Race)) // Gender
        .attr("width", x.bandwidth()) 
        .attr("y", d => y(d.Totals)) // Totals
        .attr("height", d => y(0) - y(d.Totals)); // Totals
    
    bar.append('text') 
        .text(d => d.Totals) // Totals
        .attr('x', d => x(d.Race) + (x.bandwidth()/2)) // Gender
        .attr('y', d => y(d.Totals) - 5) // Totals
        .attr('text-anchor', 'middle')
        .style('fill', 'black');
    
});