import { TooltipProps } from "recharts";
import { formatTime } from "../(root)/sales-trends/utils/formatTime";
import {
  convertToFullDate,
  formatReadableDate,
} from "../(root)/overview/components/utils/formatDate";
import { Totals } from "../src/types";

interface CustomTooltipProps extends TooltipProps<number, string> {
  isHourlyData: boolean;
  dineInTakeAwayTotals: Totals | null;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  isHourlyData,
  dineInTakeAwayTotals,
}) => {
  console.log("label ==>", label);
  console.log("payload ==>", payload);
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white rounded-lg pt-2 pl-2 pr-2 pb-1 shadow-lg text-sm w">
        <div className="font-bold mb-2 grid grid-cols-[1fr_auto_auto] gap-5">
          <div>
            {isHourlyData
              ? formatTime(label)
              : `${formatReadableDate(convertToFullDate(label))}`}
          </div>
          <div className="flex justify-center w-10">Count</div>
          <div className="flex justify-end w-10">Net</div>
        </div>
        {payload.map((data, index) => (
          <div
            key={index}
            className="text-white font-normal grid grid-cols-[1fr_auto_auto] gap-5"
          >
            <div>{data.name}</div>
            <div className="flex justify-center w-10">
              {index === 0
                ? data.payload.total_take_away_orders
                : data.payload.total_dine_in_orders}
            </div>
            <div className="flex justify-end w-10">{`$${data.value}`}</div>
          </div>
        ))}
        <div className="text-white font-normal grid grid-cols-[1fr_auto_auto] gap-5">
          <div>Total</div>
          <div>
            {dineInTakeAwayTotals!.totalTakeAwayOrders +
              dineInTakeAwayTotals!.totalDineInOrders}
          </div>
          <div>
            {(
              dineInTakeAwayTotals!.totalDineInNetSales +
              dineInTakeAwayTotals!.totalTakeAwayNetSales
            ).toFixed(2)}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
