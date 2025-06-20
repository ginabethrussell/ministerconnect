import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useProfileCompletion = () => {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = () => {
      const churchName = localStorage.getItem('churchName');
      const churchEmail = localStorage.getItem('churchEmail');
      const churchPhone = localStorage.getItem('churchPhone');
      const streetAddress = localStorage.getItem('churchStreetAddress');
      const city = localStorage.getItem('churchCity');
      const state = localStorage.getItem('churchState');
      const zipCode = localStorage.getItem('churchZipCode');
      
      const isComplete = !!(churchName && churchEmail && churchPhone && streetAddress && city && state && zipCode);
      setIsProfileComplete(isComplete);
      setLoading(false);
      
      // If profile is not complete, redirect to settings
      if (!isComplete) {
        router.push('/church/settings?incomplete=true');
      }
    };

    checkProfileCompletion();
  }, [router]);

  return { isProfileComplete, loading };
}; 