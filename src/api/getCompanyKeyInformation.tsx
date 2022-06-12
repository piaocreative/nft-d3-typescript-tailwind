import { httpRequest } from './httpRequest'
import { liveHttpRequest } from './liveHttpRequest'

export const getCompanyKeyInformation = async (company_id: string) => {
  return await liveHttpRequest().get(
    '/' +
      company_id +
      '/key_information?api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}
