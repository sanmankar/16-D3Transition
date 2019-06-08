// @TODO: YOUR CODE HERE!

// Create the SVG area and append a chartgroup

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".container")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params - Default X-Axis to "poverty" and Y-Axis to "Healthcare"
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//****************************** Define Functions **********************************


// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
      d3.max(Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(Data, chosenYAxis) {
    // create scales
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(Data, d => d[chosenYAxis])])
        .range([height, 0]);

  
    return yLinearScale;
  
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
//**********************************End Functions **********************************


// Retrieve data from the CSV file and execute everything below:

d3.csv("./assets/js/data.csv", function(err, vData) {
    if (err) throw err;

    //************************ Header Record *********************************
    //HEADER: id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,
    //healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,
    //obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228 
    //************************ Header Record *********************************

console.log("In the function");
// Parse data
//--------------------------------------------------------------

    vData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.age = +data.age;
      data.income = +data.income;
    });

//Create xscale & yscale using function calles defined above
//--------------------------------------------------------------

    // xLinearScale function above csv import
    var xLinearScale = xScale(vData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(vData, chosenYAxis);

// Create initial axis functions and append to chartgroup
//--------------------------------------------------------------
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

// Create/Plot circles on the chart
//--------------------------------------------------------------
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(vData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5");  

// Create x and y labels
//--------------------------------------------------------------
  // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

   var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
   var healthLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+50)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Lacks Healthcare(%)");

    var smokesLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokes (%)");

    var obeseLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Obese (%)");

 // x axis labels event listener
 labelsGroup.selectAll("text")
 .on("click", function() {
   // get value of selection
   var value = d3.select(this).attr("value");
   if (value !== chosenXAxis) {

     // replaces chosenXAxis with value
     chosenXAxis = value;

     // console.log(chosenXAxis)

     // functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(vData, chosenXAxis);

     // updates x axis with transition
     xAxis = renderAxes(xLinearScale, xAxis);

     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

     // updates tooltips with new info
     //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

     // changes classes to change bold text
     if (chosenXAxis === "poverty") {
        povertyLabel
         .classed("active", true)
         .classed("inactive", false);
       ageLabel
         .classed("active", false)
         .classed("inactive", true);
       incomeLabel
         .classed("active", false)
         .classed("inactive", true);  
     }
     else if (chosenXAxis === "age") {
        povertyLabel
         .classed("active", false)
         .classed("inactive", true);
       ageLabel
         .classed("active", true)
         .classed("inactive", false);
       incomeLabel
         .classed("active", false)
         .classed("inactive", true); 
     }
     else {
       povertyLabel
         .classed("active", false)
         .classed("inactive", true);
       ageLabel
         .classed("active", false)
         .classed("inactive", true);
       incomeLabel
         .classed("active", true)
         .classed("inactive", false);          
     }
   }
 });



}); // --> End of main function