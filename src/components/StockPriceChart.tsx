import React, { useMemo } from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { ITimeSeriesDailyItemWithDate } from '../features/alpha-vantage/models';

interface IStockPriceChartProps {
  data: ITimeSeriesDailyItemWithDate[],
  showMovingAverage?: boolean
}

const getDateValue = (item: ITimeSeriesDailyItemWithDate) => item.date
const getClosePrice = (item: ITimeSeriesDailyItemWithDate) => Number(item['4. close'])

const MA_DAYS = 50

export const getMAPriceCreator = (data: ITimeSeriesDailyItemWithDate[], days = MA_DAYS) => (item: ITimeSeriesDailyItemWithDate) => {
  const index = data.indexOf(item)
  let price: number | null = null

  if (index !== -1) {

    const showMAValue = index % days === 0

    if (showMAValue) {
      const medianItems = data.slice(index, index + days)
      price = medianItems.length ? (medianItems.reduce((sum, item) => sum += Number(item['4. close']), 0) / medianItems.length) : 0
    }
  }

  return price
}

export const StockPriceChart: React.FC<IStockPriceChartProps> = ({ data, showMovingAverage }) => {
  const getMAPrice = useMemo(() => getMAPriceCreator(data), [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={getDateValue} />
        <YAxis format="" />
        <Tooltip />
        <Area name="Closing price" type="monotone" dataKey={getClosePrice} stroke="#8884d8" fill="#8884d8" />
        {showMovingAverage && <Line name="50MA" type="monotone" dataKey={getMAPrice} stroke="red" connectNulls />}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

StockPriceChart.defaultProps = {
  data: []
}
