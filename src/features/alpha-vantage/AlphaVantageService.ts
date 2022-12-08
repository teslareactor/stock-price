import axios, { AxiosResponse } from 'axios'
import { AlphaVantageApiFunction, ICallFrequencyLimitResponse, IDailyTimeSeriesRequest, IDailyTimeSeriesResponse, ISearchQueryRequest, ISearchResponse } from "./models"

export const BASE_URL = 'https://www.alphavantage.co/query'
export const API_KEY = 'Z6GOGFDH4EQ2QFUU'

export const mapAxiosResponse = (response: AxiosResponse) => {
    const note = (response.data as ICallFrequencyLimitResponse).Note

    if (note) {
        throw new Error(note)
    }

    return response.data
}

export class AlphaVantageService {
    public static search(query: string): Promise<ISearchResponse> {
        const params: ISearchQueryRequest = {
            apikey: API_KEY,
            function: AlphaVantageApiFunction.symbolSearch,
            keywords: query,
        }

        return axios.get(BASE_URL, { params }).then(mapAxiosResponse)
    }

    public static timeSeriesDailyAdjusted(symbol: string): Promise<IDailyTimeSeriesResponse> {
        const params: IDailyTimeSeriesRequest = {
            apikey: API_KEY,
            function: AlphaVantageApiFunction.timeSeriesDailyAdjusted,
            symbol,
            outputsize: 'full'
        }

        return axios.get(BASE_URL, { params }).then(mapAxiosResponse)
    }
}

