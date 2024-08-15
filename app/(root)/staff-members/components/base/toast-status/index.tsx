import { twMerge } from "tailwind-merge"
import { Avatar } from "../avatar"
import { CancelSvg } from "@/app/assets/svg/whiteCancel"

type ClassOverrideProps = {
  container?: string
  label?: string
  icon?: string
}

type Props = {
  label?: string
  onClose?: () => void
}

export const ToastStatus = (props: Props) => {

  return (
    <div className="flex justify-betwee items-center px-4 justfy-center py-2 w-full bg-green-500 gap-4" role="alert">
      <p className="text-base font-semibold text-white">{props?.label?props.label: ""}</p>
      <Avatar 
        icon={<CancelSvg />}
        onClick={props?.onClose}
      />
  </div>
  )
}