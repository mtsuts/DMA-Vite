import * as d3 from 'd3'
import { drawPopup } from './popup'

export function drawMap(params: any) {
  const container = params.container
  const width = params.width
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

  const scaleExtent = [1, 8] as [number, number]

  // append logo
  d3.select('body')
    .append('div')
    .attr('class', 'logo-object')
    .style('position', 'absolute')
    .style('left', '40px')
    .style('top', '30px')
    .style('width', '150px')
    .style('height', '40px')
    .style('padding', '5px')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('border-radius', '6px')
    .html("<img src='./Spectrum_Logo_white.svg' alt='logo'/>")

  // append svg to container
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width}  ${height}`)

  // tooltip
  const drawTooltip = (data: any) => {
    svg.selectAll('.tooltip-object').remove()

    const foreignObject = svg
      .append('foreignObject')
      .attr('x', '3%')
      .attr('y', '72%')
      .attr('width', window.innerWidth > 1800 ? '600px' : '480px')
      .attr('height', window.innerWidth > 1800 ? '420px' : '300px')
      .attr('class', 'tooltip-object')
      .attr('data-dma', data.DMA)
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
      .style('font-size', window.innerWidth > 1800 ? '19px' : '15px')
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
    .scale(window.innerWidth)
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
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  let isDblClickActive = false

  dmaPath
    .selectAll('.dma')
    .data(dma.features)
    .enter()
    .append('path')
    .attr('class', 'dma')
    .attr('data-dma', (d: any) => d.properties.dma1)
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
      d3.select(this).style('filter', 'contrast(1.7) saturate(1.1)')
      svg.selectAll('.tooltip-object').remove()
      const properties = d.properties
      const foundMarket =
        marketsData.find((x: any) => x.DMA === properties.dma1) || []

      if (foundMarket.length === 0) return

      // const tooltipToKeep = d3.select(`.tooltip-object[data-dma="${data.DMA}"]`);

      clearTimeout(clickTimeout)

      clickTimeout = setTimeout(() => {
        drawTooltip(foundMarket)
      }, clickDelay)
    })

    .on(
      'mouseover',
      function (this: SVGPathElement, event: any, d: any) {
        if (isDblClickActive) return
        if (isTouchDevice && event.type === 'touchstart') event.preventDefault()

        const properties = d.properties
        const foundMarket =
          marketsData.find((x: any) => x.DMA === properties.dma1) || []

        if (foundMarket.length === 0) {
          svg.selectAll('.tooltip-object').remove()
          return
        }

        drawTooltip(foundMarket)
        d3.select(this).style('filter', 'contrast(1.7) saturate(1.1)')
      }
    )
    .on(
      'mouseleave',
      function (this: SVGPathElement, _event: any, _d: any) {
        if (isDblClickActive) return
        svg.selectAll('.dma').style('filter', 'none')
      }
    )

    .on('dblclick', function (this: SVGPathElement, event: any, d: any) {
      d3.select(this)
        .style('filter', 'contrast(1.7) saturate(1.1)')
        .attr('stroke-width', 1)

      isDblClickActive = true

      svg.selectAll('.tooltip-object').remove()

      // clearTimeout(clickTimeout)
      svg.selectAll('.tooltip-object').remove()

      const properties = d.properties
      const foundMarket =
        marketsData.find((x: any) => x.DMA === properties.dma1) || []
      if (foundMarket.length === 0) return
      const foundData = data.find(
        (market: any) => foundMarket.Priority === market.Priority
      )
      drawTooltip(foundMarket)
      event.stopPropagation()
      zooming(event, d)
      drawPopup(foundData, clickOnClose, reset)
    })

  g.on('mouseleave', () => {
    if (isDblClickActive) return
    svg.selectAll('.tooltip-object').remove()
    svg.selectAll('.dma').style('filter', 'none')
  })

  // reset
  svg.on('click', () => {
    reset()
    svg.selectAll('.popup-object').remove()
    svg.selectAll('.tooltip-object').remove()
    d3.select('.popup-object').style('display', 'none')
    d3.selectAll('.dma').style('filter', 'none')
    isDblClickActive = false
  })

  // Zoom event
  function zoomed(event: any) {
    g.attr('transform', event.transform)
  }

  const zoom = d3.zoom().scaleExtent(scaleExtent).on('zoom', zoomed)

  function zooming(_event: any, d: any) {
    const [[x0, y0], [x1, y1]] = path.bounds(d)
    const scale = Math.min(
      2,
      2 / Math.max((x1 - x0) / width, (y1 - y0) / height)
    )
    const translateX =
      width * (window.innerWidth > 1440 ? 0.4 : 0.25) - (scale * (x0 + x1)) / 2
    const translateY = height / 2 - (scale * (y0 + y1)) / 2

    const currentTransform = d3.zoomIdentity
      .translate(translateX, translateY)
      .scale(scale)
    svg.transition().duration(1000).call(zoom.transform, currentTransform)
  }

  svg.call(zoom)

  function reset() {
    svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity)
  }

  function clickOnClose() {
    d3.select('.popup-object').style('display', 'none')
    svg.selectAll('.tooltip-object').remove()
    svg.selectAll('.dma').style('filter', 'none')
    isDblClickActive = false
  }
}
