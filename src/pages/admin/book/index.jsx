import BookTable from "../../../components/Admin/Book/BookTable";
import { Card } from "antd";
import { BookOutlined } from "@ant-design/icons";

const ManageBookPage = () => {
    return (
        <div className="manage-page">
            <div className="page-header">
                <h1><BookOutlined /> Manage Books</h1>
                <p>Create, read, update and delete books</p>
            </div>
            <Card bordered={false} className="table-card">
                <BookTable />
            </Card>
        </div>
    )
}

export default ManageBookPage;