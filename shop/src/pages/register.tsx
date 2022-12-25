import { useTranslation } from 'next-i18next';
import RegisterView from '@/components/auth/register-form';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@/store/authorization-atom';
import { useRouter } from 'next/router';

export default function RegisterPage() {
    const [isAuthorize] = useAtom(authorizationAtom);
    const router = useRouter();

    if (isAuthorize) {
        router.push('/orders');
    }
    return (
        <div
            className="flex h-screen items-center justify-center bg-light sm:bg-gray-100"
        >
            <div className="m-auto w-full max-w-[420px] rounded bg-light p-5 sm:p-8 sm:shadow">
                <div className="mb-2 flex justify-center">
                    <RegisterView />
                </div>
            </div>
        </div>
    );
}

