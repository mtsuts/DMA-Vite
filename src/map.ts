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

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  let isDblClickActive = false
  let currentDma: any = null
  let lastTouchTime = 0
  const DOUBLE_TAP_THRESHOLD = 300
  const TOUCH_MOVE_THRESHOLD = 10
  let isDragging = false
  let lastTouchPosition: { x: number; y: number } | null = null
  let isClicked = false

  // Handle touchstart event
  const handleTouchStart = function (
    this: SVGPathElement,
    event: TouchEvent,
    d: any
  ) {
    const currentTime = Date.now()
    const touches = event.touches[0]
    lastTouchPosition = { x: touches.clientX, y: touches.clientY }

    const timeDifference = currentTime - lastTouchTime

    if (timeDifference <= DOUBLE_TAP_THRESHOLD) {
      if (isClicked) {
        handleDblClick.call(this, event, d)
      }
      lastTouchTime = 0
    } else {
      lastTouchTime = currentTime
      isDragging = false
    }
  }

  // Handle touchmove event
  const handleTouchMove = function (this: SVGPathElement, event: TouchEvent) {
    if (!lastTouchPosition) return

    const touches = event.touches[0]
    const dx = Math.abs(touches.clientX - lastTouchPosition.x)
    const dy = Math.abs(touches.clientY - lastTouchPosition.y)

    if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
      isDragging = true
    }
  }

  // Handle touchend event (if needed)
  const handleTouchEnd = function (
    this: SVGPathElement,
    _event: TouchEvent,
    _d: any
  ) {
    if (isDragging) {
      // Prevent tap logic when dragging
      return
    }
  }

  // Handle double-click (for mouse)
  const handleDblClick = function (this: SVGPathElement, event: any, d: any) {
    event.stopPropagation()
    isDblClickActive = true

    const properties = d.properties
    const foundMarket = marketsData.find((x: any) => x.DMA === properties.dma1)

    if (!foundMarket) return
    dmaSel.style('filter', 'none')
    d3.select(this)
      .style('filter', 'contrast(1.7) saturate(1.1)')
      .attr('stroke-width', 1)

    const foundData = data.find(
      (market: any) => foundMarket.Priority === market.Priority
    )

    svg.selectAll('.tooltip-object').remove()
    drawTooltip(foundMarket)
    zooming(event, d)
    drawPopup(foundData, clickOnClose, reset)
  }

  const dmaSel = dmaPath
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

    .on('click', function (this: SVGPathElement, event: any, d: any) {
      isClicked = true
      event.stopPropagation()
      if (isDblClickActive) return

      d3.select(this).style('filter', 'contrast(1.7) saturate(1.1)')

      if (currentDma === d.properties.dma1) {
        return
      }

      svg.selectAll('.tooltip-object').remove()

      const properties = d.properties
      const foundMarket = marketsData.find(
        (x: any) => x.DMA === properties.dma1
      )

      if (!foundMarket) return

      // clearTimeout(clickTimeout)

      // clickTimeout = setTimeout(() => {
      drawTooltip(foundMarket)
      // }, clickDelay)
    })

    .on('mouseover', function (this: SVGPathElement, event: any, d: any) {
      if (isDblClickActive) return
      if (isTouchDevice && event.type === 'touchstart') event.preventDefault()

      const properties = d.properties
      const foundMarket = marketsData.find(
        (x: any) => x.DMA === properties.dma1
      )

      if (!foundMarket) {
        svg.selectAll('.tooltip-object').remove()
        return
      }

      currentDma = properties.dma1
      drawTooltip(foundMarket)
      d3.select(this).style('filter', 'contrast(1.7) saturate(1.1)')
    })
    .on('mouseleave', function (this: SVGPathElement, _event: any, _d: any) {
      if (isDblClickActive) return
      currentDma = null
      svg.selectAll('.dma').style('filter', 'none')
    })

    .on('touchstart', function (this: SVGPathElement, event: any, d: any) {
      handleTouchStart.call(this, event, d)
    })

    .on('touchmove', function (this: SVGPathElement, event: TouchEvent) {
      handleTouchMove.call(this, event)
    })
    .on('touchend', function (this: SVGPathElement, event: TouchEvent, d: any) {
      handleTouchEnd.call(this, event, d)
    })

    .on('dblclick', function (this: SVGPathElement, event: any, d: any) {
      handleDblClick.call(this, event, d)
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
    d3.selectAll('.popup-object').style('display', 'none')
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
    isClicked = false
    svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity)
  }

  function clickOnClose() {
    isClicked = false
    d3.select('.popup-object').style('display', 'none')
    svg.selectAll('.tooltip-object').remove()
    svg.selectAll('.dma').style('filter', 'none')
    isDblClickActive = false
  }
}
