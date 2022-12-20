import { Attachment } from '@/types';

export function displayImage(
  selectedVariationImage: Attachment | undefined,
  gallery: Attachment[] | undefined | null,
  image: Attachment | undefined
) {
  if (selectedVariationImage) {
    return [selectedVariationImage];
  }
  if (gallery?.length) {
    console.log('gallery',gallery);
    return gallery;
  }
  if (image) {
    return [image];
  }
  return [];
}
