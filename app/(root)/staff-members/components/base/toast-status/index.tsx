import { twMerge } from "tailwind-merge"
import { Avatar } from "../avatar"
import { Paragraph } from "../paragraph"
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

        <div className="flex justify-between items-center w-full bg-green-500 py-3 px-8" role="alert">
            <p className="text-base font-semibold text-white">{props?.label || ""}</p>
            <Avatar 
              icon={<CancelSvg />}
              onClick={props?.onClose}
            />
      </div>
  )
}