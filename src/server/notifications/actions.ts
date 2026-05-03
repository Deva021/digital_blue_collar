"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NotificationType } from "@/lib/constants/notifications";

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body?: string,
  actionUrl?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, unknown> | null
) {
  const supabase = await createClient();
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    body,
    action_url: actionUrl,
    payload,
  });
  if (error) {
    console.error("Error creating notification:", error);
  }
}

export async function getNotifications(page: number = 1, limit: number = 20) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { notifications: [], total: 0 };

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [], total: 0 };
  }

  return { notifications: data || [], total: count || 0 };
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', authData.user.id)
    .eq('is_read', false);

  if (error) {
    console.error("Error fetching unread notifications count:", error);
    return 0;
  }

  return count || 0;
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', authData.user.id);

  if (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/notifications');
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', authData.user.id)
    .eq('is_read', false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/notifications');
  return { success: true };
}
