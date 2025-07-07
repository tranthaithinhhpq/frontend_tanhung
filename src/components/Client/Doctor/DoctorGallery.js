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
                const res = await axios.get('/api/v1/doctor/list');
                if (res.EC === 0) {
                    console.log('Doctors data:', res.DT);
                    // Xử lý tùy theo structure trả về
                    if (Array.isArray(res.DT)) {
                        setDoctors(res.DT);
                    } else if (res.DT.doctors) {
                        setDoctors(res.DT.doctors);
                    } else {
                        toast.error('Dữ liệu trả về không hợp lệ');
                    }
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

    return (
        <div className="container py-4 doctor-gallery">
            {doctors.length === 0 ? (
                <div className="text-center">Không có bác sĩ nào để hiển thị</div>
            ) : (
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
                                    <Card.Title>{doc.doctorName}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {doc.Position?.name || 'N/A'} | {doc.Degree?.name || 'N/A'}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        <strong>Chuyên khoa:</strong> {doc.Specialty?.name || 'N/A'}
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
            )}
        </div>
    );
};

export default DoctorGallery;
