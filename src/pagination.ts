export const paginate = <T>(items: T[], pageSize: number): T[][] => {
  return items.reduce((ac, value, index) => {
    const id = Math.floor(index / pageSize);
    const page = ac[id] || (ac[id] = []);

    page.push(value);
    return ac;
  }, [] as T[][]);
};
