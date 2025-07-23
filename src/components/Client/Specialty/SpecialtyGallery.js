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
        <div className="container py-4">
            <h4 className="mb-4">Danh sách chuyên khoa</h4>
            <Row>
                {specialties.map(sp => (
                    <Col key={sp.id} lg={3} md={4} sm={6} xs={12} className="mb-4">
                        <Card
                            className="specialty-card h-100"
                            onClick={() => history.push(`/specialty/${sp.id}`)}
                        >
                            <Card.Img
                                variant="top"
                                src={`${BACKEND_URL}${sp.image}`}
                                className="card-img-top"
                            />
                            <Card.Body>
                                <Card.Title>{sp.name}</Card.Title>
                                <Card.Text>{sp.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SpecialtyGallery;
