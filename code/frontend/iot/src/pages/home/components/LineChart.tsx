import { Line } from '@ant-design/charts'

const LineChart = ({ data }: { data: any[] }) => {
  const config = {
    autoFit: true,
    data,
    xField: 'time',
    yField: 'value',
  }
  return <Line {...config} />
}

export default LineChart
