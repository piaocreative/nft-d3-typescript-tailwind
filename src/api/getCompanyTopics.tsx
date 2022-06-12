import { liveHttpRequest } from './liveHttpRequest'

export const getCompanyTopics = async (company_id: string) => {
  return await liveHttpRequest().get(
    '/' + company_id + '/topics?&api_key=' + process.env.REACT_APP_ESG_API_Key,
  )
}
