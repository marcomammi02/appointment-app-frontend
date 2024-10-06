export function capitalizeFirstLetter(value: any): string {
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}
 export function toDateTime(inputDay: string, inputTime: string) {
  const day = '2024-10-06'
  return `${day}T${inputTime}:00Z`
 }
