import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMonths,
} from "date-fns";

export const renderDateSeparator = (date: Date) => {
  const now = new Date();
  const daysDiff = differenceInDays(now, date);
  const monthsDiff = differenceInMonths(now, date);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (daysDiff < 7) {
    return format(date, "EEEE");
  } else if (monthsDiff < 6) {
    return format(date, "EEE. d MMM");
  } else {
    return format(date, "d MMM, yyyy");
  }
};
