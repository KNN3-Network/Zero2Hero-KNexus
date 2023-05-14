import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div className="bgImg"></div>
        <div className="main-content">
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
