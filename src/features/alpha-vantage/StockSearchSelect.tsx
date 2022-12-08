import { debounce } from 'lodash';
import React from 'react';
import { GroupBase } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import { AlphaVantageService } from './AlphaVantageService';
import { IStockDetails } from './models';

export const getOptionLabel = (stockDetails: IStockDetails) => stockDetails['2. name']

interface IStockSearchSelectProps extends Omit<AsyncProps<IStockDetails, false, GroupBase<IStockDetails>>, 'loadOptions' | 'getOptionLabel'> { }

const loadOptions = (input: string) => {
    // limit to at least 3 chars
    if (input.length < 3) {
        return Promise.resolve([])
    }

    return AlphaVantageService.search(input).then(response => response.bestMatches).catch(error => {
        // Show message for limited calls.
        alert(error.message)
        return []
    })
}

/**
 * Debounce option load function to delay call if user types fast since we have only 5 api call per minute.
 */
const debouncedLoadOptions = debounce(loadOptions, 200)

export const StockSearchSelect: React.FC<IStockSearchSelectProps> = props => {


    return <AsyncSelect cacheOptions loadOptions={debouncedLoadOptions} getOptionLabel={getOptionLabel} {...props} />
}

StockSearchSelect.defaultProps = {
    placeholder: 'Search Symbol or Company Name'
}