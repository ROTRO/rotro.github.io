import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Pagination } from 'swiper/modules';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../../data/projects';
import { getMotionPrefs } from '../../lib/motionPrefs';
import 'swiper/css';
import 'swiper/css/pagination';

export default function FeaturedProjectsSwiper() {
  const reduce = useMemo(() => getMotionPrefs().reduce, []);

  return (
    <div className="featured-swiper-wrap">
      <Swiper
        className="featured-swiper"
        modules={[Mousewheel, Keyboard, Pagination]}
        slidesPerView={1}
        grabCursor
        speed={reduce ? 0 : 720}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 0.85,
          releaseOnEdges: true,
        }}
        keyboard={{ enabled: true }}
        pagination={
          reduce
            ? false
            : {
                clickable: true,
                type: 'fraction',
              }
        }
        a11y={{ enabled: true }}
      >
        {PROJECTS.map((project) => (
          <SwiperSlide key={project.slug} className="featured-swiper__slide">
            <div className="featured-swiper__media">
              <img
                className="featured-swiper__bg"
                src={project.heroImage}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div className="featured-swiper__scrim" aria-hidden />
            </div>
            <div className="featured-swiper__content container">
              <p className="featured-swiper__kicker">Featured work</p>
              <h2 className="featured-swiper__title">{project.name}</h2>
              <p className="featured-swiper__tagline">{project.tagline}</p>
              <div className="featured-swiper__meta">
                <span>{project.year}</span>
                <span aria-hidden>·</span>
                <span>{project.role}</span>
              </div>
              <div className="featured-swiper__cta">
                <Link className="btn btn-primary" to={`/projects/${project.slug}`}>
                  View project <ArrowUpRight size={18} aria-hidden />
                </Link>
                <Link className="btn btn-ghost" to="/projects">
                  All projects
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {!reduce && (
        <p className="featured-swiper__hint muted">
          Scroll with wheel · drag · arrow keys
        </p>
      )}
    </div>
  );
}
