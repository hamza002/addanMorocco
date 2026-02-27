import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';
import {PrayerTimesResult, PrayerName, PRAYER_NAMES} from '../utils/prayerTimes';
import hadiths from '../data/hadiths.json';

const CHANNEL_ID = 'prayer_times';
const HADITH_CHANNEL_ID = 'hadith_daily';
const HADITH_NOTIFICATION_ID = 'daily_hadith';

export async function createNotificationChannel(): Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Prayer Times',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
  await notifee.createChannel({
    id: HADITH_CHANNEL_ID,
    name: 'Hadith du Jour',
    importance: AndroidImportance.DEFAULT,
    sound: 'default',
    vibration: false,
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

/**
 * Schedule a daily hadith notification at 8:00 AM.
 * Uses RepeatFrequency.DAILY so only one trigger entry is needed.
 * The hadith text is selected based on day-of-year to rotate content.
 */
export async function scheduleDailyHadithNotification(language: string): Promise<void> {
  try {
    await notifee.cancelNotification(HADITH_NOTIFICATION_ID);

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const hadith = (hadiths as any[])[dayOfYear % hadiths.length];
    const text: string = hadith[language as 'ar' | 'fr' | 'en'] ?? hadith.fr;
    const source: string = hadith.source ?? '';

    // Schedule for tomorrow at 08:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: tomorrow.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        id: HADITH_NOTIFICATION_ID,
        title: language === 'ar' ? 'حديث اليوم' : language === 'fr' ? 'Hadith du Jour' : 'Hadith of the Day',
        body: `${text}\n— ${source}`,
        android: {
          channelId: HADITH_CHANNEL_ID,
          importance: AndroidImportance.DEFAULT,
          smallIcon: 'ic_notification',
          pressAction: {id: 'default'},
        },
        ios: {
          sound: 'default',
          foregroundPresentationOptions: {
            badge: false,
            sound: false,
            banner: true,
            list: true,
          },
        },
      },
      trigger,
    );
  } catch (e) {
    console.warn('Failed to schedule hadith notification', e);
  }
}

export async function cancelHadithNotification(): Promise<void> {
  try {
    await notifee.cancelNotification(HADITH_NOTIFICATION_ID);
  } catch (e) {
    console.warn('Failed to cancel hadith notification', e);
  }
}
