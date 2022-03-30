import moment from 'moment'

export const relativeTimestampFormatter = (time, prefix) => {
    const timeFromNow = moment(time).fromNow()

    if (prefix) {
        return `${prefix}${timeFromNow}`
    }

    return timeFromNow
}
