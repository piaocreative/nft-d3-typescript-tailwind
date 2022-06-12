import React, { useEffect, useState } from 'react'
import { getCompanyTopics } from '../../../api/getCompanyTopics'
import { Rating } from './Rating'
import { PageLoading } from '../../../components/PageLoading'

interface Props {
  company_id: string
}

export const Ratings: React.FC<Props> = ({ company_id }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCompanyTopics(company_id)
      .then((response) => {
        setData(response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [company_id])

  const topics = data ? (data as string[]) : []

  return loading ? (
    <PageLoading />
  ) : (
    // <span>loading...</span>
    <div className="my-3 text-center">
      <h2 className="subtitle">ESG Ratings</h2>
      {!!topics.length && (
        <div className="relative">
          <div className="border-t absolute top-1/2 left-0 right-0 border-gray-300 dark:border-gray-700"></div>
          <div className="relative flex justify-around gap-4">
            {topics.map((topic, index) => (
              <Rating key={index} company_id={company_id} topic={topic} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
