import UserTable from "../../../components/Admin/User/UserTable";
import { Card } from "antd";
import { TeamOutlined } from "@ant-design/icons";

const ManageUserPage = () => {
    return (
        <div className="manage-page">
            <div className="page-header">
                <h1><TeamOutlined /> Manage Users</h1>
                <p>Create, read, update and delete users</p>
            </div>
            <Card bordered={false} className="table-card">
                <UserTable />
            </Card>
        </div>
    )
}

export default ManageUserPage;