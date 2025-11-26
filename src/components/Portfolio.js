import { Fragment, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioModal from "./popup/PortfolioModal";
import ProjectCard from "./portfolio/ProjectCard";
import ProjectFilter from "./portfolio/ProjectFilter";
import { useLanguage } from "../context/LanguageContext";

const allProjects = [
  {
    id: 1,
    title: "Aquadeep",
    subtitle: "Cloud Solutions & DevOps",
    category: "Cloud",
    tags: ["AWS", "Node.js", "Cloud", "Database"],
    description1: "Architected and deployed AWS-based microservices for a scalable water monitoring solution. Introduced observability and runbooks to improve reliability.",
    description2: "Established CI/CD pipelines reducing deployment time by 30%. Led a cross-functional squad, enforcing standards and accelerating delivery.",
    img: "img/portfolio/aqua.png", 
    img2: "img/portfolio/aqua.png", 
  carousel_pictures:[],
    date: "2025",
  },
  {
    id: 2,
    title: "eSteps Health",
    subtitle: "Health-Tech SaaS",
    category: "Mobile",
    tags: ["Angular", "Node.js", "AWS", "MongoDB","Mobile"],
    description1: "Built a real-time healthcare SaaS platform for patient monitoring using Node.js and Angular. Optimized MongoDB queries cutting latency by 15%.",
    description2: "Managed tech workflow and boosted productivity by 25%. Won POESAM 2023 First Prize for this innovative healthtech solution.",
    img: "img/portfolio/esteps/1.PNG",
    img2: "img/portfolio/esteps/2.PNG",
   carousel_pictures:[
    "img/portfolio/esteps/1.png",
    "img/portfolio/esteps/2.png",
    "img/portfolio/esteps/3.png",
    "img/portfolio/esteps/5.png",
    "img/portfolio/esteps/4.png",
  ],
    date: "2024",
  },
   {
    id: 5,
    title: "JuriCar",
    subtitle: "Legal Tech",
    category: "Web",
    tags: ["React", "Node.js"],
    description1: "Developed a streamlined real estate law website using React.js. Offers personalized support and intuitive navigation for legal clients.",
    description2: "Revolutionizes the real estate law experience with a responsive and user-friendly design.",
    img: "img/portfolio/JUR/JuriCar.png", 
    img2: "img/portfolio/JUR/JuriCar.png",
   carousel_pictures:[
    "img/portfolio/JUR/1.png",
    "img/portfolio/JUR/2.png",
    "img/portfolio/JUR/3.png",
    "img/portfolio/JUR/4.png",
  ],
    date: "2024", 
  },
  {
    id: 6,  
    title: "MyFinance",
    subtitle: "Financial Management",
    category: "Web",
    tags: ["Angular", "MongoDB", "Node.js"],
    description1: "Efficient financial management platform facilitating day-to-day payments and transactions. Real-time tracking of monthly and daily spending.",
    description2: "Features Socket.IO for instant updates on transactions and budget adjustments.",
    img: "img/portfolio/myF/myFinance.png", 
    img2: "img/portfolio/myF/myFinance.png", 
    carousel_pictures:[
    "img/portfolio/myF/1.png",
    "img/portfolio/myF/2.png",
    "img/portfolio/myF/3.png",
  ],
    date: "2023", 
  },
  {
  id: 7,
  title: "Visionnaire",
  subtitle: "E-commerce Platform",
  category: "Web",
  tags: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Redux", "FittingBox"],
  description1: "Built a full-featured e-commerce platform for glasses with Next.js and TypeScript. Integrated FittingBox virtual try-on technology for real-time AR glasses fitting, implemented product catalog, shopping cart, checkout flow, and user account management with Firebase integration.",
  description2: "Deployed static site to Firebase Hosting with comprehensive user tracking and analytics system for behavior insights.",
  img: "img/portfolio/vision/visionnaire.png", 
  img2: "img/portfolio/vision/visionnaire.png", 
  carousel_pictures:[],
  date: "2025", 
},
 {
  id: 8,
  title: "Clinica-Tour",
  subtitle: "Tourism",
  category: "Web",
  tags: ["Next.js", "TypeScript",  "Tailwind CSS"],
  description1: "Developed a comprehensive medical tourism website facilitating plastic surgery packages for international tourists. Features include detailed doctor profiles, procedure information, and integrated accommodation booking.",
  description2: "Streamlined the patient journey from initial consultation to recovery, offering all-inclusive packages that combine medical procedures with travel logistics.",
  img: "img/portfolio/7.png", 
  img2: "img/portfolio/6.png", 
  carousel_pictures:[
    "img/portfolio/CT/1.png",
    "img/portfolio/CT/2.png",
    "img/portfolio/CT/3.png",
    "img/portfolio/CT/5.png",
    "img/portfolio/CT/6.png",
    "img/portfolio/CT/7.png",
  ],
  date: "2025", 
},
{
  id: 9,
  title: "MME Company",
  subtitle: "Medical",
  category: "Web",
  tags: ["Next.js", "TypeScript",  "Tailwind CSS"],
  description1: "Developed a specialized B2B/B2Cwebsite for high-precision medical equipment and advanced ceramic prosthetic components. Implemented robust product catalog management with detailed technical specifications, facilitating procurement for healthcare providers.",
  description2: "Designed a responsive user interface with Tailwind CSS to optimize accessibility and user experience for medical professionals and procurement teams,for ordering and logistics in order to obtain  medical supplies.",
  img: "img/portfolio/MMECompany.png", 
  img2: "img/portfolio/4.png", 
  carousel_pictures:[
    "img/portfolio/MM/2.png",
    "img/portfolio/MM/3.png",
  ],
  date: "2025", 
},
{
  id: 10,
  title: "France Papiers",
  subtitle: "Legal Tech",
  category: "Web",
  tags: ["Next.js", "TypeScript",  "Tailwind CSS", "Bitrix"],
  description1: "A web platform that helps people find qualified immigration lawyers quickly and easily.",
  description2: "Only lawyers with proven experience and strong client reviews are included on the platform.",
  img: "img/portfolio/fp.png", 
  img2: "img/portfolio/fp.png", 
  carousel_pictures:[
    "img/portfolio/FP/1.png",
    "img/portfolio/FP/2.png",
    "img/portfolio/FP/3.png",
  ],
  date: "2025", 
},
{
  id: 11,
  title: "Orizon Booking",
  subtitle: "Event Tech",
  category: "Web",
  tags: ["Angular","Next.js", "TypeScript",  "NestJs", ],
   description1: "An online platform that helps couples and travelers plan weddings and trips by contacting agencies or .",
  description2: "Users can order/contact contractors, manage bookings, and receive personalized suggestions—all in one intuitive interface.",
  img: "img/portfolio/OR/4.png", 
  img2: "img/portfolio/OR/4.png", 
  carousel_pictures:[
    "img/portfolio/OR/1.png",
    "img/portfolio/OR/2.png",
    "img/portfolio/OR/3.png",
  ],
  date: "2025", 
},


];

const Portfolio = () => {
  const { t } = useLanguage();
  const [modal, setModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  const [sortedProjects, setSortedProjects] = useState(allProjects);
  useEffect(() => {
    const sorted = allProjects.sort((a, b) => b.date.localeCompare(a.date));
    setSortedProjects(sorted);
    console.log("Filter changed to:", filter);
    if (filter === "All") { 
      setFilteredProjects(sortedProjects);
    } else {
      const filtered = sortedProjects.filter(p => p.category === filter);
      console.log("Filtered projects:", filtered);
      setFilteredProjects(filtered);
    }
  }, [filter]);

  const openModal = (project) => {
    setSelectedProject(project);
    setModal(true);
  };

  const filters = ["All", "Cloud", "Web", "Mobile", "Management"];

  return (
    <Fragment>
      <PortfolioModal
        open={modal}
        close={() => setModal(false)}
        project={selectedProject}
      />
      <div className="edrea_tm_section hidden animated" id="portfolio">
        <div className="section_inner">
          <div className="edrea_tm_portfolio">
            <div className="edrea_tm_main_title">
              <h3>
                {t('portfolio').split(' ')[0]} <span className="coloring">Projects</span>
              </h3>
            </div>
            
            <ProjectFilter 
              activeFilter={filter} 
              setFilter={setFilter} 
              filters={filters} 
            />

            <motion.div className="portfolio-grid" layout>
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => openModal(project)} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Portfolio;
