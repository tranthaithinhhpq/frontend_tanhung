

import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';


const RecruitmentList = () => {
    const [recruitments, setRecruitments] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const history = useHistory();

    // Lấy danh sách tin tuyển dụng
    const fetchRecruitments = async (specialtyId = null) => {
        try {
            let url = '/api/v1/client/recruitment';
            if (specialtyId) url += `?specialtyId=${specialtyId}`;
            const res = await axios.get(url);
            if (res.EC === 0) {
                setRecruitments(res.DT || []);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error('Lỗi tải danh sách tuyển dụng');
        }
    };

    // Lấy danh sách chuyên khoa
    const fetchSpecialties = async () => {
        try {
            const res = await axios.get('/api/v1/specialty/read?page=1&limit=100');
            if (res.EC === 0) {
                setSpecialties(res.DT || []);
            }
        } catch {
            toast.error('Lỗi tải danh sách khoa phòng');
        }
    };

    useEffect(() => {
        fetchRecruitments();
        fetchSpecialties();
    }, []);

    const handleFilter = (opt) => {
        setSelectedSpecialty(opt);
        fetchRecruitments(opt ? opt.value : null);
    };

    const isExpiredOrClosed = (deadline, status) => {
        const today = new Date().toISOString().split('T')[0];
        return status === 'CLOSED' || (deadline && deadline < today);
    };

    return (
        <div className="container my-4">
            <h3 className="mb-4">Vị trí tuyển dụng</h3>

            <div className="mb-3" style={{ maxWidth: 400 }}>
                <Select
                    options={specialties.map(s => ({ value: s.id, label: s.name }))}
                    value={selectedSpecialty}
                    onChange={handleFilter}
                    isClearable
                    placeholder="Lọc theo khoa phòng..."
                />
            </div>

            <Row>
                {recruitments.length > 0 ? recruitments.map(item => {
                    const expired = isExpiredOrClosed(item.deadline, item.status);
                    return (
                        <Col md={4} key={item.id} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                {item.image && (
                                    <Card.Img
                                        variant="top"
                                        src={`${BACKEND_URL}${item.image}`}
                                        alt={item.title}
                                        style={{ objectFit: 'cover', height: '200px' }}
                                    />
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Hạn nộp:</strong> {item.deadline || 'Không có'}
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <Button
                                            variant={expired ? 'secondary' : 'primary'}
                                            disabled={expired}
                                            onClick={() => history.push(`/recruitment/${item.id}`)}

                                        >
                                            {expired ? 'Đang tạm dừng' : 'Chi tiết'}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                }) : (
                    <Col>
                        <p className="text-center">Không có tin tuyển dụng nào.</p>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default RecruitmentList;
