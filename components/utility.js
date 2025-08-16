// UTILITY FUNCTIONS FOR DATE, TIME AND USERNAME

export const getMonthAndDay = (dateString) => {
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const date = new Date(dateString);

  if (isNaN(date)) return { month: "Invalid", day: "Invalid" };

  const monthIndex = date.getUTCMonth(); // getUTCMonth gives 0-based index
  const day = date.getUTCDate(); // getUTCDate returns the day of the month (1-31)

  return { month: months[monthIndex], day };
};

export const getFormattedTime = (timeString) => {
  if (timeString === null) return null;
  if (!timeString || typeof timeString !== "string") return "Invalid time";

  const [hourStr, minuteStr] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  const paddedMinute = minute < 10 ? `0${minute}` : minute;

  return `${hour}:${paddedMinute} ${ampm}`;
};

export const getTimeAgo = (input) => {
  let past;

  // Handle different input types
  if (typeof input === "string") {
    past = new Date(input);
  } else if (typeof input === "number") {
    // If the number is 10 digits, it's in seconds, convert to milliseconds
    past = new Date(input < 10000000000 ? input * 1000 : input);
  } else if (input instanceof Date) {
    past = input;
  } else {
    return "Invalid date";
  }

  // Check if the date is valid
  if (isNaN(past.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
};

export const truncUsername = (username, maxLength = 20) => {
  if (typeof username !== "string") return "";
  return username.length > maxLength
    ? username.slice(0, maxLength - 3) + "..."
    : username;
};

export function truncNumber(n) {
  if (n < 1000) return n.toString();

  const units = ["k", "M", "B", "T"];
  const order = Math.floor(Math.log10(n) / 3);
  const unit = units[order - 1];
  const num = n / Math.pow(1000, order);

  // Keep it to max 3 significant digits
  const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);

  return `${formatted}${unit}`;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

export function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
  const R = 3959; // Radius of Earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function hexToRgba(hex, alpha = 1) {
  // Remove '#' if present
  hex = hex.replace(/^#/, '');

  // Parse r, g, b values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r},${g},${b},${alpha})`;
}
