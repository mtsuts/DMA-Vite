import * as d3 from 'd3'
import { drawPopup } from './popup'

export function drawMap(params: any) {
  const container = params.container
  const width = window.innerWidth > 1440 ? 1500 : params.width
  const height = params.height
  const dma = params.dma
  const data = params.data
  const marketsData = params.markets.map((d: any) => {
    return {
      ...d,
      strategy:
        data.find((x: any) => d.Priority.includes(x.Priority))?.Label || '',
    }
  })
  console.log(data)

  const scaleExtent = [1, 8] as [number, number]

  // append svg to container
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width}  ${height}`)

  // tooltip
  function drawTooltip(data: any) {
    const foreignObject = svg
      .append('foreignObject')
      .attr('x', 130)
      .attr('y', 520)
      .attr('width', '30%')
      .attr('height', '30%')
      .attr('class', 'tooltip-object')
      .style('overflow', 'visible')
      .style('background-image', "url('./tooltip-background.png')")
      .style('background-size', '90%')
      .style('background-repeat', 'no-repeat')
      .style('padding', '20px 0px 20px 5px')

    foreignObject
      .append('xhtml:div')
      .style('position', 'absolute')
      .style('background-color', 'transparent')
      .style('color', '#fff')
      .style('font-size', '13px')
      .style('border-radius', '10px')
      .style('padding', '10px').html(`
        <div class='tooltip'> 

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
         <div class='tooltip-row'> 
      <div class='tooltip-row-title'> Strategy: </div>
      <div class='tooltip-row-value'>${data.strategy}</div>
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

  const colorScale = d3
    .scaleOrdinal()
    .domain(['Top Tier', 'Mid Tier', 'Non-Broadcast'])
    .range(['#6997ac', '#96bdcf', '#bbe0f3'])

  let clickTimeout: any
  const clickDelay = 300

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
    .style('opacity', 1)
    .on('click', function (this: SVGPathElement, _event: any, d: any) {
      clearTimeout(clickTimeout) // Cancel any pending single-click action
      d3.select(this).style('filter', 'brightness(1.2)')
      const properties = d.properties
      const foundMarket =
        marketsData.find((x: any) => x.DMA === properties.dma1) || []
      if (foundMarket.length === 0) return
      clickTimeout = setTimeout(() => {
        drawTooltip(foundMarket)
      }, clickDelay)
    })

    .on('mouseleave', function (this: SVGPathElement) {
      d3.select(this).style('filter', 'none')
      svg.selectAll('.tooltip-object').remove()
    })
    .on('dblclick', function (this: SVGPathElement, event: any, d: any) {
      clearTimeout(clickTimeout)
      svg.selectAll('.tooltip-object').remove()
      const properties = d.properties
      const foundMarket =
        marketsData.find((x: any) => x.DMA === properties.dma1) || []
      if (foundMarket.length === 0) return
      const foundData = data.find(
        (market: any) => foundMarket.Priority === market.Priority
      )
      event.stopPropagation()
      zooming(event, d)
      drawPopup(svg, foundData)
    })

  // reset
  svg.on('click', () => {
    reset()
    svg.selectAll('.popup-object').remove()
  })

  // Zoom event
  function zoomed(event: any) {
    g.attr('transform', event.transform).on('wheel', null)
  }

  const zoom = d3.zoom().scaleExtent(scaleExtent).on('zoom', zoomed)

  function zooming(_event: any, d: any) {
    const [[x0, y0], [x1, y1]] = path.bounds(d)
    const scale = Math.min(
      2,
      2 / Math.max((x1 - x0) / width, (y1 - y0) / height)
    )
    const translateX = width / 2 - (scale * (x0 + x1)) / 2
    const translateY = height / 2 - (scale * (y0 + y1)) / 2

    svg
      .transition()
      .duration(1000)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      )
  }

  svg.call(zoom)

  function reset() {
    svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity)
  }
}
