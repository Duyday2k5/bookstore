import { Badge, Descriptions, Divider, Space, Table, Tag, Modal, Image, Row, Col, Card } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { callOrderHistory, callFetchBookById } from "../../services/api";
import { FORMAT_DATE_DISPLAY } from "../../utils/constant";
import { EyeOutlined } from '@ant-design/icons';

const History = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [bookDetails, setBookDetails] = useState({});

    const STATUS_MAP = {
        'completed': { color: 'green', text: 'Đã hoàn thành' },
    };

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await callOrderHistory();
            if (res && res.data) {
                setOrderHistory(res.data);
            }
        }
        fetchHistory();
    }, []);

    const getStatusDisplay = (status) => {
        const statusInfo = STATUS_MAP[status] || STATUS_MAP['completed'];
        return (
            <Tag color={statusInfo.color}>
                {statusInfo.text}
            </Tag>
        );
    };

    const handleViewDetail = async (record) => {
        setSelectedOrder(record);
        setIsModalOpen(true);

        // Fetch book details cho những item không có thumbnail
        if (record.detail && record.detail.length > 0) {
            const missingDetails = record.detail.filter(item => !item.thumbnail && item._id);

            if (missingDetails.length > 0) {
                const fetchPromises = missingDetails.map(item =>
                    callFetchBookById(item._id)
                        .then(res => ({ id: item._id, data: res.data }))
                        .catch(err => ({ id: item._id, data: null }))
                );

                const results = await Promise.all(fetchPromises);
                const newBookDetails = {};
                results.forEach(result => {
                    if (result.data) {
                        newBookDetails[result.id] = result.data;
                    }
                });

                setBookDetails(prev => ({ ...prev, ...newBookDetails }));
            }
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Thời gian ',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return moment(item).format(FORMAT_DATE_DISPLAY)
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                const price = record.finalTotal || record.totalPrice || 0;
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => getStatusDisplay(status)
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <a onClick={() => handleViewDetail(record)} style={{ color: '#1890ff', cursor: 'pointer' }}>
                    <EyeOutlined /> Xem chi tiết
                </a>
            ),
        },
    ];


    return (
        <div >
            <div style={{ margin: "15px 0" }}>Lịch sử đặt hàng:</div>
            <Table columns={columns} dataSource={orderHistory} pagination={false} />

            <Modal
                title="Chi tiết đơn hàng"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Mã đơn hàng" span={2}>
                                {selectedOrder._id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt">
                                {moment(selectedOrder.createdAt).format(FORMAT_DATE_DISPLAY)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                {getStatusDisplay(selectedOrder.status)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền" span={2}>
                                <strong style={{ color: '#ff4d4f', fontSize: '16px' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.finalTotal || selectedOrder.totalPrice || 0)}
                                </strong>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Danh sách sản phẩm</Divider>

                        {selectedOrder.detail && selectedOrder.detail.map((item, index) => {
                            // Lấy thông tin sách từ API nếu có
                            const bookInfo = bookDetails[item._id];

                            // Sử dụng giá và ảnh từ item (đơn mới) hoặc từ API (đơn cũ)
                            const itemQty = item.quantity || 1;
                            const itemPrice = item.price || bookInfo?.price || (() => {
                                const totalItems = selectedOrder.detail.reduce((sum, i) => sum + (i.quantity || 0), 0);
                                return totalItems > 0 ? (selectedOrder.totalPrice || selectedOrder.finalTotal || 0) / totalItems : 0;
                            })();
                            const itemThumbnail = item.thumbnail || bookInfo?.thumbnail;

                            return (
                                <Card
                                    key={index}
                                    style={{ marginBottom: 16 }}
                                    bodyStyle={{ padding: 12 }}
                                >
                                    <Row gutter={16} align="middle">
                                        <Col span={4}>
                                            <Image
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${itemThumbnail || 'default.jpg'}`}
                                                alt={item.bookName || item.name}
                                                style={{ width: '100%', borderRadius: 4 }}
                                                fallback="data:image/png;base64,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"
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 8 }}>
                                                {item.bookName || item.name || 'Sản phẩm'}
                                            </div>
                                            <div style={{ color: '#8c8c8c' }}>
                                                Số lượng: <strong>{item.quantity || 1}</strong>
                                            </div>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'right' }}>
                                            <div style={{ color: '#595959', fontSize: 13, marginBottom: 4 }}>
                                                Đơn giá
                                            </div>
                                            <div style={{ color: '#ff4d4f', fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemPrice)}
                                            </div>
                                            <Divider style={{ margin: '8px 0' }} />
                                            <div style={{ color: '#595959', fontSize: 13, marginBottom: 4 }}>
                                                Thành tiền
                                            </div>
                                            <div style={{ color: '#ff4d4f', fontSize: 18, fontWeight: 600 }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemPrice * itemQty)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default History;