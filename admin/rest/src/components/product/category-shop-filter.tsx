import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import { useTypesQuery } from '@/data/type';
import { ActionMeta } from 'react-select';
import { useShopsQuery } from '@/data/shop';

type Props = {
  onCategoryFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onShopFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function CategoryShopFilter({
  onShopFilter,
  onCategoryFilter,
  className,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { shops, paginatorInfo, loading, error } = useShopsQuery({
    limit: 1000,
  });
  const { categories, loading: categoryLoading } = useCategoriesQuery({
    limit: 999,
    language: locale,
  });

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className
      )}
    >
      <div className="w-full">
        <Label>Filter By Brand</Label>
        <Select
          options={shops}
          isLoading={loading}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder='Filter By Brand'
          onChange={onShopFilter}
        />
      </div>
      <div className="w-full">
        <Label>{t('common:filter-by-category')}</Label>
        <Select
          options={categories}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder={t('common:filter-by-category-placeholder')}
          isLoading={categoryLoading}
          onChange={onCategoryFilter}
        />
      </div>
    </div>
  );
}
