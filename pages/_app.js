import '../styles/globals.css'
import { LanguageProvider } from '../src/context/LanguageContext';

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}

export default MyApp
