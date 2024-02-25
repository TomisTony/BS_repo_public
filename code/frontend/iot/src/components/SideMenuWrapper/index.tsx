import React from 'react'
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  DesktopOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useRouter } from 'next/router'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  url?: string | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    url,
  } as MenuItem
}

const items: MenuProps['items'] = [
  getItem('首页', '/home', '/home', <HomeOutlined />),
  getItem('个人信息', '/user', '/user', <UserOutlined />),
  getItem('设备配置', '/device', '/device', <DesktopOutlined />),
  getItem('数据查询', '/value', '/value', <BarChartOutlined />),
  getItem('设备轨迹', '/map', '/map', <WifiOutlined />),
]

interface SideMenuWrapperProps {
  children: React.ReactNode
  containerClassName?: string
}

const SideMenuWrapper = (props: SideMenuWrapperProps) => {
  const router = useRouter()
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    router.push(e.key as string)
  }
  const getKeyFromRouterPath = () => {
    const key = router.pathname
    return key ?? '/home'
  }

  return (
    <div className="flex-grow flex">
      <div className="w-[15%] min-w-[200px] h-full flex flex-col justify-between border-r-2 border-t-0 border-b-0 border-l-0 border-solid border-gray-200">
        <Menu
          onClick={onClick}
          selectedKeys={[getKeyFromRouterPath()]}
          defaultSelectedKeys={['/home']}
          mode="inline"
          items={items}
        />
        <div className="text-xs flex px-8 py-4 font-thin italic text-gray-400">
          Copyright © 2023-2024 <br />
          B/S 体系软件设计 <br />
          Br All Rights Reserved. <br />
        </div>
      </div>
      <div className={props.containerClassName}>{props.children}</div>
    </div>
  )
}

export default SideMenuWrapper
