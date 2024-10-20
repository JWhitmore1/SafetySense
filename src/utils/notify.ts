import PushNotificationIOS, { NotificationRequest } from "@react-native-community/push-notification-ios";
import { dataCategory } from "../data/ServerData";

export const notify = (category: dataCategory) => {
  const request: NotificationRequest = {
    id: `${category}-warning`,
    title: `${category} warning`,
    subtitle: `SafetySense has detected a ${category} over its threshold!`,
    isCritical: true,
    criticalSoundVolume: 1,
  }
  console.log('sending notification');
  PushNotificationIOS.addNotificationRequest(request);
} 