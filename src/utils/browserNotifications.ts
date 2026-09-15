// Web Push & Browser Notifications Manager
import { Signal } from "../types";

export type NotificationStatus = "default" | "granted" | "denied" | "unsupported";

/**
 * Check if the browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Get current notification permission
 */
export function getNotificationPermission(): NotificationStatus {
  if (!isNotificationSupported()) {
    return "unsupported";
  }
  return Notification.permission as NotificationStatus;
}

/**
 * Register the Service Worker for background notification delivery
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    console.log("Vector_OTC Service Worker registered with scope:", registration.scope);
    return registration;
  } catch (err) {
    console.warn("Failed to register Service Worker for push notifications:", err);
    return null;
  }
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationStatus> {
  if (!isNotificationSupported()) {
    return "unsupported";
  }

  try {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      // Also register SW immediately if not registered
      await registerServiceWorker();
    }
    return perm as NotificationStatus;
  } catch (err) {
    console.error("Error requesting notification permission:", err);
    return "denied";
  }
}

/**
 * Send Web Push / Browser notification for a newly generated trading signal
 */
export async function sendSignalBrowserNotification(signal: Signal): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return false;
  }

  const isCall = signal.recommendation === "أعلى";
  const actionText = isCall ? "شراء (أعلى / CALL 🟢)" : "بيع (أدنى / PUT 🔴)";
  const isVip = signal.strength >= 95;
  const vipTag = isVip ? " ⭐ صفقة VIP" : "";

  const title = `🚨 إشارة ${actionText} - ${signal.assetNameAr}${vipTag}`;
  const body = `سعر الدخول: ${signal.entryPrice} | الفريم: ${signal.timeframe}\nالدقة المتوقعة: ${signal.strength}%\nالاستراتيجية الأوروبية الثلاثية`;

  const notificationPayload = {
    title,
    body,
    icon: "/logo.jpg",
    badge: "/favicon.jpg",
    tag: `signal-${signal.id}`,
    renotify: true,
    requireInteraction: isVip,
    vibrate: isVip ? [300, 100, 300, 100, 300] : [200, 100, 200],
    data: {
      url: window.location.href,
      signalId: signal.id,
      timestamp: Date.now()
    }
  };

  let shown = false;

  // 1. Send to backend push log / API
  try {
    fetch("/api/push-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        body,
        signalId: signal.id,
        assetName: signal.assetNameAr,
        recommendation: signal.recommendation,
        entryPrice: signal.entryPrice,
        strength: signal.strength,
        timeframe: signal.timeframe,
        isVip
      })
    }).catch(() => {});
  } catch {}

  // 2. Deliver via ServiceWorker if available (reaches user even if tab is in background or minimized)
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationPayload);
        shown = true;
      }
    } catch (e) {
      console.warn("ServiceWorker showNotification failed, falling back to Notification API", e);
    }
  }

  // 3. Fallback to standard Window Notification
  if (!shown) {
    try {
      const notif = new Notification(title, {
        body,
        icon: "/logo.jpg",
        badge: "/favicon.jpg",
        tag: `signal-${signal.id}`,
        requireInteraction: isVip
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      shown = true;
    } catch (err) {
      console.warn("Standard Notification fallback error:", err);
    }
  }

  return shown;
}

/**
 * Send a test browser notification to verify permissions and sound
 */
export async function sendTestNotification(): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return false;
  }

  const title = "🔔 إشعارات Vector_OTC مفعلة بنجاح!";
  const body = "تهانينا! ستصلك إشعارات الصفقات اللحظية فورا حتى عندما يكون المتصفح مصغراً أو في الخلفية.";

  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: "/logo.jpg",
          badge: "/favicon.jpg",
          tag: "test-notification",
          vibrate: [200, 100, 200],
          data: { url: window.location.href }
        });
        return true;
      }
    } catch {}
  }

  try {
    const notif = new Notification(title, {
      body,
      icon: "/logo.jpg",
      badge: "/favicon.jpg"
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch {
    return false;
  }
}
