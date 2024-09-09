export const formatDateToDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = { weekday: "short" };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};
