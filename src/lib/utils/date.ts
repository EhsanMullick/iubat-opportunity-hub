import { format, parseISO, isAfter, isBefore, formatDistanceToNow } from 'date-fns';

export const DEFAULT_TIMEZONE = 'Asia/Dhaka';

/**
 * Checks if an event is expired based on current authoritative time.
 * An event is expired if end_datetime is earlier than current time in UTC.
 */
export function isEventExpired(endDatetime: string | Date): boolean {
  const endDate = typeof endDatetime === 'string' ? parseISO(endDatetime) : endDatetime;
  return isBefore(endDate, new Date());
}

/**
 * Checks if an event is currently happening right now.
 */
export function isEventLive(startDatetime: string | Date, endDatetime: string | Date): boolean {
  const now = new Date();
  const start = typeof startDatetime === 'string' ? parseISO(startDatetime) : startDatetime;
  const end = typeof endDatetime === 'string' ? parseISO(endDatetime) : endDatetime;
  return isAfter(now, start) && isBefore(now, end);
}

/**
 * Format event date in friendly format for Bangladesh / Dhaka display
 * e.g., "Saturday, 24 Oct 2026 • 10:00 AM"
 */
export function formatEventDateTime(
  datetimeStr: string,
  includeTime: boolean = true,
  tz: string = DEFAULT_TIMEZONE
): string {
  try {
    const date = parseISO(datetimeStr);
    if (includeTime) {
      return format(date, "EEE, dd MMM yyyy • hh:mm a") + (tz === DEFAULT_TIMEZONE ? ' (BST)' : '');
    }
    return format(date, "EEE, dd MMM yyyy");
  } catch {
    return datetimeStr;
  }
}

/**
 * Formats a clean date range e.g. "15 Oct 2026, 10:00 AM - 04:00 PM"
 */
export function formatEventRange(startStr: string, endStr: string): string {
  try {
    const start = parseISO(startStr);
    const end = parseISO(endStr);
    const sameDay = format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd');

    if (sameDay) {
      return `${format(start, 'EEE, dd MMM yyyy')} • ${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')} BST`;
    }
    return `${format(start, 'dd MMM yyyy, hh:mm a')} - ${format(end, 'dd MMM yyyy, hh:mm a')} BST`;
  } catch {
    return `${startStr} - ${endStr}`;
  }
}

/**
 * Returns human relative distance e.g. "in 3 days" or "ended 2 days ago"
 */
export function getRelativeTimeString(datetimeStr: string): string {
  try {
    const date = parseISO(datetimeStr);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '';
  }
}
