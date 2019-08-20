import React, { useState } from "react"
import { FixedSizeList, FixedSizeListProps } from "react-window"
import AutoResizer from "react-virtualized-auto-sizer"

import ScrollbarDelegate, {
  ScrollbarDelegateProps,
  ScrollbarDelegateMethods,
} from "./ScrollbarDelegate"

export * from "react-window"

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

interface ExtendedProps {
  width?: number | string
  height?: number | string
  autoResizable?: boolean
}

export interface VirtualizedListProps
  extends Omit<FixedSizeListProps, keyof ExtendedProps>,
    ExtendedProps {
  scrollbarProps?: ScrollbarDelegateProps
}

function createScrollbar(outerProps?: ScrollbarDelegateProps) {
  if (outerProps == null) {
    return () => ScrollbarDelegate
  }

  return () =>
    React.forwardRef<ScrollbarDelegateProps, ScrollbarDelegateMethods>(
      (props, ref) => {
        return <ScrollbarDelegate {...outerProps} {...props} ref={ref} />
      },
    )
}

/**
 * 虚拟列表
 * autoReisz 模式父容器必须有宽度和高度
 */
export const VirtualizedList = React.forwardRef<
  FixedSizeList,
  VirtualizedListProps
>((props, ref) => {
  const { width, height, autoResizable, scrollbarProps, ...other } = props
  const autoresize = width == null || height == null || autoResizable
  const [ScrollBar] = useState(createScrollbar(scrollbarProps))

  const render = (width: number | string, height: number | string) => (
    <FixedSizeList
      {...other}
      width={width}
      ref={ref}
      height={height}
      outerElementType={ScrollBar}
    />
  )

  return autoresize ? (
    <AutoResizer>
      {size => render(width || size.width, height || size.height)}
    </AutoResizer>
  ) : (
    render(width!, height!)
  )
})

VirtualizedList.displayName = "VirtualizedList"

export default VirtualizedList
