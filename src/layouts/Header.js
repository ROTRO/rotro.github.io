import { useContext } from "react";
import { context } from "../context/context";
import { useLanguage } from "../context/LanguageContext";

const Header = () => {
  const navContext = useContext(context);
  const { nav, changeNav } = navContext;
  const { language, setLanguage, t } = useLanguage();

  const activeNav = (value) => (value == nav ? "active" : "");

  return (
    <div className="edrea_tm_header">
      <div className="header_inner">
        <div className="logo">
          <a href="#" onClick={() => changeNav("home")}>
            <img src="img/logo/logo.png" alt="" />
          </a>
        </div>
        <div className="menu">
          <ul className="transition_link">
            <li className={activeNav("home")}>
              <a href="#home" onClick={() => changeNav("home")}>
                {t('home')}
              </a>
            </li>
            <li className={activeNav("about")}>
              <a href="#about" onClick={() => changeNav("about")}>
                {t('about')}
              </a>
            </li>
            <li className={activeNav("portfolio")}>
              <a href="#portfolio" onClick={() => changeNav("portfolio")}>
                {t('portfolio')}
              </a>
            </li>
            {/* <li className={activeNav("news")}>
              <a href="#news" onClick={() => changeNav("news")}>
                {t('news')}
              </a>
            </li> */}
            <li className={activeNav("contact")}>
              <a href="#contact" onClick={() => changeNav("contact")}>
                {t('contact')}
              </a>
            </li>
            <li>
              <div className="language-switcher" style={{ marginLeft: '20px', cursor: 'pointer', display: 'flex', gap: '10px' }}>
                <span 
                  onClick={() => setLanguage('en')} 
                  style={{ fontWeight: language === 'en' ? 'bold' : 'normal', color: language === 'en' ? '#fff' : '#888' }}
                >
                  EN
                </span>
                <span style={{ color: '#888' }}>|</span>
                <span 
                  onClick={() => setLanguage('fr')} 
                  style={{ fontWeight: language === 'fr' ? 'bold' : 'normal', color: language === 'fr' ? '#fff' : '#888' }}
                >
                  FR
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Header;
