import { twMerge } from "tailwind-merge"

type ClassOverride = {
  container?: string
  labelContainer?: string
  radioStyle?: string
  innerRadioStyle?: string
}
type Props = {
  label: string
  // checked: boolean
  icon?: JSX.Element
  onChange: () => void
  classOverride?: ClassOverride
}
export const CustomRadio = (props: Props) => {
  return (
    <div 
      className={twMerge(
        'flex justify-between p-4 bg-white rounded-lg border border-gray-200',
        props?.classOverride?.container
      )}
      onClick={props.onChange}
    >
      <div className={
        twMerge(
          "flex items-center gap-2",
          props?.classOverride?.labelContainer
        )
      }>
        {props.label}
        {props?.icon}
      </div>
      <div className={twMerge (
        "flex justify-center items-center border border-gray-300 rounded-full w-5 h-5",
        props?.classOverride?.radioStyle
      )}>
        <div className={twMerge(
          "w-3 h-3 rounded-full bg-white",
          props?.classOverride?.innerRadioStyle
        )}/>
      </div>
    </div>
  )
}