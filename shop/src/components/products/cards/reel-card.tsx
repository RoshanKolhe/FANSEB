import type { Product } from '@/types';
import dynamic from 'next/dynamic';
import { InstagramEmbed } from 'react-social-media-embed';

interface ReelCardProps {
  reel:any;
  className?: string;
  cardType?: any;
}
const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  className,
  ...props
}) => {
  console.log("reelData",reel);
  return reel.reel_link ? <InstagramEmbed url={reel.reel_link} width={328} /> : null
};
export default ReelCard;
