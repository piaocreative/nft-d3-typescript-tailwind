import React, { useContext, useEffect, useMemo } from 'react'
import * as d3 from 'd3'
import Tooltip from 'react-tooltip'
import { CompanyContext } from '../../context/CompanyContext'
import { TypeDataDpData } from '../../types/Type'

interface Props {
  data: TypeDataDpData[] | any
  width: number
  height: number
}

export const DataPoints: React.FC<Props> = ({ data, width, height }) => {
  const { company_id } = useContext(CompanyContext)

  useEffect(() => {
    Tooltip.rebuild()
  }, [company_id])

  const valueFunction = (d: TypeDataDpData): number => d.value

  const maxValue = useMemo(() => d3.max(data, valueFunction) || 0, [data])

  const yScale = d3
    .scaleBand()
    .paddingInner(0.3)
    .domain(data.map((d: TypeDataDpData) => d.id))
    .range([0, height])
  const widthScale = d3.scaleLinear().domain([0, maxValue]).range([0, width])

  return (
    <>
      <h2 className="subtitle mt-4 mb-2">Data Points</h2>

      <div className="flex gap-4">
        <div className="basis-1/2 flex flex-col justify-around pl-2">
          <h2 className="text-base">Environment</h2>
          <h2 className="text-base">Governance</h2>
          <h2 className="text-base">Social</h2>
        </div>
        <svg className="basis-1/2" width="100%" height={height}>
          {data.map((d: TypeDataDpData) => (
            <g key={d.id}>
              <rect
                key={d.id}
                data-tip
                data-for={d.id}
                className="hover:stroke-black cursor-pointer"
                x={20}
                y={yScale(d.id)}
                height={yScale.bandwidth()}
                fill={d.value_type === '+' ? '#f28e2b' : '#4e79a7'}
                width={widthScale(valueFunction(d)) + '%'}
              />
              <text
                className="pointer-events-none dark:fill-gray-300"
                x={d.value_type === '+' ? 0 : 2}
                y={(yScale(d.id) || 0) + yScale.bandwidth() / 2}
                dy="0.3rem"
                fill="black"
              >
                {d.value_type}
              </text>
            </g>
          ))}
        </svg>
        {data.map((d: TypeDataDpData) => (
          <Tooltip key={d.id} type="light" id={d.id} place="left">
            <div>Topic: {d.topic}</div>
            <div>{`${d.value_type}: ${d.value}`}</div>
          </Tooltip>
        ))}
      </div>
      <div className="my-3 italic text-[10px] opacity-70">
        Useful for Green Washing Analysis
      </div>
    </>
  )
}
