

// FRONTEND: src/components/Client/Preview/MedicinePreview.js
import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import Slider from 'react-slick';
import { Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../News/NewsList.scss'; // ✅ dùng chung với NewsList
import './Home.scss';           // (giữ lại nếu đang dùng cho arrow)

const NextArrow = (props) => (
    <div className="custom-arrow next" onClick={props.onClick}>
        <i className="bi bi-chevron-right"></i>
    </div>
);
const PrevArrow = (props) => (
    <div className="custom-arrow prev" onClick={props.onClick}>
        <i className="bi bi-chevron-left"></i>
    </div>
);

const MedicinePreview = () => {
    const [articles, setArticles] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchMedicineArticles = async () => {
            try {
                const res = await axios.get('/api/v1/client/news-preview', { params: { group: 'medicine' } });
                if (res.EC === 0 && res.DT?.news) setArticles(res.DT.news);
            } catch (err) { console.error('Lỗi lấy thông tin thuốc:', err); }
        };
        fetchMedicineArticles();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return '/default-news.jpg';
        if (path.startsWith('/images')) return `${process.env.REACT_APP_BACKEND_URL}${path}`;
        return `${process.env.REACT_APP_BACKEND_URL}/images/${path}`;
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Thông tin thuốc</h3>
                <button className="btn btn-outline-dark" onClick={() => history.push('/medicine-info')}>
                    Xem tất cả
                </button>
            </div>

            <Slider {...settings} className="news-slider">
                {articles.map(item => (
                    <div key={item.id} className="px-2 slide-item">
                        <Card className="news-card w-100 h-100 d-flex flex-column" onClick={() => history.push(`/news/${item.id}`)} style={{ cursor: 'pointer' }}>
                            <div className="thumb-wrap">
                                <Card.Img variant="top" className="card-img-top" src={getImageUrl(item.image)} alt={item.title} />
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="title" style={{ fontSize: '1rem' }}>
                                    {item.title}
                                </Card.Title>
                                <Card.Text className="date mt-auto" style={{ fontSize: '0.85rem' }}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default MedicinePreview;
