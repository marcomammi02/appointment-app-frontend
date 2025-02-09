export function capitalizeFirstLetter(value: any): string {
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

export function formatDateToString(inputDate: Date): string {
  const date: Date = new Date(inputDate);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

// From dateTime to "dd/mm/yyyy"
export function formatDateToStringDayFirst(dateInput: Date): string {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function toDateTime(inputDay: Date, inputTime: string) {
  const day = formatDateToString(inputDay);
  return `${day}T${inputTime}:00Z`;
}

export function toTime(dateTime: string): string {
  const date = new Date(dateTime);
  const hours = ('0' + date.getUTCHours()).slice(-2);
  const minutes = ('0' + date.getUTCMinutes()).slice(-2);
  return `${hours}:${minutes}`;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formattedHours = ('0' + hours).slice(-2);
  const formattedMinutes = ('0' + remainingMinutes).slice(-2);

  return `${formattedHours}:${formattedMinutes}`;
}

// This function tranform from format "2024-10-19T08:00:00.000Z" to minutes
export function timeToMinutes(time: string): number {
  const formattedTime = toTime(time);
  const [hours, minutes] = formattedTime.split(':').map(Number);
  return hours * 60 + minutes;
}

// This function tranform from format "12:00" to minutes
export function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// This function transforms a time string "12:30" to an hour value as a number
export function timeStringToHour(time: string): number {
  if (!time) return 0;
  const [hours] = time.split(':').map(Number);
  return hours;
}

export function firstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase();
}

export function getDayOfWeek(date: Date): string {
  const weekDays = [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ];
  const day = date.getDay();

  return weekDays[day];
}

// This function extract time like "12:00" from a date string like "2024-10-19T08:00:00.000Z"
export function getTime(date: Date) {
  let hours: number | string = date.getHours();
  let minutes: number | string = date.getMinutes();
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes == 0) {
    minutes = '00';
  }
  return `${hours}:${minutes}`;
}

export function convertLocalToUTC(localDate: Date): Date {
  // Ottieni l'offset del fuso orario locale in minuti (positivo se il fuso orario locale è indietro rispetto a UTC)
  const timezoneOffset = localDate.getTimezoneOffset();

  // Aggiungi l'offset per ottenere la data in UTC
  const utcDate = new Date(localDate.getTime() + timezoneOffset * 60000);

  return utcDate;
}

export function convertUTCToLocal(utcDate: Date): Date {
  // Ottieni l'offset del fuso orario locale in minuti (positivo se il fuso orario locale è avanti rispetto a UTC)
  const timezoneOffset = utcDate.getTimezoneOffset();

  // Sottrarre l'offset per ottenere la data locale
  const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);

  return localDate;
}
