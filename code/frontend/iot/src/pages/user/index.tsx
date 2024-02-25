import PageWrapper from '@/components/PageWrapper'
import { Button, Descriptions, DescriptionsProps, Avatar, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { UserInfo } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import apis from '@/apis'
import PasswordModifyForm from './components/PasswordModifyForm'
import UserInfoModifyForm from './components/UserInfoModifyForm'
import { useSession } from 'next-auth/react'

const getItems = (userInfo: UserInfo) => {
  return [
    {
      key: '1',
      label: 'ID',
      children: <p>{userInfo.id}</p>,
    },
    {
      key: '2',
      label: '头像',
      children: <Avatar size="large" icon={<UserOutlined />} />,
    },
    {
      key: '3',
      label: '用户名',
      children: <p>{userInfo.name}</p>,
    },
    {
      key: '4',
      label: '手机号',
      children: <p>{userInfo.phone}</p>,
    },
    {
      key: '5',
      label: '邮箱',
      children: <p>{userInfo.email}</p>,
    },
  ] as DescriptionsProps['items']
}

const UserPage = () => {
  const session = useSession()

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)
  const [visible, setVisible] = useState(0) // 0: 不显示, 1: 修改信息, 2: 修改密码

  useEffect(() => {
    const userId = parseInt(session?.data?.id ?? '1')
    apis.getUserInfo(userId).then((res: UserInfo) => {
      setUserInfo(res)
    })
  }, [])

  const [messageApi, contextHolder] = message.useMessage()

  const items = useMemo(() => getItems(userInfo), [userInfo])

  return (
    <PageWrapper containerClassName="flex flex-col justify-center items-center flex-grow">
      {contextHolder}
      <Descriptions
        title="用户信息"
        items={items}
        column={1}
        bordered
        className="w-[50%]"
      />
      <div className="mt-10">
        <Button className="mr-12" onClick={() => setVisible(1)}>
          修改信息
        </Button>
        <Button type="primary" danger onClick={() => setVisible(2)}>
          修改密码
        </Button>
      </div>
      <UserInfoModifyForm
        open={visible === 1}
        initialValues={userInfo}
        onOk={(success) => {
          if (success) {
            messageApi.success('修改用户信息成功')
          } else {
            messageApi.error('修改用户信息失败，请联系系统管理员')
          }
          const userId = parseInt(session?.data?.id ?? '1')
          apis.getUserInfo(userId).then((res: UserInfo) => {
            console.log(res)
            setUserInfo(res)
          })
          setVisible(0)
        }}
        onCancel={() => setVisible(0)}
      />
      <PasswordModifyForm
        open={visible === 2}
        onOk={(success) => {
          if (success) {
            messageApi.success('修改密码成功')
          } else {
            messageApi.error('修改密码失败，请检查旧密码是否输入正确')
          }
          setVisible(0)
        }}
        onCancel={() => setVisible(0)}
      />
    </PageWrapper>
  )
}

export default UserPage
