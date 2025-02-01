import * as momentTimezone from 'moment-timezone';

export const dueDateCalculate = (): Date => {
  const hour14 = momentTimezone()
    .tz('Asia/Tehran')
    .set('hour', 14)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);

  return hour14.toDate();
};

export const getStartOfDate = (): Date => {
  const date = momentTimezone().tz('Asia/Tehran').startOf('day');

  return date.toDate();
};

export const getTomorrowDate = (): Date => {
  const tomorrow = momentTimezone()
    .tz('Asia/Tehran')
    .add(1, 'day')
    .startOf('day');

  return tomorrow.toDate();
};
