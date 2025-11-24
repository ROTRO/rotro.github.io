import { Fragment, useContext, useState } from "react";
import { context } from "../context/context";
import { useLanguage } from "../context/LanguageContext";

const MobileHeader = () => {
  const [toggle, setToggle] = useState(false);
  const navContext = useContext(context);
  const { nav, changeNav } = navContext;
  const { language, setLanguage, t } = useLanguage();

  const activeNav = (value) => (value == nav ? "active" : "");
  const onClick = (value) => {
    setToggle(false);
    changeNav(value);
  };

  return (
    <Fragment>
      <div className="edrea_tm_topbar">
        <div className="topbar_inner">
          <div className="logo">
            <a href="#">
              <img src="img/logo/logo.png" alt="" />
            </a>
          </div>
          <div className="trigger">
            <div
              className={`hamburger hamburger--slider ${
                toggle ? "is-active" : ""
              }`}
            >
              <div className="hamburger-box" onClick={() => setToggle(!toggle)}>
                <div className="hamburger-inner" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`edrea_tm_mobile_menu ${toggle ? "opened" : ""}`}>
        <div className="inner">
          <div className="menu_list">
            <ul className="transition_link">
              <li className={activeNav("home")}>
                <a href="#home" onClick={() => onClick("home")}>
                  {t('home')}
                </a>
              </li>
              <li className={activeNav("about")}>
                <a href="#about" onClick={() => onClick("about")}>
                  {t('about')}
                </a>
              </li>
              <li className={activeNav("portfolio")}>
                <a href="#portfolio" onClick={() => onClick("portfolio")}>
                  {t('portfolio')}
                </a>
              </li>
              {/* <li className={activeNav("news")}>
                <a href="#news" onClick={() => onClick("news")}>
                  {t('news')}
                </a>
              </li> */}
              <li className={activeNav("contact")}>
                <a href="#contact" onClick={() => onClick("contact")}>
                  {t('contact')}
                </a>
              </li>
              <li>
                <div className="language-switcher" style={{ marginTop: '20px', cursor: 'pointer', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <span 
                    onClick={() => setLanguage('en')} 
                    style={{ fontWeight: language === 'en' ? 'bold' : 'normal', color: language === 'en' ? '#000' : '#888' }}
                  >
                    EN
                  </span>
                  <span style={{ color: '#888' }}>|</span>
                  <span 
                    onClick={() => setLanguage('fr')} 
                    style={{ fontWeight: language === 'fr' ? 'bold' : 'normal', color: language === 'fr' ? '#000' : '#888' }}
                  >
                    FR
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default MobileHeader;
