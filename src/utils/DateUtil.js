export function getCurrentTimer() {
  let date = new Date()
  let hour = date.getHours()
  let min = date.getMinutes()
  let second = date.getSeconds()
  let mills = date.getMilliseconds()
  return hour + ':' + min + ":" + second + ' ' + mills
}