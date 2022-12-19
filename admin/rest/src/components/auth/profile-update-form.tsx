import Input from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useUpdateUserMutation } from '@/data/user';
import TextArea from '@/components/ui/text-area';
import { getIcon } from '@/utils/get-icon';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import pick from 'lodash/pick';
import { ProfileSocials, ShopSocialInput, SocialInput } from '@/types';
import omit from 'lodash/omit';
import * as socialIcons from '@/components/icons/social';
import Label from '../ui/label';
import SelectInput from '../ui/select-input';
import { getAuthCredentials } from '@/utils/auth-utils';

type FormValues = {
  name: string;
  profile: {
    id: string;
    bio: string;
    contact: string;
    avatar: {
      thumbnail: string;
      original: string;
      id: string;
    };
    socials: ProfileSocials;
  };
};

const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];
export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="space-s-4 flex items-center text-body">
      <span className="flex h-4 w-4 items-center justify-center">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});
export default function ProfileUpdate({ me }: any) {
  const { t } = useTranslation();
  const { mutate: updateUser, isLoading: loading } = useUpdateUserMutation();
  const { permissions: currentUserPermissions } = getAuthCredentials();
  console.log("me", me);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name:me.name,
      
      profile: {
        socials: {
          ...me?.profile.socials.socials,
          socials: me?.profile.socials.socials
            ? me?.profile.socials.socials.map((social: any) => ({
              type: updatedIcons?.find(
                (icon) => icon?.value === social?.type
              ),
              link: social?.link,
            }))
            : [],
          website:me?.profile.socials.website
        },

        bio:me?.profile?.bio,
        contact:me?.profile?.contact,
        avatar:me?.profile.avatar,

      },
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'profile.socials.socials',
  });

  async function onSubmit(values: FormValues) {
    const { name, profile } = values;

    const socials = {
      ...values?.profile.socials,
      socials: values?.profile?.socials
        ? values?.profile?.socials?.socials?.map((social: any) => ({
          type: social?.type?.value,
          link: social?.link,
        }))
        : [],
    };
    console.log("socials", socials);
    const formattedSocials = { socials: socials.socials, website: socials.website }
    if (currentUserPermissions?.includes('influencer')) {
      updateUser({
        id: me?.id,
        input: {
          name: name,
          profile: {
            id: me?.profile?.id,
            bio: profile?.bio,
            contact: profile?.contact,
            avatar: {
              thumbnail: profile?.avatar?.thumbnail,
              original: profile?.avatar?.original,
              id: profile?.avatar?.id,
            },
            socials: formattedSocials

          },
        },
      });
    } else {
      updateUser({
        id: me?.id,
        input: {
          name: name,
          profile: {
            id: me?.profile?.id,
            bio: profile?.bio,
            contact: profile?.contact,
            avatar: {
              thumbnail: profile?.avatar?.thumbnail,
              original: profile?.avatar?.original,
              id: profile?.avatar?.id,
            },

          },
        },
      });
    }

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-avatar')}
          details={t('form:avatar-help-text')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="profile.avatar" control={control} multiple={false} />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:profile-info-help-text')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        />

        <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t('form:input-label-bio')}
            {...register('profile.bio')}
            error={t(errors.profile?.bio?.message!)}
            variant="outline"
            className="mb-6"
          />
          <Input
            label={t('form:input-label-contact')}
            {...register('profile.contact')}
            error={t(errors.profile?.contact?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>
      {currentUserPermissions?.includes('influencer') && (
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title='Socials'
            details='Please select your social details'
            className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            {/* <div className="mb-5">
              <Label>{t('form:input-label-autocomplete')}</Label>
              <Controller
                control={control}
                name="settings.location"
                render={({ field: { onChange } }) => (
                  <GooglePlacesAutocomplete
                    onChange={onChange}
                    data={getValues('settings.location')!}
                  />
                )}
              />
            </div>
            <Input
              label={t('form:input-label-contact')}
              {...register('settings.contact')}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.contact?.message!)}
            /> */}
            <Input
              label={t('form:input-label-website')}
              {...register('profile.socials.website')}
              variant="outline"
              className="mb-5"
              error={t(errors.profile?.socials?.website?.message!)}
            />
            <div>
              {fields.map(
                (item: any & { id: string }, index: number) => (
                  <div
                    className="border-b border-dashed border-border-200 py-5 first:mt-5 first:border-t last:border-b-0 md:py-8 md:first:mt-10"
                    key={item.id}
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                      <div className="sm:col-span-2">
                        <Label>{t('form:input-label-select-platform')}</Label>
                        <SelectInput
                          name={`profile.socials.socials.${index}.type` as const}
                          control={control}
                          options={updatedIcons}
                          isClearable={true}
                          defaultValue="InstagramIcon"
                        />
                      </div>
                      {/* <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-icon")}
                        variant="outline"
                        {...register(`settings.socials.${index}.icon` as const)}
                        defaultValue={item?.icon!} // make sure to set up defaultValue
                      /> */}
                      <Input
                        className="sm:col-span-2"
                        label="URL"
                        variant="outline"
                        {...register(`profile.socials.socials.${index}.link` as const)}
                        defaultValue={item.link!} // make sure to set up defaultValue
                      />
                      <button
                        onClick={() => {
                          remove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <Button
              type="button"
              onClick={() => append({ type: '', link: '' })}
              className="w-full sm:w-auto"
            >
              {t('form:button-label-add-social')}
            </Button>
          </Card>

        </div>)}

      <div className="text-end w-full">
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-save')}
        </Button>
      </div>
    </form>
  );
}
