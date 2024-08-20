'use client';
import React from 'react';
import SignUpForm from './components/SignUpForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const page = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    router.push('/');
  }
  return (
    <div className="w-full container h-[100vh] flex justify-end items-center ">
      <div className="max-md:hidden"></div>
      <Card className="max-md:w-full w-5/12 px-8 py-5">
        <CardHeader className="font-bold text-2xl text-center pb-3">
          Sign in to Beincom
        </CardHeader>
        <CardDescription className="text-center pb-6">
          The future of community engagement
        </CardDescription>
        <CardContent className="h-[500px]">
          <SignUpForm></SignUpForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
