import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import DateHeader from './DateHeader'
import { getMetricMetaInfo } from '../utils/helpers'
import { gray, white } from '../utils/colors'



export default function MetricCard({ date, metrics }) {
    return (
        <View style={{ height: 340 }}>
           {date && <DateHeader date={date}/>}
           {Object.keys(metrics).map((metric) => {
               const { getIcon, displayName, unit, backgroundInfo } = getMetricMetaInfo(metric)
               return (
                   <View style={styles.metric} key={metric}>
                       {getIcon()}
                       <View>
                           <Text style={{ fontSize: 20 }}>
                               {displayName}
                           </Text>
                           <Text style={{ fontSize: 16, color: gray }}>
                                {metrics[metric]} {unit}
                           </Text>
                       </View>
                   </View>
               )
           })}
        </View>
    )
}

const styles = StyleSheet.create({
    metric: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 12,
    }
})