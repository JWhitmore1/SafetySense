import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';

type DataCircleProps = {
  title: string;
  value: number | undefined;
  maxValue: number;
  unit?: string;
  threshold?: number | undefined;
}

const style = StyleSheet.create({
  container: {
    width: "45%",
    height: 220,
    borderRadius: 20,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5
  },
  title: {
    textAlign: "center",
    width: "100%",
    fontSize: 20,
    padding: 10
  },
  valueContainer: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  tempValue: {
    width: "100%",
    fontSize: 38,
    textAlign: "center",
    color: "#000"
  }
})

export const DataCircle = ({title, value, maxValue, unit, threshold}: DataCircleProps) => {
  const r = 83;

  if (value == undefined) {
    return (
      <View style={style.container}>
        <Text style={style.title}>{title}</Text>
        <View style={{
          width: r*2, 
          height: r*2,
        }}>
          <ActivityIndicator 
            size="large" 
            color="#64ab5b"
          />
        </View>
      </View>
    );
  }

  const circ = 2 * Math.PI * r;
  const percentage = ( value / maxValue ) * 100;
  const strokePct = ((100 - percentage) * circ) / 100; 
  
  const thresholdPct = ((threshold ?? 0 )/ maxValue) * 360; 

  const railColour = "#ededed"
  const progressColour = value < (threshold ?? value + 1) ? "#6cf4b4" : "#FF0303";
  const thresholdColour = "#818181";

  return (
    <View style={title ? style.container : {...style.container, height: r*2, width: r*2}}>
      {title && 
        <Text style={style.title}>{title}</Text>
      }
      <View>
        <Svg 
          width={r*2} 
          height={r*2}
          viewBox="-20.75 -20.75 207.5 207.5"
        >
          <G transform={`rotate(-90 ${r} ${r})`}>
            {/* background circle */}
            <Circle 
              r={r} 
              cx={r} 
              cy={r} 
              fill="transparent" 
              stroke={railColour}
              strokeWidth="19" 
              strokeDasharray={circ}
              strokeDashoffset="0"
            />
            {/* progress circle */}
            <Circle 
              r={r} 
              cx={r} 
              cy={r} 
              stroke={progressColour}
              strokeWidth="16px" 
              strokeLinecap="round" 
              strokeDashoffset={strokePct}
              fill="transparent" 
              strokeDasharray={circ}
            />
            {/* threshold marker */}
            {threshold &&
              <Circle 
              r={r} 
              cx={r} 
              cy={r} 
              stroke={thresholdColour}
              fill="transparent"
              strokeWidth="30" 
              strokeDasharray={circ}
              strokeDashoffset={r*6.22}
              transform={`rotate(${thresholdPct} ${r} ${r})`}
              />
            }
          </G>
          <View style={style.valueContainer}>
            <Text style={style.tempValue}>{Math.round(value)}{unit}</Text>
          </View>
        </Svg>
      </View>
    </View>
  );
}