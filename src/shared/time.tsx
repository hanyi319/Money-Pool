/**
 * 日期处理
 * 用法示例：
 * import {Time} from "shared/time";
 * const time = new Time();
 * time.format("YYYY-MM-DD");
 * time.firstDayOfMonth();
 * time.firstDayOfYear();
 * time.lastDayOfMonth();
 * time.lastDayOfYear();
 * time.add(1, "month");
 * time.subtract(1, "month");
 */

/**
 * 由于每次使用 time()，就会产生一个新的 API 对象
 * 为了节省内存，将其挂载到原型链上，于是将 time 函数重构为 Time 类
 */
export class Time {
  date: Date;
  constructor(date = new Date()) {
    this.date = date;
  }
  format(pattern = "YYYY-MM-DD") {
    // 目前支持的格式有：YYYY MM DD HH mm ss sss
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const hour = this.date.getHours();
    const minute = this.date.getMinutes();
    const second = this.date.getSeconds();
    const msecond = this.date.getMilliseconds();
    return pattern
      .replace(/YYYY/g, year.toString())
      .replace(/MM/, month.toString().padStart(2, "0"))
      .replace(/DD/, day.toString().padStart(2, "0"))
      .replace(/HH/, hour.toString().padStart(2, "0"))
      .replace(/mm/, minute.toString().padStart(2, "0"))
      .replace(/ss/, second.toString().padStart(2, "0"))
      .replace(/sss/, msecond.toString().padStart(3, "0"));
  }
  firstDayOfMonth() {
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0));
  }
  firstDayOfYear() {
    return new Time(new Date(this.date.getFullYear(), 0, 1, 0, 0, 0));
  }
  lastDayOfMonth() {
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0, 0));
  }
  lastDayOfYear() {
    return new Time(new Date(this.date.getFullYear() + 1, 0, 0, 0, 0, 0));
  }
  add(
    amount: number,
    unit: "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond"
  ) {
    // return new Time but not change this.date
    let date = new Date(this.date.getTime());
    switch (unit) {
      case "year":
        date.setFullYear(date.getFullYear() + amount);
      case "month":
        /**
         * 添加一个月的情况需要专门处理
         * 因为月份加 1 时，JS 是加上当前月份的天数，比如 1、3 月就是加上 31 天；2 月就是 28 或 29 天；4 月就是 30 天
         * 于是就会出现 2000-1-31，加一个月的时间会是 2000-3-2 的情况（也就是加了 31 天）
         */
        const d1 = date.getDate(); // 假设日期是 2000-1-31，先将其记为 d1
        date.setDate(1); // 将日期修改为 2000-1-1，这样加上 31 天后就不会跳转到 3 月了
        date.setMonth(date.getMonth() + amount); // 对 2000-1-1 进行月份加 1 的操作，变成 2000-2-1
        const d2 = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0).getDate(); // 设置一个新的日期 d2 为 2000年3月0日，也就是 2000-2-29
        date.setDate(Math.min(d1, d2)); // 比较 d1 和 d2，取较小值，符合实际情况：2000-1-31 加 1 个月为 2000-2-29
        break;
      case "day":
        date.setDate(date.getDate() + amount);
        break;
      case "hour":
        date.setHours(date.getHours() + amount);
        break;
      case "minute":
        date.setMinutes(date.getMinutes() + amount);
        break;
      case "second":
        date.setSeconds(date.getSeconds() + amount);
        break;
      case "millisecond":
        date.setMilliseconds(date.getMilliseconds() + amount);
        break;
      default:
        throw new Error("Time.add: unknown unit");
    }
    return new Time(date);
  }
}
