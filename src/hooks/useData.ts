import { useEffect, useState } from "react";
import { getData } from "../utils/dataUtils";
import { SensorData } from "../data/sensorTypes";

export const useData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SensorData>();

  const queryData = () => {
    getData().then((data) => {
      setData(data);
      setLoading(false);
    }).catch((e) => {
      console.log(`Error reading saved data: ${e}`);
    });
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      queryData();
    }, 2_000);
  
    return () => clearInterval(interval);
  }, []);

  return {loading, data}
}