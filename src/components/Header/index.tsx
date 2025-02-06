"use server"

import LogoSVG from "@public/logo.svg";
import Image from "next/image";

export default async function Header() {
  return (
    <header className="relative h-14">
      <Image className="absolute bottom-0 left-1/2 -translate-x-1/2 mx-auto" src={LogoSVG} alt="logo icon" width={128} height={20} priority={true} quality={100}/>
    </header>
  );
}