//run code
function matrix_plot(){
    var height = 800,
        width = 400,
        margin = ({ top: 0, right: 20, bottom: 10, left: 20 });

//load data
d3.json('data/total_force.json').then((data) => {  


    //calculate the officers and victims per 100
    var num_officers=100
    var dots_officers = Math.round(+data[0]["force_count_persons_with"]*num_officers/data[0]["UID"])
    var dots_victims = Math.round(+data[0]["force_count"]*num_officers/data[0]["UID"])
    var dots_officers_weapon = Math.round(+data[0]["weapon_count_persons_with"]*num_officers/data[0]["UID"])
    var dots_victims_weapon = Math.round(+data[0]["weapon_count"]*num_officers/data[0]["UID"])
    var w = 25 // set x-dimension to 25 units

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

        // This top piece lets the user set a second color group to appear first.
        // This part of the code lets you visualize the dots in percentage terms
        svg.append("g")
            .attr("fill", color)
            .attr("stroke","#D3D3D3")
            .selectAll("circle")
            .data(d3.range(total2-total1,total2))
            .join("circle")
            .attr("cx", d => x(d3.min([w,total2]))- x(d - w*Math.floor(d/w)))
            .attr("cy", d => height + height_edit - y(Math.floor(d/w)))
            .attr("r", 4)
            //.attr("opacity", 0.75);

        // visualize the main color of dots
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

    //use of force
    height = 800
    width = 400,
    form_matrix("#force_off",w,dots_officers,dots_officers,colors[2],0)
    form_matrix("#force_civ",w,dots_victims,dots_victims,colors[0],0)

    //weapons
    height = 100
    form_matrix("#weapon_off",w,dots_officers_weapon,dots_officers_weapon,colors[2],700)
    form_matrix("#weapon_civ",w,dots_victims_weapon,dots_victims_weapon,colors[0],700)
    
    //100 officers baseline
    form_matrix("#one_hundred",w,num_officers,num_officers,colors[4],700)

});
}
matrix_plot()