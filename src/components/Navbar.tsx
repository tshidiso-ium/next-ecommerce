import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
import NavIcons from "./NavIcons";

// const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  return (
    <div className="h-20 w-full px-4 md:px-8 lg:px-8 xl:px-8 2xl:px-8  relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">SNEAKER HEAD</div>
        </Link>
        <Menu />
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-2xl tracking-wide">SNEAKER HEAD</div>
          </Link>
          <div className="hidden xl:flex gap-10">
            <Link href="/" className="hover:text-lama">Homepage</Link>
            <Link href="/" className="hover:text-lama">Shop</Link>
            <Link href="/" className="hover:text-lama">Deals</Link>
            <Link href="/" className="hover:text-lama">About</Link>
            <Link href="/" className="hover:text-lama">Contact</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-12">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
