import './style.css'
import * as topojson from 'topojson-client'
import * as d3 from 'd3'
import { drawMap } from './map'
import dmajson from './data/nielsentopo.json'

d3.json('./src/data/map.json').then((data) => {
  const container = d3.select('.map-container')
  // const usgeojson = topojson.feature(data as any, (data as any).objects.states)
  const dma = topojson.feature(
    dmajson as any,
    (dmajson as any).objects.nielsen_dma
  )

  drawMap({ container, width: 1000, height: 600,  dma })
})
