import React, { useEffect, useState, useRef } from 'react'
import { getCompanyCumulativeScores } from '../../../api/getCompanyCumulativeScores'
import { MultiLineChart } from '../../../components/d3/MultiLineChart'
import { TypeNews } from '../../../types/Type'
import { PageLoading } from '../../../components/PageLoading'

interface Props {
  company_id: string
}

export const NewsSentiment: React.FC<Props> = ({ company_id }) => {
  const [data, setData] = useState<TypeNews[] | any>([])
  const ref = useRef<HTMLDivElement>(null)
  const [wrapWidth, setWrapWidth] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const getListSize = () => {
    const newWidth = ref.current?.clientWidth || 0
    setWrapWidth(newWidth)
  }

  useEffect(() => {
    setWrapWidth(ref.current?.offsetWidth || 0)
    window.addEventListener('resize', getListSize)
  }, [])

  useEffect(() => {
    setLoading(true)
    const sum_data: any[] = []
    getCompanyCumulativeScores(company_id, 'environmental')
      .then((response) => {
        response?.data?.data[0]?.topic_datas.length &&
          sum_data.push(response.data.data[0])
      })
      .finally(() => {
        getCompanyCumulativeScores(company_id, 'governance')
          .then((response) => {
            response?.data?.data[0]?.topic_datas.length &&
              sum_data.push(response.data.data[0])
          })
          .finally(() => {
            getCompanyCumulativeScores(company_id, 'social')
              .then((response) => {
                response?.data?.data[0]?.topic_datas.length &&
                  sum_data.push(response.data.data[0])
              })
              .finally(() => {
                setLoading(false)
                setData(sum_data)
              })
          })
      })
  }, [company_id])
  return (
    <div className="my-3 text-center flex flex-row h-65">
      <div className="basis-2/3" ref={ref}>
        <h2 className="subtitle">Last 12 Months</h2>
        {data.length ? (
          <MultiLineChart data={data} wrap_width={wrapWidth} />
        ) : (
          <></>
        )}
        <div id="chart" className="basis-3.5" />
      </div>
      <div className="text-left basis-1.5 subtitle">
        Topic
        <div className="flex items-center">
          <span className="bg-emerald-500 inline-block h-4 w-4"></span>
          <span className="pl-1 text-sm">Environmental</span>
        </div>
        <div className="flex items-center">
          <span className="bg-fuchsia-500 inline-block  h-4 w-4"></span>
          <span className="pl-1 text-sm">Governance</span>
        </div>
        <div className="flex items-center">
          <span className="bg-indigo-500 inline-block h-4 w-4"></span>
          <span className="pl-1 text-sm">Social</span>
        </div>
      </div>
    </div>
  )
}
