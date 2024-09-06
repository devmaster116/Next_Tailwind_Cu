import { Avatar } from "../avatar";
import { CancelSvg } from "@/app/assets/svg/whiteCancel";

type Props = {
  label?: string;
  onClose?: () => void;
};

export const ToastStatus = (props: Props) => {
  return (
    <div
      className="flex justify-between items-center w-full bg-green-500 py-3 px-8"
      role="alert"
    >
      <p className="text-base font-semibold text-white">{props?.label || ""}</p>
      <Avatar icon={<CancelSvg />} onClick={props?.onClose} />
    </div>
  );
};
