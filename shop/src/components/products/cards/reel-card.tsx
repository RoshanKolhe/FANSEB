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
    <div
      style={{
        position: 'relative',
      }}
    >
      <img
        src={reel.thumbnail?.thumbnail}
        alt="reel"
        style={{
          width: '100%',
          height: '100%',
          borderBottomRightRadius: '20px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '5%',
          color: 'white',
          top: '0%',
        }}
      >
        <p> {reel.videoDuration} </p>
      </div>
      <div
        style={{
          width: '47%',
          position: 'absolute',
          right: '0%',
          color: 'black',
          left: '50%',
          bottom: '0%',
        }}
      >
        <p
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {reel.name}
        </p>
      </div>
    </div>
  ) : // <video controls width="100%">
  //   <source src={reel.reel_link?.original} type="video/mp4" />
  //   Sorry, your browser doesn't support videos.
  // </video>
  null;
};
export default ReelCard;
