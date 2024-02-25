import request from '@/utils/request'

export const login = (username: string, password: string) => {
  return request.post(
    '/auth/login',
    {
      username,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
}

export const register = (email: string, name: string, password: string) => {
  return request.post('/auth/register', {
    name,
    email,
    password,
  })
}

export const hello = () => {
  return request.get('/hello')
}
