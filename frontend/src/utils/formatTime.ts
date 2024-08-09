import { format, isToday, isYesterday, isSameYear } from 'date-fns';

export function formatTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();

  if (isToday(date)) {
    return format(date, 'a hh:mm');
  } else if (isYesterday(date)) {
    return '어제';
  } else if (isSameYear(date, now)) {
    return format(date, 'M월 d일');
  } else {
    return format(date, 'yyyy년 M월 d일');
  }
}