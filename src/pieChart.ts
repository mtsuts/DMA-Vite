import * as d3 from 'd3'

// Reusable pie chart function
export function drawPiechart(
  data: { label: string; value: number }[]
): SVGSVGElement {
  const width = 200
  const height = 200
  const radius = Math.min(width, height) / 2

  const color = d3
    .scaleOrdinal()
    .domain(['Rethink', 'Intercept', 'Nudge', 'Win', 'Grow'])
    .range(['#0099D8', '#A6DBF1', '#003057', '#75C8EA', '#335A79'])

  const pie = d3
    .pie<{ label: string; value: number }>()
    .value((d) => d.value)
    .sort(null)

  const arc = d3
    .arc<d3.PieArcDatum<{ label: string; value: number }>>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius)

  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width}  ${height}`)

  const g = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  // Draw the arcs
  g.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d) => color(d.data.label) as string)

  // Add text labels in the middle of each arc
  g.selectAll('text')
    .data(pie(data))
    .enter()
    .append('text')
    .attr('transform', (d) => `translate(${arc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '15px')
    .style('fill', '#fff')
    .text((d) => (d.data.value === 0 ? '' : d.data.value + '%'))

  return svg.node() as SVGSVGElement
  
}
