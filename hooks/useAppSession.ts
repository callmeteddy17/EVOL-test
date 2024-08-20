import { useSession } from 'next-auth/react';

export default function usePageSession() {
  return useSession();
}
