import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';
import { pageTitle } from '../../helper';
import Accordion from '../Accordion';
import Button from '../Button';
import Cta from '../Cta';
import Div from '../Div';
import PageHeading from '../PageHeading';
import Spacing from '../Spacing';

export default function FaqPage() {
  pageTitle('Frequently Asked Questions');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <PageHeading
        title="Frequently Asked Questions"
        bgSrc="/images/about_hero_bg.jpeg"
        pageLinkText="FAQ"
      />
      <Spacing lg="150" md="80" />
      <Div className="container">
        <Div className="row">
          <Div className="col-lg-4">
            <Div className="cs-faq_nav cs-radius_15">
              <h2 className="cs-faq_nav_title cs-m0">FAQ Category</h2>
              <Div className="cs-height_30 cs-height_lg_30" />
              <ul className="cs-list cs-style1 cs-mp0">
                <li>
                  <Button
                    variant="cs-type2"
                    btnLink="/faq"
                    btnText="Service related"
                    icon={
                      <Icon icon="material-symbols:content-copy-outline-rounded" />
                    }
                  />
                </li>
                <li>
                  <Button
                    variant="cs-type2"
                    btnLink="/faq"
                    btnText="Pricing"
                    icon={
                      <Icon icon="material-symbols:content-copy-outline-rounded" />
                    }
                  />
                </li>
                <li>
                  <Button
                    variant="cs-type2"
                    btnLink="/faq"
                    btnText="Project delivery"
                    icon={
                      <Icon icon="material-symbols:content-copy-outline-rounded" />
                    }
                  />
                </li>
                <li>
                  <Button
                    variant="cs-type2"
                    btnLink="/faq"
                    btnText="Documentation"
                    icon={
                      <Icon icon="material-symbols:content-copy-outline-rounded" />
                    }
                  />
                </li>
              </ul>
            </Div>
          </Div>
          <Div className="col-lg-7 offset-lg-1">
            <Spacing lg="0" md="40" />
            <Accordion />
          </Div>
        </Div>
      </Div>
      <Spacing lg="150" md="80" />
      {/* Start CTA Section */}
      <Div className="container">
        <Cta
          title="Let’s disscuse make <br />something <i>cool</i> together"
          btnText="Apply For Meeting"
          btnLink="/contact"
          bgSrc="/images/cta_bg.jpeg"
        />
      </Div>
      {/* End CTA Section */}
    </>
  );
}
