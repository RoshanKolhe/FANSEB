import type { GetStaticProps } from 'next';
import { Image } from '@/components/ui/image';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import noResult from '@/assets/no-result.svg';
import LoginView from '@/components/auth/login-form';
import ForgotUserPassword from '@/components/auth/forgot-password';

export default function ForgotPasswordPage() {
    const { t } = useTranslation('common');

    return (
        <div
            className="flex h-screen items-center justify-center bg-light sm:bg-gray-100"
        // dir={dir}
        >
            <div className="m-auto w-full max-w-[420px] rounded bg-light p-5 sm:p-8 sm:shadow">
                <div className="mb-2 flex justify-center">
                    <ForgotUserPassword />
                </div>
            </div>
        </div>
    );
}

