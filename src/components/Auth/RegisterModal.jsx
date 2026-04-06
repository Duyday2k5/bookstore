import { Button, Divider, Form, Input, message, notification, Modal } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callRegister } from '../../services/api';
import { doHideRegisterModal, doShowLoginModal } from '../../redux/account/accountSlice';
import './auth.scss';

const RegisterModal = () => {
    const dispatch = useDispatch();
    const showRegisterModal = useSelector(state => state.account.showRegisterModal);
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;

        setIsSubmit(true);
        const res = await callRegister(fullName, email, password, phone);
        setIsSubmit(false);
        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!');
            dispatch(doHideRegisterModal());
            // Tự động chuyển sang login modal
            dispatch(doShowLoginModal());
            form.resetFields();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    const handleCancel = () => {
        dispatch(doHideRegisterModal());
        form.resetFields();
    };

    const handleSwitchToLogin = () => {
        dispatch(doHideRegisterModal());
        dispatch(doShowLoginModal());
        form.resetFields();
    };

    return (
        <Modal
            title="Đăng Ký Tài Khoản"
            open={showRegisterModal}
            onCancel={handleCancel}
            footer={null}
            maskClosable={true}
            centered
            width={500}
            className="auth-modal register-modal"
        >
            <Form
                form={form}
                name="register-form"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    label="Họ tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                >
                    <Input placeholder="Nhập họ tên của bạn" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                >
                    <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu của bạn" />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu của bạn" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                >
                    <Input placeholder="Nhập số điện thoại của bạn" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmit} block>
                        Đăng ký tài khoản
                    </Button>
                </Form.Item>

                <Divider>Hoặc</Divider>

                <p style={{ textAlign: 'center', marginBottom: '0' }}>
                    Đã có tài khoản?{' '}
                    <span
                        style={{ color: '#5f71ff', cursor: 'pointer', fontWeight: 600 }}
                        onClick={handleSwitchToLogin}
                    >
                        Đăng Nhập
                    </span>
                </p>
            </Form>
        </Modal>
    );
};

export default RegisterModal;
