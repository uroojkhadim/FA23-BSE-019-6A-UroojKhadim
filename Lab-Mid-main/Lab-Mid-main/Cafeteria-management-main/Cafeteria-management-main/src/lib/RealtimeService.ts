import { BaseCrudService } from "@/integrations/cms/service";
import { toast } from "sonner";

/**
 * RealtimeService provides a layer for background updates.
 * Since migrating to SQLite, this now uses polling as a simple fallback
 * for real-time functionality.
 */
export const RealtimeService = {
  /**
   * Subscribes to a collection with polling
   */
  subscribeToCollection: (
    collectionName: string, 
    callback: (data: any[]) => void,
    _options: any = {}
  ) => {
    console.log(`RealtimeService: Polling enabled for ${collectionName}`);
    
    const fetchData = async () => {
      try {
        const result = await BaseCrudService.getAll(collectionName);
        callback(result.items);
      } catch (error) {
        console.error(`RealtimeService poll error (${collectionName}):`, error);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  },

  /**
   * Logs a system activity for the audit trail
   */
  logActivity: async (userId: string, userName: string, action: string, details: string) => {
    try {
      await BaseCrudService.create("activity_logs", {
        userId,
        userName,
        action,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  },

  /**
   * Specialized listener for the kitchen/staff order queue
   */
  subscribeToOrderQueue: (callback: (orders: any[]) => void) => {
    return RealtimeService.subscribeToCollection('orders', (data) => {
      const activeOrders = data.filter(order => 
        ['ordered', 'accepted', 'in_process', 'ready'].includes(order.status)
      );
      callback(activeOrders);
    });
  }
};
