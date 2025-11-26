import '../styles/globals.css'
import '../src/styles/portfolio-modern.css';
import { LanguageProvider } from '../src/context/LanguageContext';

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}

export default MyApp
