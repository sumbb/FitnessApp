import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import { fetchCalenderResults } from '../utils/api'
import UdaciFitnessCalendar from 'udacifitness-calendar'
import { AsyncStorage } from 'react-native'

class History extends Component {

    componentDidMount() {
        const { dispatch } = this.props

        fetchCalenderResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                if(!entries[timeToString()]) {
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })
    }

    renderItem = ({ today, ...metrics }, formattedDate, key) => {
        return (
        <View>
            {today 
             ? <Text>{JSON.stringify(today)}</Text>
             : <Text>{JSON.stringify(metrics)}</Text>
            }
        </View>
    )}
    renderEmptydate = (formattedDate) =>  {
        return (
        <View>
            <Text>No data for this day</Text>
        </View>)
    }

    render() {
        
        return (
           <UdaciFitnessCalendar 
                items={this.props.entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptydate}
            />
        )
    }
}

function mapStateToProps(entries) {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)