import { drawPiechart } from './pieChart'
import * as d3 from 'd3'

export function drawPopup(svg: any, data: any, zoom: any) {
  const pieData = [
    { label: 'Rethink', value: Number(data.Rethink.replace('%', '')) },
    { label: 'Intercept', value: Number(data.Intercept.replace('%', '')) },
    { label: 'Nudge', value: Number(data.Nudge.replace('%', '')) },
    { label: 'Win', value: Number(data.Win.replace('%', '')) },
  ]

  const tableData = [
    {
      label: 'Rethink',
      properties: [
        'Linear TV',
        'CTV',
        'Radio',
        'Sponsorships',
        'OOH/DOOH',
        'INFLUENCERS / SOCIAL AMPLIFICATION',
      ],
    },
    {
      label: 'Intercept',
      properties: [
        'CTV',
        'Audio',
        'Search Non Brand',
        'Social',
        'DIGITAL AUDIO',
        'OOH / DOOH',
      ],
    },
    {
      label: 'Nudge',
      properties: [
        'Search Brand',
        'Digital Video',
        'Social',
        'Digital Display',
      ],
    },
    {
      label: 'Win',
      properties: [
        'Digital Video',
        'Digital Display',
        'Social',
        'Search Non Brand',
      ],
    },
  ]

  // Remove existing popup elements
  d3.selectAll('.popup-object').remove()

  // Append a div to the body for the popup
  const popupDiv = d3
    .select('body')
    .append('div')
    .attr('class', 'popup-object')
    .style('position', 'absolute')
    .style('left', window.innerWidth - 800 + 'px')
    .style('top', '60px')
    .style('width', window.innerWidth / 2)
    .style('height', '100%')
    .style('height', '600px')
    .style('overflow', 'hidden')
    .style('z-index', 1000)
    .style('display', 'block')
    .style('background-image', "url('./popup.svg')")
    .style('background-size', '100% 100%')
    .style('background-repeat', 'no-repeat')

  // Add HTML content to the popup
  popupDiv.html(`

    <div class='popup'> 

    <div id='close_button' class='close-icon'>
    <img src='./close-icon.svg' alt=''close-icon />
    </div>
      <div class='popup-logo'>
      <img src='./popup-logo.svg' width='140px' alt='popup-logo'/>
        </div>
    

        <div class='popup-header'> 
          <img src='./popup-play.svg' width=37 height=42 alt='play'/>
          <img src='./popup-title-left.svg' />
          <div class='popup-title'> ${data.Market} </div>
          <img src='./popup-title-right.svg' />
        </div> 

        <div class='popup-content'>

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
        <div class='total-share'> 
        <div> ${data.Total.replace('$', '')} </div>
        <div> total market budget </div>
        </div>
        
    
        <img src='./bullet-bottom-line.svg' class='lines'  alt='line'/>

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

        <img src='./pie-bottom-line.svg' class='lines'  alt='line'/>
  
             ${tableData
               .map((x: any) => {
                 return `<div class='bullet-detail-section vector'>
                  <img src='./vector.svg' width=300px' alt='vector'/>
                  <div class='vector-text'> ${x.label} </div>

                   <div class='bullet-desc-object'>
                  
                   ${x.properties
                     .map((a: any) => {
                       return `<div class='bullet-desc'>  
                       <div class='bullet-label'> ${
                         data[`${x.label}-${a}`]
                       } </div>
                       <div class='bullet-value'> ${
                         data[`${x.label}-${a}`] ? a : ''
                       } </div>
                       </div>`
                     })
                     .join('')}   
                   </div>
                    <img  src='./detailed-line.svg'width=300px  alt='line' />   
               </div>
               `
               })
               .join('')}   
               </div>
          </div>
      `)

  // Append the pie chart to the container
  const pieChartContainer = document.getElementById('pie-chart-container')
  if (pieChartContainer) {
    const pieChart = drawPiechart(pieData)
    pieChartContainer.appendChild(pieChart)
  }

  function clickOnClose() {
    d3.select('.popup-object').style('display', 'none')
    svg.selectAll('.tooltip-object').remove()
    svg.selectAll('.dma').style('filter', 'none')
  }

  function reset() {
    svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity)
  }

  d3.select('#close_button').on('click', () => {
    clickOnClose()
    reset()
  })


}
