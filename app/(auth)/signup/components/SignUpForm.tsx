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
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { SignUpSchema } from '@/type/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

const SignUpForm = () => {
  const [isView, setIsView] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      confirmpassword: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    try {
      const response = await axios.post('/api/signup', {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmpassword: values.confirmpassword,
      });

      toast({
        title: 'Success ',
        description: 'Registered Successfully',
      });
      form.reset();
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
    <div className="flex flex-col justify-between h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-2" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <div className="mt-10 text-sm">
        Already have an account?{' '}
        <Link className="text-primary" href={'/signin'}>
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
