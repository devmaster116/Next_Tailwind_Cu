export const capitalizeFirstLetter = (text: string) => {
  if (!text) return ""; // handle empty strings
  return text.charAt(0).toUpperCase() + text.slice(1);
};
