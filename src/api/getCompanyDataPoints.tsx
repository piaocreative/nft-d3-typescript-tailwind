import { liveHttpRequest } from './liveHttpRequest'

export const getCompanyDataPoints = async (company_id: string) => {
  return await liveHttpRequest().get(
    '/' +
      company_id +
      '/score_counts?api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}
