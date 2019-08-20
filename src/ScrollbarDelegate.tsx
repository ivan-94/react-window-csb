import React, {
  useImperativeHandle,
  useCallback,
  useRef,
  UIEventHandler,
  useMemo,
} from "react"
import CustomScrollbar, {
  positionValues,
  ScrollbarProps,
} from "react-custom-scrollbars"

export * from "react-custom-scrollbars"

export interface ScrollbarDelegateProps extends ScrollbarProps {
  className?: string
  onScroll?: UIEventHandler<HTMLDivElement>
  style?: React.CSSProperties
  scrollbarRef?: React.Ref<CustomScrollbar>
}

export interface ScrollbarDelegateMethods {}

/**
 * 滚动条代理
 */
const ScrollbarDelegate = React.forwardRef<
  ScrollbarDelegateMethods,
  ScrollbarDelegateProps
>((props, ref) => {
  const scrollbar = useRef<CustomScrollbar>(null)
  const { onScroll, className, style, children, ...other } = props
  const finalStyle = useMemo(() => ({ ...(style || {}), overflow: "hidden" }), [
    style,
  ])

  useImperativeHandle(ref, () => ({
    set scrollLeft(value: number) {
      scrollbar.current && scrollbar.current.scrollLeft(value)
    },
    get scrollLeft() {
      return scrollbar.current ? scrollbar.current.getScrollLeft() : 0
    },
    set scrollTop(value: number) {
      scrollbar.current && scrollbar.current.scrollTop(value)
    },
    get scrollTop() {
      return scrollbar.current ? scrollbar.current.getScrollTop() : 0
    },
    get scrollWidth() {
      return scrollbar.current ? scrollbar.current.getScrollWidth() : 0
    },
    get clientWidth() {
      return scrollbar.current ? scrollbar.current.getClientWidth() : 0
    },
    get clientHeight() {
      return scrollbar.current ? scrollbar.current.getClientHeight() : 0
    },
  }))

  const handleScroll = useCallback(
    (values: positionValues) => {
      const event = ({
        currentTarget: values,
      } as any) as React.UIEvent<HTMLDivElement>

      if (onScroll) {
        onScroll(event)
      }
    },
    [onScroll],
  )

  return (
    <CustomScrollbar
      ref={scrollbar}
      onScrollFrame={handleScroll}
      className={className}
      style={finalStyle}
      {...other}>
      {children}
    </CustomScrollbar>
  )
})

ScrollbarDelegate.displayName = "ScrollbarDelegate"

export default ScrollbarDelegate
