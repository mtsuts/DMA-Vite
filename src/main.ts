import './style.css'
import * as topojson from 'topojson-client'
import * as d3 from 'd3'
import { drawMap } from './map'
import dmajson from './data/nielsentopo.json'

d3.csv('/markets.csv').then((marketsData) => {
  const container = d3.select('.map-container')
  const dma = topojson.feature(
    dmajson as any,
    (dmajson as any).objects.nielsen_dma
  )
  const markets = marketsData.filter((d: any) => d !== 'columns')

  drawMap({
    container,
    width: window.innerWidth > 1440 ? 1500 : window.innerWidth < 768  ? 1000 : 1400,
    height: window.innerWidth < 768 ? 500 : 680,
    dma,
    markets,
  })
})
