import { Container } from "next/app";
import { FC } from "react";
import cn from 'classnames'
import s from './InfoBar.module.css'


const InfoBar: FC = () => {
    return (
        <Container>
            <style jsx>{`
                .infobar{
                    background: #111;
                    color: #eee;
                }
            `}
            </style>
            <div className={`infobar w-100 py-2 d-flex justify-content-center`}>
                <div className="row w-100 d-flex max-w-8xl">
                    <div className="col-6">
                        InfoBar
                    </div>
                    <div className="col-6"></div>
                </div>
            </div>
        </Container>
    )
}

export default InfoBar