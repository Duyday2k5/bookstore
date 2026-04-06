import { Col, Divider, Empty, InputNumber, Row, Checkbox } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteItemCartAction, doUpdateCartAction, doSelectItemAction, doDeselectItemAction, doSelectAllItemsAction, doClearAllSelectAction } from '../../redux/order/orderSlice';

const ViewOrder = (props) => {
    const carts = useSelector(state => state.order.carts);
    const selectedItems = useSelector(state => state.order.selectedItems) || [];
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.forEach(item => {
                if (selectedItems.includes(item._id)) {
                    sum += item.quantity * item.detail.price;
                }
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts, selectedItems]);

    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
        }
    }

    const handleSelectItem = (itemId) => {
        if (selectedItems.includes(itemId)) {
            dispatch(doDeselectItemAction(itemId));
        } else {
            dispatch(doSelectItemAction(itemId));
        }
    }

    const isAllSelected = carts.length > 0 && selectedItems.length === carts.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            dispatch(doClearAllSelectAction());
        } else {
            dispatch(doSelectAllItemsAction());
        }
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={18} xs={24}>
                {carts?.length > 0 && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                        <Checkbox
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            indeterminate={selectedItems.length > 0 && selectedItems.length < carts.length}
                        />
                        <span style={{ fontWeight: '500' }}>
                            {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'} ({selectedItems.length}/{carts.length})
                        </span>
                    </div>
                )}
                {carts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    const isSelected = selectedItems.includes(book._id);
                    return (
                        <div
                            className='order-book'
                            key={`index-${index}`}
                            style={{
                                backgroundColor: isSelected ? '#f0f5ff' : '#fff',
                                borderLeft: isSelected ? '4px solid #5f71ff' : 'none',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <Checkbox
                                checked={isSelected}
                                onChange={() => handleSelectItem(book._id)}
                                style={{ marginLeft: '12px' }}
                            />
                            <div className='book-content'>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div className='title'>
                                    {book?.detail?.mainText}
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                </div>
                            </div>
                            <div className='action'>
                                <div className='quantity'>
                                    <InputNumber onChange={(value) => handleOnChangeInput(value, book)} value={book.quantity} />
                                </div>
                                <div className='sum'>
                                    Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * (book?.quantity ?? 0))}
                                </div>
                                <DeleteTwoTone
                                    style={{ cursor: "pointer" }}
                                    onClick={() => dispatch(doDeleteItemCartAction({ _id: book._id }))}
                                    twoToneColor="#eb2f96"
                                />

                            </div>
                        </div>
                    )
                })}
                {carts.length === 0 &&
                    <div className='order-book-empty'>
                        <Empty
                            description={"Không có sản phẩm trong giỏ hàng"}
                        />
                    </div>
                }
            </Col>
            <Col md={6} xs={24} >
                <div className='order-sum'>
                    <div className='calculate'>
                        <span>  Tạm tính</span>
                        <span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <button
                        disabled={selectedItems.length === 0}
                        onClick={() => props.setCurrentStep(1)}
                    >
                        Mua Hàng ({selectedItems?.length ?? 0})
                    </button>
                </div>
            </Col>
        </Row>
    )
}

export default ViewOrder;