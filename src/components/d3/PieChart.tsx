import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface Props {
  prefix?: string
  radius?: number
  scale?: number
  max?: number
  border_width?: number
  label?: string
  color?: string
  type?: string
  active_type?: string
  setActiveType?: (val: string) => void
}

export const PieChart: React.FC<Props> = ({
  prefix = '',
  label = '',
  scale = 0,
  max = 100,
  radius = 65,
  border_width = 15,
  color = '#000',
  type = '',
  active_type = '',
  setActiveType,
}) => {
  const width = radius * 2 + 10
  const height = width
  const ref = useRef<SVGSVGElement>(null)
  const [current, setCurrent] = useState('')

  const progressArc = (radius: number, start: number, end: number) =>
    d3.arc()({
      innerRadius: 0,
      outerRadius: radius,
      startAngle: 2 * Math.PI * start,
      endAngle: 2 * Math.PI * end,
    }) || undefined

  const showArc = (e: React.MouseEvent<SVGPathElement>) => {
    let cur = e.currentTarget.id.replace(prefix + '_arc_', '')
    current === cur ? setCurrent('') : setCurrent(cur)
  }

  const hideArc = (e: React.MouseEvent<SVGUseElement>) => {
    setCurrent('')
  }

  const showLine = (e: React.MouseEvent<SVGPathElement>) => {
    let line_id: string = e.currentTarget.id.replace('arc_', 'line_')
    let element = document.getElementById(line_id)
    element && (element.style.opacity = '1')
    document
      .getElementById(prefix + '_use_line')
      ?.setAttribute('xlink:href', '#' + line_id)
  }

  const hideLine = (e: React.MouseEvent<SVGPathElement>) => {
    let line_id: string = e.currentTarget.id.replace('arc_', 'line_')
    let element = document.getElementById(line_id)
    element && (element.style.opacity = '0')
    document
      .getElementById(prefix + '_use_line')
      ?.setAttribute('xlink:href', '')
  }

  const arcClass = (sel: string) =>
    'transition duration-300 ease-in-out ' +
    (active_type !== '' && active_type !== type
      ? 'opacity-30'
      : current === sel
      ? 'stroke-2 stroke-black dark:stroke-white'
      : current !== ''
      ? 'opacity-30'
      : '')

  let text_class =
    'transition duration-300 ease-in-out ' +
    (active_type !== '' && active_type !== type
      ? 'opacity-30'
      : current === 'circle' || current === ''
      ? ''
      : 'opacity-0')
  let line_class = 'stroke stroke-black dark:stroke-white opacity-0'

  const handleClickOutside = (e: MouseEvent) => {
    ref &&
      ref.current &&
      (ref.current.contains(e.target as Node)
        ? typeof setActiveType === 'function' && setActiveType(type)
        : setCurrent(''))
  }

  useEffect(() => {
    if (typeof setActiveType === 'function') {
      if (active_type === type && current === '') {
        setActiveType('')
      }
      if (active_type !== type && current !== '') {
        setActiveType(type)
      }
    }
  }, [current])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <svg
        ref={ref}
        width={width}
        height={height}
        className="m-auto cursor-pointer"
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <path
            className="fill-gray-200 dark:fill-gray-300"
            d={progressArc(radius, 0, 1)}
          ></path>
          <path
            id={`${prefix}_arc_active`}
            fill={color}
            d={progressArc(radius, 0, scale)}
            onMouseEnter={showLine}
            onMouseLeave={hideLine}
            onClick={showArc}
            className={arcClass('active')}
          ></path>
          <path
            id={`${prefix}_arc_deactive`}
            className={`fill-gray-300 dark:fill-gray-400 ${arcClass(
              'deactive',
            )}`}
            d={progressArc(radius, scale, 1)}
            onMouseEnter={showLine}
            onMouseLeave={hideLine}
            onClick={showArc}
          ></path>
          <path
            id={`${prefix}_arc_circle`}
            className={`fill-gray-200 dark:fill-gray-300 ${arcClass('circle')}`}
            d={progressArc(radius - border_width, 0, 1)}
            onMouseEnter={showLine}
            onMouseLeave={hideLine}
            onClick={showArc}
          ></path>
          <text
            className={`pointer-events-none text-xxs capitalize ${text_class}`}
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            transform={`translate(${-width / 2}, ${-height / 2})`}
          >
            <tspan x="50%" y="50%" dy="0.6rem">
              {label}
            </tspan>
            <tspan x="50%" y="50%" dy={label ? '-0.6rem' : '0'}>
              <tspan className="text-xs font-bold">
                {Math.round(scale * max)}
              </tspan>{' '}
              / {max}
            </tspan>
          </text>
          <path
            id={`${prefix}_line_active`}
            className={line_class}
            fill="none"
            d={progressArc(radius, 0, scale)}
          ></path>
          <path
            id={`${prefix}_line_deactive`}
            className={line_class}
            fill="none"
            d={progressArc(radius, scale, 1)}
          ></path>
          <path
            id={`${prefix}_line_circle`}
            className={line_class}
            fill="none"
            d={progressArc(radius - border_width, 0, 1)}
          ></path>
          <use
            id={`${prefix}_use_arc`}
            xlinkHref={
              current !== 'circle' ? '#' + prefix + '_arc_' + current : ''
            }
            onClick={hideArc}
          />
          <use id={`${prefix}_use_line`} xlinkHref="" />
        </g>
      </svg>
    </>
  )
}
