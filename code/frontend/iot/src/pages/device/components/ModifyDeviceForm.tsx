import { Modal, Form, Input, Select } from 'antd'
import apis from '@/apis'
import { DeviceType } from '@/utils/emums'
import { useEffect } from 'react'

export interface ModifiableProps {
  name: string
  description: string
  type: number
}

interface ModifyDeviceFormProps {
  open: boolean
  initialValues: ModifiableProps
  selectedId: number
  onOk: (success: boolean) => void
  onCancel: () => void
}

const options = DeviceType.map((item, index) => ({
  label: item,
  value: index,
}))

const ModifyDeviceForm = ({
  open,
  selectedId,
  initialValues,
  onOk,
  onCancel,
}: ModifyDeviceFormProps) => {
  const [form] = Form.useForm()

  // Modal 和 Form 的特殊处理
  // 详见 https://github.com/ant-design/ant-design/issues/21543#issuecomment-635301568
  useEffect(() => {
    if (form && open) {
      form.setFieldsValue(initialValues ?? {})
    }
  }, [open])

  return (
    <Modal
      open={open}
      title="修改设备"
      okText="确认"
      cancelText="取消"
      closeIcon={null}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            const res = await apis.modifyDevice({
              id: selectedId,
              name: values.name,
              description: values.description,
              type: values.type,
            })
            onOk(res.success)
            form.resetFields()
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="modify_device_form"
        initialValues={initialValues}
      >
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
          name="description"
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

export default ModifyDeviceForm
