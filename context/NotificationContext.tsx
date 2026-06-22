import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFICATIONS_PAGE_SIZE,
} from "@/services/notifications/notificationsApi";
import type {
  AppNotification,
  BackendNotification,
} from "@/types/notifications/notification";
import { mapBackendNotification } from "@/utils/notifications/mapBackendNotification";

type NotificationContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  receiveNotification: (payload: BackendNotification) => void;
  markAllRead: () => Promise<void>;
  markOneRead: (notificationId: string) => Promise<void>;
  reset: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function sortByNewest(items: AppNotification[]): AppNotification[] {
  return [...items].sort((a, b) => b.createdAt - a.createdAt);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const page = await fetchNotifications(0, NOTIFICATIONS_PAGE_SIZE);
      if (requestId !== requestIdRef.current) return;
      setNotifications(sortByNewest(page.items.map(mapBackendNotification)));
      setHasMore(page.has_more);
      setUnreadCount(page.unread_count);
    } catch {
      // keep cached notifications
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const page = await fetchNotifications(
        notifications.length,
        NOTIFICATIONS_PAGE_SIZE,
      );
      setNotifications((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const next = page.items
          .map(mapBackendNotification)
          .filter((item) => !seen.has(item.id));
        return sortByNewest([...prev, ...next]);
      });
      setHasMore(page.has_more);
      setUnreadCount(page.unread_count);
    } catch {
      // keep current list
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loading, loadingMore, notifications.length]);

  const receiveNotification = useCallback((payload: BackendNotification) => {
    const mapped = mapBackendNotification(payload);
    setNotifications((prev) => {
      if (prev.some((item) => item.id === mapped.id)) return prev;
      return sortByNewest([mapped, ...prev]);
    });
    if (!mapped.isRead) {
      setUnreadCount((count) => count + 1);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // local read state still applied
    }
  }, []);

  const markOneRead = useCallback(async (notificationId: string) => {
    let wasUnread = false;
    setNotifications((prev) =>
      prev.map((item) => {
        if (item.id !== notificationId) return item;
        if (!item.isRead) wasUnread = true;
        return { ...item, isRead: true };
      }),
    );
    if (wasUnread) setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await markNotificationRead(notificationId);
    } catch {
      // local read state still applied
    }
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setNotifications([]);
    setUnreadCount(0);
    setHasMore(false);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      loadingMore,
      hasMore,
      refresh,
      loadMore,
      receiveNotification,
      markAllRead,
      markOneRead,
      reset,
    }),
    [
      notifications,
      unreadCount,
      loading,
      loadingMore,
      hasMore,
      refresh,
      loadMore,
      receiveNotification,
      markAllRead,
      markOneRead,
      reset,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
