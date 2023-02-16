import React, { useEffect } from 'react';
import { pageTitle } from '../../helper';
import Hero7 from '../Hero/Hero7';

export default function CaseStudyShowcaseHome() {
  pageTitle('Case Study Showcase');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const heroSocialLinks = [
    {
      name: 'Behance',
      links: '/',
    },
    {
      name: 'Twitter',
      links: '/',
    },
  ];

  const showcaseData = [
    {
      title: 'Uber food app <br />case study',
      imgUrl: '/images/slider_5.jpeg',
      href: '/case-study/case-study-details',
    },
    {
      title: 'Uber food app <br />case study',
      imgUrl: '/images/slider_6.jpeg',
      href: '/case-study/case-study-details',
    },
    {
      title: 'Uber food app <br />case study',
      imgUrl: '/images/slider_7.jpeg',
      href: '/case-study/case-study-details',
    },
    {
      title: 'Uber food app <br />case study',
      imgUrl: '/images/slider_8.jpeg',
      href: '/case-study/case-study-details',
    },
    {
      title: 'Uber food app <br />case study',
      imgUrl: '/images/slider_9.jpeg',
      href: '/case-study/case-study-details',
    },
  ];
  return (
    <>
      <Hero7
        heroSocialLinks={heroSocialLinks}
        socialLinksHeading="Follow Us"
        showcaseData={showcaseData}
      />
    </>
  );
}
