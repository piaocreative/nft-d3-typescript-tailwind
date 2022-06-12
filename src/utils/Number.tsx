export const getMaxNumberUnit = (value: number) => {
  let str = Math.ceil(value).toString();
  let digits = str.length;
  let unit = str.substring(0, 1);
  if (unit && parseInt(unit) < 5) {
    unit = "5";
  } else {
    unit = "1";
    digits++;
  }

  for (let i = 0; i < digits - 1; i++) {
    unit += "0";
  }
  return parseInt(unit);
};
