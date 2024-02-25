import PageWrapper from '@/components/PageWrapper'
import { Button, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import AddDeviceForm from './components/AddDeviceForm'
import ModifyDeviceForm from './components/ModifyDeviceForm'
import { ModifiableProps } from './components/ModifyDeviceForm'
import { DeviceType } from '@/utils/emums'
import apis from '@/apis'
import { Device } from '@/apis/device'
import { useSession } from 'next-auth/react'

interface TabelDataSource {
  key: React.Key
  id: number
  name: string
  description: string
  type: string
  last_active: string
}

const DevicePage = () => {
  const [addFormVisible, setAddFormVisible] = useState(false)
  const [modifyFormVisible, setModifyFormVisible] = useState(false)
  const [modifyFormInitialValues, setModifyFormInitialValues] =
    useState<ModifiableProps>({} as ModifiableProps)
  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [messageApi, contextHolder] = message.useMessage()
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
  const session = useSession()

  const columns: ColumnsType<TabelDataSource> = [
    {
      title: '设备 ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备描述',
      dataIndex: 'description',
      key: 'desc',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '最后活跃时间',
      dataIndex: 'last_active',
      key: 'last_active',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            const device = deviceList.find(
              (item) => item.id === record.id,
            ) as Device
            console.log(device)
            setModifyFormInitialValues({
              name: device?.name,
              description: device?.description,
              type: device?.type,
            })
            setSelectedId(device?.id)
            setModifyFormVisible(true)
          }}
        >
          修改设备
        </Button>
      ),
    },
  ]

  useEffect(() => {
    const userId = parseInt(session.data?.id ?? '1')
    apis.getDeviceList(userId).then((res) => {
      setDeviceList(res)
    })
  }, [])

  const dataSource: TabelDataSource[] = useMemo(() => {
    return deviceList.map((item) => ({
      ...item,
      key: item.id,
      type: DeviceType[item.type],
      last_active: new Date(parseInt(item.last_active)).toLocaleString(),
    }))
  }, [deviceList])

  return (
    <PageWrapper containerClassName="flex-grow p-4">
      {contextHolder}
      <Button
        type="primary"
        className="flex items-center"
        onClick={() => setAddFormVisible(true)}
      >
        <PlusOutlined />
        增添设备
      </Button>
      <Table
        className="mt-4"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <AddDeviceForm
        open={addFormVisible}
        onCancel={() => setAddFormVisible(false)}
        onOk={(success) => {
          if (success) {
            messageApi.success('增添设备成功')
          } else {
            messageApi.error('增添设备失败，请联系系统管理员')
          }
          const userId = parseInt(session.data?.id ?? '1')
          apis.getDeviceList(userId).then((res) => {
            setDeviceList(res)
          })
          setAddFormVisible(false)
        }}
      />
      <ModifyDeviceForm
        selectedId={selectedId ?? 0}
        open={modifyFormVisible}
        initialValues={modifyFormInitialValues}
        onCancel={() => setModifyFormVisible(false)}
        onOk={(success) => {
          console.log(success)
          if (success) {
            messageApi.success('修改设备成功')
          } else {
            messageApi.error('修改设备失败，请联系系统管理员')
          }
          const userId = parseInt(session.data?.id ?? '1')
          apis.getDeviceList(userId).then((res) => {
            setDeviceList(res)
          })
          setModifyFormVisible(false)
        }}
      />
    </PageWrapper>
  )
}

export default DevicePage
