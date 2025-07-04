import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { useParams } from 'react-router-dom';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (imagePath) => {
    if (!imagePath) return '/default-news.jpg';
    return `${BACKEND_URL}/${imagePath
        .replace(/^src[\\/]+public[\\/]+/, '')
        .replace(/\\/g, '/')}`;
};

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`/api/v1/news/${id}`);
                if (res.EC === 0) {
                    setNews(res.DT);
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchDetail();
    }, [id]);

    if (!news) return <div className="text-center my-5">Đang tải...</div>;

    return (
        <div className="container news-detail-page">
            <div className="card p-4 mb-4 shadow">
                <div className="row align-items-center">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                        <img
                            src={buildImgSrc(news.image)}
                            alt={news.title}
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-md-9">
                        <h2 className="fw-bold">{news.title}</h2>
                        <p className="text-muted mb-1">Loại tin: {news.NewsCategory?.name || 'N/A'}</p>
                        <p className="text-muted mb-1">Trạng thái: {news.status || 'N/A'}</p>
                        <p className="text-muted">Ngày đăng: {new Date(news.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="card p-4 shadow-sm mb-5">
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: news.content || 'Không có nội dung' }} />
            </div>
        </div>
    );
};

export default NewsDetail;

