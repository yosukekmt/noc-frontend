import Head from "next/head";

export default function HtmlHead() {
  return (
    <Head>
      <title>Nudge ONCHAIN</title>
      <meta
        name="description"
        content="Blockchain native implementation of user engagement platform."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/png" href="/favicon.png" />
    </Head>
  );
}
