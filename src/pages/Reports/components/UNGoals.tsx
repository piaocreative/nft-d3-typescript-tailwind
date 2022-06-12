import React, { useEffect, useState } from 'react'
import { PieChart } from '../../../components/d3/PieChart'
import { getCompanySdgScores } from '../../../api/getCompanySdgScores'
import { PageLoading } from '../../../components/PageLoading'

interface Props {
  company_id: string
}

export const UNGoals: React.FC<Props> = ({ company_id }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<number>(0)

  useEffect(() => {
    getCompanySdgScores(company_id)
      .then((response) => {
        const sdg_score: number = response?.data?.data[0]?.positive_sdgs || 0
        setData(sdg_score / 17)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [company_id])

  return loading ? (
    <PageLoading />
  ) : (
    // <span>loading...</span>
    <div className="my-3 text-center">
      <h2 className="subtitle">UN Sustainability Goals</h2>
      <div className="m-2 text-center relative">
        <div className="border-t absolute top-1/2 left-0 right-0 border-gray-300 dark:border-gray-700"></div>
        <div className="relative">
          <PieChart
            prefix="pie_goals"
            label="Goals Met"
            scale={data}
            max={17}
            color={data < 0.5 ? '#e15759' : '#4e79a7'}
          />
        </div>
      </div>
    </div>
  )
}
