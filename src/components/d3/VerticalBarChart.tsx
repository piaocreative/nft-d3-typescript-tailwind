import React, { useMemo, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { easeQuadInOut } from 'd3-ease'
import {
  MenuAlt1Icon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/solid'
import { NodeGroup } from 'react-move'

interface ChartData {
  value: number
  barColor: string
  bgColor: string
  label: string
}

interface Props {
  width?: number
  height?: number
  x_min?: number
  x_max?: number
  y_min?: number
  y_max?: number
  max?: number
  padding_inner?: number
  data: ChartData[]
  caption?: string
  sortable?: boolean
  refresh?: boolean
}

export const VerticalBarChart: React.FC<Props> = ({
  x_min = 0,
  x_max = 1,
  y_min = 0,
  y_max = 1,
  width = 200,
  height = 150,
  max = 100,
  padding_inner = 0.4,
  data,
  caption = '',
  sortable = false,
  refresh = false,
}) => {
  const [activeLabel, setActiveLabel] = useState('')
  const handleClick = (label: string) => {
    activeLabel === label ? setActiveLabel('') : setActiveLabel(label)
  }

  const [chart_data, setChartData] = useState(data)
  const [sort, setSort] = useState(0) // 0: default, 1: desc, 2: asc
  const handleSort = () => {
    setSort((sort + 1) % 3)
  }

  const sortStyle = {
    marginTop: '-0.2rem',
    marginLeft: '-0.2rem',
    transform: 'scaleX(0.8) scaleY(0.77)',
  }

  useMemo(() => {
    const org_data = [...data].sort((a, b) => {
      if (sort === 1) {
        return b.value - a.value
      }
      if (sort === 2) {
        return a.value - b.value
      }
      return 0
    })
    setChartData(org_data)
  }, [data, sort])

  useEffect(() => {
    if (refresh === true) {
      setActiveLabel('')
    }
  }, [refresh])

  const yScale = d3
    .scaleBand()
    .paddingInner(padding_inner)
    .domain(chart_data.map((d) => d.label))
    .range([y_min * height, y_max * height])

  const xScale = d3
    .scaleLinear()
    .domain([x_min * max, x_max * max])
    .range([x_min * width, x_max * width])

  return (
    <>
      {!!chart_data.length && (
        <>
          <div className="border-l border-solid border-gray-300 text-xs py-2 dark:border-gray-700">
            <svg width={`${width}%`} height={height}>
              <NodeGroup
                data={chart_data}
                keyAccessor={(d) => d.label}
                start={(d, i) => {
                  return { opacity: 1e-6, y: height / 2 }
                }}
                enter={(d) => {
                  return {
                    opacity: [0.7],
                    y: [yScale(d.label)],
                    timing: { duration: 750, ease: easeQuadInOut },
                  }
                }}
                update={(d, i) => ({
                  opacity: [0.7],
                  y: [yScale(d.label)],
                  timing: {
                    duration: 750,
                    //delay: i * 50,
                    ease: easeQuadInOut,
                  },
                })}
                leave={() => ({
                  opacity: [1e-6],
                  y: [yScale.range()[1]],
                  timing: { duration: 750, ease: easeQuadInOut },
                })}
              >
                {(nodes) => (
                  <>
                    {nodes.map(({ key, data, state: { y, opacity } }) => (
                      <g
                        key={key}
                        transform={`translate(0, ${y})`}
                        className={`cursor-pointer transition-opacity duration-300 ease-in-out vertical-bar ${
                          activeLabel && activeLabel !== data.label
                            ? 'opacity-30'
                            : ''
                        }`}
                        onClick={() => {
                          handleClick(data.label)
                        }}
                      >
                        <rect
                          height={yScale.bandwidth()}
                          width={`${xScale(max)}%`}
                          fill={data.bgColor}
                        />
                        <rect
                          className={`bar ${
                            activeLabel === data.label
                              ? 'active stroke-2 stroke-black dark:stroke-white'
                              : ''
                          }`}
                          height={yScale.bandwidth()}
                          width={`${xScale(data.value)}%`}
                          fill={data.barColor}
                        />
                        <text
                          className="pointer-events-none"
                          x={5}
                          y={yScale.bandwidth() / 2}
                          dy="0.25rem"
                          fill="#fff"
                        >
                          {data.label}
                        </text>
                      </g>
                    ))}{' '}
                  </>
                )}
              </NodeGroup>
            </svg>
          </div>
          <div className="relative w-full py-2 text-xs text-center text-gray-500 dark:text-gray-400">
            <span className="absolute left-0">{x_min * max}</span>
            <span>{Math.round(((x_min + x_max) * max) / 2)}</span>
            <span className="absolute right-0">{x_max * max}</span>
          </div>
          {!!caption && (
            <div className="text-center text-xs dark:text-white">
              {caption}
              {!!sortable && (
                <div
                  className="inline-block align-middle text-left cursor-pointer ml-3 w-4 h-4"
                  onClick={handleSort}
                >
                  {sort === 0 ? (
                    <MenuAlt1Icon style={sortStyle} />
                  ) : sort === 1 ? (
                    <SortAscendingIcon />
                  ) : (
                    <SortDescendingIcon />
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
