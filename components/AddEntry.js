import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import AppSlider from './AppSlider';
import AppStepper from './AppStepper';
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { getDailyReminderValue } from '../utils/helpers'
import { white, purple, red, blue } from '../utils/colors'

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
         style={ Platform.OS === 'ios' ? styles.iosSubmitBtm : styles.AndroidSubmitBtn}
         onPress={onPress}>
             <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        eat: 0,
        sleep: 0
    }
    
    submit = () => {
        const key = timeToString()
        const entry = this.state

        this.setState({
            run: 0,
            bike: 0,
            swim: 0,
            eat: 0,
            sleep: 0
        })

        this.props.dispatch(addEntry({
            [key]: entry
        }))
        // TODO: navigate to home
        submitEntry({key, entry})
        // TODO: clear the notification
    }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)

        this.setState((prevState) => {
            const count = prevState[metric] + step
            return {
                ...prevState,
                [metric]: count > max ? max : count
            }
        })
    }

    decrement = (metric) => {
        const { step } = getMetricMetaInfo(metric)

        this.setState((prevState) => {
            const count = prevState[metric] - step
            return {
                ...prevState,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, value) => {
        this.setState(() => (
            {
                [metric]: value
            }
        ))
    }

    reset = () => {
        const key = timeToString()

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))
        // TODO : route to home
        removeEntry(key)
    }

    render() {
        const metaInfo = getMetricMetaInfo()
        
        if(this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
                        size={100}
                    />
                    <Text>You already logged your information today</Text>
                    <TextButton style={{padding: 10}} onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }
        
        return <View style={styles.container}>
            <DateHeader date={(new Date()).toLocaleDateString()}/>
            {Object.keys(metaInfo).map((key) => {
                const { getIcon, type, ...rest } = metaInfo[key]
                const value = this.state[key]

                return (
                    <View style={styles.row} key={key}>
                        {getIcon()}
                        {type === 'slider'
                        ? <AppSlider
                            value={value}
                            onChange={(value) => this.slide(key, value)}
                            {...rest}
                          />
                        : <AppStepper
                            value={value}
                            onIncrement={() => this.increment(key)}
                            onDecrement={() => this.decrement(key)}
                            {...rest}
                           />
                        }
                    </View>
                )
            })}
            <SubmitBtn onPress={this.submit}/>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    iosSubmitBtm: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    AndroidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'

    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30
    }
})

function mapStateToProps(state) {
    const key = timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)