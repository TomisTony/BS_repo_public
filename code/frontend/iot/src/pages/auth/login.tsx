import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import apis from '@/apis'
import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Card, message } from 'antd'

const LoginPage: React.FC = () => {
  const [form] = Form.useForm()
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') || '/home'
  const [messageApi, contextHolder] = message.useMessage()

  const onLoginFinish = async (values: any) => {
    const res = await signIn('login', {
      redirect: false,
      username: values.username,
      password: values.password,
      callbackUrl,
    })

    if (!res?.error) {
      router.push(callbackUrl)
    } else {
      messageApi.error('用户名或密码错误')
    }
  }

  const onRegisterFinish = async (values: any) => {
    const res = await apis.register(
      values.email,
      values.username,
      values.password,
    )

    if (res?.success) {
      messageApi.success('注册成功')
      form.resetFields()
    } else {
      messageApi.error('注册失败，' + res.error)
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-400 via-blue-200 to-slate-100">
      {contextHolder}
      <div className="flex justify-center h-[10%] items-center font-bold text-4xl border-b-2 border-t-0 border-x-0 border-solid border-black">
        物联网设备管理平台
      </div>
      <div className="flex-grow flex justify-center items-center ">
        <Card
          className="w-[25%] h-[60%] shadow-lg"
          title="登录"
          hoverable
          headStyle={{
            fontSize: '16px',
          }}
        >
          <Form name="login" onFinish={onLoginFinish}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button type="primary" htmlType="submit" className="w-full">
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <span className="border-solid border border-gray-400 h-[70%] mx-8"></span>

        <Card
          className="w-[25%] h-[60%] shadow-lg"
          title="注册"
          hoverable
          headStyle={{
            fontSize: '16px',
          }}
        >
          <Form name="register" onFinish={onRegisterFinish} form={form}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入正确的邮箱', type: 'email' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="邮箱"
              />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[{ required: true, message: '用户名至少6个字节', min: 6 }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '密码至少6个字节', min: 6 }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button type="primary" htmlType="submit" className="w-full">
                注册
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div className="flex justify-center h-[10%] items-center text-sm text-gray-400">
        Copyright © 2023-2024 B/S 体系软件设计 Br All Rights Reserved.
      </div>
    </div>
  )
}

export default LoginPage
