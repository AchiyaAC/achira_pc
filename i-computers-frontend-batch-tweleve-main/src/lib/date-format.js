// --------------------------------------------------
// Format date
// --------------------------------------------------
export function formatDate(dateString) {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// --------------------------------------------------
// Format date and time
// --------------------------------------------------
export function formatTimestamp(dateString) {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --------------------------------------------------
// Format short date
// --------------------------------------------------
export function formatShortDate(dateString) {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default formatTimestamp;