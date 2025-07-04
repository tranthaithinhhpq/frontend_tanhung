import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import { useHistory } from 'react-router-dom';
import './Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (raw) => {
    if (!raw) return '';
    if (raw.startsWith('http')) return raw;
    return `${BACKEND_URL}${raw}`;
};

const DoctorGallery = () => {
    const [doctors, setDoctors] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('/api/v1/doctor-gallery');
                if (res.EC === 0) {
                    setDoctors(res.DT);
                } else {
                    toast.error(res.EM || 'Lỗi không xác định');
                }
            } catch (err) {
                console.error('Fetch doctor gallery error:', err);
                toast.error('Lỗi tải danh sách bác sĩ');
            }
        };

        fetchDoctors();
    }, []);

    const truncateContent = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <div className="container py-4 doctor-gallery">
            <Row>
                {doctors.map((doc) => (
                    <Col key={doc.id} lg={3} md={4} sm={6} xs={12} className="mb-4">
                        <Card className="h-100">
                            <Card.Img
                                variant="top"
                                src={buildImgSrc(doc.image)}
                                className="doctor-card-img"
                            />
                            <Card.Body>
                                <Card.Title>{doc.username}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {doc.DoctorInfo?.Position?.name || 'N/A'} | {doc.DoctorInfo?.Degree?.name || 'N/A'}
                                </Card.Subtitle>
                                <Card.Text>
                                    <strong>Chuyên khoa:</strong> {doc.DoctorInfo?.Specialty?.name || 'N/A'}
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => history.push(`/doctor/detail/${doc.id}`)}
                                >
                                    Xem chi tiết
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DoctorGallery;
