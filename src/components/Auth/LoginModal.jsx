import { Button, Divider, Form, Input, message, notification, Checkbox, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callLogin } from '../../services/api';
import { doLoginAction, doSetRememberMe, doHideLoginModal, doShowRegisterModal } from '../../redux/account/accountSlice';
import './auth.scss';

const LoginModal = () => {
    const dispatch = useDispatch();
    const showLoginModal = useSelector(state => state.account.showLoginModal);
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    // Auto-fill email nếu có lưu từ lần trước
    useEffect(() => {
        if (showLoginModal) {
            const savedEmail = localStorage.getItem('remembered_email');
            if (savedEmail) {
                form.setFieldsValue({ username: savedEmail });
            }
        }
    }, [showLoginModal, form]);

    const onFinish = async (values) => {
        const { username, password, rememberMe } = values;

        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);

            // Lưu email nếu user check "Ghi nhớ tôi"
            if (rememberMe) {
                localStorage.setItem('remembered_email', username);
                dispatch(doSetRememberMe(true));
            } else {
                localStorage.removeItem('remembered_email');
                dispatch(doSetRememberMe(false));
            }

            dispatch(doLoginAction(res.data.user))
            message.success('Đăng nhập tài khoản thành công!');
            dispatch(doHideLoginModal());
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
        dispatch(doHideLoginModal());
        form.resetFields();
    };

    const handleSwitchToRegister = () => {
        dispatch(doHideLoginModal());
        dispatch(doShowRegisterModal());
        form.resetFields();
    };

    return (
        <Modal
            title="Đăng Nhập"
            open={showLoginModal}
            onCancel={handleCancel}
            footer={null}
            maskClosable={true}
            centered
            width={500}
            className="auth-modal login-modal"
        >
            <Form
                form={form}
                name="login-form"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="username"
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
                    name="rememberMe"
                    valuePropName="checked"
                    initialValue={false}
                >
                    <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmit} block>
                        Đăng nhập
                    </Button>
                </Form.Item>

                <Divider>Hoặc</Divider>

                <p style={{ textAlign: 'center', marginBottom: '0' }}>
                    Chưa có tài khoản?{' '}
                    <span
                        style={{ color: '#5f71ff', cursor: 'pointer', fontWeight: 600 }}
                        onClick={handleSwitchToRegister}
                    >
                        Đăng Ký
                    </span>
                </p>

                <p style={{ color: '#9d9d9d', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                    p/s: Để test, sử dụng tài khoản guest@gmail.com/123456
                </p>
            </Form>
        </Modal>
    );
};

export default LoginModal;
