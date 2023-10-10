export class TxnHelper {
  static generateRef(prefix: string) {
    return `${prefix}-${this.randomStr(
      6,
    )}-${this.formatDate()}-${this.randomStr(3)}`;
  }

  static randomStr(length: number) {
    let str = '';
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = length; i > 0; --i)
      str += chars[Math.floor(Math.random() * chars.length)];

    return str;
  }

  static formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();
    return `${year}${month < 10 ? '0' + month : month}${
      day < 10 ? '0' + day : day
    }${hh < 10 ? '0' + hh : hh}${mm < 10 ? '0' + mm : mm}${
      ss < 10 ? '0' + ss : ss
    }`;
  }
}
