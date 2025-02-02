"use server"

import LogoSVG from "@public/logo.svg";
import Image from "next/image";

export default async function Header() {
  return (
    <header>
      <Image className="mx-auto" src={LogoSVG} alt="logo icon" width={128} height={20} priority={true} quality={100}/>
    </header>
  );
}