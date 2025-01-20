export function drawPopup(svg: any, data: any) {
  console.log(data)
  svg.selectAll('.popup-object').remove()
  const foreignObject = svg
    .append('foreignObject')
    .attr('x', 700)
    .attr('y', 150)
    .attr('width', '40%')
    .attr('height', '40%')
    .attr('class', 'popup-object')
    .style('overflow', 'visible')
    .style('background-image', "url('./popup-background.png')")
    .style('background-size', '100% 100%')
    .style('background-repeat', 'no-repeat')
    // .style('padding', '20px')

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
    .style('height', '100px').html(`
      <div> 
      <div class='popup-container'> 
      <img src='./popup-play.png' alt='play'/>
      <div> ${data.Market} </div>
      </div> 
      </div>`)
}
