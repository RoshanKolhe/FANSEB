import { Form } from '@/components/ui/form/form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import Input from '@/components/ui/input';
import { useTranslation } from 'next-i18next';
import { useAddInfluencerCommisionMutation, useAddWalletPointsMutation } from '@/data/user';
import * as Yup from 'yup';

type FormValues = {
  commision: number;
};
const addCommisionValidationSchema = Yup.object().shape({
  commision: Yup.number()
    .typeError('Commision must be a number')
    .positive('Commision must be positive')
    .required('You must need to set commision'),
});
const UserInfluencerCommisionAddView = () => {
  const { t } = useTranslation();
  const { mutate: addInfluencerCommision, isLoading: loading } =
  useAddInfluencerCommisionMutation();

  const { data: customerId } = useModalState();
  const { closeModal } = useModalAction();

  function onSubmit({ commision }: FormValues) {
    addInfluencerCommision({
      customer_id: customerId as string,
      commision: commision,
    });
    closeModal();
  }

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      validationSchema={addCommisionValidationSchema}
    >
      {({ register, formState: { errors } }) => (
        <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
          <Input
            label='Influencer Commision rate'
            {...register('commision')}
            // defaultValue="10"
            variant="outline"
            className="mb-4"
            error={t(errors.commision?.message!)}
          />
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="ms-auto"
          >
            {t('form:button-label-submit')}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default UserInfluencerCommisionAddView;
