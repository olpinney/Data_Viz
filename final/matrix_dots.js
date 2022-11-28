/* Bar chart for COVID cases cases */
function matrix_plot(){
    var height = 800,
        width = 400,
        margin = ({ top: 0, right: 20, bottom: 10, left: 20 });

d3.json('data/total_force.json').then((data) => {  


    //calculate the officers and victims per 100
    var num_officers=100
    var dots_officers = Math.round(+data[0]["force_count_persons_with"]*num_officers/data[0]["UID"])
    var dots_victims = Math.round(+data[0]["force_count"]*num_officers/data[0]["UID"])
    var dots_officers_weapon = Math.round(+data[0]["weapon_count_persons_with"]*num_officers/data[0]["UID"])
    var dots_victims_weapon = Math.round(+data[0]["weapon_count"]*num_officers/data[0]["UID"])

    // console.log("for website")
    // console.log(data[0]["weapon_count_persons_with"])
    // console.log(data[0]["weapon_count"])   
    // // console.log(dots_officers)
    // // console.log(dots_victims)
    // console.log(dots_officers_weapon)
    // console.log(dots_victims_weapon)
    // console.log("done with website")

    var w = 25 //Math.ceil(Math.sqrt(dots_victims))
    console.log(w) //15 or 

    let x = d3.scaleLinear()
        .domain([0, w]) 
        .range([margin.left, width - margin.right]); 

    let y = d3.scaleLinear()
        .domain([0, dots_victims/(w)]) // nice rounds the top num
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed

    function form_matrix(chart_name,w,total1,total2,color,height_edit){
        let svg = d3.select(chart_name)
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); 

        console.log(height_edit)

        svg.append("g")
            .attr("fill", color)
            .attr("stroke","#D3D3D3")
            .selectAll("circle")
            .data(d3.range(total2-total1,total2))
            .join("circle")
            .attr("cx", d => x(d3.min([w,total2]))- x(d - w*Math.floor(d/w)))
            .attr("cy", d => height + height_edit - y(Math.floor(d/w)))
            .attr("r", 5)
            //.attr("opacity", 0.75);

        svg.append("g")
            .attr("fill", "#fdd0a2")
            .attr("stroke","#D3D3D3")
            .selectAll("circle")
            .data(d3.range(0,total2-total1))
            .join("circle")
            .attr("cx", d => x(d3.min([w,total2]))- x(d - w*Math.floor(d/w)))
            .attr("cy", d => height + height_edit - y( Math.floor(d/w)))
            .attr("r", 5)
            //.attr("opacity", 0.75);
        }

    colors=["#a63603","#D3D3D3","#e6550d","#fd8d3c","#fdae6b","#fdd0a2","#feedde"]

    form_matrix("#force_off",w,dots_officers,num_officers,colors[2],0)
    form_matrix("#force_civ",w,dots_victims,dots_victims,colors[0],0)

    height = 100
    form_matrix("#weapon_off",w,dots_officers_weapon,num_officers,colors[2],700)
    form_matrix("#weapon_civ",w,dots_victims_weapon,dots_victims_weapon,colors[0],700)

});

}
matrix_plot()

console.log(d3.range(0,5))
    