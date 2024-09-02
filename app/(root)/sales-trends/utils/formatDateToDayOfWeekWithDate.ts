export const formatDateToDayOfWeekWithDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = { weekday: "short" };
  const dayOfWeek = new Intl.DateTimeFormat("en-US", options).format(date);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayOfWeek} ${day}/${month}`;
};
