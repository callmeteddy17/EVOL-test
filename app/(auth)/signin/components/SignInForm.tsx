'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { SignInSchema } from '@/type/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignInForm = () => {
  const router = useRouter();

  const [isView, setIsView] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
      });

      toast({
        title: 'Success',
        description: 'User SignIn Successfully',
      });
      router.push('/');
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Something Wrong',
        description: 'Registered Failed',
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Button
        onClick={() => signIn('google')}
        variant={'outline'}
        className="w-full p-5"
        type="button">
        <Image src={'/google.png'} height={30} width={30} alt="google"></Image>{' '}
        Sign in with Google
      </Button>
      <div className="flex w-full items-center my-6">
        <div
          role="none"
          className="bg-gray-500 shrink-0 h-px w-full my-2 m-0 flex-1"></div>
        <div className="mx-3 text-xs font-normal text-neutral-40">or</div>
        <div
          role="none"
          className="bg-gray-500 shrink-0 h-px w-full my-2 m-0 flex-1"></div>
      </div>
      <Form {...form}>
        <div className="flex flex-col justify-between h-full">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        className="pr-10"
                        type={isView ? 'text' : 'password'}
                        {...field}
                      />
                      {isView ? (
                        <EyeOpenIcon
                          className="absolute right-4 top-3 z-10 cursor-pointer "
                          onClick={() => {
                            setIsView(!isView);
                          }}
                        />
                      ) : (
                        <EyeClosedIcon
                          className="absolute right-4 top-3 z-10 cursor-pointer "
                          onClick={() => setIsView(!isView)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full mt-2" type="submit">
              Submit
            </Button>
          </form>
          <div className="mt-10 text-sm">
            Don’t have an account?{' '}
            <Link className="text-primary" href={'/signup'}>
              Sign up
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SignInForm;
