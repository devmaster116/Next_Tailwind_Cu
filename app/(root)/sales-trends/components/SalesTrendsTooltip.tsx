import { TooltipProps } from "recharts";
import { formatTime } from "../utils/formatTime";
import {
  convertToFullDate,
  formatReadableDate,
} from "../../overview/components/utils/formatDate";
import TooltipWrapper from "@/app/components/TooltipWrapper";

interface SalesTrendsTooltipProps extends TooltipProps<number, string> {
  isHourlyData: boolean;
}

const SalesTrendsTooltip: React.FC<SalesTrendsTooltipProps> = ({
  active,
  payload,
  label,
  isHourlyData,
}) => {
  let totalCount = 0;
  let totalNet = 0;

  if (active && payload && payload.length) {
    return (
      <TooltipWrapper>
        <div className="font-bold mb-2 grid grid-cols-[1fr_auto_auto] gap-5">
          <div>
            {isHourlyData
              ? formatTime(label)
              : `${formatReadableDate(convertToFullDate(label))}`}
          </div>
          <div className="flex justify-center w-10">Count</div>
          <div className="flex justify-end w-10">Net</div>
        </div>
        {payload.map((data, index) => {
          totalCount =
            data.payload.total_take_away_orders +
            data.payload.total_dine_in_orders;

          totalNet += data.value ? data.value : 0;
          return (
            <div
              key={index}
              className="text-white font-normal grid grid-cols-[1fr_auto_auto] gap-5 mb-1"
            >
              <div>{data.name}</div>
              <div className="flex justify-center w-10">
                {index === 0
                  ? data.payload.total_take_away_orders
                  : data.payload.total_dine_in_orders}
              </div>
              <div className="flex justify-end w-10">{`$${data.value}`}</div>
            </div>
          );
        })}
        <div className="text-white font-normal grid grid-cols-[1fr_auto_auto] gap-5 pt-2 border-t border-gray-200 mb-2">
          <div>Total</div>
          <div className="flex justify-center w-10">{totalCount}</div>
          <div className="flex justify-end w-10">${totalNet.toFixed(2)}</div>
        </div>
      </TooltipWrapper>
    );
  }
};

export default SalesTrendsTooltip;
