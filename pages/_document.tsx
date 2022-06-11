//Import necessário para gerar um Head de forma mais abstraida no App
import Document, { Html, Head, Main, NextScript } from 'next/document'

//Todas as importações de Head deve ser colocada aqui dentro
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="favicon.png" type="image/png"/>

          <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}