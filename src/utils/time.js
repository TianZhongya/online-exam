import moment from 'moment'

export function forDate (timestamp) {
  return moment.unix(timestamp).format('YYYY-MM-DD')
}
export function forDateTime (timestamp) {
  return moment.unix(timestamp).format('YYYY-MM-DD hh:mm:ss')
}

export default {
  forDate, forDateTime
}
