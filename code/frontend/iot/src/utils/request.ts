import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getSession } from 'next-auth/react'

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance: AxiosInstance
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
  }

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.request.use(
      async (config) => {
        // 一般会请求拦截里面加token，用于后端的验证
        try {
          const session = await getSession()
          const token = session?.jwt
          if (token) {
            config.headers!.Authorization = `Bearer ${token}`
          }
        } catch (err) {
          console.log(err)
        }

        return config
      },
      (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        console.log('request error:' + err)
        return Promise.reject(err)
      },
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        console.log('axios', res)
        return res.data.data
      },
      (err: any) => {
        return Promise.reject(err.response)
      },
    )
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
}

// 默认导出Request实例
export default new Request({})
