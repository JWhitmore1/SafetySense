import { useEffect, useState } from "react";
import { warningCategories } from "../data/sensorTypes";
import { getThreshold } from "../utils/dataUtils";
import { useData } from "./useData";

export const useAlarm = () => {
  const [alarm, setAlarm] = useState(false);
  const [triggeredBy, setTriggeredBy] = useState<warningCategories | 'none'>('none');
  const {loading, data} = useData();

  const alarmCheck = async () => {
    if (!loading && data) {
      const tempThreshold = getThreshold('Temperature');
      const noiseThreshold = getThreshold('Sound Level');
      const airThreshold = getThreshold('Air Quality');

      const temp = data.temperature;
      const noise = data.noiseLevel;
      const air = data.airQuality;

      await Promise.all([tempThreshold, noiseThreshold, airThreshold])
        .then((values) => {
          const thresholds = values.map(threshold => parseInt(threshold))
          let alarm = false
          if (temp > thresholds[0]) {
            alarm = true;
            setTriggeredBy('Temperature');
          }
          if (noise > thresholds[1]) {
            alarm = true
            setTriggeredBy('Sound Level');
          }
          if (air > thresholds[2]) {
            alarm = true;
            setTriggeredBy('Air Quality');
          }
          setAlarm(alarm);
        })
    }
  }

  useEffect(() => {
    alarmCheck();
  }, [data])

  return { alarm, triggeredBy }
}