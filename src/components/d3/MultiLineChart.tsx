import React, { useEffect } from 'react'
import * as d3 from 'd3'
import {
  TypeNews,
  TypeTopicData,
  TypeFormatedTopicData,
} from '../../types/Type'

interface props {
  data: TypeNews[] | any
  wrap_width: number
}

export const MultiLineChart: React.FC<props> = ({ data, wrap_width }) => {
  useEffect(() => {
    data.length && renderChart()
  }, [data])

  const renderChart = () => {
    const width = wrap_width
    const height = 200
    const margin = 50

    const lineOpacity = '1'
    const lineOpacityHover = '0.85'
    const otherLinesOpacityHover = '0.1'
    const lineStroke = '0.2rem'
    const lineStrokeHover = '2.5px'

    /* Add SVG */
    d3.selectAll('.new-sentiment').remove()
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('class', 'new-sentiment')
      .attr('width', width + margin + 'px')
      .attr('height', height + margin + 'px')
      .append('g')
      .attr('transform', `translate(${margin}, 0)`)

    /* Format Data */
    const formatedData = data.map((d: any) => {
      return {
        ...d,
        topic_datas: d.topic_datas.map((topic: TypeTopicData) => {
          return { ...topic, day: new Date(topic.day) }
        }),
      }
    })

    //Accessors
    const x = (d: TypeFormatedTopicData): Date => d.day
    const y = (d: TypeFormatedTopicData): number => d.cumulative_score

    const x_min = d3.min([
      (formatedData[0]?.topic_datas
        ? d3.min(formatedData[0]?.topic_datas, x)
        : 0) as number,
      (formatedData[1]?.topic_datas
        ? d3.min(formatedData[1]?.topic_datas, x)
        : 0) as number,
      (formatedData[2]?.topic_datas
        ? d3.min(formatedData[2]?.topic_datas, x)
        : 0) as number,
    ])

    const x_max = d3.max([
      (formatedData[0]?.topic_datas
        ? d3.max(formatedData[0]?.topic_datas, x)
        : 0) as number,
      (formatedData[1]?.topic_datas
        ? d3.max(formatedData[1]?.topic_datas, x)
        : 0) as number,
      (formatedData[2]?.topic_datas
        ? d3.max(formatedData[2]?.topic_datas, x)
        : 0) as number,
    ])
    const y_min = d3.min([
      (formatedData[0]?.topic_datas
        ? d3.min(formatedData[0]?.topic_datas, y)
        : 0) as number,
      (formatedData[1]?.topic_datas
        ? d3.min(formatedData[1]?.topic_datas, y)
        : 0) as number,
      (formatedData[2]?.topic_datas
        ? d3.min(formatedData[2]?.topic_datas, y)
        : 0) as number,
    ])

    const y_max = d3.max([
      (formatedData[0]?.topic_datas
        ? d3.max(formatedData[0]?.topic_datas, y)
        : 0) as number,
      (formatedData[1]?.topic_datas
        ? d3.max(formatedData[1]?.topic_datas, y)
        : 0) as number,
      (formatedData[2]?.topic_datas
        ? d3.max(formatedData[2]?.topic_datas, y)
        : 0) as number,
    ])
    /* Scale */
    // const xScale = d3
    //   .scaleLinear()
    //   .domain(d3.extent(formatedData[0].topic_datas, x) as any)
    //   .range([0, width - margin])
    const xScale = d3
      .scaleLinear()
      .domain([x_min, x_max] as any)
      .range([0, width - margin])

    const yScale = d3
      .scaleLinear()
      .domain([y_min, y_max] as any)
      .range([height, margin])

    const color = d3.scaleOrdinal(d3.schemeCategory10)
    /* Add Axis into SVG */
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(3)
      .tickFormat((d: any) => `${d3.timeFormat('%B %d, %y')(d)}`)

    const yAxis = d3.axisLeft(yScale).ticks(3)

    svg
      .append('g')
      .attr('class', 'x axis dark:text-gray-300')
      .attr('transform', `translate(0, ${height + 10})`)
      .attr('stroke-width', 0)
      .style('font-size', '0.8rem')
      .call(xAxis)

    svg
      .append('g')
      .attr('class', 'y axis dark:text-gray-300')
      .attr('stroke-width', 0)
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('class', 'dark:fill-gray-300')
      .attr('y', 0 - margin)
      .attr('x', 0 - height / 2)
      .attr('fill', '#000')
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('New Sentiment')
      .style('font-size', '0.8rem')

    var div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
    /* Add line into SVG */
    const line = d3
      .line()
      .x((d: any) => xScale(d.day))
      .y((d: any) => yScale(d.cumulative_score))

    let lines = svg.append('g').attr('class', 'lines')

    lines
      .selectAll('.line-group')
      .data(formatedData)
      .enter()
      .append('g')
      .attr('class', 'line-group')
      .on('mouseover', (event, d: any) => {
        svg
          .append('text')
          .attr('class', 'title-text dark:fill-gray-300')
          .text(d.topic)
          .attr('text-anchor', 'middle')
          .attr('x', (width - margin) / 2)
          .attr('y', 30)
      })
      .on('mouseout', function (d) {
        svg.select('.title-text').remove()
      })
      .append('path')
      .attr('class', 'line')
      .attr('d', (d: any) => line(d.topic_datas))
      .style('stroke', (d: any, i) => {
        switch (d.topic) {
          case 'environmental':
            return 'rgb(89, 161, 79)'
          case 'governance':
            return 'rgb(176, 122, 161)'
          case 'social':
            return 'rgb(78, 121, 167)'
        }
        return 'rgb(89, 161, 79)'
      })
      .style('stroke-width', '0.2rem')
      .style('opacity', lineOpacity)
      .on('mouseover', function (d: any) {
        d3.selectAll('.line').style('opacity', otherLinesOpacityHover)
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style('stroke-width', lineStrokeHover)
          .style('cursor', 'pointer')
      })
      .on('mouseout', function (d) {
        d3.selectAll('.line').style('opacity', lineOpacity)
        d3.select(this)
          .style('stroke-width', lineStroke)
          .style('cursor', 'none')
      })
  }
  return <div id="chart" className="basis-3.5" />
}
