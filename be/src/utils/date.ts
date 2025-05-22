export const addTwoHours = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid input: argument must be a Date object');
  }

  return new Date(date.getTime() + 2 * 60 * 60 * 1000);
};
