import { useContext, useState } from "react";
import { context } from "../context/context";
import AnimatedText from "./AnimatedText";
import AboutPopup from "./popup/AboutPopup";
import { useLanguage } from "../context/LanguageContext";

const homeData = {
  firstName: "Bilel",
  lastName: "Hedhli",
  skills: ["Technical Lead", "Full-Stack Engineer", "Cloud Solutions"],
};

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

const Home = ({ activeWithBtn }) => {
  const navContext = useContext(context);
  const { changeNav } = navContext;
  const [popup, setPopup] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="edrea_tm_section animated" id="home">
      <AboutPopup
        open={popup}
        close={() => setPopup(false)}
        aboutData={aboutData}
      />
      <div className="section_inner">
        <div className="edrea_tm_home">
          <h3 className="name">
            {homeData.firstName}{" "}
            <span className="coloring">{homeData.lastName}</span>
          </h3>
          <h3 className="job">
            <AnimatedText />
          </h3>
          <div className="edrea_tm_button transition_link">
            <a href="#" onClick={() => setPopup(true)}>
              {t('about_me')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
