
import { Col, Divider, Form, Radio, Row, message, notification, Button, Input as AntInput } from 'antd';
import { DeleteTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteItemCartAction, doPlaceOrderAction, doUpdateCartAction } from '../../redux/order/orderSlice';
import { doApplyDiscount, doRemoveDiscount } from '../../redux/discount/discountSlice';
import { Input } from 'antd';
import { callPlaceOrder, callValidateDiscountCode } from '../../services/api';
import AddressForm from './AddressForm';
const { TextArea } = Input;

const Payment = (props) => {
    const carts = useSelector(state => state.order.carts);
    const selectedItems = useSelector(state => state.order.selectedItems) || [];
    const discount = useSelector(state => state.discount);
    const address = useSelector(state => state.address);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    const [isValidatingCode, setIsValidatingCode] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const user = useSelector(state => state.account.user);
    const [form] = Form.useForm();

    // Lấy những sản phẩm được chọn
    const selectedCarts = carts.filter(item => selectedItems.includes(item._id));

    useEffect(() => {
        if (selectedCarts && selectedCarts.length > 0) {
            let sum = 0;
            selectedCarts.forEach(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);

            // Tính giá sau giảm
            if (discount.isApplied) {
                let finalPrice = sum;
                if (discount.discountType === 'PERCENT') {
                    finalPrice = sum - (sum * discount.discount / 100);
                } else {
                    finalPrice = sum - discount.discount;
                }
                setDiscountedPrice(Math.max(0, finalPrice));
            } else {
                setDiscountedPrice(sum);
            }
        } else {
            setTotalPrice(0);
            setDiscountedPrice(0);
        }
    }, [selectedCarts, discount]);


    const handlePlaceOrder = () => {
        if (!address) {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: "Thông tin địa chỉ không được để trống!"
            })
            return;
        }
        props.setCurrentStep(2);
    }

    const onFinish = async (values) => {
        // Validate address
        if (!address.selectedProvince || !address.selectedDistrict || !address.selectedWard || !address.street) {
            notification.error({
                message: "Địa chỉ không đầy đủ",
                description: "Vui lòng chọn đầy đủ tỉnh/thành phố, quận/huyện, phường/xã và nhập số nhà/ngõ/ngách"
            });
            return;
        }

        setIsSubmit(true);
        const detailOrder = selectedCarts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                price: item.detail.price,
                thumbnail: item.detail.thumbnail,
                _id: item._id
            }
        })

        // Build full address
        const fullAddress = [
            address.street,
            address.selectedWard.name,
            address.selectedDistrict.name,
            address.selectedProvince.name
        ].join(', ');

        const data = {
            name: values.name,
            address: fullAddress,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder,
            discountCode: discount.code || null,
            discountAmount: discount.isApplied ? (totalPrice - discountedPrice) : 0,
            finalTotal: discountedPrice,
            province: address.selectedProvince.name,
            district: address.selectedDistrict.name,
            ward: address.selectedWard.name,
            street: address.street
        }

        const res = await callPlaceOrder(data);
        if (res && res.data) {
            message.success('Đặt hàng thành công !');
            dispatch(doPlaceOrderAction());
            dispatch(doRemoveDiscount());
            props.setCurrentStep(2);
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng nhập mã giảm giá"
            });
            return;
        }

        const sanitizedCode = discountCode.trim();
        setIsValidatingCode(true);

        try {
            const res = await callValidateDiscount(discountCode.trim(), totalPrice);
            if (res?.data) {
                dispatch(doApplyDiscount({
                    code: sanitizedCode,
                    discount: res.data.discountValue,
                    discountType: res.data.discountType === 'percentage' ? 'PERCENT' : 'AMOUNT',
                    message: res.data.message || 'Áp dụng mã giảm giá thành công!'
                }));
                message.success(`Áp dụng mã giảm giá thành công! Tiết kiệm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(res.data.discountAmount)}`);
                setDiscountCode('');
            } else {
                notification.error({
                    message: "Mã giảm giá không hợp lệ",
                    description: res.message || "Mã giảm giá không tồn tại hoặc đã hết hạn"
                });
            }
        } catch (error) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: error.response?.data?.message || "Vui lòng thử lại"
            });
        }
        setIsValidatingCode(false);
    }

    const handleRemoveDiscount = () => {
        dispatch(doRemoveDiscount());
        message.info('Đã xoá mã giảm giá');
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {selectedCarts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    return (
                        <div className='order-book' key={`index-${index}`}>
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
                                    Số lượng: {book?.quantity}
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
            </Col>
            <Col md={8} xs={24} >
                <div className='order-sum'>
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            style={{ margin: 0 }}
                            labelCol={{ span: 24 }}
                            label="Tên người nhận"
                            name="name"
                            initialValue={user?.fullName}
                            rules={[{ required: true, message: 'Tên người nhận không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{ margin: 0 }}
                            labelCol={{ span: 24 }}
                            label="Số điện thoại"
                            name="phone"
                            initialValue={user?.phone}
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <AddressForm />
                    </Form>

                    <div className='info' style={{ marginTop: '20px' }}>
                        <div className='discount-section' style={{
                            padding: '10px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            marginBottom: '15px'
                        }}>
                            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                Mã giảm giá
                            </div>
                            {discount.isApplied ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px',
                                    backgroundColor: '#f0f5ff',
                                    borderRadius: '4px',
                                    marginBottom: '8px'
                                }}>
                                    <span>
                                        <strong>Mã:</strong> {discount.code}
                                        ({discount.discountType === 'PERCENT' ? `${discount.discount}%` : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount.discount)}`})
                                    </span>
                                    <Button
                                        size="small"
                                        danger
                                        onClick={handleRemoveDiscount}
                                    >
                                        Xoá
                                    </Button>
                                </div>
                            ) : (
                                <Row gutter={[8, 8]}>
                                    <Col flex="auto">
                                        <AntInput
                                            placeholder="Nhập mã giảm giá"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            disabled={isValidatingCode}
                                        />
                                    </Col>
                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={handleApplyDiscount}
                                            loading={isValidatingCode}
                                        >
                                            Áp dụng
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </div>

                    <div className='info'>
                        <div className='method'>
                            <div>  Hình thức thanh toán</div>
                            <Radio checked>Thanh toán khi nhận hàng</Radio>
                        </div>
                    </div>

                    <Divider style={{ margin: "5px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                        </span>
                    </div>
                    {discount.isApplied && (
                        <>
                            <div className='calculate' style={{ color: '#ff4d4f' }}>
                                <span>Giảm giá ({discount.discountType === 'PERCENT' ? `${discount.discount}%` : 'cố định'})</span>
                                <span>
                                    -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice - discountedPrice)}
                                </span>
                            </div>
                        </>
                    )}
                    <Divider style={{ margin: "5px 0" }} />
                    <div className='calculate' style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        <span>Thành tiền</span>
                        <span className='sum-final'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountedPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "5px 0" }} />
                    <button
                        onClick={() => form.submit()}
                        disabled={isSubmit || selectedCarts.length === 0}
                    >
                        {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                        Đặt Hàng ({selectedCarts?.length ?? 0})
                    </button>
                </div>
            </Col>
        </Row>
    )
}

export default Payment;