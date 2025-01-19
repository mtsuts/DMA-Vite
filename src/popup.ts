export function drawPopup(svg: any) {
  svg.selectAll('.popup-object').remove()
  const foreignObject = svg
    .append('foreignObject')
    .attr('x', 700)
    .attr('y', 150)
    .attr('width','40%')
    .attr('height', "40%")
    .attr('class', 'popup-object')
    .style('overflow', 'visible')
    .style('background-image', "url('/public/popup-background.png')") 
    .style('background-size', '100% 100%') 
    .style('background-repeat', 'no-repeat') 
    .style('padding', '40px')
    .style('text-align', 'middle')

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
    .text('Hi popup')

}
