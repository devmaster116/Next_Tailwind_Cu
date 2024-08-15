import { twMerge } from "tailwind-merge"
import { Typography } from "../typography"

type ClassOverrideProps = {
  container?: string
  label?: string
  icon?: string
}

type Props = {
  cls: string
  label?: string
}

export const ToastStatus = (props: Props) => {
  return (
    <div className="alert alert-custom alert-outline-2x alert-outline-primary fade show mb-5" role="alert">
      <div className="alert-icon"><i className="flaticon-warning"></i></div>
      <div className="alert-text">{props?.label?props.label: ""}dfsfdsfsdfsdfsdfds</div>
      <div className="alert-close">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true"><i className="ki ki-close"></i></span>
          </button>
      </div>
  </div>
  )
}