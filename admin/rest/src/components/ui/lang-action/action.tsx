import ActionButtons from '@/components/common/action-buttons';
import { Config } from '@/config';
import LanguageAction from './language-switcher';
import shop from '@/components/layouts/shop';
import { useRouter } from 'next/router';

export type LanguageSwitcherProps = {
  record: any;
  slug: string;
  deleteModalView?: string | any;
  routes: any;
  isInfluencerProduct?: boolean;
  showEdit: boolean;
  className?: string | undefined;
};

export default function LanguageSwitcher({
  record,
  slug,
  deleteModalView,
  routes,
  isInfluencerProduct = false,
  showEdit = false,
  className,
}: LanguageSwitcherProps) {
  const { enableMultiLang } = Config;
  const {
    query: { shop },
  } = useRouter();
  return (
    <>
      {enableMultiLang ? (
        <LanguageAction
          slug={slug}
          record={record}
          deleteModalView={deleteModalView}
          routes={routes}
          className={className}
        />
      ) : (
        <ActionButtons
          id={isInfluencerProduct ? record.pivot.id : record?.id}
          editUrl={showEdit ? routes.editWithoutLang(slug, shop) : undefined}
          deleteModalView={deleteModalView}
        />
      )}
    </>
  );
}
