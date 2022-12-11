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
  constructor(date?: string | Date) {
    if (date === undefined) {
      this.date = new Date();
    } else if (typeof date === "string") {
      this.date = new Date(date);
    } else {
      this.date = date;
    }
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
  getRaw() {
    return this.date;
  }
  getTimestamp() {
    return this.date.getTime();
  }
  firstDayOfWeek() {
    /**
     * getDate() 返回指定日期为一个月中的哪一天（1-31）
     * getDay() 返回指定日期中一周的第几天（0 表示星期日）
     * 这个减法可以直接通过日历直观体验
     * 默认以星期日作为一周开始日
     * 这里为了强行用星期一作为一周开始日，暂且用很丑的写法替代
     */
    let weekDay = this.date.getDay();
    weekDay === 0 ? (weekDay = 7) : weekDay;
    return new Time(
      new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() - weekDay + 1,
        0,
        0,
        0
      )
    );
  }
  lastDayOfWeek() {
    let weekDay = this.date.getDay();
    weekDay === 0 ? (weekDay = 7) : weekDay;
    return new Time(
      new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() - weekDay + 1 + 7,
        0,
        0,
        0
      )
    );
  }
  firstDayOfMonth() {
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0));
  }
  lastDayOfMonth() {
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0, 0));
  }
  firstDayOfYear() {
    return new Time(new Date(this.date.getFullYear(), 0, 1, 0, 0, 0));
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
        // 避免新增年份可能出现的日期溢出问题，原理与月份加 1 类似（加 365 天和 366 天的区别）
        // 比如 2000-2-29，年份加 1 的结果应该是 2001-2-28，但由于该年为闰年（加 366 天而不是 365 天），结果为 2001-3-1，不符合预期
        const currentDate = date.getDate(); // 假设日期是 2000-2-29，记为 currentDate
        date.setDate(1); // 将日期置为 2000-2-1
        date.setFullYear(date.getFullYear() + amount); // 年份加 1，日期为 2001-2-1
        const targetDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0).getDate(); // 设置一个新的日期 targetDate 为 2001 年 3 月 0 日，也就是 2001-2-28
        date.setDate(Math.min(currentDate, targetDate)); // 比较 currentDate 和 targetDate，取较小值，符合实际情况：2000-2-29 加 1 年为 2001-2-28
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
