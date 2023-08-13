import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EnvelopeOpenIcon } from "@radix-ui/react-icons"

function Navbar() {
    const staticStyles = "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-[#2e026d] hover:bg-white mt-4 lg:mt-0";
    return (
        // Create a naviagation bar that contains two links: login and signup. On the left side of the nav bar, the logo and title should be pair while the login and signup buttons shold be all the way on the right (flex box)
        <nav className="flex justify-between items-center bg-[#2e026d] p-6 top-0 sticky">
            <Avatar className="flex items-center text-white mr-6">
                <AvatarImage className='w-[60px]' src="/00.png" alt="stitchedIT logo" />
                <span className="font-semibold text-xl tracking-tight p-4">stitchedIT</span>
                <AvatarFallback>stitchedIT logo</AvatarFallback>
            </Avatar>
            <div className='flex gap-4'>

            <Link href='/login' className={`${staticStyles} ${buttonVariants({ variant: "outline" })}`}>Login</Link>
            <Link href='/signup' className={`${staticStyles} ${buttonVariants({ variant: "outline" })}`}>Signup</Link>
            </div>
        </nav>

    )
}

export default Navbar;