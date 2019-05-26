import { AsyncStorage } from 'react-native'
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from './_calender'

export function fetchCalenderResults() {
    return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
            .then(formatCalendarResults)
}

export function submitEntry({key, entry}) {
    return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
        [key]: entry
    }))
}

export function removeEntry(key) {
    return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
    .then((results) => {
        const data = JSON.stringify(results)
        data[key] = undefined
        delete data[key]
        AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data))
    })
}