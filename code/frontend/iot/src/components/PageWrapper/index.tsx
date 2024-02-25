import Header from '@/components/Header'
import SideMenuWrapper from '@/components/SideMenuWrapper'

interface PageWrapperProps {
  children: React.ReactNode
  containerClassName?: string // 用于设置内容区域的样式
}

const PageWrapper = (props: PageWrapperProps) => {
  return (
    <div className="flex flex-col h-[100%]">
      <Header />
      <SideMenuWrapper containerClassName={props.containerClassName}>
        {props.children}
      </SideMenuWrapper>
    </div>
  )
}

export default PageWrapper
