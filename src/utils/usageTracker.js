export const getTodayKey = () => {
  const today = new Date().toISOString().split("T")[0]; // ex: "2025-10-11"
  return `usage_${today}`;
};

export const getUsageCount = (isLoggedIn) => {
  const key = getTodayKey();
  const data = JSON.parse(localStorage.getItem(key)) || { guest: 0, user: 0 };
  return isLoggedIn ? data.user : data.guest;
};

export const incrementUsage = (isLoggedIn) => {
  const key = getTodayKey();
  const data = JSON.parse(localStorage.getItem(key)) || { guest: 0, user: 0 };

  if (isLoggedIn) data.user += 1;
  else data.guest += 1;

  localStorage.setItem(key, JSON.stringify(data));
};

export const getRemainingQuota = (isLoggedIn) => {
  const max = isLoggedIn ? 5 : 5;
  const count = getUsageCount(isLoggedIn);
  return Math.max(0, max - count);
};

export const resetUsage = () => {
  // untuk testing manual reset
  localStorage.clear();
};
