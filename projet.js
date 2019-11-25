
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 960 - margin.top - margin.bottom;

//var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
   // .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Frequency:</strong> <span style='color:red'>" + d.reduction_amount + "</span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.json("https://data.cityofnewyork.us/resource/nc67-uf89.json",function(error,data){

// on a bien un set contenant toutes les violations
  let listeViolations = ()=> {
    var setViolation = new Set();
    data.forEach(element => {
      let violation = element.violation
      setViolation.add(violation)
    });
    return setViolation;
  }
  // on crée un tableau contenant une violation et le nombre d'occurence de celle-ci
  let test = () =>{
    var tabViolenceOccurence = new Array();
  for (let violation of listeViolations()){
    var count = 0;
    data.forEach(element => {
      if(element.violation == violation){
        count++;
      }
    });
    tabViolenceOccurence[violation]=count;
    }
    return tabViolenceOccurence;
  }
  var testo = test();
 
  x.domain(testo.map(function(d){

  }))
  for(var i= 0; i < test().length; i++)
{
  x.domain(test().map(function(d) { 
     return d.count; }));
   y.domain([0, d3.max(data, function(d) { 
     return d.reduction_amount; })]);
}
  for(var valeur in test()){
    
    console.log(valeur)
     console.log(test()[valeur])
     x.domain(valeur);
    // y.domain(0, d3.max(test()[valeur]));
  }
  //console.log(test())
  /*
  x.domain(data.map(function(d) { 
    return d.state; }));
  y.domain([0, d3.max(data, function(d) { 
    return d.reduction_amount; })]);
  */
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.state); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.penalty_amount); })
      .attr("height", function(d) { return height - y(d.penalty_amount); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});
/*
d3.tsv("data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});
*/
function type(d) {
  d.frequency = +d.frequency;
  return d;
}