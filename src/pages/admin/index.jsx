import { Card, Col, Row, Statistic, Button, Skeleton } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import { callFetchDashboard } from "../../services/api";
import { TeamOutlined, ShoppingCartOutlined, BookOutlined, DollarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import './admin.scss';

const AdminPage = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initDashboard = async () => {
            setLoading(true);
            try {
                const res = await callFetchDashboard();
                if (res && res.data) {
                    setDataDashboard(res.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            } finally {
                setLoading(false);
            }
        }
        initDashboard();
    }, []);

    const formatter = (value) => <CountUp end={value} separator="," />;

    const statsCards = [
        {
            title: 'Total Users',
            value: dataDashboard.countUser,
            icon: <TeamOutlined />,
            color: '#667eea',
            path: '/admin/user'
        },
        {
            title: 'Total Orders',
            value: dataDashboard.countOrder,
            icon: <ShoppingCartOutlined />,
            color: '#764ba2',
            path: '/admin/order'
        },
        {
            title: 'Total Books',
            value: dataDashboard.countUser,
            icon: <BookOutlined />,
            color: '#f093fb',
            path: '/admin/book'
        },
        {
            title: 'Total Revenue',
            value: dataDashboard.countOrder * 100,
            icon: <DollarOutlined />,
            color: '#4facfe',
            path: '/admin'
        }
    ];

    if (loading) {
        return (
            <Row gutter={[24, 24]} className="dashboard-container">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Col xs={24} sm={12} lg={6} key={i}>
                        <Skeleton active />
                    </Col>
                ))}
            </Row>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome to your admin panel</p>
            </div>

            <Row gutter={[24, 24]} className="stats-grid">
                {statsCards.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Link to={stat.path} style={{ textDecoration: 'none' }}>
                            <Card
                                className="stat-card"
                                bordered={false}
                                hoverable
                                style={{
                                    borderLeft: `4px solid ${stat.color}`,
                                    overflow: 'hidden'
                                }}
                            >
                                <div className="stat-content">
                                    <div className="stat-icon" style={{ background: stat.color }}>
                                        {stat.icon}
                                    </div>
                                    <div className="stat-info">
                                        <Statistic
                                            title={stat.title}
                                            value={stat.value}
                                            formatter={formatter}
                                            valueStyle={{ color: stat.color, fontSize: '24px', fontWeight: '700' }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col xs={24}>
                    <Card
                        title="Quick Actions"
                        bordered={false}
                        className="quick-actions"
                    >
                        <Row gutter={[12, 12]}>
                            <Col xs={24} sm={12} md={6}>
                                <Link to="/admin/user">
                                    <Button type="primary" block size="large">
                                        Manage Users
                                    </Button>
                                </Link>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Link to="/admin/book">
                                    <Button type="primary" block size="large">
                                        Manage Books
                                    </Button>
                                </Link>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Link to="/admin/order">
                                    <Button type="primary" block size="large">
                                        Manage Orders
                                    </Button>
                                </Link>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Button type="default" block size="large">
                                    View Reports
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdminPage;