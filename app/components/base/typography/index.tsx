import React from "react"
import { twMerge } from "tailwind-merge"

export type Variant = 
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'label-large'
    | 'label-medium'
    | 'label-small'

const textStyle: { [k in Variant]: string } = {
    'h1': twMerge(
        'text-4xl leading-[4.5rem] font-[400] text-gray-900',
    ),
    'h2': twMerge(
        'text-3xl leading-[3rem] font-[400] text-gray-900',
    ),
    'h3': twMerge(
        'text-2xl leading-[2.5rem] font-[400] text-gray-900',
    ),
    'h4': twMerge(
        'text-xl font-[400] text-gray-900',
    ),
    'h5': twMerge(
        'text-lg font-[400] text-gray-900',
    ),
    'h6': twMerge(
        'text-base font-[400] text-gray-900',
    ),
    'label-large': twMerge(
        'text-lg font-[400] text-gray-900',
    ),
    'label-medium': twMerge(
        'text-base font-[400] text-gray-800',
    ),
    'label-small': twMerge(
        'text-sm font-[400] text-gray-900',
    ),
}
type Props = {
    variant: Variant
    children: React.ReactNode
    className?: string
    disabled?: boolean
    onClick?: () => void
}
export const Typography = (props: Props) => {
    // Create a component map
    const Component = {
      'h1': 'h1',
      'h2': 'h2',
      'h3': 'h3',
      'h4': 'h4',
      'h5': 'h5',
      'h6': 'h6',
      'label-large': 'p',
      'label-medium': 'p',
      'label-small': 'p',
    }[props.variant]
  
    // Return the appropriate heading level with the class string applied
    return React.createElement(
      Component,
      {
        className: twMerge(
            textStyle[props.variant],
            props.className,
        ),
        onClick: !props.disabled ? props.onClick : undefined,
        disabled: props.disabled,
      },
      props.children,
    )
  }