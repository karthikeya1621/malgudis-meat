import { FC } from 'react'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import s from './HomeSlider.module.scss'
import cn from 'classnames'

const HomeSlider: FC = () => {
  return (
    <div className={s.root} style={{ overflow: 'hidden' }}>
      <Swiper
        className="h-full"
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true, dragSize: 1600, hide: true }}
      >
        <SwiperSlide>
          <div className="w-full h-full slide">
            <img className={s.img} alt="" src="/images/slides/banner1.webp" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full slide">
            <img className={s.img} alt="" src="/images/slides/banner2.webp" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full slide">
            <img className={s.img} alt="" src="/images/slides/banner3.webp" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full slide">
            <img className={s.img} alt="" src="/images/slides/banner4.webp" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full slide">
            <img className={s.img} alt="" src="/images/slides/banner5.webp" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default HomeSlider
