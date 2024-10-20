import PushNotificationIOS, { NotificationRequest } from "@react-native-community/push-notification-ios";
import { dataCategory } from "../data/ServerData";
import icons from "../data/icons";

export const notify = (category: dataCategory) => {
  const request: NotificationRequest = {
    id: `${category}-warning`,
    title: `${category} warning`,
    body: `SafetySense has detected ${category.toLowerCase()} at an unsafe level!`,
  }
  PushNotificationIOS.addNotificationRequest(request);
} 