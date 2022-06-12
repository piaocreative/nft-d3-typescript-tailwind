import { liveHttpRequest } from './liveHttpRequest'

export const getCompanySubTopics = async (company_id: string) => {
  return await liveHttpRequest().get(
    '/' +
      company_id +
      '/subtopic_performance?api_key=' +
      process.env.REACT_APP_ESG_API_Key,
  )
}
// export const getCompanySubTopics = async (
//   company_id: string,
//   topic_name: string
// ) => {
//   return await httpRequest().get(
//     "/" + company_id + "/topics/" + topic_name + "/subtopics"
//   );
// };
