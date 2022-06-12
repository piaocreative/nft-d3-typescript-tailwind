import { liveHttpRequest } from './liveHttpRequest'

export const getCompanySdgScores = async (company_id: string) => {
  return await liveHttpRequest().get(
    '/' +
      company_id +
      '/sdg_scores?api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}
