//run the code
function run_bubble_plot(){

//call util functions to create chart
function chart_create(chart_id,data_all,dept_selection,bubble_var_selection,legend_id,legend_title,height,width,margin){
  svg = d3.select(chart_id)
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
  let myBubbleChart = bubbleChart(svg,height,width,margin);
  myBubbleChart(data_all,dept_selection,bubble_var_selection,legend_id,legend_title)
}

//delete old chart and replace
function chart_update(chart_id,data_all,dept_selection,bubble_var_selection,legend_id,legend_title,height,width,margin){
  d3.select(chart_id).selectAll("svg").remove();
  chart_create(chart_id,data_all,dept_selection,bubble_var_selection,legend_id,legend_title,height,width,margin)
}

//load the data and run the code
d3.json('data/departments_officers.json').then(data_all => {
  console.log(data_all)
  
  //clean data
  var dept_selection="DISTRICT 001" 
  var bubble_var_selection="civ_complaint_count"
  var data=[]

  //Select data from broader dataset
  for (let i=0; i<data_all.length;i++) {
    if (data_all[i].unit_description==dept_selection){
        data=data_all[i].officers
        break}}

  for (let d of data){
  d.size_var=+d[bubble_var_selection]
  d.x_var=+d.force_count+d.weapon_count
  d.color_var=+d.x_var
  }
  
  //set variables for legend
  const x_axis_title="Self-Reported Use of Force or Weapon Incidents between 2004 and 2016:"
  color_list=["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d"]
  color = d3.scaleQuantize().domain([-19,81]).range(color_list)
  quantile=20 //based on the 100 span domain for color above
  quantile_span=["0","1-"+quantile, (quantile+1)+"-"+(2*quantile), (2*quantile+1)+"-"+(3*quantile), (3*quantile+1)+"+"]

  //add legends to all charts
  legend_intro=Legend(d3.scaleOrdinal(quantile_span,color_list),{ title: x_axis_title, tickSize: 0})
  legend=Legend(d3.scaleOrdinal(quantile_span,color_list),{ title: x_axis_title, tickSize: 0})
  d3.select("#legend_intro").node().appendChild(legend_intro) // why does this one not work, but the other one does?
  d3.select("#legend").node().appendChild(legend);
  
  //create intro chart
  var height = 400,
    width = 700,
    margin = ({ top: 0, right: 40, bottom: 0, left: 120});
  var legend_title="Number of Civilian Complaints between 2000 and 2016"
  chart_create("#scatter_intro",data,dept_selection,bubble_var_selection,"#scatter_intro",legend_title,height,width,margin)

  //create final chart
  var legend_title="Size Variable"
  chart_create("#scatter",data,dept_selection,bubble_var_selection,"#scatter",legend_title,height,width,margin)

  //add listeners for tool tip and data dropdowns

  //initalize tooltip
  const tooltip = d3.select("#bio").append("div")
  .attr("class", "svg-tooltip")
  .attr("id","scrolling")
  .html("<p></p><h3>Click on Individual Officers to Learn More</h3>")
  .style("height","200px")
  .style("overflow-y","scroll")
  .style("font-size","0.9rem")
  var clicked_officer
  var clicked_officer_bool

  function add_tooltip(tooltip,bubble_var_selection){  
    d3.selectAll("#officer-bubble")
        .on("click", function(event,d) {
          d3.selectAll("circle").attr('fill', d => color(d.color_var))
          d3.select(this).select("#the_bubble").attr('fill', 'grey')
          document.getElementById('scrolling').scrollTop =0;
          clicked_officer=d
          clicked_officer_bool=true
          tooltip.html("<p></p><h3>"+
            "Officer Biography:</h3>"+`NAME: ${d.full_name}<br /> RANK: ${d.current_rank} <br /> START DATE: ${d.appointed_date} <br /> TENURE: ${+d.years_in_2016-1} YEAR(S)<br /> USES OF FORCE OR WEAPON: ${+d.force_count+d.weapon_count} <br /><br /> INCIDENTS: ${+d[bubble_var_selection]} ${d[bubble_var_selection+'_desc_list']}`
            )
          })          
  }

  //add tooltip 
  add_tooltip(tooltip,bubble_var_selection)

  //add department listener: filters data for new chart
  d3.select("#department")  
      .on("change", function (event) {
          dept_selection = event.target.value;
      
      clicked_officer_bool=false

      //Select data from broader dataset
      for (let i=0; i<data_all.length;i++) {
        if (data_all[i].unit_description==dept_selection){
            data=data_all[i].officers
            break}}

      for (let d of data){
      d.size_var=+d[bubble_var_selection]
      d.x_var=+d.force_count+d.weapon_count
      d.color_var=+d.x_var
      }
      chart_update("#scatter",data,dept_selection,bubble_var_selection,"#scatter",legend_title,height,width,margin)
      add_tooltip(tooltip,bubble_var_selection)
      tooltip.html("<p></p><h3>Click on Individual Officers to Learn More</h3>")      
      });

  //add size variable listener: select new size variable attribute
  d3.select("#bubble_variable") 
      .on("change", function (event) {
          bubble_var_selection = event.target.value;

      for (let d of data){
        d.size_var=+d[bubble_var_selection]
        }
      chart_update("#scatter",data,dept_selection,bubble_var_selection,"#scatter",legend_title,height,width,margin)
      
      if (clicked_officer_bool==true){
        tooltip.html("<p></p><h3>"+
            "Officer Biography:</h3>"+`NAME: ${clicked_officer.full_name}<br /> RANK: ${clicked_officer.current_rank} <br /> START DATE: ${clicked_officer.appointed_date} <br /> TENURE: ${+clicked_officer.years_in_2016-1} YEAR(S)<br /> USES OF FORCE OR WEAPON: ${+clicked_officer.force_count+clicked_officer.weapon_count} <br /><br /> INCIDENTS: ${+clicked_officer[bubble_var_selection]} ${clicked_officer[bubble_var_selection+'_desc_list']}`
            )
      }
      else{
        tooltip.html("<p></p><h3>Click on Individual Officers to Learn More</h3>") 
      }
      add_tooltip(tooltip,bubble_var_selection)
      });
})}
run_bubble_plot()





  

