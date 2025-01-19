import * as d3 from 'd3'

export function drawMap(params: any) {
  const container = params.container
  const width = params.width
  const height = params.height
  const dma = params.dma

  // append svg to container
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 975 710')

  const g = svg.append('g')

  const projection = d3
    .geoAlbersUsa()
    .scale(1200)
    .translate([width / 2, height / 2])

  // path generator
  const path = d3.geoPath().projection(projection) // Apply projection here
  const dmaPath = g.append('g')


  dmaPath
    .selectAll('.dma')
    .data(dma.features)
    .enter()
    .append('path')
    .attr('class', 'dma')
    .attr('d', path)
    .attr('fill', '#ccc')
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
}
