export function getFormattedDateTime(): string {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const time = `${formattedHours}:${formattedMinutes}${ampm}`;

  const day = now.getDate();
  const month = now.getMonth() + 1; // Months are zero-based in JavaScript
  const year = now.getFullYear();

  const formattedDate = `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;

  return `${time} ${formattedDate}`;
}
