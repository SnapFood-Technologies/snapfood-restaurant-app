import firebase from '@react-native-firebase/app';
import {EventRegister} from 'react-native-event-listeners';

export const androidChannelId = 'OrderManagementAppNotificationChannel';
export const androidChannelDescription = 'Main Channel';

export const PUSH_NOTIFICATION_RECEIVED_EVENT = 'pushNotificationReceivedEvent';
// export const PUSH_NOTIFICATION_OPENED_EVENT = 'pushNotificationOpenedEvent';
// export const PUSH_NOTIFICATION_VENDOR_NEW_ORDER = 'pushNotificationVendorNewOrder';

export const setupPushNotifications = async () => {
  try {
    await firebase.messaging().requestPermission();
    const fcmToken = await firebase.messaging().getToken();
    console.log('FIREBASE TOKEN: ', fcmToken);
    // Build a channel
    const channel = new firebase.notifications.Android
      .Channel(androidChannelId, androidChannelDescription, firebase.notifications.Android.Importance.Max)
      .setDescription('Main Channel for notifications');

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    firebase.notifications().onNotification((notification) => {
      notification.android.setChannelId('OrderManagementAppNotificationChannel');
      notification.android.setSmallIcon('@mipmap/ic_launcher');
      firebase.notifications().displayNotification(notification);
    });
    firebase.notifications().onNotificationOpened(({notification}) => {
      EventRegister.emit(PUSH_NOTIFICATION_RECEIVED_EVENT, notification);
    });
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      EventRegister.emit(PUSH_NOTIFICATION_RECEIVED_EVENT, notificationOpen.notification);
    }
    return notificationOpen;
  } catch (e) {
    console.log(e);
  }
};
