import * as d3 from 'd3'

export function drawMap(params: any) {
  const container = params.container
  const width = params.width
  const height = params.height
  const usgeojson = params.usgeojson

  // append svg to container
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 975 710')

  const g = svg.append('g')

  // path generator
  const path = d3.geoPath()

  // draw us state paths
  g.selectAll('.state')
    .data(usgeojson.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('fill', '#ccc')
    .attr('stroke', '#333')
    .attr('stroke-width', 0.5)
    .on('mouseover', function () {
      console.log(d3.select(this))
      d3.select(this).attr('fill', 'blue')
    })
    .on('mouseover', function () {
      d3.select(this).attr('fill', '#ccc')
    })
}
