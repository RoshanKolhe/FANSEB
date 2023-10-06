import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import {
  useCheckStatus,
  useCreateOrder,
  useInitiatePayment,
  useOrderStatuses,
} from '@/framework/order';
import ValidationError from '@/components/ui/validation-error';
import Button from '@/components/ui/button';
import { formatOrderedProduct } from '@/lib/format-ordered-product';
import { useCart } from '@/store/quick-cart/cart.context';
import { checkoutAtom, discountAtom, walletAtom } from '@/store/checkout';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/store/quick-cart/cart.utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export const PlaceOrderAction: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading: isLoadingOrder } = useCreateOrder();
  const { initiatePayment, isLoading, initiatedPaymentData } =
    useInitiatePayment();
  const {
    checkStatus,
    isLoading: paymentStatusLoading,
    checkStatusPaymentData,
  } = useCheckStatus();
  console.log(initiatedPaymentData);
  const { locale }: any = useRouter();
  const [isPayemntInitiated, setIsPayemntInitiated] = useState(false);
  const [isPayemntCompleted, setIsPayemntCompleted] = useState(false);
  const { items } = useCart();
  const { orderStatuses } = useOrderStatuses({
    limit: 1,
    language: locale,
  });

  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      coupon,
      verified_response,
      customer_contact,
      payment_gateway,
      token,
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);
  const [use_wallet_points] = useAtom(walletAtom);

  useEffect(() => {
    if (initiatedPaymentData) {
      setIsPayemntInitiated(true);
      window.open(
        initiatedPaymentData?.data?.instrumentResponse?.redirectInfo?.url,
        '_blank'
      );
    }
  }, [initiatedPaymentData]);

  useEffect(() => {
    let intervalId: any;

    const checkStatusWithInterval = () => {
      const inputData = {
        transactionId: initiatedPaymentData.data.merchantTransactionId,
      };
      checkStatus(inputData);

      if (checkStatusPaymentData && checkStatusPaymentData.success) {
        clearInterval(intervalId); // Stop the interval if success is true
        handlePlaceOrder(true);
      }
    };

    if (
      isPayemntInitiated &&
      initiatedPaymentData &&
      initiatedPaymentData.success
    ) {
      console.log('here', initiatedPaymentData);
      intervalId = setInterval(checkStatusWithInterval, 2000); // Call checkStatusWithInterval every 2 seconds
    }

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts or when isPaymentInitiated changes
    };
  }, [isPayemntInitiated, checkStatusPaymentData]);

  useEffect(() => {
    setErrorMessage(null);
  }, [payment_gateway]);

  const available_items = items?.filter(
    (item) => !verified_response?.unavailable_products?.includes(item.id)
  );

  const subtotal = calculateTotal(available_items);
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: verified_response?.total_tax!,
      shipping_charge: verified_response?.shipping_charge!,
    },
    Number(discount)
  );

  function generateRandomString(length: number) {
    return Math.random().toString(36).substr(2, length);
  }

  const handlePlaceOrder = (isPaymentDone: boolean, transactionId?: string) => {
    if (!customer_contact) {
      setErrorMessage('Contact Number Is Required');
      return;
    }
    if (!use_wallet_points && !payment_gateway) {
      setErrorMessage('Gateway Is Required');
      return;
    }
    // if (!use_wallet_points && payment_gateway === 'PHONEPE' ) {
    //   setErrorMessage('Please Pay First');
    //   return;
    // }
    let input: any = {
      //@ts-ignore
      products: available_items?.map((item) => formatOrderedProduct(item)),
      tracking_number: generateRandomString(12),
      influencer_id: available_items[0].influencer_id,
      status: orderStatuses[0]?.id ?? '1',
      amount: subtotal,
      coupon_id: Number(coupon?.id),
      discount: discount ?? 0,
      paid_total: total,
      sales_tax: verified_response?.total_tax,
      delivery_fee: verified_response?.shipping_charge,
      total,
      delivery_time: delivery_time?.title,
      customer_contact,
      payment_gateway,
      use_wallet_points,
      billing_address: {
        ...(billing_address?.address && billing_address.address),
      },
      shipping_address: {
        ...(shipping_address?.address && shipping_address.address),
      },
    };
    delete input.billing_address.__typename;
    delete input.shipping_address.__typename;

    if (transactionId) {
      input.payment_id = transactionId;
    }

    console.log('orderInput', input);
    if (isPaymentDone) {
      createOrder(input);
    } else {
      initiatePayment(input);
    }
    //@ts-ignore
  };
  const isDigitalCheckout = available_items.find((item) =>
    Boolean(item.is_digital)
  );

  const formatRequiredFields = isDigitalCheckout
    ? [customer_contact, payment_gateway, available_items]
    : [
        customer_contact,
        payment_gateway,
        billing_address,
        shipping_address,
        delivery_time,
        available_items,
      ];
  const isAllRequiredFieldSelected = formatRequiredFields.every(
    (item) => !isEmpty(item)
  );
  return (
    <>
      <Button
        loading={isLoadingOrder || isLoading}
        className={classNames('mt-5 w-full', props.className)}
        onClick={() => {
          handlePlaceOrder(false);
        }}
        disabled={!isAllRequiredFieldSelected}
        {...props}
      />
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
      {!isAllRequiredFieldSelected && (
        <div className="mt-3">
          <ValidationError message={t('text-place-order-helper-text')} />
        </div>
      )}
    </>
  );
};
