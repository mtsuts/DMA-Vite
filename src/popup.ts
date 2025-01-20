import { drawPiechart } from './pieChart'

export function drawPopup(svg: any, data: any, zoom: any) {
  const pieData = [
    { label: 'Rethink', value: Number(data.Rethink.replace('%', '')) },
    { label: 'Intercept', value: Number(data.Intercept.replace('%', '')) },
    { label: 'Nudge', value: Number(data.Nudge.replace('%', '')) },
    { label: 'Win', value: Number(data.Win.replace('%', '')) },
    { label: 'Grow', value: Number(data.Grow.replace('%', '')) },
  ]


  svg.selectAll('.popup-object').remove()
  const foreignObject = svg
    .append('foreignObject')
    .attr('x', 500)
    .attr('y', 150)
    .attr('width', '60%')
    .attr('height', '100%')
    .attr('class', 'popup-object')
    .style('overflow', 'visible')
    .style('background-color', '')
    .style('background-image', "url('./popup-background.png')")
    .style('background-size', '100% 100%')
    .style('background-repeat', 'no-repeat')

  foreignObject
    .append('xhtml:div')
    .style('position', 'absolute')
    .style('background-color', 'transparent')
    .style('color', '#fff')
    .style('font-size', '20px')
    .style('border-radius', '10px')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('justify-content', 'center')
    .style('width', '100%')
    .style('overflow', 'auto')
    .style('height', '600px').html(`
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
         <div> Homes <br/> Passed % </div>
          </div> 
      </div>

      <img src='./bullet-bottom-line.svg' width='700px' alt='line'/>

      <div class='pie-chart-section'> 
      <img src='./left-line.svg' height='200px' alt='left-line'/>

       <div id="pie-chart-container"></div>

       <div class='pie-bullet'>
       ${pieData
         .map((d: any) => {
           return `<div class='pie-bullets-group'> 
        <img src='./bullets/${d.label.toLowerCase()}.svg' alt='rect'/>
        <div> ${d.label} </div>
       </div>`
         })
         .join('')}
       </div>

        <img src='./right-line.svg' height='200px' alt='right-line'/>
      </div>

     <img src='./pie-bottom-line.svg' width='700px' alt='line'/>



      </div>`)

  // Append the pie chart to the container
  const pieChartContainer = document.getElementById('pie-chart-container')
  if (pieChartContainer) {
    const pieChart = drawPiechart(pieData)
    pieChartContainer.appendChild(pieChart)
  }
}
    //  <img src='./vector.svg' width=300px' alt='vector'/>