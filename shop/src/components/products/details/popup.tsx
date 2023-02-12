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

const RelatedProducts = dynamic(() => import('./related-products'));
interface ProductPopupProps {
  productSlug: string;
  isNotInfluencerProduct?: any;
  receivedProduct?: any;
}
const Popup: React.FC<ProductPopupProps> = ({
  productSlug,
  isNotInfluencerProduct = false,
  receivedProduct,
}) => {
  console.log('receivedProduct', receivedProduct);
  const router = useRouter();
  const { t } = useTranslation('common');
  const [showStickyShortDetails] = useAtom(stickyShortDetailsAtom);
  let product: any;
  let isLoading: any;
  if (isNotInfluencerProduct) {
    const data = useProduct({ slug: productSlug });
    product = data.product;
    isLoading = data.isLoading;
  } else {
    const data = router.query.id
      ? useInfluencerProduct({ slug: productSlug, id: router.query.id, type:receivedProduct?.pivot?.type })
      : useProduct({ slug: productSlug });
    product = data.product;
    isLoading = data.isLoading;
  }

  const productItem: any = product;

  const { id, related_products } = product ?? {};

  if (isLoading || !product)
    return (
      <div className="relative flex h-96 w-96 items-center justify-center bg-light">
        <Spinner text={t('common:text-loading')} />
      </div>
    );
  return (
    <AttributesProvider>
      <article className="relative z-[51] w-full max-w-6xl bg-light md:rounded-xl xl:min-w-[1152px]">
        {/* Sticky bar */}
        <ShortDetails
          product={
            router.query.id && !isNotInfluencerProduct
              ? {
                  ...productItem,
                  image: JSON.parse(
                    productItem?.pivot?.featureInfluencerImageUrl
                  ),
                  gallery: [
                    JSON.parse(productItem?.pivot?.featureInfluencerImageUrl),
                    ...productItem.gallery,
                  ],
                }
              : productItem
          }
          isSticky={showStickyShortDetails}
        />
        {/* End of sticky bar */}
        <Details
          product={
            router.query.id && !isNotInfluencerProduct
              ? {
                  ...productItem,
                  image: JSON.parse(
                    productItem?.pivot?.featureInfluencerImageUrl
                  ),
                  gallery: [
                    JSON.parse(productItem?.pivot?.featureInfluencerImageUrl),
                    ...productItem.gallery,
                  ],
                }
              : productItem
          }
          backBtn={false}
          isModal={true}
        />

        {related_products?.length! > 1 && (
          <div className="p-5 md:pb-10 lg:p-14 xl:p-16">
            <RelatedProducts
              products={related_products}
              currentProductId={id}
            />
          </div>
        )}
      </article>
    </AttributesProvider>
  );
};

export default Popup;
