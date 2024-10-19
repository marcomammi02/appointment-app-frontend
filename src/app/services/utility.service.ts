export function capitalizeFirstLetter(value: any): string {
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
export function toDateTime(inputDay: Date, inputTime: string) {
  const day = formatDateToString(inputDay)
  return `${day}T${inputTime}:00Z`
}

export function toTime(dateTime: string): string {
  const date = new Date(dateTime);
  const hours = ('0' + date.getUTCHours()).slice(-2);
  const minutes = ('0' + date.getUTCMinutes()).slice(-2);
  return `${hours}:${minutes}`;
}

// This function tranform from format "2024-10-19T08:00:00.000Z" to minutes
export function timeToMinutes(time: string): number {
  const formattedTime = toTime(time)
  const [hours, minutes] = formattedTime.split(':').map(Number)
  return hours * 60 + minutes;
}

// This function tranform from format "12:00" to minutes
export function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function firstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase();
}

export function getDayOfWeek(date: Date): string {
  const weekDays = [
    'Domenica', 'Lunedì', 'Martedì', 'Mercoledì',
    'Giovedì', 'Venerdì', 'Sabato'
  ]
  const day = date.getDay()

  return weekDays[day]
}
