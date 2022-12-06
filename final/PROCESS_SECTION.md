#  Violence within the Chicago Police Department

## Process Section

### Overview Commentary
My primarily inspiration for this project lay in the data itself. I believe it is a rich data source, which can speak to the nuances in the national dialogue surrounding police violence. Having access to internal police reporting on use of force is very rare, especially in a form in which the officers are identifiable. Thus, I wanted to make this data more available for uses in the form of interactive data visualizations.

Defining my story was more difficult. I knew that I wanted to build a tool for the user to interact with but defining the story and the target user was more difficult. I started telling a story about the distribution of civilian complaints across the Chicago police department but felt like my most engaging content (the interactive visualization itself) was buried too deep into the website. Thus, I decided to restructure it around teaching the reader about the various variables that are helpful for understanding police violence and prepare them for interacting with the final visualization.

### Data Cleaning Process (From README)
The raw data contains 3 types of files, which are handled independent and then merged together on officer unique id ("UID"). The process for each of these types are as follows:

#### 1. CPD Department Roster.
data: 
- roster_1936-2017_2017-04.csv

Cleaning: limit officers to those on the CPD Roster in 2016. For officers that appear in multiple positions within 2016, limit to the last known position. Finally, categorize departments by overarching department clusters. 

#### 2. Civilian and Departmental Complaints
data: 
- complaints-accused.csv
- complaints-complaints.csv
- Complaint Categories.csv

Cleaning: merge all complaint data on unique id ("cr_id"). Remove non-severe departmental complaints, and bucket civilian complaint types. (Note: these decisions were made manually by reading through all of the complaint descriptions). Group the complaints by complaint type to ensure that all complaints are categorized, and none are included in multiple categories. (Note: double checking code is included but commented out). Group complaints by officer ("UID") to create complaint counts per person.  

#### 3. Tactical Response Reports
data:
- TRR-main_2004-2016_2016-09.csv
- TRR-subjects_2004-2016_2016-09.csv
- TRR-officers_2004-2016_2016-09.csv
- TRR-actions-responses_2004-2016_2016-09.csv

Cleaning: Merge all tactical response reports on unique id ("trr_id"). Bucket report incidents by action type. (Note: all use of force actions were already labeled as "Physical Force" in "force_type" variable. Weapon usage was categorized manually based on the "force_type" variable. Display of a weapon is not considered weapon usage. All other incidents are categorized as other, and not used in the analysis).  Group incidents by officer ("UID") to create incident counts per person. 

#### Combine and Export

Reformat variables for export: fix percentage, combine full name, calculate years on force, group complaint and self-reported incident descriptions per person. The final exports are as follows:
- Final dataset export as officer_2016.json
- Group by department and export as departments.json
- Group all and export as total_force.json
- Add officer data as list per department. Export as departments_officers.json
- Reformat list of departments in hierarchical form under department categories. Bucket small departments as other. Export as departments_tree.json
- Remove officers in Recruit Training Section. Format pie size variables. Export as percent_cat.json

### Data Cleaning Commentary

The data cleaning was time consuming because of the vastness of these datasets. The complaint data in particular was unwieldy in its non-categorized form. I added in subjective bias by categorizing complaint types myself and addressed this by explaining the meaning of each complaint type on the visualization web page. 

The other difficult component of the data cleaning process was the data formatting. My charts all required different data formats. While this reformatting could have occurred in d3, my datasets are large enough that I was worried about visualizations lagging while the data was prepared. Thus, I did the reformatting to json form in python. 

I had an advantage in the data cleaning process because I have worked with this dataset before and am very familiar with the variables. Thus, I had an easy time performing validity checks. 

### Chart Creation Commentary 
I made a couple value judgements in the data that I included in my charts. I decided to feature officers in 2016, because this was the last year for which I had complaint and incident data. I had previously considered choosing 2014, the year in which Laquan McDonald was fatally shot by the CPD, but this would require excluding the subsequent 2015-2016 complaint and incident data. The only data gap I faced was the data before 2004 and after 2016. Selecting 2016 as the focus of the analysis was the best way of dealing with these gaps.

I also decided not to include data on how infrequently civilian complaints result in police disciplinary action. This topic has received attention by other news sources. I felt that including it would further complicate the information provided to the reader and reduce their engagement with the data presented. 

My biggest ethical consideration appeared in my framing of violence. These data points fail to capture the individual repercussions of police altercations. Thus, I tried to cast I wide net in terms of the definition of violence, and let the audience understand the nuance between these various means of assessing violent police actions. This wide definition led me to consider all incidences, rather than normalize incidents by year. Additionally, it led me to consider a wide definition of "criminal activity" by the police. While many people might find trespassing and distribution of controlled substances to be a very different type of crime to sexual assault and use of weapon off duty, I decided to include all of these incident types.

Some of these charts were easy choices. Namely the tree chart and the pie chart seemed like the most natural ways of displaying nested departments, and percent of officers. The most difficult part of the tree chart came with bucketing departments into broad categories and identifying the cut off for being bucketed into the "other" category. The pie charts could have been displayed as percentage bar charts instead of pies. I also could have bucketed officers into frequency of complaints / use of force. I decided not to do this because it would complicate the charts, and the percentage information could be explored through the visualization in the final chart.

The matrix dot chart was complicated to create despite being conceptually simple. My vision for this chart was to take a very simple statistic regarding percentage of officers and their respective victims and turn it into something that was more emotionally evocative. I wanted the user to be caught off guard by how long they were required to scroll before hitting the end of the visualization. I knew that this would be an untraditional choice, especially because it would mean a significant distance between the top of the graphic, and the final message at the bottom. Ultimately, I had to be very careful to get the desired result. I decided I could only display the dots in rows of a "natural" unit numbers. I tried having rows of 10 data points, or 20 or 50 or 100. I also tried having a base on 10 officers or 1,000 officers. I found that rows of 25 units, and a base of 100 officers created the most approachable result. 

The bubble chart was also complicated. This chart type was suggested by Professor France, and I felt it was a great suggestion because it let me display all the officers as their own datapoint in an engaging manner. In past iterations I included an x-axis but excluded it because it created chart junk. I had annotations and a tooltip that hovered on the chart, but they also felt like chart junk. I used color to display a third variable but found three variables to be overcomplicating. I let the user customize the x-axis variable, but it created shapes that were less helpful than the separation achieved by self-reported incidents. The resulting chart is still very complicated, and not immediately user friendly. It expects that the user will click around and figure the interface out for themselves. I felt this would be better for the curious audience member. The other option would have been to include more of the chart (for example the scale of the x-axis and specific name of the size-variable) but this would have entailed more chart junk and repetitive information because these facts were displayed elsewhere in the interface.

Ultimately, I decided not the follow the project prompt exactly. We were asked to tell a story which the data supported. For me, having the viewer gain familiarity with the data, and come to conclusions themselves was a key part of the story. Thus, I wanted to create a tool that would stimulate the viewer's curiosity. I did include some of my conclusions, especially in the earlier sections. However, I left the reader on the open question of: Can these officers by sorted into the categories of "bad apples" and non-violent police?