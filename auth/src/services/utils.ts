export function pad(num: number, size: number): string {
  let numStr = num.toString();
  while (numStr.length < size) numStr = '0' + num;
  return numStr;
}

export function formatDate(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1, 2) +
    '-' +
    pad(d.getDate(), 2) +
    ' ' +
    pad(d.getHours(), 2) +
    ':' +
    pad(d.getMinutes(), 2) +
    ':' +
    pad(d.getSeconds(), 2) +
    '.' +
    pad(d.getMilliseconds(), 3)
  );
}
