/* eslint-disable react/prop-types */
import {
  Map,
  APILoader,
  Marker,
  Provider,
  Polyline,
} from '@uiw/react-baidu-map'
import { useEffect, useState } from 'react'

interface Point {
  lat: number
  lng: number
  alert: boolean
  info: string
}

interface BaiduMapProps {
  className?: string
  points?: Point[]
}

const BaiduMap = (props: BaiduMapProps) => {
  const [path, setPath] = useState<any>([])
  useEffect(() => {
    setPath(
      props.points?.map((item) => ({
        lat: item.lat,
        lng: item.lng,
      })),
    )
  }, [props.points])

  return (
    <div className={props.className}>
      <APILoader akay={process.env.BAIDU_MAP_AK}>
        <Provider>
          <Map
            ref={(props) => {
              if (props && props.map) {
                // 启用滚轮放大缩小，默认禁用
                props.map.enableScrollWheelZoom()
              }
            }}
            widget={[
              {
                name: 'OverviewMapControl',
                options: {
                  isOpen: true,
                },
              },
              {
                name: 'CopyrightControl',
                control: (BMap) => {
                  // 设置版权控件位置
                  const cr = new BMap.CopyrightControl({
                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                  })
                  // 返回地图可视区域
                  cr.removeCopyright(1)
                  return cr
                },
              },
              {
                name: 'NavigationControl',
                options: (BMap) => {
                  return {
                    offset: new BMap.Size(15, 5),
                    showZoomInfo: false,
                    enableGeolocation: true,
                  }
                },
              },
            ]}
            center={
              props.points?.length
                ? {
                    lat: props.points[0].lat,
                    lng: props.points[0].lng,
                  }
                : { lat: 39.914889, lng: 116.404449 }
            }
          >
            <Polyline path={path}></Polyline>
            {props.points?.map((item, index) => (
              <Marker
                key={index}
                position={{
                  lat: item.lat,
                  lng: item.lng,
                }}
                type={item.alert ? 'simple_red' : 'loc_blue'}
                title={item.info}
              />
            ))}
          </Map>
        </Provider>
      </APILoader>
    </div>
  )
}

export default BaiduMap
