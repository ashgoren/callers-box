export const dateToLocaleString = (date: Date) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};
