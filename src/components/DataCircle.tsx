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
  title: {
    textAlign: "center",
    width: "100%",

  },
  textContainer: {
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
  const railColour = "#ededed";
  const progressColour = "#6cf4b4";

  const r = 83;
  const circ = 2 * Math.PI * r;
  const percentage = ( value / maxValue ) * 100;
  const strokePct = ((100 - percentage) * circ) / 100; 
  // where stroke will start, e.g. from 15% to 100%.

  return (
    <View>
      <Text style={style.title}>{title}</Text>
      <View>
        <Svg 
          width="166" 
          height="166" 
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
          </G>
          <View style={style.textContainer}>
            <Text style={style.tempValue}>{value}</Text>
          </View>
        </Svg>
      </View>
    </View>
  );
}