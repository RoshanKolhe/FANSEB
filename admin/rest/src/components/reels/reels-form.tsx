import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import { getErrorMessage } from '@/utils/form-error';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { reelsValidationSchema } from './reels-validation-schema';
import { useShopQuery } from '@/data/shop';
import { useCreateReelsMutation, useUpdateReelsMutation } from '@/data/reels';
import FileInput from '../ui/file-input';
import { useEffect, useRef, useState } from 'react';

type FormValues = {
  // reel_link: string;
  name: string;
  video: any;
  thumbnail: any;
};

// const defaultValues = {
//   image: "",
//   amount: 0,
//   active_from: new Date(),
//   expire_at: new Date(),
// };

type IProps = {
  initialValues?: any | null;
};
export default function CreateOrUpdateReelsForm({ initialValues }: IProps) {
  const videoEl = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();
  const {
    query: { shop },
  } = router;
  const isNewTranslation = router?.query?.action === 'translate';
  const [fileError, setFileError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(reelsValidationSchema),
    ...(Boolean(initialValues) && {
      defaultValues: {
        ...initialValues,
        video: initialValues.reel_link,
        thumbnail: initialValues?.thumbnail,
      } as any,
    }),
  });
  const watchVideo = watch('video', false);
  const watchThumbnail = watch('thumbnail', false);
  const { mutate: createReels, isLoading: creating } = useCreateReelsMutation();
  const { mutate: updateReels, isLoading: updating } = useUpdateReelsMutation();

  const onSubmit = async (values: FormValues) => {
    const { name, video, thumbnail } = values;
    if (video.length == 0) {
      setFileError('Video File is required');
      return;
    }
    if (
      !thumbnail &&
      !thumbnail.length &&
      Object.keys(thumbnail).length === 0
    ) {
      setThumbnailError('Thumbnail is required');
      return;
    }

    const input = {
      language: router.locale,
      reel_link: video,
      name,
      thumbnail: thumbnail,
      videoDuration: videoDuration || '00:00',
    };
    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        createReels({
          ...input,
          ...(initialValues?.slug && { slug: initialValues.slug }),
        });
      } else {
        updateReels({
          ...input,
          id: initialValues.id!,
        });
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
  const handleLoadedMetadata = () => {
    const video: any = videoEl.current;
    if (!video) return;
    setVideoDuration(`${video?.duration}`);
  };
  useEffect(() => {
    if (watchThumbnail || Object.keys(watchThumbnail)) {
      setThumbnailError('');
    }
  }, [watchThumbnail]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`Add Reel Embed URL from here.`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Name*"
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          {/* <Input
            label="Reel URL*"
            {...register('reel_link')}
            error={t(errors.reel_link?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title="video"
          details="Upload your video here"
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="video"
            control={control}
            multiple={false}
            acceptFile={true}
            helperText={fileError ? fileError : 'Please upload a video file'}
          />
          <span>{errors.video?.message}</span>
          {watchVideo.length || Object.keys(watchVideo).length ? (
            <video
              autoPlay
              controls
              width="200px"
              height="200px"
              ref={videoEl}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src={watchVideo?.original} type="video/mp4" />
              Sorry, your browser doesn't support videos.
            </video>
          ) : null}
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title="thumbnail image"
          details="Upload your thumbnail image here"
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="thumbnail" control={control} multiple={false} />
          <span style={{ color: 'red', marginTop: '10px' }}>
            {thumbnailError ? thumbnailError : null}
          </span>
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
          {initialValues ? 'Update Reel' : 'Add Reel'}
        </Button>
      </div>
    </form>
  );
}
