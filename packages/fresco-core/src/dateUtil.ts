export const formatDate = (dateObject: Date): string => {
  return dateObject.toISOString().slice(0, 10);
};

export const copyDate = (date: Date): Date => {
  return new Date(date.getTime());
};

export const incrementDate = ({
  dateObject,
  incrementBy: increment = 1,
}: {
  dateObject: Date;
  incrementBy?: number;
}): void => {
  dateObject.setDate(dateObject.getDate() + increment);
};

export const changeDateBy = ({
  dateObject,
  delta = 0,
}: {
  dateObject: Date;
  delta?: number;
}): Date => {
  const newDate = copyDate(dateObject);
  newDate.setDate(dateObject.getDate() + delta);
  return newDate;
};
