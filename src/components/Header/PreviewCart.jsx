import { Dropdown } from "antd";

const PreviewCart = (props) => {

    //build items with hardcode
    const items = [
        {
            key: '1',
            type: 'group',
            label: 'Sản phẩm mới thêm',
            children: [
                {
                    key: '1-1',
                    label: '1st menu item',
                },
                {
                    key: '1-2',
                    label: '2nd menu item',
                },
            ],
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
        }
    ];


    //build dynamic items

    return (
        <Dropdown
            menu={{ items }}
            placement="topRight"
            arrow={{ pointAtCenter: true }}
            overlayStyle={{ width: 500 }}
        >
            {props.children}
        </Dropdown>
    )
}

export default PreviewCart;