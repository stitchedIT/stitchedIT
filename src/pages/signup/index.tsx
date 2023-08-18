import React, { useState } from "react";
import Head from "next/head";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Navbar from "~/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

const Signup: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState<string | null>(null);

  const createUser = api.user.addUser.useMutation();

  if (session) {
    router.push("/"); // Redirect to home if the user is already authenticated
  }

  const handleFormSubmit = async (formData: any): Promise<void> => {
    setError(null); // Reset any previous error

    if (formData.password !== formData.retypePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Add additional validation logic here if needed.

      // Continue with the API call here
      await createUser.mutateAsync(formData);
      alert("User created successfully");
      // Optionally redirect to the login page or some other page after a successful sign-up
    } catch (e) {
      console.error("Failed to create user:", e);
      setError("Failed to create user, please try again");
    }
  };

  return (
    <>
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="An app to explore new clothes." />
        <link rel="icon" href="/00.png" />
      </Head>
      <main className="flex min-h-screen flex-col justify-center bg-black">
        <Navbar />
        <section className="container mx-auto p-4">
          <div className="flex flex-col justify-center p-5 text-center">
            <h1 className="text-5xl text-stitched-pink">Create an Account</h1>
            <div className="pt-5" />
            <p className="text-xl text-stitched-sand">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Accusamus, dolores odio natus sequi mollitia neque modi dolore
              quis dolorum reprehenderit incidunt quo dignissimos nostrum
              sapiente possimus laborum quasi. Labore, enim.
            </p>
          </div>

          <div className="pt-10" />

          <Card className="mx-auto border-none">
            <CardContent className="grid gap-4 text-slate-50">
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => signIn("discord")}
                    className="md:col-span-1"
                  >
                    Discord
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => signIn("google")}
                    className="md:col-span-1"
                  >
                    Google
                  </Button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-muted-foreground text-slate-50">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email" className="text-stitched-pink">
                        Email
                      </Label>
                      <Input
                        {...register("email")}
                        className="roun p-2"
                        id="email"
                        type="email"
                        placeholder="jasonp@gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fullName" className="text-stitched-pink">
                        Full Name
                      </Label>
                      <Input
                        {...register("fullName")}
                        className="roun p-2"
                        id="fullName"
                        type="text"
                        placeholder="Jason Paulino"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userName" className="text-stitched-pink">
                        Username
                      </Label>
                      <Input
                        {...register("userName")}
                        className="roun p-2"
                        id="userName"
                        type="text"
                        placeholder="jasonpaulino"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-stitched-pink">
                        Password
                      </Label>
                      <Input
                        {...register("password")}
                        className="roun p-2"
                        id="password"
                        type="password"
                        placeholder="Stitched123!"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label
                        htmlFor="retype-password"
                        className="text-stitched-pink"
                      >
                        Re-type Password
                      </Label>
                      <Input
                        {...register("retypePassword")}
                        className="roun p-2"
                        id="retype-password"
                        type="password"
                        placeholder="Stitched123!"
                      />
                    </div>
                  </div>
                </div>
                <CardFooter>
                  <Button
                    type="submit"
                    className="inline-block rounded border border-white px-4 py-2 text-sm leading-none text-white hover:border-transparent hover:bg-white hover:text-[#2e026d]"
                  >
                    Create account
                  </Button>
                </CardFooter>
              </form>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default Signup;
