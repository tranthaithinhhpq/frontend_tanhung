import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Card, Button, Row, Col, Form, Pagination, InputGroup } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import '../News/NewsList.scss';
import { FaSearch } from "react-icons/fa";

const MedicineInfoList = () => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 }); // ✅ mặc định 10 bài/trang
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const catIdFromUrl = queryParams.get('categoryId');
        const parsedCatId = catIdFromUrl ? parseInt(catIdFromUrl) : '';
        setCategory(parsedCatId);

        fetchCategories();
        fetchArticles(1, parsedCatId, keyword);


    }, [location.search]); // eslint-disable-line


    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/v1/news-categories-nav', { params: { group: 'medicine' } });
            if (res.EC === 0) {
                setCategories(res.DT);

            }
        } catch (err) { console.error(err); }
    };

    const fetchArticles = async (page = 1, categoryParam = category, keywordParam = keyword) => {
        try {
            const res = await axios.get('/api/v1/client/news', {
                params: {
                    page,
                    limit: pagination.limit,
                    categoryId: categoryParam || undefined,
                    keyword: keywordParam || undefined,
                    group: 'medicine'
                }
            });
            if (res.EC === 0) {
                setArticles(res.DT.news);
                setPagination(res.DT.pagination);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) { console.error(err); }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value ? +e.target.value : '';
        setCategory(value);
        history.push(value === '' ? '/medicine-info' : `/medicine-info?categoryId=${value}`);
    };

    const handleSearch = () => fetchArticles(1);

    const paginationItems = [];
    for (let i = 1; i <= Math.ceil(pagination.total / pagination.limit); i++) {
        paginationItems.push(
            <Pagination.Item key={i} active={i === pagination.page} onClick={() => fetchArticles(i)}>
                {i}
            </Pagination.Item>
        );
    }

    // ✅ tách bài viết
    const latestArticle = articles.length > 0 ? articles[0] : null;
    const highlightArticles = articles.slice(1, 4);
    const popularArticles = articles.slice(4);

    return (
        <div className="container my-4">
            <h3>Thông tin thuốc</h3>

            {/* Filter */}
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                        <option value="">Tất cả thông tin thuốc</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </Form.Control>
                </Col>
                <Col md={8}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm tiêu đề, nội dung"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                        <Button variant="dark" onClick={handleSearch}>
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Col>
            </Row>

            {/* Latest Article - Horizontal Layout */}
            {latestArticle && (
                <Card
                    className="news-card mb-4 cursor-pointer border-0 no-hover"
                    onClick={() => history.push(`/news/${latestArticle.id}`)}
                >
                    <Row className="g-0 align-items-stretch">
                        {/* Image */}
                        <Col md={6}>
                            <Card.Img
                                src={latestArticle.image
                                    ? encodeURI(`${process.env.REACT_APP_BACKEND_URL}${latestArticle.image}`)
                                    : '/default-news.jpg'}
                                alt={latestArticle.title}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover', borderRadius: 0, height: '100%' }}
                            />
                        </Col>

                        {/* Article Content */}
                        <Col md={6} className="d-flex flex-column justify-content-center p-3">
                            <Card.Body className="p-0">
                                <Card.Title as="h2" className="fw-bold">{latestArticle.title}</Card.Title>
                                <Card.Text className="text-muted mb-2">
                                    Ngày đăng: {new Date(latestArticle.createdAt).toLocaleDateString()}
                                </Card.Text>
                                <Card.Text>
                                    {latestArticle.content.replace(/<[^>]+>/g, '').substring(0, 300)}...
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering the onClick of Card
                                        history.push(`/news/${latestArticle.id}`);
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

            {/* Highlighted Articles */}
            {highlightArticles.length > 0 && (
                <>
                    <h4 className="mb-3">Nổi bật</h4>
                    <Row>
                        {highlightArticles.map(item => (
                            <Col md={4} key={item.id} className="mb-4">
                                <Card
                                    className="news-card cursor-pointer"
                                    onClick={() => history.push(`/news/${item.id}`)}
                                >
                                    <Card.Img
                                        src={item.image
                                            ? encodeURI(`${process.env.REACT_APP_BACKEND_URL}${item.image}`)
                                            : '/default-news.jpg'}
                                        alt={item.title}
                                    />
                                    <Card.Body>
                                        <Card.Title className="title">{item.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </Card.Text>

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {/* Popular Articles */}
            {popularArticles.length > 0 && (
                <>
                    <h4 className="mb-3">Phổ biến</h4>
                    <Row>
                        {popularArticles.map(item => (
                            <Col md={4} key={item.id} className="mb-4">
                                <Card
                                    className="news-card cursor-pointer"
                                    onClick={() => history.push(`/news/${item.id}`)}
                                >
                                    <Card.Img
                                        src={item.image
                                            ? encodeURI(`${process.env.REACT_APP_BACKEND_URL}${item.image}`)
                                            : '/default-news.jpg'}
                                        alt={item.title}
                                    />
                                    <Card.Body>
                                        <Card.Title className="title small">{item.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </Card.Text>

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {/* Pagination */}
            <Pagination>
                <Pagination.Prev disabled={pagination.page === 1} onClick={() => fetchArticles(pagination.page - 1)} />
                {paginationItems}
                <Pagination.Next
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    onClick={() => fetchArticles(pagination.page + 1)}
                />
            </Pagination>
        </div>
    );

};

export default MedicineInfoList;
