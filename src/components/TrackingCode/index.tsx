import Head from "next/head";
import Script from "next/script";

export default function TrackingCode() {
  return(
    <>
      <Script async src="https://scr.actview.net/empregossdosul.js"/>
      <link rel="preload" as="script" href="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
    </>
  );
}