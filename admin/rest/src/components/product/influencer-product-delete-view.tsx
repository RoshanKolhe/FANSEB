import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteInfluencerProductMutation } from '@/data/influencerProduct';
import { getErrorMessage } from '@/utils/form-error';

const InfluencerProductDeleteView = () => {
  const { mutate: deleteProduct, isLoading: loading } =
  useDeleteInfluencerProductMutation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    try {
      deleteProduct({ id: data });
      closeModal();
    } catch (error) {
      closeModal();
      getErrorMessage(error);
    }
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default InfluencerProductDeleteView;
