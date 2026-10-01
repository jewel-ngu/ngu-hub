export const CALENDAR_URL = "https://calendar.google.com/calendar/u/0?cid=Y18zZjFkMDQzNTBjMmEyN2FkM2RmNGI1ZGJkMzM4MzFjZGJlZjUyNTUxYjNhOWNjM2QzYjJlNDdmMDU2MmE5MjNmQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20";

export type HubEvent = {
  readonly id: string;
  readonly title: string;
  readonly start: string;
  readonly end: string;
  readonly allDay: boolean;
  readonly imageUrl?: string;
  readonly meetingUrl?: string;
  readonly location?: string;
};
