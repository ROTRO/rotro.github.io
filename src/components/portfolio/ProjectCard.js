import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaAws, FaAngular, FaDatabase, FaCloud } from "react-icons/fa";
import { SiNextdotjs, SiMongodb, SiFirebase, SiIonic, SiTypescript } from "react-icons/si";

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

const ProjectCard = ({ project, onClick }) => {
  return (
    <motion.div 
      className="project-card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
    >
      <div className="card-image">
        <img src={project.img} alt={project.title} />
        <div className="card-overlay">
          <span className="view-details">View Details</span>
        </div>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3>{project.title}</h3>
          <span className="category-tag">{project.subtitle}</span>
        </div>
        <div className="tech-stack">
          {project.tags && project.tags.map((tag, i) => (
            <span key={i} className="tech-icon" title={tag}>
              {getIcon(tag)}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
