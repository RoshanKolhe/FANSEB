import { SUPER_ADMIN, INFLUENCER } from '@/utils/constants';
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));
const InfluencerLayout = dynamic(() => import('@/components/layouts/influencer'));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(SUPER_ADMIN)) {
    return <AdminLayout {...props} />;
  }
  if(userPermissions?.includes(INFLUENCER)){
    return <InfluencerLayout {...props} />;
  }
  return <OwnerLayout {...props} />;
}
