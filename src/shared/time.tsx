export const time = (date = new Date()) => {
  const api = {
    format: (pattern = "YYYY-MM-DD") => {
      // 目前支持的格式有：YYYY MM DD HH mm ss sss
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const msecond = date.getMilliseconds();
      return pattern
        .replace(/YYYY/g, year.toString())
        .replace(/MM/, month.toString().padStart(2, "0"))
        .replace(/DD/, day.toString().padStart(2, "0"))
        .replace(/HH/, hour.toString().padStart(2, "0"))
        .replace(/mm/, minute.toString().padStart(2, "0"))
        .replace(/ss/, second.toString().padStart(2, "0"))
        .replace(/sss/, msecond.toString().padStart(3, "0"));
    },
  };
  return api;
};
