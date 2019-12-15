// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.json("https://data.cityofnewyork.us/resource/nc67-uf89.json",function(error,data){

    let returndata = () =>{
        var tabViolenceTime = [];
        data.forEach(element => {
           
            let violation_time = element.violation_time
           
            if(violation_time.includes("A")){
                //associate id
                let plate = element.plate
                violation_time = violation_time.replace(':','');
                violation_time = violation_time.replace('A','');
                violation_time_am = parseInt(violation_time);
                tabViolenceTime[plate] = violation_time_am;
            }
            if(violation_time.includes("P")){
                let plate = element.plate
                violation_time = violation_time.replace(':','');
                violation_time = violation_time.replace('P','');
                violation_time_pm = parseInt(violation_time)+1200;
                tabViolenceTime[plate] = violation_time_pm;
            }
          });
          console.log(tabViolenceTime)
          return tabViolenceTime;
    }

        var newdata = returndata()
        var  test = []
        var tut = []
        for(var key in newdata){
            var value = newdata[key];
            test.push(value)
        }
        
        let count = 0;
        let number = [], sortedNumbers = [];
        console.log(test)
        test.forEach(elt => {
            let a = Math.floor(elt/100);
            number[a+':00'] ? number[a+':00']++ : number[a+':00'] = 1;
        });
        Object.keys(number).sort((a, b) => (parseInt(a.split(':')) - parseInt(b.split(':')))).forEach(elt => sortedNumbers[elt] = number[elt]);
       // console.log(number);
        console.log(sortedNumbers);


    // Add X axis --> it is a date format
    var x = d3.scalePoint()
     // .domain(Object.keys(sortedNumbers), function(key) { return key; }))
      .domain(d3.extent(Object.keys(sortedNumbers), function(key) { return key; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(Object.keys(sortedNumbers), function(key) { return sortedNumbers[key]; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(Object.keys(sortedNumbers))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(key){ return x(key); })
        .y(function(key) { return y(sortedNumbers[key]) })
        )

});

