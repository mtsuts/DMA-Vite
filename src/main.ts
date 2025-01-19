import './style.css'
import * as topojson from 'topojson-client'
import * as d3 from 'd3'
import { drawMap } from './map'

d3.json('./src/data/map.json').then((data) => {
  const container = d3.select('.map-container')
  const usgeojson = topojson.feature(data as any, (data as any).objects.states)
  drawMap({ container, width: 850, height: 650, usgeojson: usgeojson })
})
