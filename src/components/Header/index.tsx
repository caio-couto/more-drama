import LogoPNG from "@public/logo.png";
import MenuDotsSVG from "@public/dots.svg";
import EpisodesListSVG from "@public/episodes-list.svg";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
  <header className={`relative w-full h-14 z-10 py-3 px-4`}>
    <Link className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" href={"/"}>
      <Image className="" src={LogoPNG} alt="logo icon" width={128} height={20} priority={true} quality={100}/>
    </Link>
  </header>
  );
}