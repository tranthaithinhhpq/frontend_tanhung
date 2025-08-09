import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from '../../../setup/axios';
import './SpecialtyGallery.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const SpecialtyGallery = () => {
    const [specialties, setSpecialties] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get('/api/v1/specialty/read').then(res => {
            if (res.EC === 0) setSpecialties(res.DT);
        });
    }, []);

    return (
        <div className="container-xxl py-4 ">
            <h4 className="mb-4">Danh sách khoa phòng</h4>
            <div className="row g-2 row-cols-3 row-cols-sm-4 row-cols-lg-6 row-cols-xxl-8 justify-content-center">
                {specialties
                    .slice() // tạo bản sao để không thay đổi mảng gốc
                    .sort((a, b) => a.displayOrder - b.displayOrder) // sắp xếp id từ bé đến lớn
                    .map(sp => (
                        <div className="col" key={sp.displayOrder}>
                            <div
                                className="specialty-wrapper"
                                onClick={() => history.push(`/specialty/${sp.id}`)}
                            >
                                <Card className="specialty-card">
                                    <Card.Img
                                        variant="top"
                                        src={`${BACKEND_URL}${sp.image}`}
                                        className="card-img-top"
                                    />
                                </Card>
                                <div className="specialty-name">{sp.name}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default SpecialtyGallery;
