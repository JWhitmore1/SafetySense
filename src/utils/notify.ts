import PushNotificationIOS, { NotificationRequest } from "@react-native-community/push-notification-ios";
import { warningCategories } from "../data/sensorTypes";
import icons from "../data/icons";

export const notify = (category: warningCategories) => {
  const request: NotificationRequest = {
    id: `${category}-warning`,
    title: `${category} warning`,
    body: `SafetySense has detected ${category.toLowerCase()} at an unsafe level!`,
  }
  PushNotificationIOS.addNotificationRequest(request);
} 