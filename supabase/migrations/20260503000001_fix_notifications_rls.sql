-- Fix: split the blanket "for all" notifications RLS policy into per-operation
-- policies so that server actions can INSERT notifications for *other* users
-- (cross-user notification pattern) while users can only read/update/delete
-- their own rows.

-- 1. Drop the original blanket policy (covers INSERT + SELECT + UPDATE + DELETE
--    all under auth.uid() = user_id, which blocks cross-user inserts).
DROP POLICY IF EXISTS "Users can modify notifications" ON public.notifications;

-- 2. Users may only read their own notifications.
CREATE POLICY "Users can read own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Users may only update their own notifications (e.g. mark as read).
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users may only delete their own notifications.
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Any authenticated session may INSERT a notification for any recipient.
--    All inserts flow exclusively through trusted server-side actions
--    (createNotification in src/server/notifications/actions.ts) — never
--    directly from the browser client — so this is safe.
CREATE POLICY "Authenticated users can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
