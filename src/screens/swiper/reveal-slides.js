import React from "react";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

// import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";

// import required modules
import { Navigation } from "swiper";
import useWindowDimensions from "../../components/useWindowDimentions";

const RevealSlides = () => {
  const location = useLocation();
  const dimensions = useWindowDimensions();
  const { slideList, presentation_background, styles } = location.state;

  return (
    <>
      <Swiper
        style={{
          height: dimensions.height,
          //width: dimensions.width < 600 ? dimensions.width - 20 : 398,
        }}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper  h-screen -mt-12"
      >
        {slideList.reverse().map((slide, index) => {
          return (
            <SwiperSlide
              key={index}
              style={{
                backgroundImage: `url(${presentation_background})`,
              }}
              className="mb-12 h-screen"
            >
              <div
                style={{
                  height: 0.85*dimensions.height,
                }}
                className={`flex flex-col self-start ${styles?.primary} px-2 py-2  pv-2`}
              >
                <div className="flex justify-center capitalize mt-16">
                  <p className="text-5xl">{slide.title}</p>
                </div>

                <div
                  className={`flex flex-1  flex-col ${dimensions.width > 600 ? 'text-2xl mx-24' : 'text-lg mx-12'} justify-center align-center  ${styles?.secondary}`}
                  dangerouslySetInnerHTML={{ __html: slide.description }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default RevealSlides;
