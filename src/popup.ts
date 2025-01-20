import { drawPiechart } from './pieChart'
import * as d3 from 'd3'

export function drawPopup(svg: any, data: any, zoom:any) {
  const pieData = [
    { label: 'Rethink', value: Number(data.Rethink.replace('%', '')) },
    { label: 'Intercept', value: Number(data.Intercept.replace('%', '')) },
    { label: 'Nudge', value: Number(data.Nudge.replace('%', '')) },
    { label: 'Win', value: Number(data.Win.replace('%', '')) },
    { label: 'Grow', value: Number(data.Grow.replace('%', '')) },
  ]

  // Remove existing popup elements
  d3.selectAll('.popup-object').remove()

  // Append a div to the body for the popup
  const popupDiv = d3
    .select('body')
    .append('div')
    .attr('class', 'popup-object')
    .style('position', 'absolute')
    .style('left', window.innerWidth - 750 + 'px')
    .style('top', '40px')
    .style('width', window.innerWidth > 1440 ? '40%' : '50%')
    .style('height', '100%')
    .style('height', '600px')
    .style('overflow', 'auto')
    .style('z-index', 1000)
    .style('display', 'block')
    .style('background-image', "url('./popup-background.png')")
    .style('background-size', '100% 100%')
    .style('background-repeat', 'no-repeat')

  console.log(data.Market)

  // Add HTML content to the popup
  popupDiv.html(`
      <div class='popup'> 
        <div class='popup-header'> 
          <img src='./popup-play.svg' width=37 height=42 alt='play'/>
          <img src='./popup-title-left.svg' />
          <div class='popup-title'> ${data.Market} </div>
          <img src='./popup-title-right.svg' />
        </div> 

        <div class='popup-bullets'> 
          <div class='bullet'>
            <div class='bullet-title'> ${
              data['% Homes Passed (pct availability)'] || ''
            } </div>
            <div> Homes <br/> Passed % </div>
          </div> 

          <div class='bullet'>
            <div class='bullet-title'> ${data['Market Share %'] || ''} </div>
            <div> Market <br/> share % </div>
          </div> 

          <div class='bullet'>
            <div class='bullet-title'> ${
              data['Multi-Cultural (Hispanic, Asian, African American)'] || ''
            } </div>
            <div> Multicultural % </div>
          </div> 

          <div class='bullet'>
            <div class='bullet-title'> ${data['Gateway Index'] || ''} </div>
            <div> Gateway Index </div>
          </div> 
        </div>

        <img src='./bullet-bottom-line.svg' width='560px' alt='line'/>

        <div class='pie-chart-section'> 
          <img src='./left-line.svg' height='200px' alt='left-line'/>

          <div id="pie-chart-container"></div>

          <div class='pie-bullet'>
            ${pieData
              .map(
                (d: any) =>
                  `<div class='pie-bullets-group'> 
                    <img src='./bullets/${d.label.toLowerCase()}.svg' alt='rect'/>
                    <div> ${d.label} </div>
                  </div>`
              )
              .join('')}
          </div>

          <img src='./right-line.svg' height='200px' alt='right-line'/>
        </div>

        <img src='./pie-bottom-line.svg' width='560px' alt='line'/>
        
        ${pieData
          .map(
            (d: any) =>
              `<div class='bullet-detail-section vector'> 
                <img src='./vector.svg' width=300px' alt='vector'/>
                <div class='vector-text'> ${d.label} </div>
              </div>`
          )
          .join('')}
          <button id='close_button'>
          <img class='close-icon' src='./close-icon.svg' alt=''close-icon />
          </button>
      </div>`)

  // Append the pie chart to the container
  const pieChartContainer = document.getElementById('pie-chart-container')
  if (pieChartContainer) {
    const pieChart = drawPiechart(pieData)
    pieChartContainer.appendChild(pieChart)
  }

  function clickOnClose() {
    console.log('test')
    d3.select('.popup-object').style('display', 'none')
  }

  function reset() {
    svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity)
  }

  d3.select('#close_button').on('click', () => {
    clickOnClose()
    reset()
  })
}
