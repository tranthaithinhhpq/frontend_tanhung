import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`/api/v1/news/${id}`);
                if (res.EC === 0) {
                    setNews(res.DT);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchDetail();
    }, [id]);

    const buildImageUrl = (imagePath) => {
        if (!imagePath) return '/default-news.jpg';
        return `${process.env.REACT_APP_BACKEND_URL}/${imagePath
            .replace(/^src[\\/]+public[\\/]+/, '')
            .replace(/\\/g, '/')}`;
    };

    if (!news) return <div className="container my-4">Đang tải...</div>;

    return (
        <div className="container my-4">
            <Card>
                <Card.Img variant="top" src={buildImageUrl(news.image)} />
                <Card.Body>
                    <Card.Title>{news.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        Loại tin: {news.NewsCategory?.name} | Trạng thái: {news.status}
                    </Card.Subtitle>
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                </Card.Body>
            </Card>
        </div>
    );
};

export default NewsDetail;
