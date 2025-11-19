import MangeOrder from "../../../components/Admin/Order/MangeOrder";
import { Card } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const AdminOrderPage = () => {
    return (
        <div className="manage-page">
            <div className="page-header">
                <h1><ShoppingCartOutlined /> Manage Orders</h1>
                <p>View and manage customer orders</p>
            </div>
            <Card bordered={false} className="table-card">
                <MangeOrder />
            </Card>
        </div>
    )
}

export default AdminOrderPage;