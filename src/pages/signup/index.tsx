import Head from "next/head";
import { NextPage } from "next";
import Navbar from "~/components/NavBar";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react";

const Signup: NextPage = () => {
    return (
        <>
            <Head>
                <title>Signup Page</title>
                <meta name="description" content="An app to explore new clothes." />
                <link rel="icon" href="/00.png" />
            </Head>
            <main className="min-h-screen justify-center bg-black">
                <Navbar />
                <section className='container'>
                    <div className='flex flex-col justify-center text-center p-5'>
                        <h1 className='text-stitched-pink text-5xl'>Create an Account</h1>
                        <div className='pt-5' />
                        <p className='text-stitched-sand text-xl'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus, dolores odio natus sequi mollitia neque modi dolore quis dolorum reprehenderit incidunt quo dignissimos nostrum sapiente possimus laborum quasi. Labore, enim.</p>
                    </div>

                    <div className='pt-10' />

                    <Card className='container border-none'>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl text-slate-50">Signup</CardTitle>
                            <CardDescription className='text-md'>
                            Enter your email below to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 text-slate-50">
                            <div className="grid grid-cols-2 gap-6">
                                <Button variant="outline">
                                    {/* <Icons.gitHub className="mr-2 h-4 w-4" /> */}
                                    Discord
                                </Button>
                                <Button variant="outline">
                                    {/* <Icons.google className="mr-2 h-4 w-4" /> */}
                                    Google
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black text-slate-50 px-2 text-muted-foreground">
                                    Or continue with
                                    </span>
                                </div>
                            </div>

        
                            <div className="grid gap-2">
                                <Label htmlFor="email" className='text-stitched-pink'>Email</Label>
                                <Input className='p-2 roun' id="email" type="email" placeholder="jasonp@gmail.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fullName" className='text-stitched-pink'>Full Name</Label>
                                <Input className='p-2 roun' id="fullName" type="text" placeholder="Jason Paulino" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username" className='text-stitched-pink'>Full Name</Label>
                                <Input className='p-2 roun' id="username" type="text" placeholder="jasonpaulino" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className='text-stitched-pink'>Password</Label>
                                <Input className='p-2 roun' id="password" type="password" placeholder="Stitched123!"/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className='text-stitched-pink'>Re-type Passoword</Label>
                                <Input className='p-2 roun' id="password" type="password" placeholder="Stitched123!"/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Create account</Button>
                        </CardFooter>
                    </Card>
                </section>
            </main>
        </>
    )
}

export default Signup;