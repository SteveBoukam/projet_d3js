
var margin = {top: 40, right: 20, bottom: 120, left: 40},
    width = 960 - margin.left - margin.right,
    height = 960 - margin.top - margin.bottom;

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

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    var tabViolenceOccurence = [];
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

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Occurence:</strong> <span style='color:red'>" + testo[d] + "</span>";
  })

  svg.call(tip);
  
  x.domain(Object.keys(testo).map(function(key){ return key; }));
  y.domain([0, d3.max(Object.keys(testo), function(key){ return testo[key]; })]);
   
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
      //.text("Occurence");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".71em")
    .attr("transform", "rotate(60)")
    .style("text-anchor", "start");

  svg.selectAll(".bar")
      .data(Object.keys(testo))
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(key){ return x(key); })
      .attr("width", x.rangeBand())
      .attr("y", function(key){ return y(testo[key]); })
      .attr("height", function(key){return height - y(testo[key]);})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});

function type(d) {
  d.frequency = +d.frequency;
  return d;
}