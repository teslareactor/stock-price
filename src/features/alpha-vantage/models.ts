
export interface IAlphaVantageBaseRequest {
  apikey: string
  function: AlphaVantageApiFunction
  // defaults to json on api if not provided
  datatype?: AlphaVantageResponseDataType
}

export type AlphaVantageResponseDataType = 'json' | 'csv'

export enum AlphaVantageApiFunction {
  symbolSearch = 'SYMBOL_SEARCH',
  timeSeriesDailyAdjusted = 'TIME_SERIES_DAILY_ADJUSTED'
}

export interface ISearchQueryRequest extends IAlphaVantageBaseRequest {
  function: AlphaVantageApiFunction.symbolSearch
  keywords: string
}

export interface ISearchResponse {
  "bestMatches": IStockDetails[]
}

export interface IStockDetails {
  "1. symbol": string,
  "2. name": string,
  "3. type": string,
  "4. region": string,
  // 09:30
  "5. marketOpen": string,
  // "16:00
  "6. marketClose": string,
  // "UTC-04"
  "7. timezone": string,
  "8. currency": string,
  // "0.7143"
  "9. matchScore": string
}

export interface IDailyTimeSeriesRequest extends IAlphaVantageBaseRequest {
  function: AlphaVantageApiFunction.timeSeriesDailyAdjusted
  symbol: string
  /**
   * compact = 100 data points
   * full =  full-length time series
   *  Defaults to compact.
   */
  outputsize?: 'compact' | 'full'
}

export interface IDailyTimeSeriesResponse {
  "Meta Data": {
    "1. Information": string,
    "2. Symbol": string,
    "3. Last Refreshed": string,
    "4. Output Size": string,
    "5. Time Zone": string
  },
  "Time Series (Daily)": ITimeSeries
}

/**
 * Dictionary with keys as date and values as daily stock details.
 */
export type ITimeSeries = Record<string, ITimeSeriesDailyItem>

export interface ITimeSeriesDailyItem {
  "1. open": string,
  "2. high": string,
  "3. low": string,
  "4. close": string,
  "5. adjusted close": string,
  "6. volume": string,
  "7. dividend amount": string,
  "8. split coefficient": string
}

/**
 * Extended ITimeSeriesDailyItem to include actual date.
 */
export interface ITimeSeriesDailyItemWithDate extends ITimeSeriesDailyItem {
  date: string
}

/**
 * Response when API call limit is reached.
 * API call frequency is 5 calls per minute and 500 calls per day.
 */
export interface ICallFrequencyLimitResponse {
  Note: string
}