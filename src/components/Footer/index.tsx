"use server"

import Link from "next/link";

export default async function Footer() {
  return (
    <>
      <div className="bg-background-secondary">
        <ul className="flex justify-between py-5 px-4 text-xs">
          <li>
            <Link href={"/"}>Contato</Link>
          </li>
          <div className="w-px h-3 bg-foreground"></div>
          <li>
            <Link href={"/"}>Política de Privacidade</Link>
          </li>
          <div className="w-px h-3 bg-foreground"></div>
          <li>
            <Link href={"/"}>Termos de Uso</Link>
          </li>
          <div className="w-px h-3 bg-foreground"></div>
          <li>
            <Link href={"/"}>Sobre Nós</Link>
          </li>
        </ul>
      </div>
      <div className="bg-primary py-5 px-4 text-xs text-center">
        © 2025 moremanaus is a registered trademark, maintained, and 
        owned by CNPJ: 23.558.894/0006-61 NETGROWTH - Internet 
        Portals and Providers Services LTD.
      </div>
    </>
  );
}