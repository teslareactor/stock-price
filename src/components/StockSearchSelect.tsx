import React from 'react';
import { GroupBase } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import { AlphaVantageService } from '../features/alpha-vantage/AlphaVantageService';
import { IStockDetails } from '../features/alpha-vantage/models';

export const getOptionLabel = (stockDetails: IStockDetails) => stockDetails['2. name']

interface IStockSearchSelectProps extends Omit<AsyncProps<IStockDetails, false, GroupBase<IStockDetails>>, 'loadOptions' | 'getOptionLabel'> { }

const loadOptions = (input: string) => AlphaVantageService.search(input).then(response => response.bestMatches)

export const StockSearchSelect: React.FC<IStockSearchSelectProps> = props => {
    return <AsyncSelect cacheOptions loadOptions={loadOptions} getOptionLabel={getOptionLabel} {...props} />
}

StockSearchSelect.defaultProps = {
    placeholder: 'Search Symbol or Company Name'
}