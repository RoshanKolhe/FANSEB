import Spinner from '@/components/ui/loaders/spinner/spinner';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import Details from './details';
import ShortDetails from './short-details';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import { useAtom } from 'jotai';
import { AttributesProvider } from './attributes.context';
import { useInfluencerProduct, useProduct } from '@/framework/product';
import { useRouter } from 'next/router';
import { useReel } from '@/framework/reel';
import ReelView from './reel-view';

const RelatedProducts = dynamic(() => import('./related-products'));
interface ReelPopupProps {
  reel_id: any;
}
const Popup: React.FC<ReelPopupProps> = ({ reel_id }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { reel, isLoading } = useReel({ id: reel_id });

  const reelItem: any = reel;

  const { id, products: related_products_new } = reelItem ?? {};

  if (related_products_new && related_products_new.length) {
    var related_products = related_products_new.filter((res: any) => {
      return res.status === 'publish';
    });
  }

  if (isLoading || !reel)
    return (
      <div className="relative flex h-96 w-96 items-center justify-center bg-light">
        <Spinner text={t('common:text-loading')} />
      </div>
    );
  return (
    <AttributesProvider>
      <article className="relative z-[51] w-full max-w-6xl bg-light md:rounded-xl xl:min-w-[1152px]">
        <ReelView
          reel={reelItem}
          backBtn={false}
          isModal={true}
          related_products={related_products}
        />

        {/* {related_products?.length! >= 1 && (
          <div className="p-5 md:pb-10 lg:p-14 xl:p-16">
            <RelatedProducts
              products={related_products}
              currentProductId={id}
            />
          </div>
        )} */}
      </article>
    </AttributesProvider>
  );
};

export default Popup;
