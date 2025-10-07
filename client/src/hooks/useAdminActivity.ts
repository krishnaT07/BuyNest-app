import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  type: 'order' | 'seller' | 'user' | 'shop';
  message: string;
  time: string;
  status: 'success' | 'pending' | 'info' | 'warning';
}

export const useAdminActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const activities: ActivityItem[] = [];

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, status, created_at, shop_id')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentOrders) {
        for (const order of recentOrders) {
          const { data: shop } = await supabase
            .from('shops')
            .select('name')
            .eq('id', order.shop_id)
            .single();

          activities.push({
            id: `order-${order.id}`,
            type: 'order',
            message: `New order ${order.id.slice(0, 8)} placed at ${shop?.name || 'Unknown Shop'}`,
            time: formatTimeAgo(order.created_at),
            status: order.status === 'delivered' ? 'success' : 'pending'
          });
        }
      }

      // Get recent shop registrations
      const { data: recentShops } = await supabase
        .from('shops')
        .select('id, name, created_at, is_approved')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentShops) {
        recentShops.forEach(shop => {
          activities.push({
            id: `shop-${shop.id}`,
            type: 'seller',
            message: `${shop.name} requested shop verification`,
            time: formatTimeAgo(shop.created_at),
            status: shop.is_approved ? 'success' : 'pending'
          });
        });
      }

      // Get recent user registrations
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentUsers) {
        activities.push({
          id: `users-today`,
          type: 'user',
          message: `${recentUsers.length} new users registered recently`,
          time: formatTimeAgo(recentUsers[0]?.created_at),
          status: 'info'
        });
      }

      // Sort all activities by time
      activities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      setActivities(activities.slice(0, 10));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const parseTimeAgo = (timeString: string): number => {
    if (timeString === 'Just now') return 0;
    const match = timeString.match(/(\d+)\s+(mins?|hours?|days?)/);
    if (!match) return 0;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    if (unit.startsWith('min')) return value;
    if (unit.startsWith('hour')) return value * 60;
    if (unit.startsWith('day')) return value * 60 * 24;
    return 0;
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return { activities, loading, refetch: fetchActivities };
};