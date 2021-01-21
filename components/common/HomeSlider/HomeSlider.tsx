import { FC } from 'react'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import s from './HomeSlider.module.scss'
import cn from 'classnames'

const HomeSlider: FC = () => {
  return (
    <div className={s.root} style={{ overflow: 'hidden', height: '400px' }}>
      <Swiper
        className="h-full"
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true, dragSize: 1600, hide: true }}
      >
        <SwiperSlide>
          <div className="w-full h-full slide" style={{ background: 'red' }}>
            <img className={s.img} alt="" src="/images/slides/map.webp" />
            <div className={cn(s.s1, s.overlay)}></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full slide" style={{ background: 'yellow' }}>
            <img className={s.img} alt="" src="/images/slides/meat.webp" />
            <div className={cn(s.s2, s.overlay)}></div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default HomeSlider
