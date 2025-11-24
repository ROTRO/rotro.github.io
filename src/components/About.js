import { Fragment, useState } from "react";
import AnimatedText from "./AnimatedText";
import AboutPopup from "./popup/AboutPopup";
import { useLanguage } from "../context/LanguageContext";

const aboutData = {
  firstName: "Bilel",
  lastName: "Hedhli",
  bithday: "1998",
  address: "Tunis, Tunisia",
  phn: "+216 51 531 353",
  email: "bilelhedhli@gmail.com",
  serviceLists: [
    "Cloud Solutions",
    "Full-Stack Development",
    "Backend Systems",
    "CI/CD Pipelines",
    "Microservices Architecture",
  ],
  skills: {
    programming: [
      { name: "Angular", value: "95" },
      { name: "React/Next.js", value: "90" },
      { name: "Node.js", value: "90" },
      { name: "AWS/Cloud", value: "85" },
      { name: "Ionic", value: "80" },
      { name: "MongoDB/SQL", value: "85" },
    ],
    language: [
      { name: "English", value: "95" },
      { name: "French", value: "80" },
      { name: "Arabic", value: "100" },
    ],
  },
  education: [
    { year: "2020 - 2022", unv: "I.S.E.T Rades", degree: "MSc in Computer Software & Media Applications" },
    { year: "2017 - 2020", unv: "I.S.E.T Bizerte", degree: "BSc in Computer Software Engineering" },
  ],
  working: [
    { year: "2024 - Present", company: "Aquadeep", deg: "Technical Lead" },
    { year: "2023 - 2024", company: "eSteps Health", deg: "Software Engineering Lead" },
    { year: "2022 - 2023", company: "NOVASOLVD", deg: "IT Project Manager" },
    { year: "2020 - 2021", company: "DnD Services", deg: "Full-Stack Developer" },
  ],
  certifications: [
    "POESAM 2023 First Prize – Innovative Connected Health Solution",
    "AWS (in progress)",
    "Cybersecurity Foundations",
    "Java Programming"
  ],
  partnersLogos: [
    "img/partners/1.png",
    "img/partners/2.png",
    "img/partners/3.png",
    "img/partners/4.png",
  ],
};

const About = () => {
  const [popup, setPopup] = useState(false);
  const { t } = useLanguage();

  return (
    <Fragment>
      <AboutPopup
        open={popup}
        close={() => setPopup(false)}
        aboutData={aboutData}
      />
      <div className="edrea_tm_section hidden animated" id="about">
        <div className="section_inner">
          <div className="edrea_tm_about">
            <div className="left">
              <div className="image">
                <img src="img/thumbs/1-1.jpg" alt="" />
                <div className="main" data-img-url="img/about/1.jpg" />
              </div>
            </div>
            <div className="right">
              <div className="short">
                <h3 className="name">
                  {aboutData.firstName}{" "}
                  <span className="coloring">{aboutData.lastName}</span>
                </h3>
                <h3 className="job">
                  <AnimatedText />
                </h3>
              </div>
              <div className="text">
                <p>
                  {t('bio_desc')}
                </p>
              </div>
              <div className="edrea_tm_button">
                <a href="#" onClick={() => setPopup(true)}>
                  {t('learn_more')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default About;
