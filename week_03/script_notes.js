/* Bar chart of COVID cases */

/*ask TF if I can get code access earlier*/

/*
fetching data can be handled in the documentation 
through convenience functions can load data from a blob, buffer, csv, dsv, html, image, json, svg, txv, xml
*/

d3.csv("covid.csv").then(data =>{

    /*
    // want to loop through the data and make sure that cases are integers
    //plus sign turns into integers

    //console.log(data);
    */

    for (let d of data){
    
        d.cases= +d.cases;

    }

    const height=400,
        width=600,
        margin= ({top:25,right:30,bottom:35,left:50});

    //create svg using a let because we will modify it further on
    let svg=d3.select("#chart")
            .append("svg")
            .attr("viewbox",[0,0,,width,height]);

    /*
    //needs to be appended to the div of chart
    //if we want to select all ifds of a type, we need d3.selectAll
    //view box lets you resize based on the size of the browsers
    //scaleBand are used for boxes. otherwise use scale linear and ordinal scale
    //scales give you two things: domain and range
    d is row, d.country is attribute of the row we are on. using d for a row of data is customary 
    only when we use scaleBand we can use padding of any value <=1
    */
    
    const x = d3.scaleBand().domain(data.map(d=> d.country))
        .domain([])
        .range([])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0,d3.max(data,d=>d.cases)]).nice()
        .range([height-margin.bottom,margin.top])

    /*
    domain is now our start and end
    .nice has our range end at a nice value
    */

    const yAxis = g => g
        .attr("transfrom",'translate(${margin.left -5},0)') //why is my code orange here

    /*
    transform lets us move our axis to be based at 0:
    height-margin+5
    5 is the magic number for padding
    .call runs the function as soon as we have seen the keyword
    */


    /*
    */
});

//promise is: do this and then do this
//java is async so dont know the order at which things are loaded
//promise helps us control the flow
//arrows are just shortcuts for functions