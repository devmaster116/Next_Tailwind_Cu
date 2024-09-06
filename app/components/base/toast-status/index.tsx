import { Avatar } from "../avatar";
import { CancelSvg } from "@/app/assets/svg/cancel";

type Props = {
  label?: string;
  onClose?: () => void;
};

export const ToastStatus = (props: Props) => {
  return (
    <div
      className="flex justify-between items-center w-full bg-success-green-100 py-3 px-8"
      role="alert"
    >
      <p className="text-base font-semibold text-success-green-700">
        {props?.label || ""}
      </p>
      <Avatar
        icon={<CancelSvg width={10} height={10} color="#027A48" />}
        onClick={props?.onClose}
      />
    </div>
  );
};
