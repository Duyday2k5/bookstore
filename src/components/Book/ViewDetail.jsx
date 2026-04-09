import { Row, Col, Rate, Divider, Button, Breadcrumb, Tooltip } from 'antd';
import './book.scss';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import ModalGallery from './ModalGallery';
import { MinusOutlined, PlusOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import BookLoader from './BookLoader';
import { useDispatch } from 'react-redux';
import { doAddBookAction } from '../../redux/order/orderSlice'
import { Link, useNavigate } from 'react-router-dom';

const ViewDetail = (props) => {
    const { dataBook } = props;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [currentQuantity, setCurrentQuantity] = useState(1);
    const refGallery = useRef(null);
    const images = dataBook?.items ?? [];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }


    const handleChangeButton = (type) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === 'PLUS') {
            if (currentQuantity === +dataBook.quantity) return; //max
            setCurrentQuantity(currentQuantity + 1);
        }
    }

    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < +dataBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }

    const handleAddToCart = (quantity, book) => {
        dispatch(doAddBookAction({ quantity, detail: book, _id: book._id }))
    }

    const handleBuyNow = (quantity, book) => {
        dispatch(doAddBookAction({ quantity, detail: book, _id: book._id }))
        navigate('/order');
    }
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div className='detail-top-bar'>
                    <Tooltip title="Quay lại">
                        <button
                            className='back-button'
                            onClick={() => navigate(-1)}
                            aria-label="Quay lại trang trước"
                            style={{ margin: '0 0 6px', padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#6a7cff', color: '#fff' }}
                        >
                            <ArrowLeftOutlined />
                            <span> Back</span>
                        </button>
                    </Tooltip>
                    <Breadcrumb
                        style={{ marginRight: '4px' }}
                        items={[
                            {
                                title: <HomeOutlined />,
                            },
                            {
                                title: (
                                    <Link to={'/'}>
                                        <span>Trang Chủ</span>
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <span>{dataBook?.mainText || 'Chi tiết sách'}</span>
                                ),
                            }
                        ]}
                    />
                </div>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    {dataBook && dataBook._id ?
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className='author'>Tác giả: <a href='#'>{dataBook?.author}</a> </div>
                                    <div className='title' style={{ fontWeight: 700 }}>{dataBook?.mainText}</div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" />
                                            Đã bán {dataBook.sold}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook?.price ?? 0)}
                                        </span>
                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left-side'>Vận chuyển</span>
                                            <span className='right-side'>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left-side'>Số lượng</span>
                                        <span className='right-side'>
                                            <button onClick={() => handleChangeButton('MINUS')} ><MinusOutlined /></button>
                                            <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                            <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                        </span>
                                    </div>
                                    <div className='buy'>
                                        <button className='cart' onClick={() => handleAddToCart(currentQuantity, dataBook)}>
                                            <BsCartPlus className='icon-cart' />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button
                                            className='now'
                                            onClick={() => handleBuyNow(currentQuantity, dataBook)}
                                            style={{ cursor: 'pointer' }}
                                        >Mua ngay</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        :
                        <BookLoader />
                    }
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataBook?.mainText}
            />
        </div>
    )
}

export default ViewDetail;