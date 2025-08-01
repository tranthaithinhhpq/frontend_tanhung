import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';

const MedicineInfoList = () => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0 });
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
    }, [location.search]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/v1/news-categories-nav', {
                params: { group: 'medicine' } // ✅ Lấy đúng danh mục thuốc
            });
            if (res.EC === 0) {
                setCategories(res.DT);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchArticles = async (page = 1, categoryParam = category, keywordParam = keyword) => {
        try {
            const res = await axios.get('/api/v1/client/news', {
                params: {
                    page,
                    limit: pagination.limit,
                    categoryId: categoryParam || undefined,
                    keyword: keywordParam || undefined,
                    group: 'medicine' // ✅ Lọc đúng nhóm thuốc
                }
            });

            if (res.EC === 0) {
                setArticles(res.DT.news);
                setPagination(res.DT.pagination);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value ? +e.target.value : '';
        setCategory(value);

        if (value === '') {
            history.push('/medicine-info');
        } else {
            history.push(`/medicine-info?categoryId=${value}`);
        }
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

    return (
        <div className="container my-4">
            <h3>Thông tin thuốc</h3>

            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                        <option value="">Tất cả thông tin thuốc</option>
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

            <Row>
                {articles.map(item => (
                    <Col md={4} key={item.id} className="mb-4">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={
                                    item.image
                                        ? encodeURI(`${process.env.REACT_APP_BACKEND_URL}${item.image}`)
                                        : '/default-news.jpg'
                                }
                            />
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>
                                    {item.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                </Card.Text>
                                <Card.Text>
                                    <small className="text-muted">
                                        Ngày đăng: {new Date(item.createdAt).toLocaleDateString()}
                                    </small>
                                </Card.Text>
                                <Button onClick={() => history.push(`/news/${item.id}`)}>Xem chi tiết</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Pagination>
                <Pagination.Prev disabled={pagination.page === 1} onClick={() => fetchArticles(pagination.page - 1)} />
                {paginationItems}
                <Pagination.Next disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)} onClick={() => fetchArticles(pagination.page + 1)} />
            </Pagination>
        </div>
    );
};

export default MedicineInfoList;
