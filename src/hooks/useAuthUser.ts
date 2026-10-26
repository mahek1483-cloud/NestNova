import { useSyncExternalStore } from "react";
import { getClientDemoUser, createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let memoryUser: any = null;
let initialized = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function initAuthStore() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  // Initialize from demo cookie if available
  memoryUser = getClientDemoUser();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      supabase.auth.getUser()
        .then(({ data }) => {
          if (data?.user) {
            memoryUser = data.user;
            notify();
          }
        })
        .catch(() => {});

      supabase.auth.onAuthStateChange((_, session) => {
        if (session?.user) {
          memoryUser = session.user;
        } else {
          memoryUser = getClientDemoUser();
        }
        notify();
      });
    } catch {}
  }
}

function subscribe(callback: () => void) {
  if (typeof window !== "undefined") {
    initAuthStore();
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    initAuthStore();
  }
  return memoryUser;
}

function getServerSnapshot() {
  return null;
}

export function useAuthUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setAuthUser(user: any) {
  memoryUser = user;
  notify();
}
