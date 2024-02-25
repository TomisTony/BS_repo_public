import PageWrapper from '@/components/PageWrapper'
import { Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import apis from '@/apis'
import useSWRMutation from 'swr/mutation'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

const BaiduMap = dynamic(() => import('@/pages/map/components/BaiduMap'), {
  ssr: false,
})

const MapPage = () => {
  const [devices, setDevices] = useState<any>([])
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
  const session = useSession()

  const { trigger, data } = useSWRMutation(`/message/list/${selectedId}`, () =>
    apis.getMessageList(selectedId as unknown as number),
  )

  const points = useMemo(() => {
    return data?.map((item: any) => ({
      lat: item.lat,
      lng: item.lng,
      alert: item.alert,
      info:
        new Date(parseInt(item.timestamp)).toLocaleString() +
        (item.alert ? ' 警报: ' : ' 正常: ') +
        item.info,
    }))
  }, [data])

  useEffect(() => {
    const userId = parseInt(session.data?.id ?? '1')
    apis.getDeviceList(userId).then((res) => {
      setDevices(res)
      setSelectedId(res?.length > 0 ? res?.[0].id : undefined)
    })
  }, [])

  // 由于 setSelectedId 的那个瞬间触发 trigger时，selectedId 还是 undifined，所以需要在 useEffect 中手动触发
  useEffect(() => {
    if (selectedId !== undefined) trigger()
  }, [selectedId])

  const deviceList = useMemo(() => {
    return devices.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
  }, [devices])

  return (
    <PageWrapper containerClassName="flex-grow p-4 flex flex-col">
      <Select
        options={deviceList}
        value={selectedId}
        placeholder="请选择设备"
        className="w-[120px]"
        onChange={(value) => setSelectedId(value)}
      />
      <span className="text-sm text-gray-400 mt-2">
        注：地图上红色标记点表示设备发出警报信息
      </span>
      <BaiduMap
        className="mt-1 w-full flex-grow overflow-hidden"
        points={points}
      ></BaiduMap>
    </PageWrapper>
  )
}

export default MapPage
