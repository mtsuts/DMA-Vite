import * as d3 from 'd3'

export function drawMap(params: any) {
  const container = params.container
  const width = window.innerWidth > 1440 ? 1500 : params.width
  const height = params.height
  const dma = params.dma
  const marketsData = params.markets

  // append svg to container
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width}  ${height}`)

  function drawTooltip(data: any) {
    console.log(data)

    const foreignObject = svg
      .append('foreignObject')
      .attr('x', 150)
      .attr('y', height - 150)
      .attr('width', 400)
      .attr('height', 200)
      .attr('class', 'tooltip-object')
      .style('overflow', 'visible')

    foreignObject
      .append('xhtml:div')
      .style('position', 'absolute')
      .style('background-color', 'transparent')
      .style('color', '#fff')
      .style('font-size', '20px')
      .style('border-radius', '10px')
      .style('padding', '10px').html(`<div class='tooltip'> 
      <div class='tooltip-row'> 
      <div class='tooltip-row-title'> DMA Market: </div>
      <div class='tooltip-row-value'>${data.DMA} </div>
      </div>
       <div class='tooltip-row'> 
      <div class='tooltip-row-title'> State: </div>
      <div class='tooltip-row-value'> ${data.State} </div>
      </div>
       <div class='tooltip-row'> 
      <div class='tooltip-row-title'> 2025 Cohort: </div>
      <div class='tooltip-row-value'>${data['Market Type']} </div>
      </div>
       <div class='tooltip-row'> 
      <div class='tooltip-row-title'> Priority Markets: </div>
      <div class='tooltip-row-value'>${data.Priority}</div>
      </div>
      </div>`)
  }

  const g = svg.append('g')

  const projection = d3
    .geoAlbersUsa()
    .scale(window.innerWidth > 1440 ? 1500 : 1400)
    .translate([width / 2, height / 2])

  // path generator
  const path = d3.geoPath().projection(projection)
  const dmaPath = g.append('g')

  const dmaProperties = dma.features.map((d: any) => d.properties)
  // const marketsMatch = dmaProperties.filter((d: any) =>
  //   marketsData.some((x: any) => d.dma1 === x.DMA)
  // )

  // console.log(dmaProperties)
  // console.log(marketsData)
  // console.log(marketsMatch)

  const colorScale = d3
    .scaleOrdinal()
    .domain(['Top Tier', 'Mid Tier', 'Non Broadcast'])
    .range(['#6997ac', '#96bdcf', '#bbe0f3'])

  dmaPath
    .selectAll('.dma')
    .data(dma.features)
    .enter()
    .append('path')
    .attr('class', 'dma')
    .attr('d', path)
    .attr('fill', function (d: any) {
      const properties = d.properties
      const foundMarket = marketsData.find(
        (x: any) => x.DMA === properties.dma1
      )
      return foundMarket ? colorScale(foundMarket['Market Type']) : '#fff'
    })
    .attr('stroke', '#80807e')
    .attr('stroke-width', 0.5)
    .style('cursor', 'pointer')
    .on('mouseover', function (this: SVGPathElement, event: any, d: any) {
      const properties = d.properties
      const foundMarket = marketsData.find(
        (x: any) => x.DMA === properties.dma1
      ) || []
      if(foundMarket.length === 0) return
      drawTooltip(foundMarket)
    })
    .on('mouseleave', function (this: SVGPathElement) {
      svg.selectAll('.tooltip-object').remove()
    })
}
