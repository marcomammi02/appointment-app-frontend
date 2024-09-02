export function capitalizeFirstLetter(value: any): string {
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

