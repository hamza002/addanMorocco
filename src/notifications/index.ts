import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';
import {PrayerTimesResult, PrayerName, PRAYER_NAMES} from '../utils/prayerTimes';

const CHANNEL_ID = 'prayer_times';

export async function createNotificationChannel(): Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Prayer Times',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

export async function schedulePrayerNotifications(
  prayerTimes: PrayerTimesResult,
  enabledPrayers: Record<string, boolean>,
  prayerLabels: Record<PrayerName, string>,
  bodyTemplate: string,
): Promise<void> {
  // Cancel existing prayer notifications first
  await cancelPrayerNotifications();

  const now = Date.now();

  for (const name of PRAYER_NAMES) {
    if (!enabledPrayers[name]) {
      continue;
    }

    const prayerTime = prayerTimes[name];
    if (prayerTime.getTime() <= now) {
      continue; // Skip past prayers
    }

    const label = prayerLabels[name] || name;
    const body = bodyTemplate.replace('{{prayer}}', label);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: prayerTime.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: `prayer_${name}`,
        title: label,
        body,
        android: {
          channelId: CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          sound: 'default',
          smallIcon: 'ic_notification',
          pressAction: {id: 'default'},
        },
        ios: {
          sound: 'default',
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      },
      trigger,
    );
  }
}

export async function cancelPrayerNotifications(): Promise<void> {
  try {
    for (const name of PRAYER_NAMES) {
      await notifee.cancelNotification(`prayer_${name}`);
    }
  } catch (e) {
    console.warn('Failed to cancel notifications', e);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await notifee.cancelAllNotifications();
}
