import { liveHttpRequest } from './liveHttpRequest'

export const getCompanies = async (company_type: string, restrict: boolean) => {
  return await liveHttpRequest().get(
    '/' +
      '?company_type=' +
      company_type +
      '&restrict=' +
      restrict +
      '&api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}