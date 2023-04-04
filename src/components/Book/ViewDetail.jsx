import { Row, Col, Rate, Divider } from 'antd';
import './book.scss';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import ModalGallery from './ModalGallery';

const ViewDetail = (props) => {

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const refGallery = useRef(null);

    const images = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
    ];

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }

    const onChange = (value) => {
        console.log('changed', value);
    };

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto' }}>
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
                            <div className='author'>Tác giả: Jo Hemmings</div>
                            <div className='title'>How Psychology Works - Hiểu Hết Về Tâm Lý Học</div>
                            <div className='rating'>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                <Divider type="vertical" />
                                <span className='sold'>Đã bán 6969</span>
                            </div>
                            <div className='price'>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(696966666)}
                                </span>
                            </div>
                            <div className='delivery'>
                                <div>
                                    <span>Vận chuyển</span>
                                    <span>Miễn phí vận chuyển</span>
                                </div>
                            </div>
                            <div className='quantity'>
                                <div>
                                    <span>Số lượng</span>
                                    <span>
                                        <button>-</button>
                                        <input />
                                        <button>+</button>
                                    </span>
                                </div>
                            </div>
                            <div>
                                <button>Thêm vào giỏ hàng</button>
                                <button>Mua ngay</button>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={"hardcode"}
            />
        </div>
    )
}

export default ViewDetail;