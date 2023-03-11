import { useContext,useState } from "react";
import { context } from "../context/context";
import AnimatedText from "./AnimatedText";
import AboutPopup from "./popup/AboutPopup";
const homeData = {
  firstName: "Bilel",
  lastName: "Hedhli",
  skills: ["DevOps", "Developer", "Auditor"],
};
const aboutData = {
  firstName: "Bilel",
  lastName: "Hedhli ",
  address: "Avon str. 22, NYC, USA",
  phn: "+216 51 531 353",
  email: "bilelhedhli@gmail.com",
  serviceLists: [
    "Website Development",
    "Mobile Development",
    "AWS cloud hosting",
    "Social Media Design",
    "Shared Web Hosting",
  ],
  skills: {
    programming: [
      { name: "NextJs", value: "" },
      { name: "JavaScript", value: "" },
      { name: "Angular", value: "" },
      { name: "NodeJs", value: "" },
      { name: "SQL", value: "" },
      { name: "MongoDb", value: "" },
      { name: "EC2", value: "" },
      { name: "Java", value: "" },
      { name: "C", value: "" },
    ],
    language: [
      { name: "English", value: "80" },
      { name: "French", value: "70" },
      { name: "Arabic", value: "90" },
    ],
  },
  education: [
    { year: "2020 - 2022", unv: "I.S.E.T Rades", degree: "Master Degree" },
    { year: "2017 - 2020", unv: "I.S.E.T Bizerte", degree: "Bachelor Degree" },
    { year: "2013 - 2017", unv: "Menzel Bourguiba College", degree: "Associate Degree" },
  ],
  working: [
    { year: "2018 - running",company: "Envato Elements",deg: "Exclusive Author",},
    { year: "2015 - 2018", company: "Avo Corporation", deg: "Content Manager" },
    { year: "2012 - 2015", company: "FC Barcelona", deg: "Football Player" },
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
              About me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
