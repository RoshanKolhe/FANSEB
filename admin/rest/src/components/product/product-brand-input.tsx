import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import { useShopsQuery } from '@/data/shop';
import ValidationError from '@/components/ui/form-validation-error';

interface Props {
  control: Control<any>;
  setValue: any;
  shopError:any;
}

const ProductBrandInput = ({ control, setValue, shopError }: Props) => {
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
      setValue('shops', []);
    }
  }, [type?.slug]);

  const { shops, paginatorInfo, loading, error } = useShopsQuery({
    limit: 1000,
  });

  return (
    <div className="mb-5">
      <Label>Brands</Label>
      <SelectInput
        name="shops"
        control={control}
        getOptionLabel={(option: any) =>(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={option?.logo?.thumbnail} height="30px" width="30px"/>
            <span style={{ marginLeft: 5 }}>{option?.name}</span>
          </div>
        )}
        getOptionValue={(option: any) => option.id}
        // @ts-ignore
        options={shops}
        isLoading={loading}
      />
      <ValidationError message={t(shopError!)} />
    </div>
  );
};

export default ProductBrandInput;
