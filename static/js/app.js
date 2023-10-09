// Load the GeoJSON data.
var geoData = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

var geojson;

const select = d3.select("#selDataset");
// Get the data with d3.
d3.json(geoData).then(function (data) {
    geojson = data;
    // Append options to the select element
    for (let i = 0; i < geojson.names.length; i++) {
        select.append("option").text(geojson.names[i]).property("value", geojson.names[i]);
    }

    initBar();
    initBubble();
    initDemographicInfo();
    initGauge();
});

// Display the default plot
function initBar() {
    let data = geojson.samples[0];
    console.log(data);

    let trace1 = {
        x: data.sample_values.slice(0, 10).reverse(),
        y: data.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: data.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    let layout = {
        title: "Top 10 OTUs",
        height: 600,
        width: 800
    };

    Plotly.newPlot("bar", [trace1], layout);
}

function initBubble() {
    let data = geojson.samples[0];
    console.log(data);

    let trace1 = {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: 'markers',
        marker: {
            color: data.otu_ids,
            size: data.sample_values
        }
    };

    let layout = {
        title: "Top 10 OTUs",
        height: 600,
        width: 1400
    };

    Plotly.newPlot("bubble", [trace1], layout);
}

function initDemographicInfo() {
    let data = geojson.metadata[0];
    console.log(data);

    let panel = d3.select("#sample-metadata");

    panel.html("");

    Object.entries(data).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toLowerCase()}: ${value}`);
    });
}

function initGauge() {
    let data = [{
        type: "indicator",
        mode: "gauge+number",
        value: geojson.metadata[0].wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>(Scrubs per Week)", font: { size: 24 } },
        gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 1], color: "#f7f4f9" },
                { range: [1, 2], color: "#e4dcec" },
                { range: [2, 3], color: "#d0c8e3" },
                { range: [3, 4], color: "#bcb0da" },
                { range: [4, 5], color: "#a79ad1" },
                { range: [5, 6], color: "#9384c8" },
                { range: [6, 7], color: "#7e6fbd" },
                { range: [7, 8], color: "#6a59b4" },
                { range: [8, 9], color: "#5543aa" }
            ]
        }
    }]

    let layout = {
        width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("gauge", data, layout);

}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a letiable
    let dataset = dropdownMenu.property("value");

    let sample_data = geojson.samples.find(sample => sample.id == dataset);
    let metadata = geojson.metadata.find(sample => sample.id == dataset);

    // Call function to update the chart
    updateBar(sample_data);
    updateBubble(sample_data);
    updateDemographicInfo(metadata);
}

// Update the restyled plot's values
function updateBar(newdata) {
    let trace1 = {
        x: newdata.sample_values.slice(0, 10).reverse(),
        y: newdata.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: newdata.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    Plotly.restyle("bar", "x", [trace1.x]);
    Plotly.restyle("bar", "y", [trace1.y]);
    Plotly.restyle("bar", "text", [trace1.text]);
}

function updateBubble(newdata) {
    let trace1 = {
        x: newdata.otu_ids,
        y: newdata.sample_values,
        text: newdata.otu_labels,
        mode: 'markers',
        marker: {
            color: newdata.otu_ids,
            size: newdata.sample_values
        }
    };

    Plotly.restyle("bubble", "x", [trace1.x]);
    Plotly.restyle("bubble", "y", [trace1.y]);
    Plotly.restyle("bubble", "text", [trace1.text]);
}

function updateDemographicInfo(newdata) {
    let panel = d3.select("#sample-metadata");

    panel.html("");

    Object.entries(newdata).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toLowerCase()}: ${value}`);
    });
}

