import Head from "next/head";
import { NextPage } from "next";
import { api } from "~/utils/api"; 
import { useRouter } from "next/router";
import Navbar from "~/components/NavBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signOut, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form' ;

const Signup: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const createUser = api.user.addUser.useMutation();

  if (session) {
    router.push('/'); // Redirect to home if the user is already authenticated
  }

  const handleFormSubmit = async (formData: any): Promise<void> => {
    if (formData.password !== formData.retypePassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('User information:', formData);

    // continue with the API call here if needed
    createUser.mutate(formData);
  };

  return (
    <>
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="An app to explore new clothes." />
        <link rel="icon" href="/00.png" />
      </Head>
      <main className="min-h-screen flex flex-col justify-center bg-black">
        <Navbar />
        <section className='container mx-auto p-4'>
          <div className='flex flex-col justify-center text-center p-5'>
            <h1 className='text-stitched-pink text-5xl'>Create an Account</h1>
            <div className='pt-5' />
            <p className='text-stitched-sand text-xl'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus, dolores odio natus sequi mollitia neque modi dolore quis dolorum reprehenderit incidunt quo dignissimos nostrum sapiente possimus laborum quasi. Labore, enim.</p>
          </div>

          <div className='pt-10' />

          <Card className='mx-auto border-none'>
            <CardContent className="grid gap-4 text-slate-50">
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button variant="outline" onClick={() => signIn('discord')} className="md:col-span-1">
                    Discord
                  </Button>
                  

                  <Button variant="outline" onClick={() => signIn('google')} className="md:col-span-1">
                    Google
                  </Button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black text-slate-50 px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className='text-stitched-pink'>Email</Label>
                    <Input {...register('email')} className='p-2 roun' id="email" type="email" placeholder="jasonp@gmail.com" />
                  </div>
                  <div>
                    <Label htmlFor="fullName" className='text-stitched-pink'>Full Name</Label>
                    <Input {...register('fullName')} className='p-2 roun' id="fullName" type="text" placeholder="Jason Paulino" />
                  </div>
                  <div>
                    <Label htmlFor="userName" className='text-stitched-pink'>Username</Label>
                    <Input {...register('userName')} className='p-2 roun' id="userName" type="text" placeholder="jasonpaulino" />
                  </div>
                  <div>
                    <Label htmlFor="password" className='text-stitched-pink'>Password</Label>
                    <Input {...register('password')} className='p-2 roun' id="password" type="password" placeholder="Stitched123!"/>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="retype-password" className='text-stitched-pink'>Re-type Password</Label>
                    <Input {...register('retypePassword')} className='p-2 roun' id="retype-password" type="password" placeholder="Stitched123!"/>
                  </div>
                </div>
                <CardFooter>
                  <Button type="submit" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-[#2e026d] hover:bg-white">Create account</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default Signup;
