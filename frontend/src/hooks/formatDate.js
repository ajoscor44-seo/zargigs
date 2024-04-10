const formatDate = (dateString) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours() % 12 || 12; // Convert 24hr to 12hr format and handle 0 as 12.
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(); // Add leading zero if needed.
  const ampm = date.getHours() < 12 ? "am" : "pm";

  // Determine the ordinal suffix
  const ordinal = (day) => {
    const j = day % 10,
      k = day % 100;
    if (j == 1 && k != 11) {
      return day + "st";
    }
    if (j == 2 && k != 12) {
      return day + "nd";
    }
    if (j == 3 && k != 13) {
      return day + "rd";
    }
    return day + "th";
  };

  return `${month} ${ordinal(day)} ${year} ${hour}:${minutes} ${ampm}`;
};

export default formatDate;
