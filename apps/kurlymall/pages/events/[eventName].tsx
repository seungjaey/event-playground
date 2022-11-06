import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled'

const IframeWrap = styled.iframe`
  transition: opacity 300ms ease-out;
  opacity: 0;
  height: 0;
  overflow: hidden;
`

const EVENT_TYPES = {
  LOADED: 'LOADED',
  GO_LINK: 'GO_LINK',
  GET_COUPON: 'GET_COUPON',
  APPEND_TO_CART: 'APPEND_TO_CART',

  CALLBACK_LOADED: 'CALLBACK_LOADED',
  CALLBACK_GO_LINK: 'CALLBACK_GO_LINK',
  CALLBACK_GET_COUPON: 'CALLBACK_GET_COUPON',
  CALLBACK_APPEND_TO_CART: 'CALLBACK_APPEND_TO_CART',
} as const

type EventMessage = {
  type: keyof typeof EVENT_TYPES
  payload: {
    message?: string
    href?: string
    width?: number
    height?: number
    result?: boolean
  }
}

const delay = (ms: number) => {
  return (fn: () => void) => {
    const timerId = setTimeout(() => {
      fn()
      clearTimeout(timerId)
    }, ms)
  }
}

const twoSecondsDelayAction = delay(2000)

const EventDetailPage = () => {
  const { query } = useRouter()
  const { eventName } = query
  const [iframeHeight, setIframeHeight] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isEventNameExist = !!eventName;

  const isIframeNotLoaded = iframeHeight === 0

  const handleMessage = (event: MessageEvent) => {
    const { data, origin } = event
    // TODO: origin TOBE EventProvider Domain
    if (origin !== 'http://localhost:3001') {
      return;
    }
    const { type, payload } = data;
    console.log(`[PARENT RECEIVE MESSAGE] : ${type} : ${JSON.stringify(payload)}`)
    switch (type) {
      case EVENT_TYPES.LOADED:
        const { height } = payload
        twoSecondsDelayAction(() => {
          setIframeHeight(() => height)
          postMessage({
            type: EVENT_TYPES.CALLBACK_LOADED,
            payload: {
              message: '수신양호'
            }
          })
        })

        break
      case EVENT_TYPES.GO_LINK:
        // TODO: 별도 콜백 없이 화면이 전환될듯
        postMessage({
          type: EVENT_TYPES.CALLBACK_GO_LINK,
          payload: {
            message: '수신양호'
          }
        })
        break
      case EVENT_TYPES.APPEND_TO_CART:
        // TODO: 장바구니 추가 API 결과 전달
        twoSecondsDelayAction(() => {
          postMessage({
            type: EVENT_TYPES.CALLBACK_APPEND_TO_CART,
            payload: {
              result: true,
            }
          })
        })
        break
      case EVENT_TYPES.GET_COUPON:
        // TODO: 쿠폰 받기 API 결과 전달
        twoSecondsDelayAction(() => {
          postMessage({
            type: EVENT_TYPES.CALLBACK_GET_COUPON,
            payload: {
              message: '수신양호'
            }
          })
        })
        break
    }
  }

  const postMessage = (message: EventMessage) => {
    const iframe = iframeRef.current
    if (!iframe) {
      return;
    }
    const { contentWindow } = iframe
    if (!contentWindow) {
      return;
    }
    const { type, payload } = message
    console.log(`[PARENT SEND MESSAGE TO CHILD] : ${type} : ${JSON.stringify(payload)}`)
    contentWindow.postMessage(message, '*')
  }

  useEffect(() => {
    document.domain = 'localhost'
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div>
      <h1>{eventName}</h1>
      {
        isEventNameExist
          ? (
            <IframeWrap
              key="event-detail"
              ref={iframeRef}
              src={`http://localhost:3001/events/${eventName}`}
              style={{ height: `${iframeHeight}px`, opacity: isIframeNotLoaded ? 0 : 1 }}
            />
          )
          : null
      }
    </div>
  );
}

export default EventDetailPage;