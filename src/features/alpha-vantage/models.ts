
export interface IAlphaVantageBaseRequest {
  apikey: string
  function: AlphaVantageApiFunction
  // defaults to json on api if not provided
  datatype?: AlphaVantageResponseDataType
}

export type AlphaVantageResponseDataType =  'json' | 'csv'

export enum AlphaVantageApiFunction {
  symbolSearch = 'SYMBOL_SEARCH' 
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