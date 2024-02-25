import React from 'react'
import { Avatar, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useSession, signOut } from 'next-auth/react'

const Header = () => {
  const { data: session } = useSession()

  return (
    <div className="flex justify-between bg-blue-200 border-gray-100 border-2">
      <div className="ml-10 flex items-center text-xl font-bold">
        物联网设备管理平台
      </div>
      <div className="flex items-center h-full px-4 py-2 justify-end ">
        <div className="flex items-center">
          <Avatar size="large" icon={<UserOutlined />} />
          <span className="ml-4">{session?.user?.name ?? 'UNAUTH'}</span>
        </div>
        <Button className="ml-8" danger onClick={() => signOut()}>
          退出
        </Button>
      </div>
    </div>
  )
}

export default Header
