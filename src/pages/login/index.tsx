import Head from "next/head";
import { type NextPage } from "next";

const Login: NextPage = () => {
    return (
        <>
            <Head>
                <title>Login Page</title>
                <meta name="description" content="An app to explore new clothes." />
                <link rel="icon" href="/00.png" />
            </Head>
            <h1>This is the Login page</h1>
        </>
    )
}

export default Login;