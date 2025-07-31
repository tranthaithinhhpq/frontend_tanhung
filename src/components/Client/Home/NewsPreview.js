import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import Slider from 'react-slick';
import { Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Home.scss';

// Mũi tên phải
const NextArrow = (props) => (
    <div className="custom-arrow next" onClick={props.onClick}>
        <i className="bi bi-chevron-right"></i>
    </div>
);

// Mũi tên trái
const PrevArrow = (props) => (
    <div className="custom-arrow prev" onClick={props.onClick}>
        <i className="bi bi-chevron-left"></i>
    </div>
);

const NewsPreview = () => {
    const [topNews, setTopNews] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get('/api/v1/client/news-preview');
                if (res.EC === 0 && res.DT?.news) {
                    setTopNews(res.DT.news);
                }
            } catch (err) {
                console.error('Lỗi lấy tin tức:', err);
            }
        };
        fetchNews();
    }, []);



    const getImageUrl = (path) => {
        if (!path) return '/default-news.jpg';
        if (path.startsWith('/images')) {
            return `${process.env.REACT_APP_BACKEND_URL}${path}`;
        }
        return `${process.env.REACT_APP_BACKEND_URL}/images/${path}`;
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1, // 👈 bằng với slidesToShow
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1 // 👈 tương ứng
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Tin tức</h3>
                <button className="btn btn-outline-dark" onClick={() => history.push('/news')}>
                    Xem tất cả
                </button>
            </div>

            <Slider {...settings}>
                {topNews.map(item => (
                    <div key={item.id} className="px-2">
                        <Card className="news-card" onClick={() => history.push(`/news/${item.id}`)} style={{ cursor: 'pointer' }}>
                            <Card.Img variant="top" src={getImageUrl(item.image)} />
                            <Card.Body>
                                <Card.Title style={{ fontSize: '1rem' }}>{item.title}</Card.Title>
                                <Card.Text style={{ fontSize: '0.85rem' }}>
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

export default NewsPreview;

