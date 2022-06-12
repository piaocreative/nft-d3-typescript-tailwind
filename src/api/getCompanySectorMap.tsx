import { httpRequest } from './httpRequest'

export const getCompanySectorMap = async (company_id: string) => {
  return await httpRequest().get(
    '/' +
      company_id +
      '/sector_map?api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}
