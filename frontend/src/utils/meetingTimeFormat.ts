import { format } from 'date-fns';

export function meetingTimeFormat(createdAt: string | undefined): string | undefined {
  if(createdAt) {
    const date = new Date(createdAt);

    return format(date, 'yyyy년 M월 d일');
  }
}