export function drawPopup(svg: any, data: any) {
  console.log(data)
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
      <img src='./bullet-bottom-line.svg' width='500px' alt='line'/>

      <div class='pie-chart-section'> 
      <img src='./left-line.svg' height='200px' alt='left-line'/>
      <div> pie chart  </div>
       <div class='pie-bullets'>
       <div class='pie-bullets-group'> 
        <img src='./bullets/rethink.svg' alt='rething-rect'/>
        <div> Rethink </div>
       </div> 
       </div>
        <img src='./right-line.svg' height='200px' alt='right-line'/>
      </div>

      </div>`)
}
