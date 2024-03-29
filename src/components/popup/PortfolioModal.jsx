import Modal from "./Modal";
import React, { useState, useEffect } from "react";
const PortfolioModal = ({
  close,
  open,
  title,
  subtitle,
  description1,
  description2,
  img,
  index = 0,
}) => {
  console.log(img);
  let render = false;
  let img_Array = [
    {
      main: "img/portfolio/esteps/1.PNG",
      images: [
        `img/portfolio/esteps/2.PNG`,
        `img/portfolio/esteps/3.PNG`,
        `img/portfolio/esteps/4.PNG`,
        `img/portfolio/esteps/5.PNG`,
      ],
    },
    {
      main: "img/portfolio/MMECompany.png",
      images: [
        `img/portfolio/2.png`,
        `img/portfolio/3.png`,
        `img/portfolio/4.png`,
        `img/portfolio/7.png`,
      ],
    },
    {
      main: "img/portfolio/CT/1.png",
      images: [
        `img/portfolio/CT/2.png`,
        `img/portfolio/CT/3.png`,
        `img/portfolio/CT/5.png`,
        `img/portfolio/CT/6.png`,
      ],
    },
    {
      main: "img/portfolio/JUR/JuriCar.png",
      images: [
        `img/portfolio/JUR/1.PNG`,
        `img/portfolio/JUR/2.PNG`,
        `img/portfolio/JUR/3.PNG`,
        `img/portfolio/JUR/4.pPNGng`,
      ],
    },
    {
      main: "img/portfolio/myF/myFinance.png",
      images: [
        `img/portfolio/myF/1.PNG`,
        `img/portfolio/myF/2.PNG`,
        `img/portfolio/myF/3.PNG`,
      ],
    },
    {
      main: "img/portfolio/GDF/1.PNG",
      images: [
        `img/portfolio/GDF/2.PNG`,
        `img/portfolio/GDF/3.PNG`,
        `img/portfolio/GDF/4.PNG`,
        `img/portfolio/GDF/5.PNG`,
      ],
    },
  ];
  console.log(index, "11");
  setTimeout(() => {
    render = true;
  }, 2000);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (
      title != "" &&
      subtitle != "" &&
      description1 != "" &&
      description2 != "" &&
      img != ""
    ) {
      setIsLoading(false);
    }
  }, [title, subtitle, description1, description2, img]);

  return !isLoading ? (
    <Modal close={close} open={open}>
      <div className="portfolio_popup_details">
        <div className="top_image">
          <img className="main"  src={img} />
        </div>
        <div className="portfolio_main_title">
          <h3>
            {title}
          </h3>
          <span>
            <a href="#">{subtitle}</a>
          </span>
          <div />
        </div>

        <div className="text">
          <p>{description1}</p>
          <p>{description2}</p>
        </div>
        <div className="additional_images">
          <ul className="gallery_zoom">
            {img_Array[index ? index : 0].images.map((values, index) => (
              <li key={index}>
                <div className="list_inner">
                  <div className="image">
                    <img className="main" src={values} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  ) : (
    <div></div>
  );
};
export default PortfolioModal;
