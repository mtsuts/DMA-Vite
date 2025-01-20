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
        'Sponshorships',
        'OOH/DOOH',
        'Influencers/Social Amplification',
      ],
    },
    {
      label: 'Intercept',
      properties: [
        'CTV',
        'Audio',
        'search non brand',
        'SOCIAL',
        'DIGITAL AUDIO',
        'OOH/DOOH',
      ],
    },
    {
      label: 'Nudge',
      properties: [
        'search brand',
        'DIGITAL VIDEO',
        'social',
        'DIGITAL DISPLAY',
      ],
    },
    {
      label: 'Win',
      properties: [
        'DIGITAL VIDEO',
        'DIGITAL DISPLAY',
        'Social',
        'SEARCH NON bRAND',
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
    .style('top', '40px')
    .style('width', window.innerWidth > 1440 ? '40%' : '50%')
    .style('height', '100%')
    .style('height', '600px')
    .style('overflow', 'auto')
    .style('z-index', 1000)
    .style('display', 'block')
    .style('background-image', "url('./popup-backgrounds.png')")
    .style('background-size', '100% 100%')
    .style('background-repeat', 'no-repeat')

  // Add HTML content to the popup
  popupDiv.html(`

      <div class='popup'> 

    <div id='close_button' class='close-icon'>
    <img src='./close-icon.svg' alt=''close-icon />
    </div>
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
        <div class='total-share'> 
        <div> ${data.Total.replace('$', '')} </div>
        <div> total market budget </div>
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


          <div class='bullet-detail-section vector'> 
              <img src='./vector.svg' width=300px' alt='vector'/>
              <div class='vector-text'> Rethink </div>
            <div>
            <div class='bullet-desc'>        
             <div> ${data['Rethink-Linear TV']} </div>
             <div> Linear TV </div>
            <div> 

            <div class='bullet-desc'>  
             <div> ${data['Rethink-CTV']} </div>
             <div> CTV </div>
             </div>

             <div class='bullet-desc'>  
             <div> ${data['Rethink-Radio']} </div>
             <div> Radio </div>
             </div>

            <div class='bullet-desc'>  
             <div> ${data['Rethink-Sponsorships']} </div>
             <div> Sponsorships </div>
             </div>

            <div class='bullet-desc'>  
             <div> ${data['Rethink-OOH/DOOH']} </div>
             <div> OOH/DOOH </div>
             </div>

              <div class='bullet-desc'>  
             <div> ${data['Rethink-NFLUENCERS / SOCIAL AMPLIFICATION']} </div>
             <div> OOH/DOOH </div>
             </div>
             <img  src='./detailed-line.svg'width=300px  alt='line' />
             </div>


            <div class='bullet-detail-section vector'> 
            <img src='./vector.svg' width=300px' alt='vector'/>
             <div class='vector-text'> Intercept </div>
            <div>
            <div class='bullet-desc'>        
             <div> ${data['Intercept-CTV']} </div>
             <div> CTV </div>
            <div> 

            <div class='bullet-desc'>  
             <div> ${data['Intercept-Audio']} </div>
             <div> Audio </div>
             </div>

             <div class='bullet-desc'>  
             <div> ${data['Intercept-Search Non Brand']} </div>
             <div> Search Non Brand </div>
             </div>

            <div class='bullet-desc'>  
             <div> ${data['Intercept-Social']} </div>
             <div> Social </div>
             </div>

            <div class='bullet-desc'>  
             <div> ${data['Intercept-DIGITAL AUDIO']} </div>
             <div> DIGITAL AUDIO </div>
             </div>

              <div class='bullet-desc'>  
             <div> ${data['Intercept-OOH / DOOH']} </div>
             <div> OOH/DOOH </div>
             </div>
             <img  src='./detailed-line.svg'width=300px  alt='line' />
             </div>


             <div class='bullet-detail-section vector'> 
             <img src='./vector.svg' width=300px' alt='vector'/>
             <div class='vector-text'> Nudge </div>
           <div>
           <div class='bullet-desc'>        
            <div> ${data['Nudge-Search Brand']} </div>
            <div> Search Brand </div>
           <div> 

           <div class='bullet-desc'>  
            <div> ${data['Nudge-Digital Video']} </div>
            <div> Digital Video </div>
            </div>

            <div class='bullet-desc'>  
            <div> ${data['Nudge-Social']} </div>
            <div> Social </div>
            </div>

           <div class='bullet-desc'>  
            <div> ${data['Nudge-Digital Display']} </div>
            <div> Digital Display </div>
            </div>
            <img  src='./detailed-line.svg'width=300px  alt='line' />
            </div>



            <div class='bullet-detail-section vector'> 
            <img src='./vector.svg' width=300px' alt='vector'/>
            <div class='vector-text'> Win </div>
          <div>
          <div class='bullet-desc'>        
           <div> ${data['Win-Digital Video']} </div>
           <div> Digital Video </div>
          <div> 

          <div class='bullet-desc'>  
           <div> ${data['Win-Digital Display']} </div>
           <div> Digital Display </div>
           </div>

           <div class='bullet-desc'>  
           <div> ${data['Intercept-Search Non Brand']} </div>
           <div> Search Non Brand </div>
           </div>

          <div class='bullet-desc'>  
           <div> ${data['Win-Social']} </div>
           <div> Social </div>
           </div>

          <div class='bullet-desc'>  
           <div> ${data['Win-Search Non Brand']} </div>
           <div> Search Non Brand </div>
           </div>
            <img  src='./detailed-line.svg'width=300px  alt='line' />
           </div>

           </div>

            </div>            
            </div>
           </div>
         
          </div>
            <img class='popup-logo' src='./logo.svg' alt='logo' />
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
  }

  function reset() {
    svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity)
  }

  d3.select('#close_button').on('click', () => {
    clickOnClose()
    reset()
  })
}
