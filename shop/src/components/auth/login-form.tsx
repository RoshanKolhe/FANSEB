import { signIn } from 'next-auth/react';
import Logo from '@/components/ui/logo';
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/forms/input';
import PasswordInput from '@/components/ui/forms/password-input';
import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { GoogleIcon } from '@/components/icons/google';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { MobileIcon } from '@/components/icons/mobile-icon';
import { Form } from '@/components/ui/forms/form';
import { useLogin } from '@/framework/user';
import type { LoginUserInput } from '@/types';
import { AnonymousIcon } from '@/components/icons/anonymous-icon';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('The provided email address format is not valid')
    .required('You must need to provide your email address'),
  password: yup.string().required('You must need to provide your password'),
});
function LoginForm() {
  const { t } = useTranslation('common');
  const router = useRouter();

  function handleNavigate(path: string) {
    router.push(`/${path}`);
  }
  const isCheckout = router.pathname.includes('checkout');
  const { mutate: login, isLoading, serverError, setServerError } = useLogin();

  function onSubmit({ email, password }: LoginUserInput) {
    login({
      email,
      password,
    });
  }

  return (
    <>
      <Alert
        variant="error"
        message={serverError && t(serverError)}
        className="mb-6"
        closeable={true}
        onClose={() => setServerError(null)}
      />
      <Form<LoginUserInput>
        onSubmit={onSubmit}
        validationSchema={loginFormSchema}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label='Email'
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-5"
              error={t(errors.email?.message!)}
            />
            <PasswordInput
              label='Password'
              {...register('password')}
              error={t(errors.password?.message!)}
              variant="outline"
              className="mb-5"
              forgotPageRouteOnClick={() => handleNavigate('forgot-password')}
            />
            <div className="mt-8">
              <Button
                className="h-11 w-full sm:h-12"
                loading={isLoading}
                disabled={isLoading}
              >
                Login
              </Button>
            </div>
          </>
        )}
      </Form>
      {/* //===============// */}
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 ltr:left-2/4 ltr:-ml-4 rtl:right-2/4 rtl:-mr-4">
          Or
        </span>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-4">
        {/* <Button
          className="!bg-social-google !text-light hover:!bg-social-google-hover"
          disabled={isLoading}
          onClick={() => {
            signIn('google');
          }}
        >
          <GoogleIcon className="h-4 w-4 ltr:mr-3 rtl:ml-3" />
          {t('text-login-google')}
        </Button> */}

        <Button
          className="h-11 w-full !bg-gray-500 !text-light hover:!bg-gray-600 sm:h-12"
          disabled={isLoading}
          onClick={() => handleNavigate('otp-login')}
        >
          <MobileIcon className="h-5 text-light ltr:mr-2 rtl:ml-2" />
          Login with Mobile Number
        </Button>

        {isCheckout && (
          <Button
            className="h-11 w-full !bg-pink-700 !text-light hover:!bg-pink-800 sm:h-12"
            disabled={isLoading}
            onClick={() => router.push(Routes.checkoutGuest)}
          >
            <AnonymousIcon className="h-6 text-light ltr:mr-2 rtl:ml-2" />
            Checkout as guest
          </Button>
        )}
      </div>
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        Don't have any account?{' '}
        <button
          onClick={() => handleNavigate('register')}
          className="font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-none ltr:ml-1 rtl:mr-1"
        >
          Register
        </button>
      </div>
    </>
  );
}

export default function LoginView() {
  
  const { t } = useTranslation('common');
  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-4 mb-8 text-center text-sm text-body sm:mt-5 sm:mb-10 md:text-base">
        Login with your email & password
      </p>
      <LoginForm />
    </div>
  );
}
