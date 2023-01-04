import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import { useShopsQuery } from '@/data/shop';
import ValidationError from '@/components/ui/form-validation-error';
import { useProductsQuery } from '@/data/product';

interface Props {
  control: Control<any>;
  setValue: any;
  productError: any;
  shop_id: any;
}

const ProductInput = ({ control, setValue, productError, shop_id }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation('common');
  const type = useWatch({
    control,
    name: 'type',
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue('products', []);
    }
  }, [type?.slug]);

  const { products, paginatorInfo, loading, error } = useProductsQuery(
    {
      limit: 1000,
      shop_id: shop_id,
      type,
    },
    {
      enabled: Boolean(shop_id),
    }
  );

  return (
    <div className="mb-5">
      <Label>Products</Label>
      <SelectInput
        name="products"
        control={control}
        isMulti
        getOptionLabel={(option: any) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={option?.image?.thumbnail} height="50px" width="50px" style={{maxHeight:'50px'}} />
            <span style={{ marginLeft: 5 }}>
              <p
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                }}
              >
                {option?.name}
              </p>
            </span>
          </div>
        )}
        getOptionValue={(option: any) => option.id}
        // @ts-ignore
        options={products}
        isLoading={loading}
      />
      <ValidationError message={t(productError!)} />
    </div>
  );
};

export default ProductInput;
