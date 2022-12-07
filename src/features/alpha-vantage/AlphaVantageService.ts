import axios, { AxiosResponse } from 'axios'
import { AlphaVantageApiFunction, ISearchQueryRequest, ISearchResponse } from "./models"

export const BASE_URL = 'https://www.alphavantage.co/query'
export const API_KEY = 'Z6GOGFDH4EQ2QFUU'

export const mapAxiosResponse = (response: AxiosResponse) => response.data

export class AlphaVantageService {
    public static search(query: string): Promise<ISearchResponse> {
        const params: ISearchQueryRequest = {
            apikey: API_KEY,
            function: AlphaVantageApiFunction.symbolSearch,
            keywords: query,
        }

        return axios.get(BASE_URL, { params }).then(mapAxiosResponse)
    }
}

