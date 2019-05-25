import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import AppSlider from './AppSlider';
import AppStepper from './AppStepper';
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
         onPress={onPress}>
             <Text>Submit</Text>
        </TouchableOpacity>
    )
}

export default class AddEntry extends Component {
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

        // TODO: update redux
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

        // TODO : update redux
        // TODO : route to home
        removeEntry(key)
    }

    render() {
        const metaInfo = getMetricMetaInfo()
        
        if(this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name='md-happy'
                        size={100}
                    />
                    <Text>You already logged your information today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }
        
        return <View>
            <DateHeader date={(new Date()).toLocaleDateString()}/>
            {Object.keys(metaInfo).map((key) => {
                const { getIcon, type, ...rest } = metaInfo[key]
                const value = this.state[key]

                return (
                    <View key={key}>
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
