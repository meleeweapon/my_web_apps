export const shuffleInPlace = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const formatMatch = (matchMilliseconds: number) => {
  return (matchMilliseconds / 1000).toFixed(2);
};
