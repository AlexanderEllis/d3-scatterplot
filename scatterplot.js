
// Select the svg element
let svg = d3.select('svg');

// Define our constants
let margin = { top: 90, right: 40, bottom: 70, left: 70 };
let width = +svg.attr('width');
let height = +svg.attr('height');

// Cyclist data in JSON
let URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Get the data with callback
d3.json(URL, function(error, data) {

    // Just in case
    if (error) throw error;

    // Define linear scales for x and y
    let x = d3.scaleLinear()
        .range([margin.left, width - margin.right]);
    let y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]);

    // Define domains for x and y.  We want the chart to go highest to lowest, so [max, min]
    x.domain([d3.max(data, d => +d.Seconds) + 5, d3.min(data, d=> +d.Seconds) - 30] );
    y.domain( [d3.max(data, d => +d.Place) + 1, 1] );
    
    // Add the data into the svg with the correct coordinates based on the time and placing
    let plot = svg.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', d => 'translate(' + x( +d.Seconds) + ',' + y( +d.Place) + ')');
        
    // Add the circle for each one with fill dependent on doping.  We don't need to change cx/cy as it will inherit from g
    // Didn't have to make separate plot.append call, but I did to clearly show that circle and text have the same parent.
    plot.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', '6')
        .style('fill', d => d.Doping === '' ? '#7aff83' : '#d61b1b')
        .on('mouseover', d => d3.select('.tooltip')
                                    .style('visibility', 'visible')
                                    .html('<h3>' + d.Name + ', ' + d.Nationality + '</h3><h4>Ranking: ' + 
                                          d.Place + '</h3><p><b>Year:</b> ' + d.Year + '   <b>Time:</b> ' + d.Time + 
                                          '</p><p><b>Doping:</b> ' + d.Doping + '</p>')) 
        .on('mousemove', d => d3.select('.tooltip')
                                    .style('top', (d3.event.pageY) + 'px')
                                    .style('left', (d3.event.pageX + 5) + 'px'))
        .on('mouseleave', d => d3.select('.tooltip')
                                    .style('visibility', 'hidden'));
    // Separate call to plot.append required because plot.append('circle') returns the circle as parent, and we can't put
    // text element inside of a shape element
    plot.append('text')
        .attr('transform', 'translate(' + 10 + ',' + 4 + ')')
        .text(d => d.Name)
        .style('font-size', '12px');

    // Adding tooltip for hovering over cyclist circle
    d3.select('body').append('div')
        .attr('class', 'tooltip')
        .attr('height', '200px')
        .attr('width', '300px')
        .style('visibility', 'hidden')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('background-color', '#CCC')
        .style('opacity', '.9')
        .style('text-align', 'center')
        .style('border-radius', '3px')
        .style('border', '1px solid #444')
        .style('padding-left', '11px')
        .style('padding-right', '11px')
    
    // Create the y axis with 10 ticks
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)')
        .call(d3.axisLeft(y).ticks(10));
    
    // Create the x axis with time formatting (seconds -> mm:ss)
    svg.append('g')
        .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
        .call(d3.axisBottom(x).ticks(10).tickFormat(d => Math.floor(d / 60) + ':' + (d % 60 == 0 ? '00': d % 60)));

    // Add labels
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (margin.left / 2) + ',' + (height / 2) + ')rotate(-90)')
        .attr('font-size', '20px')
        .text('Ranking')
    
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height - margin.bottom / 4) + ')')
        .attr('font-size', '20px')
        .text('Time')
    
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / 2) + ')')
        .attr('font-size', '30px')
        .text('Tour de France: 35 Fastest times up Alpe d\'Huez')
    
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / 2 + 25) + ')')
        .attr('font-size', '20px')
        .text('Normalized to 13.8km distance')

});
