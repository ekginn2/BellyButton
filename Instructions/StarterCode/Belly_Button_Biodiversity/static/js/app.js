function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // hard code a sample id to see how it works
  // look at Saturday fullstack flask Plotly, stu stocks dynamic

    d3.json(`/metadata/${sample}`).then((data) => { // Use `d3.json` to fetch the metadata for a sample
      var samplepanel = d3.select("#sample-metadata"); // Use d3 to select the panel with id of `#sample-metadata`
      samplepanel.html("") // Use `.html("") to clear any existing metadata
      Object.entries(data).forEach(([key, value]) => { // Use `Object.entries` to add each key and value pair to the panel
      samplepanel.append("p").text(`${key} : ${value}`);
      });
     });
   }

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/metadata/${sample}`).then((data) => {
      var otuIds = data.otu_ids;
      var sampleValues = data.sample_values;
      var otuLabels = data.otu_labels;


    // @TODO: Build a Bubble Chart using the sample data
    var bubbleLayout = {
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
        }
      }
    ];

    Plotly.plot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // Plot the default route once the page loads

    var pieData = [
      {
        values: sampleValues.slice(0, 10),
        labels: otuIds.slice(0, 10),
        hovertext: otuLabels.slice(0, 10),
        type: "pie"
      }
    ];

    var pieLayout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pieData, pieLayout);
  });
}

    // // Update the plot with new data
    // function updatePlotly(newdata) {
    //   Plotly.restyle("bar", "x", [newdata.x]);
    //   Plotly.restyle("bar", "y", [newdata.y]);
    // }
    //
    // // Get new data whenever the dropdown selection changes
    // function getData(route) {
    //   console.log(route);
    //   d3.json(`/${route}`).then(function(data) {
    //     console.log("newdata", data);
    //     updatePlotly(data);
    //   });
    // }

    // var trace1 = {
    //   labels: [],
    //   values: [],
    //   type: 'pie'
    // };
    //
    // var data = [trace1];
    //
    // var layout = {
    //   title: "Belly Buttons",
    // };
    //
    // Plotly.newPlot("pie", data, layout);

    // Slices first two items
    // const topten = trace1.slice(0, 10);
    // console.log(left);


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
