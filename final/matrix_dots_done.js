/* Bar chart for COVID cases cases */
function matrix_plot(){
    var height = 200,
        width = 400,
        margin = ({ top: 0, right: 5, bottom: 5, left: 20 });

d3.json('data/total_force.json').then((data) => {  

    console.log(data[0])

    //calculate the officers and victims per 100
    var num_officers=20
    var dots_officers = Math.round(+data[0]["force_count_persons_with"]*num_officers/data[0]["UID"])
    var dots_victims = Math.round(+data[0]["force_count"]*num_officers/data[0]["UID"])
    var dots_officers_weapon = Math.round(+data[0]["weapon_count_persons_with"]*num_officers/data[0]["UID"])
    var dots_victims_weapon = Math.round(+data[0]["weapon_count"]*num_officers/data[0]["UID"])

    var w = num_officers/2 //Math.ceil(Math.sqrt(dots_victims))
    console.log(w) //15 or 

    let x = d3.scaleLinear()
        .domain([0, dots_victims/w]) // nice rounds the top num
        .range([margin.left, width - margin.right]); //svgs are built from top down, so this is reversed

    let y = d3.scaleLinear()
        .domain([0, dots_victims/(2*w)]) // nice rounds the top num
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed

    function form_matrix(chart_name,w,total1,total2,color){
        let svg = d3.select(chart_name)
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser

        console.log()

        svg.append("g")
            .attr("fill", color)
            .selectAll("circle")
            .data(d3.range(total2-total1,total2))
            .join("circle")
            .attr("cx", d => x(d3.min([w,total2]))- x(d - w*Math.floor(d/w)))
            .attr("cy", d => height - y(Math.floor(d/w)))
            .attr("r", 5)
            .attr("opacity", 0.75);

        svg.append("g")
            .attr("fill", "tan")
            .selectAll("circle")
            .data(d3.range(0,total2-total1))
            .join("circle")
            .attr("cx", d => x(d3.min([w,total2]))- x(d - w*Math.floor(d/w)))
            .attr("cy", d => height - y( Math.floor(d/w)))
            .attr("r", 5)
            .attr("opacity", 0.75);
        }
    form_matrix("#force_off",w,dots_officers,num_officers,"steelblue")
    form_matrix("#force_civ",2*w,dots_victims,dots_victims,"maroon")

    form_matrix("#weapon_off",w,dots_officers_weapon,num_officers,"steelblue")
    form_matrix("#weapon_civ",2*w,dots_victims_weapon,dots_victims_weapon,"maroon")

});

}
matrix_plot()

console.log(d3.range(0,5))
    