/* D3 Pie Chart */

d3.json("a3cleanedonly2015.json").then(data => {
    // Always start by console.logging the data
    console.log(data);

    //Create list of distinct variables
    const races = [...new Set(data.map(x => x.Race))]
    const armed = [...new Set(data.map(x => x.Armed))] // was used to identify the below categories
    const armed_cats_map = {'':'None', 'Knife':'Other', 'Gun':'Gun', 'Unknown Weapon':'Other', 'Hammer':'Other', 'Unarmed':'None', 'Vehicle':'Vehicle', 'Toy Weapon':'Other', 'Machete':'Other', 'Sword':'Other', 'Chain':'Other', 'Guns And Explosives':'Gun', 'Nail Gun':'Other', "Contractor'S Level":'Other', 'Metal Pipe':'Other', 'Metal Object':'Other', 'Metal Stick':'Other', 'Blunt Object':'Other', 'Hatchet':'Other', 'Box Cutter':'Other', 'Cordless Drill':'Other', 'Metal Pole':'Other', 'Crossbow':'Other', 'Screwdriver':'Other', 'Tasered':'Other', 'Straight Edge Razor':'Other', 'Beer Bottle':'Other'}
    const armed_cats = ["None","Gun","Other"]
    
    // Create a new object to transform data
    let newData = []

    for (let i=0; i<races.length; i++){ 
        var temp_dict={Race: "",Values:[],Denom: 0};
        if (races[i] == ""){
            temp_dict.Race = "Unknown"}
        else {
            temp_dict.Race = races[i]}

        for (let j=0; j<armed_cats.length; j++){
            var temp_sub_dict={Weapon: "",Totals:0};
            temp_sub_dict.Weapon = armed_cats[j]

            for (let d of data) {
                if (d.Race === races[i]) {
                    if (armed_cats_map[d.Armed] === armed_cats[j])
                    temp_sub_dict.Totals += 1;}
            }
        temp_dict.Values.push(temp_sub_dict)
        temp_dict.Denom = temp_dict.Denom + temp_sub_dict.Totals
        }
        newData.push(temp_dict)
    };

    console.log(newData); // view transformed data

    for (let d of newData) {
        console.log(d)
        createRing(d);
      }

});

function createRing({ Race, Values, Denom}) {
    const height = 250,
      width = 300,
      innerRadius = 40,
      outerRadius = 65,
      labelRadius = 85;
  
    const arcs = d3.pie().value(d => d.Totals)(Values);
  
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
    const svg = d3.select("#pie_chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d, i) => d3.schemeCategory10[i])
      .attr("d", arc);
  
    svg.append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .selectAll("tspan")
      .data(d => {
        return [d.data.Weapon, d3.format(".0%")(d.data.Totals / Denom)];
      })
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i) => `${i * 1.1}em`)
      .attr("font-weight", (d, i) => i ? null : "bold")
      .text(d => d);
  
    svg.append("text")
      .attr("font-size", 16)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(Race)
      .style("font-size", 20);

  }

   