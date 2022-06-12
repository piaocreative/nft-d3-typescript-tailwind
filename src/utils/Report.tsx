export const calcScore = (average: number) => {
  return (100 * (average + 1)) / 2;
};

export const getScoreColor = (score: number): string => {
  if (score >= 0 && score < 5) return "orange-900";
  if (score >= 5 && score < 10) return "orange-800";
  if (score >= 10 && score < 15) return "orange-700";
  if (score >= 15 && score < 20) return "orange-600";
  if (score >= 20 && score < 25) return "orange-500";
  if (score >= 25 && score < 30) return "orange-400";
  if (score >= 30 && score < 35) return "orange-300";
  if (score >= 35 && score < 40) return "orange-200";
  if (score >= 40 && score < 45) return "orange-100";
  if (score >= 45 && score < 50) return "orange-50";
  if (score >= 50 && score < 55) return "sky-50";
  if (score >= 55 && score < 60) return "sky-100";
  if (score >= 60 && score < 65) return "sky-200";
  if (score >= 65 && score < 70) return "sky-300";
  if (score >= 70 && score < 75) return "sky-400";
  if (score >= 75 && score < 80) return "sky-500";
  if (score >= 80 && score < 85) return "sky-600";
  if (score >= 85 && score < 90) return "sky-700";
  if (score >= 90 && score < 95) return "sky-800";
  if (score >= 95 && score <= 100) return "sky-900";
  return "";
};
