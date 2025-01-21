import './style.css'
import * as topojson from 'topojson-client'
import * as d3 from 'd3'
import { drawMap } from './map'
import dmajson from './data/nielsentopo.json'

Promise.all([d3.csv('./markets.csv'), d3.csv('./mainData.csv')]).then(
  ([marketsData, mainData]) => {
    const container = d3.select('.map-container')
    const dma = topojson.feature(
      dmajson as any,
      (dmajson as any).objects.nielsen_dma
    )
    const markets = marketsData.filter((d: any) => d !== 'columns')
    const data = mainData.filter((d: any) => d !== 'columns')
console.log(window.innerWidth)
    drawMap({
      container,
      width: window.innerWidth,
      height: window.innerHeight,
      dma,
      markets,
      data,
    })
  }
)
// window.innerWidth < 768 ? 500 : 800
// window.innerWidth > 1440 ? 1500 : window.innerWidth < 768 ? 1000 : 1400
