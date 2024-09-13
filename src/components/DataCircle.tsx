import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';

type DataCircleProps = {
  title: string;
  value: number;
  maxValue: number;
  threshold: number;
}

const style = StyleSheet.create({
  container: {
    width: 190,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
  },
  title: {
    textAlign: "center",
    width: "100%",
    fontSize: 20,
    padding: 20
  },
  valueContainer: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  tempValue: {
    width: "100%",
    fontSize: 42,
    textAlign: "center",
    color: "#000"
  }
})

export const DataCircle = ({title, value, maxValue, threshold}: DataCircleProps) => {
  const railColour = "#ededed"
  const progressColour = value < threshold ? "#6cf4b4" : "#FF0303";
  const thresholdColour = "#818181";

  const r = 83;
  const circ = 2 * Math.PI * r;
  const percentage = ( value / maxValue ) * 100;
  const strokePct = ((100 - percentage) * circ) / 100; 
  
  const thresholdPct = (threshold / maxValue) * 360; 

  return (
    <View style={style.container}>
      <Text style={style.title}>{title}</Text>
      <View>
        <Svg 
          width="190" 
          height="190" 
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
            <Circle 
              r={r} 
              cx={r} 
              cy={r} 
              stroke={thresholdColour}
              fill="transparent"
              strokeWidth="32" 
              strokeDasharray={circ}
              strokeDashoffset="526"
              transform={`rotate(${thresholdPct} ${r} ${r})`}
            />
          </G>
          <View style={style.valueContainer}>
            <Text style={style.tempValue}>{value}</Text>
          </View>
        </Svg>
      </View>
    </View>
  );
}