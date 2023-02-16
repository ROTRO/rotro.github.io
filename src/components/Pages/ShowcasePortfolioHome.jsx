import React, { useEffect } from 'react';
import { pageTitle } from '../../helper';
import 'swiper/css';
import 'swiper/css/pagination';
import Hero6 from '../Hero/Hero6';

export default function ShowcasePortfolioHome() {
  pageTitle('Showcase Portfolio');
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
      title: 'Think reality <br/>do positive',
      imgUrl: '/images/slider_1.jpeg',
      href: '/case-study/case-study-details',
    },
    {
      title: 'Think reality <br/>do positive',
      imgUrl: '/images/slider_2.jpeg',
      href: '/case-study/case-study-details',
    },
    {
      title: 'Think reality <br/>do positive',
      imgUrl: '/images/slider_3.jpeg',
      href: '/case-study/case-study-details',
    },
    {
      title: 'Think reality <br/>do positive',
      imgUrl: '/images/slider_4.jpeg',
      href: '/case-study/case-study-details',
    },
  ];

  return (
    <Hero6
      heroSocialLinks={heroSocialLinks}
      socialLinksHeading="Follow Us"
      showcaseData={showcaseData}
    />
  );
}
