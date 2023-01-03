import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productGalleryValidationSchema } from './product-validation-schema';
import { ProductType, Product, GalleryType } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import ProductTagInput from './product-tag-input';
import Alert from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import ProductAuthorInput from './product-author-input';
import ProductManufacturerInput from './product-manufacturer-input';
import {
  getProductDefaultValues,
  getProductInputValues,
  influencerProductTypeOptions,
  ProductFormValues,
  ProductGalleryFormValues,
  productTypeOptions,
} from './form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import ProductGalleryTypeInput from './product-gallery-type-input';
import ProductGroupInput from './product-group-input';
import ProductCategoryInput from './product-category-input';
import ProductBrandInput from './product-brand-input';
import ProductInput from './product-input copy';
import { type } from 'os';
import { useCreateInfluencerProductMutation, useUpdateInfluencerProductMutation } from '@/data/influencerProduct';
import { useMeQuery } from '@/data/user';


export default function CreateOrUpdateInfluencerProduct({
  initialValues,
}: any) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [galleryType, setGalleryType] = useState<string | null>(null);
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';

  const methods = useForm<ProductGalleryFormValues>({
    resolver: yupResolver(productGalleryValidationSchema),
    shouldUnregister: true,
    // @ts-ignore
    defaultValues: {
      product_gallery_type: influencerProductTypeOptions.find(
        (option) => initialValues?.type === option.value
      ) || undefined,

      featureInfluencerImageUrl: initialValues?.featureInfluencerImageUrl || '',
      shops: initialValues?.products?.shop_id,
      products: initialValues?.products,
    },
  });
  const { data, isLoading: loading, error } = useMeQuery();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const watchShposValueChange = watch("shops");

  const { mutate: createInfluencerProduct, isLoading: creating } =
    useCreateInfluencerProductMutation();
  const { mutate: updateInfluencerProduct, isLoading: updating } =
    useUpdateInfluencerProductMutation();

  const onSubmit = async (values: any) => {
    const inputValues = {
      ...values,
      product_gallery_type: values.product_gallery_type.value,
      userId: data?.id || undefined
    }
    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        //@ts-ignore
        createInfluencerProduct({
          ...inputValues,
        });
      } else {
        //@ts-ignore
        // updateInfluencerProduct({
        //   ...inputValues,
        //   id: initialValues.id!,
        // });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };
  function checkGalleryType(e: any) {
    setValue('product_gallery_type', e);
    setGalleryType(e.value);
  }

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-title-product-type')}
              details={t('form:form-description-product-type')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
            />
            <ProductGalleryTypeInput checkGalleryType={checkGalleryType} />
          </div>
          {galleryType === 'collection' ? <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:featured-image-title')}
              details={t('form:featured-image-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="image" control={control} multiple={false} />
            </Card>
          </div> : null}

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title='Brands & Products'
              details='Select Brands and Products from here'
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductBrandInput control={control} setValue={setValue} shopError={t((errors?.shops as any)?.message)} />
              {watchShposValueChange ?
                <ProductInput control={control} setValue={setValue} productError={t((errors?.products as any)?.message)} shop_id={watchShposValueChange.id} />
                : null
              }
            </Card>
          </div>

          <div className="mb-4 text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="me-4"
                type="button"
              >
                {t('form:button-label-back')}
              </Button>
            )}
            <Button loading={updating || creating}>
              {initialValues
                ? t('form:button-label-update-product')
                : t('form:button-label-add-product')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
