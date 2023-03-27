import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const UserModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;

    return (
        <>

            <Modal
                title="Basic Modal"
                open={openModalCreate}
                onOk={() => setOpenModalCreate(false)}
                onCancel={() => setOpenModalCreate(false)}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
};

export default UserModalCreate;