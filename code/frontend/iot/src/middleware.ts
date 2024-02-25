export { default } from 'next-auth/middleware'

export const config = {
  // 匹配除了 /auth/login 之外的所有路由
  matcher: ['/((?!auth).*)'],
}
