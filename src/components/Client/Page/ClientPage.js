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
        <div className="client-page container py-5">
            <h1 className="mb-4">{page.title}</h1>
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
    );
};

export default ClientPage;


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../../../setup/axios';
// import parse from 'html-react-parser';

// const ClientPage = () => {
//     const { slug } = useParams();
//     const [page, setPage] = useState(null);

//     useEffect(() => {
//         const fetchPage = async () => {
//             try {
//                 const res = await axios.get(`/api/v1/client/page/${slug}`);
//                 console.log("res.data ", res.data)

//                 setPage(res.data);
//             } catch (error) {
//                 console.error("Failed to load page", error);
//             }
//         };
//         fetchPage();
//     }, [slug]);

//     if (!page) return <div className="container py-5 text-danger">Không tìm thấy nội dung.</div>;

//     return (
//         <div className="container py-5">
//             <h2 className="mb-4">{page.title}</h2>
//             <div>{parse(page.contentThumbnail)}</div>
//             {page.videoYoutubeId &&
//                 <div className="mt-4">
//                     <iframe
//                         width="100%"
//                         height="450"
//                         src={`https://www.youtube.com/embed/${page.videoYoutubeId}`}
//                         frameBorder="0"
//                         allowFullScreen
//                         title="Video"
//                     ></iframe>
//                 </div>
//             }
//         </div>
//     );
// };

// export default ClientPage;
