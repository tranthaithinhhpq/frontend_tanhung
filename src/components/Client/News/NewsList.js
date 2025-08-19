import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import './NewsList.scss';


const NewsList = () => {
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');

    const latestNews = news.length > 0 ? news[0] : null;
    const highlightNews = news.slice(1, 4);
    const popularNews = news.slice(4);

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const catIdFromUrl = queryParams.get('categoryId');
        if (catIdFromUrl) setCategory(+catIdFromUrl); // setCategory là state của categoryId
        fetchCategories();
        fetchNews(1, catIdFromUrl, '');
    }, [location.search]);

    const history = useHistory();

    const fetchNews = async (page = 1, categoryParam = category, keywordParam = keyword) => {
        try {
            const res = await axios.get('/api/v1/client/news', {
                params: {
                    page,
                    limit: pagination.limit,
                    categoryId: categoryParam || undefined,
                    keyword: keywordParam || undefined,
                    group: 'news' // ✅ Thêm dòng này để lọc đúng group
                }
            });

            if (res.EC === 0) {
                setNews(res.DT.news);
                setPagination(res.DT.pagination);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            console.log("Backend nhận: ", {
                page,
                categoryId: categoryParam,
                keyword: keywordParam,
                group: 'news'
            });

        } catch (err) {
            console.error(err);
        }
    };



    const handleCategoryChange = e => {
        const value = e.target.value ? +e.target.value : '';

        setCategory(value);

        if (value === '') {
            history.push('/news'); // 👉 chuyển về /news để xóa categoryId khỏi URL
        } else {
            history.push(`/news?categoryId=${value}`); // 👉 cập nhật URL với category mới
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/v1/news-categories', {
                params: { group: 'news' } // ✅ lọc đúng group
            });
            if (res.EC === 0) {
                setCategories(res.DT);
            }
        } catch (err) {
            console.error(err);
        }
    };







    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const catIdFromUrl = queryParams.get('categoryId');

        const categoryValue = catIdFromUrl ? parseInt(catIdFromUrl) : '';

        setCategory(categoryValue);        // Cập nhật filter theo URL
        fetchCategories();                 // Lấy danh mục
        fetchNews(1, categoryValue, keyword);  // Lấy dữ liệu theo category từ URL

    }, [location.search]); // chạy lại mỗi khi URL search (query string) thay đổi

    const handleSearch = () => fetchNews(1);

    const paginationItems = [];
    for (let i = 1; i <= Math.ceil(pagination.total / pagination.limit); i++) {
        paginationItems.push(
            <Pagination.Item key={i} active={i === pagination.page} onClick={() => fetchNews(i)}>
                {i}
            </Pagination.Item>
        );
    }

    return (
        <div className="container my-4">
            <h3>Tin tức</h3>

            <Row className="mb-4">
                <Col md={4}>

                    <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                        <option value="">Tất cả loại tin</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </Form.Control>
                </Col>
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm tiêu đề, nội dung"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Button onClick={handleSearch}>Tìm kiếm</Button>
                </Col>
            </Row>

            {/* Tin unique - layout ngang */}
            {latestNews && (
                <Card
                    className="news-card mb-4 cursor-pointer border-0 no-hover "
                    onClick={() => history.push(`/news/${latestNews.id}`)}
                >
                    <Row className="g-0 align-items-stretch">
                        {/* Ảnh tin */}
                        <Col md={6}>
                            <Card.Img
                                src={latestNews.image ? encodeURI(`${process.env.REACT_APP_BACKEND_URL}${latestNews.image}`) : '/default-news.jpg'}
                                alt={latestNews.title}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover', borderRadius: 0, height: '100%' }}
                            />
                        </Col>

                        {/* Nội dung tin */}
                        <Col md={6} className="d-flex flex-column justify-content-center p-3">
                            <Card.Body className="p-0">
                                <Card.Title as="h2" className="fw-bold">{latestNews.title}</Card.Title>
                                <Card.Text className="text-muted mb-2">
                                    Ngày đăng: {new Date(latestNews.createdAt).toLocaleDateString()}
                                </Card.Text>
                                <Card.Text>
                                    {latestNews.content.replace(/<[^>]+>/g, '').substring(0, 300)}...
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation(); // tránh kích hoạt onClick của Card
                                        history.push(`/news/${latestNews.id}`);
                                    }}
                                    className="mt-2 align-self-start"
                                >
                                    Xem chi tiết
                                </Button>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            )}

            {/* Nổi bật */}
            {highlightNews.length > 0 && (
                <>
                    <h4 className="mb-3">Nổi bật</h4>
                    <Row>
                        {highlightNews.map(item => (
                            <Col md={4} key={item.id} className="mb-4">
                                <Card
                                    className="news-card cursor-pointer"
                                    onClick={() => history.push(`/news/${item.id}`)}
                                    style={{ cursor: 'pointer' }} // đảm bảo con trỏ chuột thay đổi
                                >
                                    <Card.Img
                                        src={item.image ? encodeURI(`${process.env.REACT_APP_BACKEND_URL}${item.image}`) : '/default-news.jpg'}
                                        alt={item.title}
                                    />
                                    <Card.Body>
                                        <Card.Title className="title">{item.title}</Card.Title>
                                        <Card.Text className="date">
                                            <small className="text-muted">{new Date(item.createdAt).toLocaleDateString()}</small>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {/* Phổ biến */}
            {popularNews.length > 0 && (
                <>
                    <h4 className="mb-3">Phổ biến</h4>
                    <Row>
                        {popularNews.map(item => (
                            <Col md={4} key={item.id} className="mb-4">
                                <Card
                                    className="news-card cursor-pointer"
                                    onClick={() => history.push(`/news/${item.id}`)}
                                    style={{ cursor: 'pointer' }} // đảm bảo con trỏ chuột thay đổi
                                >
                                    <Card.Img
                                        src={item.image ? encodeURI(`${process.env.REACT_APP_BACKEND_URL}${item.image}`) : '/default-news.jpg'}
                                        alt={item.title}
                                    />
                                    <Card.Body>
                                        <Card.Title className="title small">{item.title}</Card.Title>
                                        <Card.Text className="date">
                                            <small className="text-muted">{new Date(item.createdAt).toLocaleDateString()}</small>
                                        </Card.Text>

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}


            <Pagination>
                <Pagination.Prev disabled={pagination.page === 1} onClick={() => fetchNews(pagination.page - 1)} />
                {paginationItems}
                <Pagination.Next disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)} onClick={() => fetchNews(pagination.page + 1)} />
            </Pagination>
        </div>
    );
};

export default NewsList;
