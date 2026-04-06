import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Breadcrumb
                    style={{ margin: '6px 16px', fontSize: '18px' }}
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
                        }
                    ]}
                />
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    Contact Page
                </div>
            </div>
        </div>
    )
}

export default ContactPage