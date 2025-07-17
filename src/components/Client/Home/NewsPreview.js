// // import React, { useEffect, useState } from 'react';
// // import { Row, Col, Card, Button } from 'react-bootstrap';
// // import axios from '../../../setup/axios';
// // import { useHistory } from 'react-router-dom';

// // const NewsSliderPreview = () => {
// //     const [news, setNews] = useState([]);
// //     const [page, setPage] = useState(1);
// //     const [total, setTotal] = useState(0);
// //     const limit = 4;
// //     const history = useHistory();

// //     const fetchNews = async (pageNumber) => {
// //         try {
// //             const res = await axios.get('/api/v1/client/news/preview', {
// //                 params: { page: pageNumber, limit }
// //             });
// //             if (res.EC === 0) {
// //                 setNews(res.DT.news);
// //                 setTotal(res.DT.total);
// //                 setPage(res.DT.page);
// //             }
// //         } catch (err) {
// //             console.error(err);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchNews(page);
// //     }, []);

// //     const getImageUrl = (path) => {
// //         if (!path) return '/default-news.jpg';
// //         return `${process.env.REACT_APP_BACKEND_URL}/${path.replace(/^src[\\/]+public[\\/]+/, '').replace(/\\/g, '/')}`;
// //     };

// //     return (
// //         <div className="container my-5">
// //             <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <h3 className="mb-0">Tin tức</h3>
// //                 <Button variant="outline-dark" onClick={() => history.push('/news')}>
// //                     Xem tất cả
// //                 </Button>
// //             </div>

// //             <Row className="position-relative">
// //                 {news.map(item => (
// //                     <Col md={3} sm={6} xs={12} key={item.id} className="mb-4">
// //                         <Card className="news-card h-100" onClick={() => history.push(`/news/${item.id}`)} style={{ cursor: 'pointer' }}>
// //                             <Card.Img variant="top" src={getImageUrl(item.image)} />
// //                             <Card.Body>
// //                                 <Card.Title style={{ fontSize: '1rem' }}>{item.title}</Card.Title>
// //                                 <Card.Text style={{ fontSize: '0.85rem' }}>{new Date(item.createdAt).toLocaleDateString()}</Card.Text>
// //                             </Card.Body>
// //                         </Card>
// //                     </Col>
// //                 ))}

// //                 <div className="d-flex justify-content-between mt-3">
// //                     <Button
// //                         variant="light"
// //                         disabled={page === 1}
// //                         onClick={() => fetchNews(page - 1)}
// //                     >
// //                         &larr;
// //                     </Button>
// //                     <Button
// //                         variant="light"
// //                         disabled={page * limit >= total}
// //                         onClick={() => fetchNews(page + 1)}
// //                     >
// //                         &rarr;
// //                     </Button>
// //                 </div>
// //             </Row>
// //         </div>
// //     );
// // };

// // export default NewsSliderPreview;


// import React, { useEffect, useState } from 'react';
// import axios from '../../../setup/axios';
// import Slider from 'react-slick';
// import { Card } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import './Home.scss';

// const NewsPreview = () => {
//     const [topNews, setTopNews] = useState([]);
//     const history = useHistory();

//     useEffect(() => {
//         const fetchNews = async () => {
//             try {
//                 const res = await axios.get('/api/v1/client/news/slider');
//                 if (res.EC === 0 && res.DT?.news) {
//                     setTopNews(res.DT.news);
//                 }
//             } catch (err) {
//                 console.error('Lỗi lấy tin tức:', err);
//             }
//         };
//         fetchNews();
//     }, []);

//     const getImageUrl = (path) => {
//         if (!path) return '/default-news.jpg';
//         return `${process.env.REACT_APP_BACKEND_URL}/${path.replace(/^src[\\/]+public[\\/]+/, '').replace(/\\/g, '/')}`;
//     };

//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 4,
//         slidesToScroll: 1,
//         arrows: true,
//         responsive: [
//             {
//                 breakpoint: 1200,
//                 settings: { slidesToShow: 3 }
//             },
//             {
//                 breakpoint: 768,
//                 settings: { slidesToShow: 2 }
//             },
//             {
//                 breakpoint: 576,
//                 settings: { slidesToShow: 1 }
//             }
//         ]
//     };

//     return (
//         <div className="container my-5">
//             <h3 className="mb-4">Tin tức</h3>
//             <Slider {...settings}>
//                 {topNews.map(item => (
//                     <div key={item.id} className="px-2">
//                         <Card className="news-card" onClick={() => history.push(`/news/${item.id}`)} style={{ cursor: 'pointer' }}>
//                             <Card.Img variant="top" src={getImageUrl(item.image)} />
//                             <Card.Body>
//                                 <Card.Title style={{ fontSize: '1rem' }}>{item.title}</Card.Title>
//                                 <Card.Text style={{ fontSize: '0.85rem' }}>
//                                     {new Date(item.createdAt).toLocaleDateString()}
//                                 </Card.Text>
//                             </Card.Body>
//                         </Card>
//                     </div>
//                 ))}
//             </Slider>
//             <div className="text-end mt-3">
//                 <button className="btn btn-outline-dark" onClick={() => history.push('/news')}>
//                     Xem tất cả
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default NewsPreview;




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
                const res = await axios.get('/api/v1/client/news/slider');
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
        return `${process.env.REACT_APP_BACKEND_URL}/${path.replace(/^src[\\/]+public[\\/]+/, '').replace(/\\/g, '/')}`;
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 4, // 👈 bằng với slidesToShow
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3 // 👈 tương ứng
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
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

