import { Pie } from '@ant-design/charts'

const PieChart = ({ data }: { data: any[] }) => {
  const config = {
    forceFit: true,
    radius: 0.6,
    data,
    angleField: 'value',
    colorField: 'type',
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  }
  return <Pie {...config} />
}

export default PieChart
