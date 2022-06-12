import { liveHttpRequest } from './liveHttpRequest'

export const getCompanyScores = async (
  company_id: string,
  topics: string,
  sub_topics: string,
) => {
  return await liveHttpRequest().get(
    '/' +
      company_id +
      '/scores/?topics=' +
      topics +
      '&subtopics=' +
      sub_topics +
      '&api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}
