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

var textGroup = chartGroup.selectAll(".stateText")

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

// function used for updating y-scale var upon click on y axis label
function yScale(Data, chosenYAxis) {
    // create scales
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(Data, d => d[chosenYAxis])])
        .range([height, 0]);

  
    return yLinearScale;
  
  }

// function used for updating circles group with a transition to
// new circles for chosenXaxis
function renderCirclesX(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }


function renderTextX(textGroup, newXScale, chosenXaxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textGroup;
  }


// function used for updating circles group with a transition to
// new circles for chosenXaxis
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
          .duration(1000)
          .call(leftAxis);
      
        return yAxis;
      }

function renderTextY(textGroup, newYScale, chosenYAxis) {

        textGroup.transition()
          .duration(1000)
          .attr("y", d => newYScale(d[chosenYAxis])+3);
      
        return textGroup;
      }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

var chosenXAxis = "poverty";
//var chosenYAxis = "healthcare";

  if (chosenXAxis === "poverty") {
    if (chosenYAxis === "healthcare") {

      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr("fill", "red")
      .offset([80, -60])
      .html(function(d) {
        return(`${d.state}<br>Poverty: ${d.poverty}<br>Health: ${d.healthcare}`);
      });
    }
    else if (chosenYAxis === "smokes") {
      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return(`${d.state}<br>Poverty: ${d.poverty}<br>Smokes: ${d.smokes}`);
      });     
    }
    else if (chosenYAxis === "obesity") {
      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr("fill", "red")
      .offset([80, -60])
      .html(function(d) {
        return(`${d.state}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
      });     
    } 
  };

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
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
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
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
    .attr("r", 12)
    .attr("fill", "blue")
    .attr("opacity", ".8");  


  // append text to circles
  var textGroup = chartGroup.selectAll(".stateText")
    .data(vData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+2)
    .text(d => d["abbr"])
    .classed("stateText",true);
    
    
// Create x and y labels
//--------------------------------------------------------------
  // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var labelsGroupY = chartGroup.append("g");

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
  //  var healthLabel = chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left+50)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .classed("active", true)
  //   .text("Lacks Healthcare(%)");

  //   var smokesLabel = chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left+30)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .classed("inactive", true)
  //   .text("Smokes (%)");

  //   var obeseLabel = chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left+10)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .classed("inactive", true)
  //   .text("Obese (%)");

   var healthLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+50)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Lacks Healthcare(%)");

    var smokesLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokes (%)");

    var obeseLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Obese (%)");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

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
     xAxis = renderAxesX(xLinearScale, xAxis);

     // updates circles with new x values
     circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

     // updates text with new x values

     textGroup = renderTextX(textGroup, xLinearScale, chosenXAxis);

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

 // y axis labels event listener
 labelsGroupY.selectAll("text")
 .on("click", function() {
   // get value of selection
   var value2 = d3.select(this).attr("value");
   if (value2 !== chosenYAxis) {

     // replaces chosenXAxis with value
     chosenYAxis = value2;

     // console.log(chosenXAxis)

     // functions here found above csv import
     // updates y scale for new data
     yLinearScale = yScale(vData, chosenYAxis);

     // updates y axis with transition
     yAxis = renderAxesY(yLinearScale, yAxis);

     // updates circles with new x values
     circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

     // updates text with new x values

     textGroup = renderTextY(textGroup, yLinearScale, chosenYAxis);

     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);


     // changes classes to change bold text
     if (chosenYAxis === "healthcare") {
        healthLabel
         .classed("active", true)
         .classed("inactive", false);
       obeseLabel
         .classed("active", false)
         .classed("inactive", true);
       smokesLabel
         .classed("active", false)
         .classed("inactive", true);  
     }
     else if (chosenYAxis === "smokes") {
        healthLabel
         .classed("active", false)
         .classed("inactive", true);
       obeseLabel
         .classed("active", false)
         .classed("inactive", true);
       smokesLabel
         .classed("active", true)
         .classed("inactive", false);
     }
     else {
      healthLabel
        .classed("active", false)
        .classed("inactive", true);
      obeseLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);        
     }
   }
 });


}); // --> End of main function