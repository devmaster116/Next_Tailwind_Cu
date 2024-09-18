import React from "react";

interface ModalFooterProps {
  onActionClick: (e: React.MouseEvent) => void;
  actionLabel: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  onActionClick,
  actionLabel,
}) => (
  <div className="min-md:hidden max-sm:fixed max-sm:block max-sm:bg-white max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:p-5">
    <button
      className="flex items-center justify-center text-white bg-primary-purple-600 p-3 px-5 gap-2 rounded-lg leading-6 text-base font-semibold min-w-[120px] hover:bg-primary-purple-700 focus:bg-primary-purple-700 size-full"
      onClick={onActionClick}
    >
      {actionLabel}
    </button>
  </div>
);

export default ModalFooter;
