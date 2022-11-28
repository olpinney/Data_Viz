d3.json('data/departments_officers.json').then(data_all => {
    console.log(data_all)
    dept_cat="AIRPORT LAW ENFORCEMENT SECTION - NORTH"
    
    data=[]
    for (let i=0; i<data_all.length;i++) {i
        if (data_all[i].unit_description==dept_cat){
            data=data_all[i].officers_2014
            break 
        }
    }
    
   
    for (let d of data){
        d.dept_complaint_cleaned_flag=+d.dept_complaint_cleaned_flag, 
        d.civ_complaint_flag=+d.civ_complaint_flag,
        d.civ_complaint_force=+d.civ_complaint_force, 
        d.civ_complaint_detain=+d.civ_complaint_detain, 
        d.civ_complaint_hate=+d.civ_complaint_hate,
        d.civ_complaint_crime=+d.civ_complaint_crime, 
        d.force_flag=+d.force_flag,
        d.weapon_flag=+d.weapon_flag}
    console.log(data)

    //d.force_flag, d.civ_complaint_flag
});


    // for (let d of data2) {
    //     d.year = +d.year,
    //     d.distance = +d.distance,
    //     d.speed= +d.speed
    // }

//     console.log("loading new data")
//     console.log(data2)

