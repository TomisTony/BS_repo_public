import { Modal, Form, Input } from 'antd'
import apis from '@/apis'
import { useSession } from 'next-auth/react'

interface PasswordModifyFormProps {
  open: boolean
  onOk: (success: boolean) => void
  onCancel: () => void
}

const PasswordModifyForm = ({
  open,
  onOk,
  onCancel,
}: PasswordModifyFormProps) => {
  const [form] = Form.useForm()
  const session = useSession()
  return (
    <Modal
      open={open}
      title="修改密码"
      okText="确认"
      cancelText="取消"
      closeIcon={null}
      okButtonProps={{ danger: true }}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            const res = await apis.modifyUserPassword({
              oldPassword: values.oldPassword,
              password: values.newPassword,
              id: parseInt(session?.data?.id ?? '1'),
            })
            onOk(res.success)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
          .finally(() => {
            form.resetFields()
          })
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="oldPassword"
          label="旧密码"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[{ required: true, message: '新密码不得少于6个字节', min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PasswordModifyForm
