import request from '@/utils/request'

export function getMessageCount(userId: number) {
  return request.get(`/message/count?userId=${userId}`)
  // return Promise.resolve({
  //   data: 8,
  // })
}
