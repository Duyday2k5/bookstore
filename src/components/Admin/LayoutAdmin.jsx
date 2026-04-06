import React, { useState } from 'react';
import {
    DashboardOutlined,
    BookOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import './layout.scss';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../services/api';
import { doLogoutAction } from '../../redux/account/accountSlice';
import ManageAccount from '../Account/ManageAccount';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showManageAccount, setShowManageAccount] = useState(false);
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const menuItems = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: '/admin',
            icon: <DashboardOutlined />,
        },
        {
            label: <Link to='/admin/user'>Users</Link>,
            key: '/admin/user',
            icon: <UserOutlined />,
        },
        {
            label: <Link to='/admin/book'>Books</Link>,
            key: '/admin/book',
            icon: <BookOutlined />,
        },
        {
            label: <Link to='/admin/order'>Orders</Link>,
            key: '/admin/order',
            icon: <ShoppingCartOutlined />,
        },
    ];

    const userMenuItems = [
        {
            label: <span onClick={() => setShowManageAccount(true)}>Tài khoản</span>,
            key: 'account',
            icon: <SettingOutlined />,
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
            key: 'logout',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    // Get the current key based on location
    const getCurrentKey = () => {
        if (location.pathname === '/admin') return '/admin';
        if (location.pathname.includes('/admin/user')) return '/admin/user';
        if (location.pathname.includes('/admin/book')) return '/admin/book';
        if (location.pathname.includes('/admin/order')) return '/admin/order';
        return '/admin';
    }

    return (
        <>
            <Layout style={{ minHeight: '100vh' }} className="layout-admin">
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    width={250}
                    collapsedWidth={80}
                    breakpoint="lg"
                >
                    <div className='sidebar-logo'>
                        <div className='logo-icon'>📚</div>
                        {!collapsed && <div className='logo-text'>BookAdmin</div>}
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[getCurrentKey()]}
                        items={menuItems}
                    />
                </Sider>

                <Layout className='main-layout'>
                    <div className='admin-header'>
                        <div className='header-left'>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                className='menu-trigger'
                            />
                        </div>
                        <div className='header-right'>
                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }} className='user-space'>
                                    <Avatar src={urlAvatar} size="large" />
                                    <div className='user-info'>
                                        <div className='user-name'>{user?.fullName}</div>
                                        <div className='user-role'>Administrator</div>
                                    </div>
                                </Space>
                            </Dropdown>
                        </div>
                    </div>

                    <Content className='admin-content'>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>

            <ManageAccount
                isModalOpen={showManageAccount}
                setIsModalOpen={setShowManageAccount}
            />
        </>
    );
};

export default LayoutAdmin;