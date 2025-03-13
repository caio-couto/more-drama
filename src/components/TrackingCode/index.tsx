import Script from "next/script";

export default function TrackingCode() {
  return(
    <>
      <Script src="https://scr.actview.net/empregossdosul.js" strategy="lazyOnload"/>
      <link rel='preload' as='script' href='https://securepubads.g.doubleclick.net/tag/js/gpt.js' />
    </>
  );
}