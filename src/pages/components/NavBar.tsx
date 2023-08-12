import Link from "next/link";
import Image from "next/image";

function Navbar() {
    return (
        // Create a naviagation bar that contains two links: login and signup. On the left side of the nav bar, the logo and title should be pair while the login and signup buttons shold be all the way on the right (flex box)
        <nav className="flex justify-between items-center bg-[#2e026d] p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Image width={50} height={50} src={`/00.png`} alt="stitchedIT" />
                <span className="font-semibold text-xl tracking-tight p-4">stitchedIT</span>
            </div>
            <div className='flex gap-4'>
                <Link href="/login" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-[#2e026d] hover:bg-white mt-4 lg:mt-0">
                    Login
                </Link>
                <Link href="/signup" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-[#2e026d] hover:bg-white mt-4 lg:mt-0">
                    Signup
                </Link>
            </div>
        </nav>

    )
}

export default Navbar;