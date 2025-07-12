export const getBadgeClass = (type: string) => {
  const baseClass = "badge-pill";
  switch (type) {
    case "youtube":
      return `${baseClass} badge-youtube`;
    case "github":
      return `${baseClass} badge-github`;
    case "blog":
      return `${baseClass} badge-blog`;
    case "text":
      return `${baseClass} badge-text`;
    default:
      return `${baseClass} badge-github`;
  }
};

export const truncateContent = (content: string, maxLength: number = 100) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

export const formatDate = (dateString: string) => {
  const timestamp = Number(dateString);
  if (isNaN(timestamp)) return dateString;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
