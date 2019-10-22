// set the dimensions and margins of the graph
var margin = {
    top: 30,
    right: 30,
    bottom: 120,
    left: 120
  },
  width = 720 - margin.left - margin.right,
  height = 480 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



//Chart1-1

var xLabel = svg.append("text")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Median Score on Rotten Tomatoes (%)");

var yLabel = svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -100)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Box Office in Total ($)");

//Read the data
d3.json("data/Chart1-1.json").then(function(data) {
  console.log(data);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([80, 100])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 16000000000])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  var tooltip = d3.select("#chart-area").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
    var color = colorScale(d.character);
    var html = "<span style='color:" + color + ";'> <b>" + d.character + "</span><br/>" +
      "Median Score on Rotten Tomatoes: " + d.rottenTomatoes + "%" +"<br/>" +
      "Box Office in Total: $" + d.boxOffice + "</span>";

    tooltip.html(html)
      .style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .transition()
      .duration(200) // ms
      .style("opacity", 1); // started as 0!

  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
    tooltip.transition()
      .duration(300) // ms
      .style("opacity", 0); // don't care about position!
  };

var colorScale = d3.scaleOrdinal(d3.schemeSet2);

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return x(d.rottenTomatoes);
    })
    .attr("cy", function(d) {
      return y(d.boxOffice);
    })
    .attr("r", 10)
    .style("fill", function(d) { return colorScale(d.character); })
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);
});




//Chart1-2

function updateData() {

  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();
  svg.selectAll("g").remove();

var xLabel = svg.append("text")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Score on Rotten Tomatoes (%)");

var yLabel = svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -100)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Box Office ($)");

d3.json("data/Chart1-2.json").then(function(data) {
  console.log(data);

    // Add X axis
    var x = d3.scaleLinear()
      .domain([60, 100])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 3000000000])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the tooltip container to the vis container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3.select("#chart-area").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // tooltip mouseover event handler
    var tipMouseover = function(d) {
      var color = colorScale(d.Character);
      var html = "<span style='color:" + color + ";'> <b>" + d.Movie + "</span><br/>" +
        "Score on Rotten Tomatoes: " + d.RottenTomatoes + "%" +"</span><br/>" + "Box Office: $" + d.BoxOffice;

      tooltip.html(html)
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .transition()
        .duration(200) // ms
        .style("opacity", 1); // started as 0!

    };
    // tooltip mouseout event handler
    var tipMouseout = function(d) {
      tooltip.transition()
        .duration(300) // ms
        .style("opacity", 0); // don't care about position!
    };

  var colorScale = d3.scaleOrdinal(d3.schemeDark2);

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return x(d.RottenTomatoes);
      })
      .attr("cy", function(d) {
        return y(d.BoxOffice);
      })
      .attr("r", 5)
      .style("fill", function(d) { return colorScale(d.Character); })
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);
});

}




//Chart1-1 Revert

function revertData() {

  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();
  svg.selectAll("g").remove();

  var xLabel = svg.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Median Score on Rotten Tomatoes (%)");

  var yLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -100)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Box Office in Total ($)");

  //Read the data
  d3.json("data/Chart1-1.json").then(function(data) {
    console.log(data);

    // Add X axis
    var x = d3.scaleLinear()
      .domain([80, 100])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 16000000000])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the tooltip container to the vis container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3.select("#chart-area").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // tooltip mouseover event handler
    var tipMouseover = function(d) {
      var color = colorScale(d.character);
      var html = "<span style='margin-left:5px;'> <br/>" +
        "<span style='color:" + color + ";'> <b>" + d.character + "</span><br/>" +
        "Median Score on Rotten Tomatoes: " + d.rottenTomatoes + "%" +"<br/>" +
        "Box Office in Total: $" + d.boxOffice + "</span>";

      tooltip.html(html)
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .transition()
        .duration(200) // ms
        .style("opacity", 1); // started as 0!

    };
    // tooltip mouseout event handler
    var tipMouseout = function(d) {
      tooltip.transition()
        .duration(300) // ms
        .style("opacity", 0); // don't care about position!
    };

  var colorScale = d3.scaleOrdinal(d3.schemeSet2);

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return x(d.rottenTomatoes);
      })
      .attr("cy", function(d) {
        return y(d.boxOffice);
      })
      .attr("r", 10)
      .style("fill", function(d) { return colorScale(d.character); })
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);
  });
}
