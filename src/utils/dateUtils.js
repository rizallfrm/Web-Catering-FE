// src/utils/dateUtils.js
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export const formatIndonesianDate = (dateString) => {
  return dayjs(dateString).format('dddd, D MMMM YYYY');
};

export const getNextDateForDay = (dayName) => {
  const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
  const targetDayIndex = days.indexOf(dayName.toLowerCase());
  
  const today = dayjs();
  let nextDate = today.day(targetDayIndex);
  
  if (nextDate.isBefore(today, 'day')) {
    nextDate = nextDate.add(1, 'week');
  }
  
  return nextDate;
};