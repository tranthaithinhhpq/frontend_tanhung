import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import axios from '../../../setup/axios';
import '../../Admin/Doctor/Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const SpecialtyDetailPage = () => {
    const { id } = useParams();
    const [specialty, setSpecialty] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchSpecialty = async () => {
            const res = await axios.get('/api/v1/specialty/read');
            const item = res.DT.find(x => x.id === +id);
            if (item) setSpecialty(item);
        };
        const fetchDoctors = async () => {
            const res = await axios.get(`/api/v1/doctor/by-specialty/${id}`);
            if (res.EC === 0) setDoctors(res.DT);
        };
        fetchSpecialty();
        fetchDoctors();
    }, [id]);

    if (!specialty) return <div className="text-center my-5">Loading...</div>;

    return (
        <div className="container doctor-detail-page py-4">
            {/* Card giới thiệu chuyên khoa */}
            <div className="card p-4 mb-4 shadow">
                <div className="row align-items-center">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                        <img
                            src={`${BACKEND_URL}${specialty.image}`}
                            alt={specialty.name}
                            className="doctor-img rounded"
                        />
                    </div>
                    <div className="col-md-9">
                        <h2 className="fw-bold">{specialty.name}</h2>
                        <p className="text-muted">{specialty.description}</p>
                    </div>
                </div>
            </div>

            {/* Card markdown content */}
            <div className="card p-4 shadow-sm mb-5">
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: specialty.markdownContent || 'Không có nội dung' }} />
            </div>

            {/* Danh sách bác sĩ */}
            <h4 className="mb-3">Bác sĩ thuộc chuyên khoa này</h4>
            <Row>
                {doctors.map(doc => (
                    <Col key={doc.id} md={3} className="mb-3">
                        <Card className="h-100 shadow-sm">
                            <Card.Img
                                src={`${BACKEND_URL}${doc.image}`}
                                className="doctor-card-img"
                                alt={doc.doctorName}
                            />
                            <Card.Body>
                                <Card.Title>{doc.doctorName}</Card.Title>
                                <Card.Text>{doc.Position?.name} - {doc.Degree?.name}</Card.Text>
                                <div className="d-flex justify-content-between">
                                    <Button variant="success" size="sm">Đặt lịch</Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => history.push(`/doctor/detail/${doc.id}`)}
                                    >
                                        Chi tiết
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="text-center mt-3">
                <Button variant="outline-dark">Xem tất cả</Button>
            </div>
        </div>
    );
};

export default SpecialtyDetailPage;
