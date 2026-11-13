export function getErrorMessage(err) {
  const data = err.response?.data;

  if (!data) return "Cannot reach the server. Is the backend running?";
  if (typeof data === "string") return "Something went wrong. Please try again.";
  if (data.detail) return data.detail;

  // Field errors: { title: ["..."], category: ["..."] }
  return Object.entries(data)
    .map(([field, messages]) => `${field}: ${[].concat(messages).join(" ")}`)
    .join(" | ");
}