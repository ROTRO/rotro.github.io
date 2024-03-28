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
        `img/portfolio/JUR/1.png`,
        `img/portfolio/JUR/2.png`,
        `img/portfolio/JUR/3.png`,
        `img/portfolio/JUR/4.png`,
      ],
    },
    {
      main: "img/portfolio/myF/myFinance.png",
      images: [
        `img/portfolio/myF/1.png`,
        `img/portfolio/myF/2.png`,
        `img/portfolio/myF/3.png`,
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
