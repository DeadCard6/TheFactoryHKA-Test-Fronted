/**
 * Parses a date string returned by the .NET API.
 * The .NET API returns UTC dates but often without the 'Z' suffix.
 * This function appends 'Z' if missing to ensure the browser interprets it as UTC,
 * preventing local timezone shifts during parsing.
 * 
 * @param {string} dateString - The ISO date string from the API
 * @returns {Date} The parsed Date object
 */
export const parseApiDate = (dateString) => {
  if (!dateString) return new Date();
  const str = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
  return new Date(str);
};

/**
 * Formats a date string for display in the UI using the America/Bogota timezone.
 * 
 * @param {string} dateString - The ISO date string from the API
 * @returns {string} Formatted date string in Spanish (Colombia) locale
 */
export const formatDateTime = (dateString) => {
  const date = parseApiDate(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

/**
 * Creates an ISO string representing the very start of a given day in the America/Bogota timezone,
 * converted to UTC without the 'Z' suffix (as expected by the .NET API).
 * 
 * @param {string} dateStr - A date string in 'YYYY-MM-DD' format
 * @returns {string} UTC ISO string for the start of the day
 */
export const startOfDayParam = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(`${dateStr}T00:00:00-05:00`);
  // return ISO string without 'Z' for the backend
  return date.toISOString().replace('Z', '');
};

/**
 * Creates an ISO string representing the very end of a given day in the America/Bogota timezone,
 * converted to UTC without the 'Z' suffix (as expected by the .NET API).
 * 
 * @param {string} dateStr - A date string in 'YYYY-MM-DD' format
 * @returns {string} UTC ISO string for the end of the day
 */
export const endOfDayParam = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(`${dateStr}T23:59:59.999-05:00`);
  return date.toISOString().replace('Z', '');
};
