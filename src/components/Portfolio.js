import { Fragment, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { portfolioSlider } from "../sliderProps";
import PortfolioModal from "./popup/PortfolioModal";

const Portfolio = () => {
  let valuesArray = [
    {
      title: "eSteps Health",
      subtitle: "Medical",
      description1: `
      The website serves as a comprehensive platform for introducing esteps health's revolutionary
       technology to the medical community and MS patients alike. Visitors to the site will find
        detailed information about the remote monitoring devices, including their features, benefits,
         and compatibility with existing healthcare systems.
      `,
      description2: `Through ongoing research and collaboration with leading healthcare professionals,
       eSteps Health is dedicated to advancing the field of MS management and improving the lives
        of patients. With remote monitoring technology, eSteps aims to
         empower MS patients to take control of their health and achieve optimal outcomes, ultimately transforming
          the way MS is diagnosed, monitored, and treated.`,
      img: "/img/portfolio/esteps/1.png",
    },
    {
      title: "MMECompany",
      subtitle: "Medical",
      description1: `
      The MME Company website is user-friendly, allowing customers 
      to browse product selection based on their specific needs.
       Additionally, they have a team of qualified healthcare professionals
        available to address any inquiries and provide advice on the best
         treatment options. Furthermore, they provide fast delivery and a satisfaction
          guarantee to ensure their customers' satisfaction.
      `,
      description2: `Whether it's braces, supports, mobility aids, or rehabilitation 
      equipment, they offer a comprehensive range of orthopedic products to cater to various
       requirements.`,
      img: "/img/portfolio/MMECompany.png",
    },
    {
      title: "Clinica Tour",
      subtitle: "Tourism, Medical",
      description1: `Introducing our Next.js-based medical tourism platform, designed 
      to connect users with global healthcare services. Users can easily book appointments
       with specialists and arrange hotel accommodations, all within one seamless platform.
        `,
      description2: `This project leverages Next.js for efficient development and offers intuitive interfaces
      for smooth user experience. With Next.js, we're streamlining medical tourism and making 
      healthcare accessibility easier worldwide.`,
      img: "/img/portfolio/CT/1.png",
    },
    {
      title: "JuriCar",
      subtitle: "Law, Legal",
      description1: `
      we've developed a streamlined real estate law law website using React.js, 
      dedicated to assisting clients with cases concerning French real estate 
      law. Their platform offers personalized support, intuitive navigation, and
       responsive design, ensuring clients can easily access essential information 
       and engage with legal professionals. 
        `,
      description2: `In summary, their React.js-powered website revolutionizes the real estate law experience, providing unparalleled value and support to clients seeking to navigate French real estate law with confidence.`,
      img: "/img/portfolio/JUR/JuriCar.png",
    },
    {
      title: "MyFinance",
      subtitle: "Finance, Budget",
      description1: `
      Introducing an efficient financial management platform,
       developed with Angular, Express, Mongoose, MongoDB, and
        Socket.IO. This comprehensive solution facilitates day-to-day
         payments and transactions within the company, enabling real-time 
         tracking of monthly and daily spending.
        `,
      description2: `With Socket.IO, users receive instant updates on transactions,
       payment approvals, and budget adjustments, facilitating seamless collaboration 
       and informed decision-making. From expense tracking to invoice management, our
        platform streamlines financial operations, empowering companies to optimize resource
         allocation and drive financial success.`,
      img: "/img/portfolio/myF/myFinance.png",
    },
    {
      title: "GDF",
      subtitle: "Finance, Sales",
      description1: `
      Introducing our comprehensive business management platform, meticulously crafted using 
      Angular for the frontend and powered by Mongoose, Express.js, Node.js, Socket.IO, and MongoDB
       for backend operations. This versatile solution seamlessly handles every aspect of the invoicing 
       lifecycle, from estimates and invoices to purchase orders, delivery slips, stock management, and beyond.

At the forefront of our platform is an intuitive Angular frontend, providing users with a dynamic and user-friendly
 interface for efficient navigation and interaction. With Angular's robust features and modular architecture, users
  can effortlessly create, manage, and track estimates, invoices, purchase orders, and delivery slips with ease.
        `,
      description2: `Our platform facilitates seamless management of employees, clients, suppliers, and products, offering centralized repositories and streamlined workflows for enhanced productivity and efficiency. From employee scheduling and client management to supplier relations and product inventory tracking, our platform provides end-to-end solutions to optimize business operations and drive growth.
      With real-time updates and notifications powered by Socket.IO, users can stay informed about critical business activities, ensuring timely decision-making and proactive management. Additionally, MongoDB serves as a reliable and scalable database solution, offering flexibility and performance to meet the demands of dynamic business environments.
      In summary, our Angular-powered business management platform, backed by Mongoose, Express.js, Node.js, Socket.IO, and MongoDB, revolutionizes the way businesses manage their invoicing lifecycle. With a comprehensive suite of features and robust technology stack, we empower businesses to streamline operations, improve efficiency, and achieve sustainable growth in today's competitive landscape.`,
      img: "/img/portfolio/GDF/1.png",
    },
  ];
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [mainIndex, setIndex] = useState("");
  const [img, setImg] = useState("");

  // Function to update the values based on the clicked object
  const updateValues = (values, index) => {
    setTitle(values.title || "");
    setSubtitle(values.subtitle || "");
    setDescription1(values.description1 || "");
    setDescription2(values.description2 || "");
    setImg(values.img || "");
    setIndex(index || 0);
    setModal(true);
  };
  return (
    <Fragment>
      <PortfolioModal
        title={title}
        description1={description1}
        subtitle={subtitle}
        description2={description2}
        img={img}
        index={mainIndex}
        open={modal}
        close={() => setModal(false)}
      />
      <div className="edrea_tm_section hidden animated" id="portfolio">
        <div className="section_inner">
          <div className="edrea_tm_portfolio swiper-section">
            <div className="edrea_tm_main_title">
              <h3>
                Creative <span className="coloring">Portfolio</span>
              </h3>
            </div>
            <div className="portfolio_list gallery_zoom">
              <Swiper {...portfolioSlider} className="swiper-container">
                <div className="swiper-wrapper">
                  {valuesArray.map((values, index) => (
                    <SwiperSlide className="swiper-slide" key={index}>
                      <div className="list_inner">
                        <div className="image">
                          <img src="img/thumbs/1-1.jpg" alt="" />
                          <div className="main" data-img-url={values.img} />
                        </div>
                        <div className="details">
                          <h3>{values.title}</h3>
                          <span>{values.subtitle}</span>
                        </div>
                        <a
                          className="edrea_tm_full_link portfolio_popup"
                          href="#"
                          onClick={() => updateValues(values, index)}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </div>
                <div className="edrea_tm_swiper_progress fill">
                  <div className="my_pagination_in">
                    <span className="current" />
                    <span className="pagination_progress">
                      <span className="all">
                        <span />
                      </span>
                    </span>
                    <span className="total" />
                  </div>
                  <div className="my_navigation">
                    <ul>
                      <li>
                        <a className="my_prev" href="#">
                          <i className="icon-left-open-1" />
                        </a>
                      </li>
                      <li>
                        <a className="my_next" href="#">
                          <i className="icon-right-open-1" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Portfolio;
