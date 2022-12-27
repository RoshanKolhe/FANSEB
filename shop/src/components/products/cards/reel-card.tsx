import type { Product } from '@/types';
import dynamic from 'next/dynamic';
import { InstagramEmbed } from 'react-social-media-embed';

interface ReelCardProps {
  reel: any;
  className?: string;
  cardType?: any;
}
const ReelCard: React.FC<ReelCardProps> = ({ reel, className, ...props }) => {
  return reel.reel_link ? (
    <video controls width="100%">
      <source src={reel.reel_link?.original} type="video/mp4" />
      Sorry, your browser doesn't support videos.
    </video>
  ) : null;
};
export default ReelCard;
