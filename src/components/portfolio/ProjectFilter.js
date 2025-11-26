import { motion } from "framer-motion";

const ProjectFilter = ({ activeFilter, setFilter, filters }) => {
  return (
    <div className="project-filter">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
          onClick={() => setFilter(filter)}
        >
          {filter}
          {activeFilter === filter && (
            <motion.div 
              className="active-indicator" 
              layoutId="activeFilter"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
