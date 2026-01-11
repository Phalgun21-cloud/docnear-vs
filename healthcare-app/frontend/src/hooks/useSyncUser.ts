import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Hook to sync Clerk user with MongoDB database
 * This should be called after user signs in to ensure they exist in our database
 */
export const useSyncUser = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { user } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !clerkUser) return;
      
      // Check if user already has dbId in metadata
      const dbId = clerkUser.publicMetadata?.dbId;
      if (dbId) {
        // User already synced
        return;
      }

      try {
        // Sync user with database
        const response = await api.post('/clerk/sync', {
          clerkId: clerkUser.id,
          role: clerkUser.publicMetadata?.role || 'patient'
        });

        if (response.data.success) {
          console.log('User synced successfully:', response.data.user);
          // Reload page to update user metadata
          window.location.reload();
        }
      } catch (error) {
        console.error('Failed to sync user:', error);
        // Don't block user if sync fails - they can still use the app
      }
    };

    syncUser();
  }, [clerkUser, isLoaded]);
};
