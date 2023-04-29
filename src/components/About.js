import { Fragment, useState } from "react";
import AnimatedText from "./AnimatedText";
import AboutPopup from "./popup/AboutPopup";

const aboutData = {
  firstName: "Bilel",
  lastName: "Hedhli ",
  bithday: "1998",
  address: "",
  phn: "+216 51 531 353",
  email: "bilelhedhli@gmail.com",
  serviceLists: [
    "Website Development",
    "Digital Experience",
    "Content Marketing",
    "Social Media Design",
    "Shared Web Hosting",
  ],
  skills: {
    programming: [
      { name: "NextJs", value: "60" },
      { name: "React", value: "56" },
      { name: "Ionic", value: "80" },
      { name: "JavaScript", value: "80" },
      { name: "Angular", value: "90" },
    ],
    language: [
      { name: "English", value: "95" },
      { name: "French", value: "80" },
      { name: "Arabic", value: "100" },
    ],
  },
  education: [
    { year: "2020 - 2022", unv: "I.S.E.T Rades", degree: "Master Degree in Mobile App Developpment" },
    { year: "2017 - 2020", unv: "I.S.E.T Bizerte", degree: "Bachelor Degree in Information Systems Developpment" },
    { year: "2013 - 2017", unv: "Menzel Bourguiba HS", degree: "Associate Degree in Computer Science" },
  ],
  working: [
    { year: "Feb 2021 - Feb 2023", company: "NovaSolvd", deg: "IT Manager" },
    { year: "Feb 2020 - Dec 2021", company: "DndServ", deg: "Full-stack dev" },
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
                  My name is <span>Bilel Hedhli.</span> I am a graphic designer,
                  and {`I'm`} very passionate and dedicated to my work. With 20
                  years experience as a professional a graphic designer, I have
                  acquired the skills and knowledge.
                </p>
              </div>
              <div className="edrea_tm_button">
                <a href="#" onClick={() => setPopup(true)}>
                  Learn More
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
