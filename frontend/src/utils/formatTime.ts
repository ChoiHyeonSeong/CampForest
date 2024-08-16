import { format, isToday, isYesterday, isSameYear } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatTime(createdAt: string): string {
  const date = new Date(createdAt);
  date.setHours(date.getHours() + 9);
  const now = new Date();

  if (isToday(date)) {
    const time = format(date, 'a hh:mm  ', {locale: ko});
    return time;
  } else if (isYesterday(date)) {
    return '어제';
  } else if (isSameYear(date, now)) {
    return format(date, 'M월 d일');
  } else {
    return format(date, 'yyyy년 M월 d일');
  }
}