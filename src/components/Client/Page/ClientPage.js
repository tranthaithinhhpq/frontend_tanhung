// src/components/Client/ClientPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../setup/axios';
// import './ClientPage.scss';

const ClientPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    const buildImgSrc = (imagePath) => {
        if (!imagePath) return '/default-page.jpg';
        return encodeURI(`${BACKEND_URL}${imagePath}`);
    };

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await axios.get(`/api/v1/client/page/${slug}`);
                console.log("res ", res);
                if (res.EC === 0) {
                    setPage(res.DT);
                } else {
                    setError(res.EM || 'Không tìm thấy nội dung.');
                }
            } catch (err) {
                setError('Lỗi kết nối máy chủ.');
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    if (loading) return <div className="client-page container py-5">Đang tải...</div>;
    if (error) return <div className="client-page container py-5 text-danger">{error}</div>;

    return (

        <>
            <div className="card p-4 mb-4 text-white" style={{ backgroundColor: '#343A40' }}>
                <div className="row align-items-center">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                        <img
                            src={buildImgSrc(page.image)}
                            alt={page.title}
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-md-9">
                        <h2 className="fw-bold">{page.title}</h2>

                        <p className="text-white">Ngày đăng: {new Date(page.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="client-page container py-5">
                {/* <h1 className="mb-4">{page.title}</h1> */}
                {page.videoYoutubeId && (
                    <div className="mb-4">
                        <iframe
                            width="100%"
                            height="400"
                            src={`https://www.youtube.com/embed/${page.videoYoutubeId}`}
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                <div className="page-content" dangerouslySetInnerHTML={{ __html: page.contentThumbnail }}></div>
            </div>
        </>
    );
};

export default ClientPage;
