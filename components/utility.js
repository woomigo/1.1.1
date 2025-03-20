// UTILITY FUNCTIONS FOR DATE, TIME AND USERNAME

export const getMonthAndDay = (dateString) => {
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

  const parts = dateString.split("/");
  if (parts.length !== 3) return { month: "Invalid", day: "Invalid" };

  const monthIndex = parseInt(parts[0], 10) - 1; // Convert to zero-based index
  const day = parseInt(parts[1], 10); // Extract day

  if (monthIndex < 0 || monthIndex > 11 || isNaN(day))
    return { month: "Invalid", day: "Invalid" };

  return { month: months[monthIndex], day };
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
        return `${diffInSeconds} sec${diffInSeconds !== 1 ? 's' : ''} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

export const truncUsername = (username, maxLength = 20) => {
    if (typeof username !== "string") return "";
    return username.length > maxLength ? username.slice(0, maxLength-3) + "..." : username;
};

