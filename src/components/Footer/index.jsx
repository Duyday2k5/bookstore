// import './footer.scss';

// const Footer = () => {
//     return (
//         <footer>
//             <div>&copy; BookStore</div>
//         </footer>
//     )
// }

// export default Footer;

import { Row, Col } from "antd";
import {
    FacebookOutlined,
    InstagramOutlined,
    LinkedinOutlined,
} from "@ant-design/icons";
import "./footer.scss";

export default function Footer() {
    return (
        <div className="footer-wrapper">
            <div className="footer-container">
                <Row gutter={[32, 32]}>
                    {/* =========================================
              CHĂM SÓC KHÁCH HÀNG
          ========================================== */}
                    <Col xs={24} sm={12} md={6}>
                        <h4 className="footer-title">CHĂM SÓC KHÁCH HÀNG</h4>
                        <ul className="footer-list">
                            <li>Trung Tâm Trợ Giúp</li>
                            <li>BookStore Blog</li>
                            <li>BookStore Mall</li>
                            <li>Hướng Dẫn Mua Hàng</li>
                            <li>Hướng Dẫn Bán Hàng</li>
                            <li>Thanh Toán</li>
                            <li>BookStore Xu</li>
                            <li>Vận Chuyển</li>
                            <li>Trả Hàng & Hoàn Tiền</li>
                            <li>Chăm Sóc Khách Hàng</li>
                            <li>Chính Sách Bảo Hành</li>
                        </ul>
                    </Col>

                    {/* =========================================
              VỀ BOOKSTORE
          ========================================== */}
                    <Col xs={24} sm={12} md={6}>
                        <h4 className="footer-title">VỀ BOOKSTORE</h4>
                        <ul className="footer-list">
                            <li>Giới Thiệu Về BookStore Việt Nam</li>
                            <li>Tuyển Dụng</li>
                            <li>Điều Khoản BookStore</li>
                            <li>Chính Sách Bảo Mật</li>
                            <li>Chính Hãng</li>
                            <li>Kênh Người Bán</li>
                            <li>Flash Sales</li>
                            <li>Chương Trình Tiếp Thị Liên Kết BookStore</li>
                            <li>Liên Hệ Với Truyền Thông</li>
                        </ul>
                    </Col>

                    {/* =========================================
              THANH TOÁN & VẬN CHUYỂN
          ========================================== */}
                    <Col xs={24} sm={12} md={6}>
                        <h4 className="footer-title">THANH TOÁN</h4>
                        <div className="payment-list">
                            <img src="/visa.png" alt="" />
                            <img src="/mastercard.png" alt="" />
                            <img src="/jcb.png" alt="" />
                            <img src="/amex.png" alt="" />
                            <img src="/cod.png" alt="" />
                            <img src="/installment.png" alt="" />
                        </div>

                        <h4 className="footer-title mt-20">ĐƠN VỊ VẬN CHUYỂN</h4>
                        <div className="ship-list">
                            <img src="/spx.png" alt="" />
                            <img src="/ghn.png" alt="" />
                            <img src="/viettelpost.png" alt="" />
                            <img src="/vnpost.png" alt="" />
                            <img src="/ninjalog.png" alt="" />
                            <img src="/best.png" alt="" />
                        </div>
                    </Col>

                    {/* =========================================
              THEO DÕI CHÚNG TÔI + TẢI APP
          ========================================== */}
                    <Col xs={24} sm={12} md={6}>
                        <h4 className="footer-title">THEO DÕI CHÚNG TÔI</h4>
                        <ul className="footer-social">
                            <li><FacebookOutlined /> Facebook</li>
                            <li><InstagramOutlined /> Instagram</li>
                            <li><LinkedinOutlined /> LinkedIn</li>
                        </ul>

                        <h4 className="footer-title mt-20">TẢI ỨNG DỤNG BOOKSTORE NGAY</h4>
                        <div className="app-download">
                            <img src="/qr.png" className="qr" alt="QR" />
                            <div className="store-list">
                                <img src="/appstore.png" alt="" />
                                <img src="/googleplay.png" alt="" />
                                <img src="/appgallery.png" alt="" />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
