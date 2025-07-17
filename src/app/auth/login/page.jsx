'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginPage() {
  const [providers, setProviders] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  return (
     <div className="flex flex-col items-center justify-center">
      <div className="">


        {providers?.google && (
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className=" px-4 py-2 bg-white rounded-sm cursor-pointer hover:bg-gray-200 flex text-black gap-4 items-center justify-between"
          >
            <FcGoogle size={24}/>
            Continue with Google
          </button>
        )}
      </div>

      <p className="mt-8 text-sm text-slate-400 text-center max-w-xs z-10">
        🔐 We respect your privacy. Your data is secure and used only for authentication.
      </p>
    </div>
  );
}
