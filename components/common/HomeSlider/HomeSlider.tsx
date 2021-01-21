import { FC } from "react";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react'

import s from './HomeSlider.module.scss'


const HomeSlider: FC = () => {
    return (
        <div className={s.root} style={{ overflow: 'hidden', height: '400px' }}>
            <Swiper className="h-full" slidesPerView={1} navigation pagination={{ clickable: true }} scrollbar={{ draggable: true, dragSize: window.innerWidth, hide: true }}>
                <SwiperSlide>
                    <div className="w-full h-full slide" style={{ background: 'red' }}>
                        <img alt="" src="/images/slides/map.webp" />
                    </div>
                </SwiperSlide>
                <SwiperSlide><div className="w-full h-full slide" style={{ background: 'yellow' }}>2</div></SwiperSlide>
            </Swiper>
        </div>
    )
}

export default HomeSlider