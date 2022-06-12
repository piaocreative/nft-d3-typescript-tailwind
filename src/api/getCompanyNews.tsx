import { httpRequest } from './httpRequest'
import { liveHttpRequest } from './liveHttpRequest'

export const getCompanyNews = async (company_id: string) => {
  return await liveHttpRequest().get(
    '/' + company_id + '/news?api_key=' + process.env.REACT_APP_ESG_API_Key,
  )
}
