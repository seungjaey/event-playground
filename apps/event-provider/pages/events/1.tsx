import { useEffect, useRef, useCallback } from 'react'

const EVENT_TYPES = {
  LOADED: 'LOADED',
  GO_LINK: 'GO_LINK',
  GET_COUPON: 'GET_COUPON',
  APPEND_TO_CART: 'APPEND_TO_CART',

  CALLBACK_LOADED: 'CALLBACK_LOADED',
  CALLBACK_GO_LINK: 'GO_LINK',
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
    result?: number
  }
}

const postMessage = (message: EventMessage) => {
  // TODO: TargetOrigin TOBE kurlymall DOMAIN
  const { type } = message
  console.log(`[CHILD SEND MESSAGE TO PARENT] : ${type}`)
  window.parent.postMessage(message, '*')
}

const FirstEventPage = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const handleMessage = (event: MessageEvent) => {
    const { data, origin } = event
    // TODO: origin TOBE Kurlymall DOMAIN
    if (origin !== 'http://localhost:3000') {
      return;
    }
    const { type, payload } = data
    console.log(`[CHILD RECEIVE MESSAGE] : ${type} : ${JSON.stringify(payload)}`)
  }

  const handleClickButton = useCallback((name: string) => () => {
    postMessage({
      type: EVENT_TYPES.GO_LINK,
      payload: {
        href: name
      }
    })
  }, [])

  const handleClickAppendToCart = useCallback(() => {
    postMessage({
      type: EVENT_TYPES.APPEND_TO_CART,
      payload: {
        message: '상품 번호'
      }
    })
  }, [])

  const handleClickGetCoupon = useCallback(() => {
    postMessage({
      type: EVENT_TYPES.GET_COUPON,
      payload: {
        message: '쿠폰 번호'
      }
    })
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) {
      return
    }
    const { width, height } = wrapper.getBoundingClientRect()
    window.addEventListener('message', handleMessage)
    postMessage({
      type: EVENT_TYPES.LOADED,
      payload: {
        message: 'Event screen ready',
        width,
        height,
      }
    })
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '1800px', backgroundColor: 'blue' }}>
      <ul>
        <li>
          <button type="button" onClick={handleClickButton('상품1')}>
            상품 1
          </button>
        </li>
        <li>
          <button type="button" onClick={handleClickButton('상품2')}>
            상품 2
          </button>
        </li>
        <li>
          <button type="button" onClick={handleClickAppendToCart}>
            장바구니 담기
          </button>
        </li>
        <li>
          <button type="button" onClick={handleClickGetCoupon}>
            쿠폰 받기
          </button>
        </li>
      </ul>
    </div>
  );
}

export default FirstEventPage;