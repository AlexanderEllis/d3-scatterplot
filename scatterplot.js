
let svg = d3.select('svg');

let margin = { top: 70, right: 20, bottom: 70, left: 70 };
let width = +svg.attr('width');
let height = +svg.attr('height');

let URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(URL, function(error, data) {

    if (error) throw error;

    let x = d3.scaleLinear()
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]);

    x.domain([d3.max(data, d => +d.Seconds) + 5, d3.min(data, d=> +d.Seconds) - 30] );

    y.domain( [d3.max(data, d => +d.Place) + 1, 1] );
    
    let plot = svg.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', d => 'translate(' + x( +d.Seconds) + ',' + y( +d.Place) + ')');
        
    plot.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', '6')
        .style('fill', d => d.Doping === '' ? '#7aff83' : '#d61b1b')
    plot.append('text')
        .attr('transform', 'translate(' + 10 + ',' + 3 + ')')
        .text(d => d.Name)
        .style('font-size', '12px');
    
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)')
        .call(d3.axisLeft(y).ticks(10));
    
    svg.append('g')
        .attr('transform', 'translate(' + 0 + ',' + (height - margin.bottom) + ')')
        .call(d3.axisBottom(x).ticks(10).tickFormat(d => Math.floor(d / 60) + ':' + (d % 60 == 0 ? '00': d % 60)));

    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + margin.left + ',' + (height / 2) + ')rotate(-90)')
        .attr('font-size', '20px')
        .text('')
    
});
