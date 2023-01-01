import type { AppProps } from "next/app";

import "@aws-amplify/ui-react/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
