export interface TypeCompany {
  ticker_id: string
  ticker_name: string
  industry_group: string
}

export interface TypePeerMap {
  ticker_name: string
  ticker_market_cap: number
  signals_average: number
  signals_count: number
}

export interface TypePeerMaps {
  data: TypePeerMap[]
  data_type: string
}

export interface TypeSectorPerformance {
  topic: string
  subtopic: string
  company_sentiment: number
  nearest_neighbours_sentiment: number
}

export interface TypeSectorPerformances {
  data: TypeSectorPerformance[]
  data_type: string
}

export interface TypeCompanySummary {
  data: [TypePeerMaps, TypeSectorPerformances]
  data_type: string
  ticker: string
}

export interface TypeCompanyScore {
  ticker_id: string
  ticker_name: string
  environmental_score: number
  governance_score: number
  social_score: number
}

export interface TypeCompanyScores {
  data_type: string
  data: TypeCompanyScore[]
}

export interface TypeSubTopicScore {
  sub_topic: string
  score: number
}

export interface TypeTopicScores {
  topic: string
  scores: TypeSubTopicScore[]
}

export interface TypeTopicData {
  ticker_id: string
  day: string
  score: number
  cumulative_score: number
}

export interface TypeFormatedTopicData {
  ticker_id: string
  day: Date
  score: number
  cumulative_score: number
}

export interface TypeNews {
  topic: string
  topic_datas: TypeTopicData[]
}

export interface TypeNewsData {
  headline: string
  sentence: string
  datetime: string
  link: string
  source: Number
}

export interface TypeNews {
  data_type: string
  data: TypeNewsData[]
}

export interface TypeDataPoint {
  topic: string
  value_type: string
  value: Number
}

export interface TypeKeyInformation {
  name: string
  industry: string
  country: string
  market_cap: string
  institutional_investors: Number
  latest_emissions: string
  sustainability_report: string
  charities_supported: Number
  disclosure_score: Number
}

export interface TypeDataDpData {
  topic: string
  value_type: string
  value: number
  id: string
}
