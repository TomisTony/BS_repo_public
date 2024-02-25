import PageWrapper from '@/components/PageWrapper'
import { Card, Select } from 'antd'
import { AppstoreTwoTone } from '@ant-design/icons'
import apis from '@/apis'
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from 'react'
import { DeviceType } from '@/utils/emums'
import { Device } from '@/apis/device'
import { Message } from '@/apis/value'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

const Pie = dynamic(() => import('@/pages/home/components/PieChart'), {
  ssr: false,
})

const Line = dynamic(() => import('@/pages/home/components/LineChart'), {
  ssr: false,
})

const HomePage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [messageCount, setMessageCount] = useState<number>(0)
  const [deviceTypeData, setDeviceTypeData] = useState<any[]>([])
  const [messageData, setMessageData] = useState<any[]>([])
  const session = useSession()

  const { trigger, data } = useSWRMutation(`/message/list/${selectedId}`, () =>
    apis.getMessageList(selectedId as number),
  )

  useEffect(() => {
    const id = parseInt(session.data?.id ?? '1')
    console.log('session', session)
    apis.getDeviceList(id).then(
      (res) => {
        setDeviceList(res ?? [])
        setSelectedId(res?.length ?? 0 > 0 ? res?.[0].id : null)
      },
      (res) => {
        console.log(res)
      },
    )
    apis.getMessageCount(id).then(
      (res) => {
        setMessageCount(res ?? 0)
      },
      (res) => {
        console.log(res)
      },
    )
  }, [])

  useEffect(() => {
    if (deviceList.length > 0) {
      const template = DeviceType.map((item) => ({
        type: item,
        value: 0,
      }))
      deviceList.forEach((item) => {
        template[item.type].value++
      })
      setDeviceTypeData(template)
    }
  }, [deviceList])

  // 由于 setSelectedId 的那个瞬间触发 trigger时，selectedId 还是 undifined，所以需要在 useEffect 中手动触发
  useEffect(() => {
    if (selectedId !== undefined) trigger()
  }, [selectedId])

  useEffect(() => {
    if (data) {
      // 按时间升序排序，取最后八个 message
      const sortedData = data
        .sort((a: Message, b: Message) => {
          return (
            new Date(parseInt(a.timestamp)).getTime() -
            new Date(parseInt(b.timestamp)).getTime()
          )
        })
        .slice(-8)
      console.log(sortedData)
      setMessageData(
        sortedData.map((message: any) => {
          return {
            time: new Date(parseInt(message.timestamp)).toLocaleString(),
            value: message.value,
          }
        }),
      )
    }
  }, [data])

  return (
    <PageWrapper containerClassName="flex-grow p-4 bg-gray-100 flex flex-col">
      <Card
        title="设备统计信息"
        bordered={false}
        bodyStyle={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div className="flex items-center justify-center">
          <AppstoreTwoTone className="text-lg" />
          <span className="ml-2 text-lg font-bold">
            设备总数：{deviceList?.length ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <AppstoreTwoTone className="text-lg" />
          <span className="ml-2 text-lg font-bold">
            活跃设备数：
            {deviceList?.filter(
              // 时间戳在今日凌晨 0 点之后的设备
              (device) => {
                return (
                  new Date(parseInt(device.last_active)).getTime() >
                  new Date().setHours(0, 0, 0, 0)
                )
              },
            ).length ?? 0}
            /{deviceList?.length ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <AppstoreTwoTone className="text-lg" />
          <span className="ml-2 text-lg font-bold">
            消息总量：{messageCount}
          </span>
        </div>
      </Card>
      <div className="relative bottom-4 top-4 flex-grow">
        <Card
          className="w-[49%] absolute bottom-4 top-0 left-0"
          title="设备类型分布图"
          bordered={false}
        >
          <Pie data={deviceTypeData} />
        </Card>
        <Card
          className="w-[49%] absolute bottom-4 right-0 top-0"
          bodyStyle={{ height: '80%' }}
          title="设备数据走势图"
          bordered={false}
        >
          <div className="h-[15%]">
            <Select
              options={
                deviceList?.map((item) => ({
                  label: item.name,
                  value: item.id,
                })) ?? []
              }
              value={selectedId}
              className="w-[120px]"
              placeholder="请选择设备"
              onChange={(value) => {
                setSelectedId(value)
              }}
            />
          </div>

          <div className="h-[80%]">
            <Line data={messageData} />
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}

export default HomePage
