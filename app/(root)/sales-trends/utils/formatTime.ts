export const formatTime = (value: string) => {
  const hours = Number(value) % 24;
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}${period}`;
};
