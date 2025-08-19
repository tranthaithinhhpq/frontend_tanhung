

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Container } from 'react-bootstrap';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import axios from '../../../setup/axios';
import './Doctor.scss';

const DoctorGallery = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [degreeOptions, setDegreeOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const [filters, setFilters] = useState({ degreeId: null, specialtyId: null, positionId: null });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const limit = 8;

    const fetchDoctors = async () => {
        try {
            const params = {
                page: page + 1,
                limit,
                search: search || undefined,
                degreeId: filters.degreeId?.value,
                specialtyId: filters.specialtyId?.value,
                positionId: filters.positionId?.value
            };

            const res = await axios.get('/api/v1/doctor/list', { params });
            if (res.EC === 0 && res.DT?.doctors) {
                setDoctors(res.DT.doctors);
                setTotalPages(res.DT.totalPages || 0);
            } else {
                setDoctors([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFilters = async () => {
        const [dRes, sRes, pRes] = await Promise.all([
            axios.get('/api/v1/degree/read'),
            axios.get('/api/v1/specialty/read'),
            axios.get('/api/v1/position/read')
        ]);
        setDegreeOptions(dRes.DT.map(d => ({ value: d.id, label: d.name })));
        setSpecialtyOptions(sRes.DT.map(s => ({ value: s.id, label: s.name })));
        setPositionOptions(pRes.DT.map(p => ({ value: p.id, label: p.name })));
    };

    useEffect(() => {
        fetchFilters();
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [search, filters, page]);

    const handlePageChange = (selected) => {
        setPage(selected.selected);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // cuộn về đầu mượt mà
    };

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    const buildImgSrc = (raw) => (!raw ? '' : raw.startsWith('http') ? raw : `${BACKEND_URL}${raw}`);

    return (
        <Container className="doctor-gallery py-4">
            <Row className="mb-3">
                <Col md={3}><Form.Control type="text" placeholder="Tìm theo tên" value={search} onChange={e => setSearch(e.target.value)} /></Col>
                <Col md={3}><Select options={positionOptions} placeholder="Chức vụ" isClearable onChange={val => setFilters(prev => ({ ...prev, positionId: val }))} /></Col>
                <Col md={3}><Select options={degreeOptions} placeholder="Học vị" isClearable onChange={val => setFilters(prev => ({ ...prev, degreeId: val }))} /></Col>
                <Col md={3}><Select options={specialtyOptions} placeholder="Chuyên khoa" isClearable onChange={val => setFilters(prev => ({ ...prev, specialtyId: val }))} /></Col>
            </Row>

            {doctors.length === 0 ? (
                <div className="text-center">Không có bác sĩ nào phù hợp</div>
            ) : (
                <Row>
                    {doctors.map((doc) => (
                        <Col key={doc.id} lg={3} md={4} sm={6} xs={12} className="mb-4">
                            <Card className="h-100">
                                <Card.Img variant="top" src={buildImgSrc(doc.image)} className="doctor-card-img" />
                                <Card.Body>
                                    <Card.Title>{doc.doctorName}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {doc.Position?.name || 'N/A'} | {doc.Degree?.name || 'N/A'}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        <strong>Chuyên khoa:</strong> {doc.Specialty?.name || 'N/A'}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between mt-3">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => window.location.href = `/doctor/detail/${doc.id}`}
                                        >
                                            Xem chi tiết
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => window.location.href = `/booking/${doc.id}`}
                                        >
                                            Đặt lịch khám
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <ReactPaginate
                        previousLabel={'←'}
                        nextLabel={'→'}
                        breakLabel={'...'}
                        pageCount={totalPages}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination-doctor-card'}
                        activeClassName={'active'}
                        forcePage={page}
                    />
                </div>
            )}
        </Container>
    );
};

export default DoctorGallery;

