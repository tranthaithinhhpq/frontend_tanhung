import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from '../../../setup/axios';
import '../../Admin/Doctor/Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const DeviceGallery = () => {
    const [devices, setDevices] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await axios.get('/api/v1/device/read');
                if (res.EC === 0) {
                    setDevices(res.DT);
                }
            } catch (err) {
                console.error('Error fetching devices:', err);
            }
        };

        fetchDevices();
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4">Danh sách trang thiết bị</h2>
            <Row>
                {devices.map((device) => (
                    <Col md={3} key={device.id} className="mb-4">
                        <Card
                            className="h-100 shadow-sm cursor-pointer"
                            onClick={() => history.push(`/device/${device.id}`)}
                        >
                            <Card.Img
                                variant="top"
                                src={`${BACKEND_URL}${device.image}`}
                                style={{ aspectRatio: '3 / 2', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{device.name}</Card.Title>
                                <Card.Text>{device.category}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DeviceGallery;