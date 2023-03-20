import { Button, Divider, Form, Input } from 'antd';

const RegisterPage = () => {

    const onFinish = (values) => {
        console.log('Success:', values);
    };


    return (
        <div className="register-page" style={{ padding: '50px' }}>

            <h3 style={{ textAlign: 'center' }}>Đăng ký người dùng mới</h3>
            <Divider />
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                style={{ maxWidth: 600, margin: '0 auto' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'fullname không được để trống' }]}
                >
                    <Input />
                </Form.Item>


                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'email không được để trống!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'password không được để trống!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'phone không được để trống!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterPage;