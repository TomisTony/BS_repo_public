import { Modal, Form, Input, Select } from 'antd'
import apis from '@/apis'
import { DeviceType } from '@/utils/emums'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface AddDeviceFormProps {
  open: boolean
  onOk: (success: boolean) => void
  onCancel: () => void
}

const options = DeviceType.map((item, index) => ({
  label: item,
  value: index,
}))

const AddDeviceForm = ({ open, onOk, onCancel }: AddDeviceFormProps) => {
  const [form] = Form.useForm()
  const session = useSession()

  // Modal 和 Form 的特殊处理
  // 详见 https://github.com/ant-design/ant-design/issues/21543#issuecomment-635301568
  useEffect(() => {
    if (form && open) {
      form.resetFields()
    }
  }, [open])

  return (
    <Modal
      getContainer={false}
      open={open}
      title="增添设备"
      okText="确认"
      cancelText="取消"
      closeIcon={null}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            console.log(session.data?.id)
            const res = await apis.addDevice({
              name: values.name,
              description: values.desc,
              type: values.type,
              last_active: new Date().getTime(),
              userId: session.data?.id ?? 1,
            })
            onOk(res.success)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical" name="add_device_form">
        <Form.Item
          name="name"
          label="设备名称"
          rules={[
            {
              required: true,
              message: '请输入设备名称',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="desc"
          label="设备描述"
          rules={[
            {
              required: true,
              message: '请输入设备描述',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="设备类型"
          rules={[
            {
              required: true,
              message: '请输入设备类型',
            },
          ]}
        >
          <Select options={options}></Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddDeviceForm
