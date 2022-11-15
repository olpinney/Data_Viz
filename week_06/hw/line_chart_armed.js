/* Line chart by Year */
/* D3 Line Chart */


const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#line_chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.json("a3cleanedonly2015.json").then(data => {
    // Always start by console.logging the data
    console.log(data);
    let timeParse = d3.timeParse("%m/%d/%Y"); // parse time to JS format so code can read it

    for (let d of data) {
        d.Date = timeParse(d.Date); // using timeParse function we created above
    }

    //Create list of distinct variables
    var years = [...new Set(data.map(x => x.Date))]
    years = Array.from(years)
    years = years.sort((a,b)=>a-b)
    const armed = [...new Set(data.map(x => x.Armed))] // was used to identify the below categories
    const armed_cats_map = {'':'Unknown', 'Knife':'Armed', 'Gun':'Armed', 'Unknown Weapon':'Armed', 'Hammer':'Armed', 'Unarmed':'Unarmed', 'Vehicle':'Vehicle', 'Toy Weapon':'Armed', 'Machete':'Armed', 'Sword':'Armed', 'Chain':'Armed', 'Guns And Explosives':'Gun', 'Nail Gun':'Armed', "Contractor'S Level":'Armed', 'Metal Pipe':'Armed', 'Metal Object':'Armed', 'Metal Stick':'Armed', 'Blunt Object':'Armed', 'Hatchet':'Armed', 'Box Cutter':'Armed', 'Cordless Drill':'Armed', 'Metal Pole':'Armed', 'Crossbow':'Armed', 'Screwdriver':'Armed', 'Tasered':'Armed', 'Straight Edge Razor':'Armed', 'Beer Bottle':'Armed'}
    const armed_cats = ["Unarmed","Armed","Unknown"]


    // Create a new object to transform data
    let newData = []

    for (let j=0; j<armed_cats.length; j++){
        cum_sum=0
        var temp_dict={Weapon: armed_cats[j],Values:[],Percent: 0};

        for (let i=0; i<years.length; i++){ 
            var temp_sub_dict={Date: years[i],Totals:cum_sum};

            for (let d of data) {
                if (d.Date === years[i]) {
                    if (armed_cats_map[d.Armed] === armed_cats[j]){
                        temp_sub_dict.Totals += 1;
                    }}}
            temp_dict.Values.push(temp_sub_dict)
            cum_sum=temp_sub_dict.Totals
        }
        newData.push(temp_dict)
    };
    
    console.log(newData); // view transformed data

    let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date)) // returns an array
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([0,years.length]).nice() // nice to round up axis tick
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis") // adding a class to y-axis for scoping
      .call(d3.axisLeft(y)
        .tickSizeOuter(0)
        .tickFormat(d => d) 
        .tickSize(-width + margin.right + margin.left) // modified to meet at end of axis
      );

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Month");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Cumulative Fatal Shottings");
    

    console.log("Here")

    for (let d of newData) {
        console.log("Here")
        console.log(d => d.Weapon)

        let line = d3.line()
            .x(d => x(d.data.Date))
            .y(d => y(d.data.Totals))
            .curve(d3.curveNatural); // more: https://observablehq.com/@d3/d3-line#cell-244

        svg.append("path")
            .datum(newData)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue");


      }
    

  });

  



