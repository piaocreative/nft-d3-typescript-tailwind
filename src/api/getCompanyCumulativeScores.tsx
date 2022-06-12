import { liveHttpRequest } from './liveHttpRequest'

export const getCompanyCumulativeScores = async (
  company_id: string,
  topic: string,
) => {
  return await liveHttpRequest().get(
    '/' +
      company_id +
      '/cumulative_scores' +
      '?topics=' +
      topic +
      '&api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}
