import { Form, Select, Input, Row, Col, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { doSetProvince, doSetDistrict, doSetWard, doSetStreet } from '../../redux/address/addressSlice';
import { useMemo } from 'react';

const AddressForm = () => {
    const dispatch = useDispatch();
    const address = useSelector(state => state.address);
    const [form] = Form.useForm();

    // Get available districts
    const availableDistricts = useMemo(() => {
        if (address.selectedProvince) {
            const provinceId = address.selectedProvince.id;
            return address.districts[provinceId] || [];
        }
        return [];
    }, [address.selectedProvince, address.districts]);

    // Get available wards
    const availableWards = useMemo(() => {
        if (address.selectedProvince && address.selectedDistrict) {
            const key = `${address.selectedProvince.id}_${address.selectedDistrict.id}`;
            return address.wards[key] || [];
        }
        return [];
    }, [address.selectedProvince, address.selectedDistrict, address.wards]);

    const handleProvinceChange = (value) => {
        const selected = address.provinces.find(p => p.id === value);
        dispatch(doSetProvince(selected));
    };

    const handleDistrictChange = (value) => {
        const selected = availableDistricts.find(d => d.id === value);
        dispatch(doSetDistrict(selected));
    };

    const handleWardChange = (value) => {
        const selected = availableWards.find(w => w.id === value);
        dispatch(doSetWard(selected));
    };

    const handleStreetChange = (e) => {
        const value = sanitizeInput(e.target.value);
        dispatch(doSetStreet(value));
    };

    // Build full address
    const fullAddress = useMemo(() => {
        const parts = [];
        if (address.street) parts.push(address.street);
        if (address.selectedWard) parts.push(address.selectedWard.name);
        if (address.selectedDistrict) parts.push(address.selectedDistrict.name);
        if (address.selectedProvince) parts.push(address.selectedProvince.name);
        return parts.join(', ');
    }, [address.street, address.selectedWard, address.selectedDistrict, address.selectedProvince]);

    return (
        <>
            <Alert
                message="Vui lòng chọn đầy đủ địa chỉ"
                description="Để đảm bảo giao hàng chính xác, vui lòng chọn tỉnh/thành phố, quận/huyện, phường/xã rồi nhập số nhà/ngõ/ngách."
                type="info"
                showIcon
                style={{ marginBottom: '15px' }}
            />

            <Form.Item
                labelCol={{ span: 24 }}
                label="Tỉnh/Thành phố"
                required
            >
                <Select
                    placeholder="-- Chọn Tỉnh/Thành phố --"
                    options={address.provinces.map(p => ({
                        label: p.name,
                        value: p.id
                    }))}
                    value={address.selectedProvince?.id || undefined}
                    onChange={handleProvinceChange}
                />
            </Form.Item>

            <Form.Item
                labelCol={{ span: 24 }}
                label="Quận/Huyện"
                required
            >
                <Select
                    placeholder="-- Chọn Quận/Huyện --"
                    options={availableDistricts.map(d => ({
                        label: d.name,
                        value: d.id
                    }))}
                    value={address.selectedDistrict?.id || undefined}
                    onChange={handleDistrictChange}
                    disabled={!address.selectedProvince}
                />
            </Form.Item>

            <Form.Item
                labelCol={{ span: 24 }}
                label="Phường/Xã"
                required
            >
                <Select
                    placeholder="-- Chọn Phường/Xã --"
                    options={availableWards.map(w => ({
                        label: w.name,
                        value: w.id
                    }))}
                    value={address.selectedWard?.id || undefined}
                    onChange={handleWardChange}
                    disabled={!address.selectedDistrict}
                />
            </Form.Item>

            <Form.Item
                labelCol={{ span: 24 }}
                label="Số nhà/Ngõ/Ngách"
                required
                rules={[
                    { required: true, message: 'Vui lòng nhập số nhà/ngõ/ngách!' },
                    { min: 1, message: 'Vui lòng nhập thông tin hợp lệ' }
                ]}
            >
                <Input
                    placeholder="Ví dụ: 123 Nguyễn Huệ, Tòa nhà ABC"
                    value={address.street}
                    onChange={handleStreetChange}
                    maxLength={100}
                />
            </Form.Item>

            {fullAddress && (
                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Địa chỉ đầy đủ"
                >
                    <div style={{
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9'
                    }}>
                        {fullAddress}
                    </div>
                </Form.Item>
            )}
        </>
    );
};

export default AddressForm;
