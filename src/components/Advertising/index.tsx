import AdvertisingWEBP from "@public/advertising.webp";
import Image from "next/image";

export default function Advertising() {
  return (
    <div className="py-8 px-2">
      <div className="uppercase text-center text-xs mb-2">Advertising</div>
      <Image className="mx-auto" src={AdvertisingWEBP} alt="advertising image" width={358} height={356}/>
    </div>
  );
}