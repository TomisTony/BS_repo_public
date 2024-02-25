import PageWrapper from '@/components/PageWrapper'
import apis from '@/apis'
import { Select, Table, Popover } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import type { ColumnsType } from 'antd/es/table'
import { Message } from '@/apis/value'
import { useSession } from 'next-auth/react'

interface TabelDataSource {
  key: React.Key
  device_id: number
  location: string
  alert: string
  timestamp: string
  info: string
  value: string
}

const columns: ColumnsType<TabelDataSource> = [
  {
    title: '设备 ID',
    dataIndex: 'device_id',
    key: 'device_id',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '信息类型',
    dataIndex: 'alert',
    key: 'alert',
  },
  {
    title: '时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: '信息',
    dataIndex: 'info',
    key: 'info',
    render: (text) => (
      <Popover content={text} title="详细信息">
        <span>{text.slice(0, 10)}...</span>
      </Popover>
    ),
  },
  {
    title: '上报数值',
    dataIndex: 'value',
    key: 'value',
  },
]

const ValuePage = () => {
  const [devices, setDevices] = useState<any>([])
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
  const session = useSession()

  const { trigger, data, isMutating } = useSWRMutation(
    `/message/list/${selectedId}`,
    () => apis.getMessageList(selectedId as number),
  )

  const dataSourse: TabelDataSource[] = useMemo(() => {
    return (
      data?.map((item: Message, index: number) => ({
        key: index,
        device_id: item.deviceId,
        location: `${item.lat},${item.lng}`,
        alert: item.alert ? '报警' : '正常',
        timestamp: new Date(parseInt(item.timestamp)).toLocaleString(),
        info: item.info,
        value: String(item.value),
      })) ?? ([] as TabelDataSource[])
    )
  }, [data])

  // 由于 setSelectedId 的那个瞬间触发 trigger时，selectedId 还是 undifined，所以需要在 useEffect 中手动触发
  useEffect(() => {
    if (selectedId !== undefined) trigger()
  }, [selectedId])

  useEffect(() => {
    const userId = parseInt(session.data?.id ?? '1')
    apis.getDeviceList(userId).then((res) => {
      setDevices(res)
      setSelectedId(res?.length > 0 ? res?.[0].id : undefined)
    })
  }, [])

  const deviceList = useMemo(() => {
    return devices.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
  }, [devices])

  return (
    <PageWrapper containerClassName="flex-grow p-4">
      <Select
        options={deviceList}
        value={selectedId}
        className="w-[120px]"
        placeholder="请选择设备"
        onChange={(value) => {
          setSelectedId(value)
        }}
      />
      <Table
        className="mt-4"
        dataSource={dataSourse}
        columns={columns}
        loading={isMutating}
        pagination={false}
      />
    </PageWrapper>
  )
}

export default ValuePage
