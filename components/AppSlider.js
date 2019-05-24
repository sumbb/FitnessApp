import React from 'react'
import { View, Slider, Text } from 'react-native'

export default function AppSlider({ max, unit, step, value, onChange }) {
    return (
        <View>
            <Slider 
                minimumValue={0}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={onChange}
            />
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    )  
}