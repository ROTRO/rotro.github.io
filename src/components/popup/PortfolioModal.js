import { useContext } from "react";
import { context } from "../../context/context";
import Modal from "./Modal";
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaAws, FaAngular, FaDatabase, FaCloud } from "react-icons/fa";
import { SiNextdotjs, SiMongodb, SiFirebase, SiIonic, SiTypescript } from "react-icons/si";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper";

const getIcon = (tag) => {
  switch (tag.toLowerCase()) {
    case 'react': return <FaReact />;
    case 'next.js': return <SiNextdotjs />;
    case 'node.js': return <FaNodeJs />;
    case 'aws': return <FaAws />;
    case 'angular': return <FaAngular />;
    case 'mongodb': return <SiMongodb />;
    case 'firebase': return <SiFirebase />;
    case 'ionic': return <SiIonic />;
    case 'typescript': return <SiTypescript />;
    case 'cloud': return <FaCloud />;
    case 'database': return <FaDatabase />;
    default: return null;
  }
};

const PortfolioModal = ({ open, close, project }) => {
  const colorContext = useContext(context);
  const { color } = colorContext;

  if (!project) return null;

  return (
    <Modal open={open} close={close}>
      <div className="portfolio_popup_details">
        <div className="top_image">
          <img src={project.img} alt="" />
          <div
            className="main"
            data-img-url={project.img}
            style={{ backgroundImage: `url(${project.img})` }}
          />
        </div>
        <div className="portfolio_main_title">
          <h3>{project.title}</h3>
          <span>{project.subtitle}</span>
          <div />
        </div>
        
        <div className="tech-stack-modal">
          {project.tags && project.tags.map((tag, i) => (
            <div key={i} className="tech-item">
              {getIcon(tag)}
              <span>{tag}</span>
            </div>
          ))}
        </div>

        <div className="text">
          <p>{project.description1}</p>
          <p>{project.description2}</p>
        </div>
        
        <div className="additional_images">
          {project.carousel_pictures && project.carousel_pictures.length > 0 ? (
             <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 1000 }}
                className="portfolio-carousel"
             >
                {project.carousel_pictures.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="list_inner">
                      <div className="image">
                        <img src={img} alt="" />
                        <div
                          className="main"
                          data-img-url={img}
                          style={{ backgroundImage: `url(${img})` }}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
             </Swiper>
          ) : (
            project.img2 && (
              <ul className="gallery_zoom">
                <li>
                  <div className="list_inner">
                    <div className="image">
                      <img src={project.img2} alt="" />
                      <div
                        className="main"
                        data-img-url={project.img2}
                        style={{ backgroundImage: `url(${project.img2})` }}
                      />
                    </div>
                  </div>
                </li>
              </ul>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};
export default PortfolioModal;
