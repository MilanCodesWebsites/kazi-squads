'use client'

import * as React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Notification03Icon, CheckmarkBadge01Icon } from '@hugeicons/core-free-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { supabaseBrowser } from '@/lib/supabase/browser'

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = React.useState<any[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!userId) return

    const fetchNotifications = async () => {
      const { data } = await supabaseBrowser
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length)
      }
    }

    fetchNotifications()

    // Setup realtime subscription
    const channel = supabaseBrowser
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        setNotifications(prev => [payload.new, ...prev].slice(0, 10))
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [userId])

  const handleOpenChange = async (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && unreadCount > 0) {
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      
      // Mark as read in db
      await supabaseBrowser
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
          <HugeiconsIcon icon={Notification03Icon} className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--kazi-lime)' }}></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 rounded-xl border border-[#e5e5e5] bg-background p-0 shadow-lg" align="end">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className="flex gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="mt-0.5 shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <HugeiconsIcon icon={CheckmarkBadge01Icon} className="h-4 w-4 text-foreground" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
