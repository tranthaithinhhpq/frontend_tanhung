import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../setup/axios';
import '../../Admin/Doctor/Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const DeviceDetailPage = () => {
    const { id } = useParams();
    const [device, setDevice] = useState(null);

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const res = await axios.get('/api/v1/device/read');
                const found = res.DT.find((item) => item.id === +id);
                if (found) setDevice(found);
            } catch (err) {
                console.error('Error fetching device detail:', err);
            }
        };

        fetchDevice();
    }, [id]);

    if (!device) return <div className="text-center my-5">Đang tải thông tin...</div>;

    return (
        <div className="container py-4">
            <div className="card p-4 shadow mb-4">
                <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                        <img
                            src={`${BACKEND_URL}${device.image}`}
                            alt={device.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: 300, objectFit: 'contain' }}
                        />
                    </div>
                    <div className="col-md-8">
                        <h2>{device.name}</h2>
                        <p className="text-muted mb-2">Mã: {device.code}</p>
                        <p className="text-muted">Phân loại: {device.category}</p>
                    </div>
                </div>
            </div>

            <div className="card p-4 shadow">
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: device.markdownContent }} />
            </div>
        </div>
    );
};

export default DeviceDetailPage;