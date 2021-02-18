import { Container } from "next/app";
import { FC } from "react";
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import cn from 'classnames'
import s from './InfoBar.module.css'
// @ts-ignore
import ReactCountryFlag from "react-country-flag"
import CallOutlinedIcon from '@material-ui/icons/CallOutlined';


const InfoBar: FC = () => {
    return (
        <Container>
            <style jsx>{`
                .infobar{
                    font-size: 14px;
                    background: #333;
                    color: #eee;
                }
            `}
            </style>
            <div className={`infobar hidden md:flex w-100 py-2 justify-center`}>
                <div className="flex w-full max-w-8xl px-6">
                    <div className="md:w-6/12 lg:w-10/12">
                        <span>Store Hours: 10 a.m - 10 p.m CST ( Monday - Sunday )</span>
                    </div>
                    <div className="md:w-6/12 lg:w-2/12 flex justify-between">
                      <div><WhatsAppIcon fontSize="small" /> Chat with Us</div>
                      <div><CallOutlinedIcon fontSize="small" /> <span style={{marginRight: '6px'}}>1800-313-4656</span> <ReactCountryFlag countryCode="US" svg /></div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default InfoBar
