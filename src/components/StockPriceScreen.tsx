import React, { useEffect, useMemo, useState } from 'react'
import { ActionMeta, SingleValue } from 'react-select'
import { Row, Col, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { StockPriceChart } from './StockPriceChart'
import { StockSearchSelect } from '../features/alpha-vantage/StockSearchSelect';
import { IDailyTimeSeriesResponse, IStockDetails, ITimeSeriesDailyItemWithDate } from '../features/alpha-vantage/models';


import { AlphaVantageService } from '../features/alpha-vantage/AlphaVantageService';

export const mapDailyTimeSeriesResponseToData = (response: IDailyTimeSeriesResponse): ITimeSeriesDailyItemWithDate[] => {
    const series = response['Time Series (Daily)']
    const seriesKeys = Object.keys(series)

    return seriesKeys.map(date => {
        return {
            ...series[date],
            date,
        }
    })
}

const sortCompareByDateTimeSeriesDailyItemWithDate = (item1: ITimeSeriesDailyItemWithDate, item2: ITimeSeriesDailyItemWithDate) => {
    const item1Date = new Date(item1.date)
    const item2Date = new Date(item2.date)

    if (item1Date < item2Date) {
        return -1
    } else if (item1Date > item2Date) {
        return 1
    } else {
        return 0
    }
}

const createLessThanComparator = (compareDate: Date) => (item: ITimeSeriesDailyItemWithDate) => new Date(item.date) < compareDate
const createLargerThanComparator = (compareDate: Date) => (item: ITimeSeriesDailyItemWithDate) => new Date(item.date) > compareDate

const filterDailyTimeSeries = (allData: ITimeSeriesDailyItemWithDate[], startDate: string, endDate: string) => {
    const startDateValue = startDate ? new Date(startDate) : null
    const endDateValue = endDate ? new Date(endDate) : null
    const comparators: ((item: ITimeSeriesDailyItemWithDate) => boolean)[] = []

    startDateValue && comparators.push(createLargerThanComparator(startDateValue))
    endDateValue && comparators.push(createLessThanComparator(endDateValue))

    const filteredData = allData.filter(item => comparators.reduce<boolean>((accumulator, comparator) => accumulator && comparator(item), true))

    return filteredData
}

export const StockPriceScreen = () => {
    const [selectedStock, setSelectedStock] = useState<IStockDetails | null>(null)
    const [dailyTimeSeries, setDailyTimeSeries] = useState<IDailyTimeSeriesResponse>()
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [showMA, setShowMA] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (newStock: SingleValue<IStockDetails>, actionMeta: ActionMeta<IStockDetails>) => {
        if (actionMeta.action === 'select-option') {
            setSelectedStock(newStock)
        }
    }

    useEffect(() => {
        if (selectedStock) {
            setStartDate('')
            setEndDate('')
            setIsLoading(true)

            AlphaVantageService.timeSeriesDailyAdjusted(selectedStock['1. symbol'])
                .then(setDailyTimeSeries)
                .catch(
                    error => {
                        // Show message for limited calls.
                        alert(error.message)
                    }
                )
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [selectedStock])

    const chartData = useMemo(() => {
        if (dailyTimeSeries) {
            const allData = mapDailyTimeSeriesResponseToData(dailyTimeSeries).sort(sortCompareByDateTimeSeriesDailyItemWithDate)

            if (!startDate && !endDate) {
                return allData
            }

            return filterDailyTimeSeries(allData, startDate, endDate)
        }

        return []
    }, [dailyTimeSeries, startDate, endDate])

    const handleChangeShowMovingAverage: React.ChangeEventHandler<HTMLInputElement> = event => {
        setShowMA(event.target.checked)
    }

    return (
        <Row>
            <Col>
                <Row>
                    <Col xs={12} md={12} lg={4} className="mb-3">
                        <StockSearchSelect onChange={handleChange} />
                    </Col>
                    <Col xs="auto">
                        <FormGroup row>
                            <Label for="startDate" xs={{ size: 'auto' }}>
                                Start Date
                            </Label>
                            <Col sm={{ size: 'auto' }}>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    placeholder="Start date"
                                    type="date"
                                    value={startDate}
                                    onChange={event => setStartDate(event.target.value)}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs="auto">
                        <FormGroup row>
                            <Label for="endDate" xs={{ size: 'auto' }}>
                                End Date
                            </Label>
                            <Col sm={{ size: 'auto' }}>
                                <Input
                                    id="endDate"
                                    name="endDate"
                                    placeholder="End date"
                                    type="date"
                                    value={endDate}
                                    onChange={event => setEndDate(event.target.value)}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs="auto">
                        <FormGroup switch>
                            <Input type="switch" role="switch" value={showMA ? 'on' : 'off'} onChange={handleChangeShowMovingAverage} />
                            <Label check>Show Moving Average</Label>
                        </FormGroup>
                    </Col>
                </Row>
            </Col>
            {
                selectedStock &&
                <Col xs={12}>
                    <h2>{`${selectedStock['2. name']} `} stock price</h2>
                </Col>
            }
            <Col xs={12} className="position-relative">
                {
                    isLoading &&
                    <div className='position-absolute d-flex align-items-center justify-content-center w-100' style={{ height: '100%', background: ' rgba(0, 0, 0, 0.3)' }}>
                        <Spinner />
                    </div>
                }
                <div style={{ height: 500 }}>
                    <StockPriceChart data={chartData} showMovingAverage={showMA} />
                </div>
            </Col>
        </Row>
    )
}