import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Card, Button, Row, Col, Form, Pagination } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0 });
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');

    const history = useHistory();

    const fetchNews = async (page = 1, categoryParam = category, keywordParam = keyword) => {
        try {
            const res = await axios.get('/api/v1/news', {
                params: {
                    page,
                    limit: pagination.limit,
                    categoryId: categoryParam || undefined,
                    keyword: keywordParam || undefined
                }
            });

            if (res.EC === 0) {
                setNews(res.DT.news);
                setPagination(res.DT.pagination);
            }

            console.log("Backend nhận categoryId: ", categoryParam, "keyword: ", keywordParam);

        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryChange = e => {
        const value = e.target.value ? +e.target.value : '';
        setCategory(value);
        fetchNews(1, value, keyword);
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/v1/news-categories');
            if (res.EC === 0) {
                setCategories(res.DT);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchNews();
    }, []);

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

            <Row className="mb-3">
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

            <Row>
                {news.map(item => (
                    <Col md={4} key={item.id} className="mb-4">
                        <Card>
                            {/* <Card.Img variant="top" src={`${process.env.REACT_APP_BACKEND_URL}/${item.image}`} /> */}
                            {/* <Card.Img variant="top" src={`${process.env.REACT_APP_BACKEND_URL}/${item.image.replace('src/public/', '').replace(/\\/g, '/')}`}/> */}
                            <Card.Img
                                variant="top"
                                src={
                                    item.image
                                        ? `${process.env.REACT_APP_BACKEND_URL}/${item.image.replace('src/public/', '').replace(/\\/g, '/')}`
                                        : '/default-news.jpg'
                                }
                            />
                            {console.log("check item image: ", item.image)}
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>
                                    {item.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                </Card.Text>
                                <Card.Text><small className="text-muted">Ngày đăng: {new Date(item.createdAt).toLocaleDateString()}</small></Card.Text>
                                <Button onClick={() => history.push(`/news/${item.id}`)}>Xem chi tiết</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Pagination>
                <Pagination.Prev disabled={pagination.page === 1} onClick={() => fetchNews(pagination.page - 1)} />
                {paginationItems}
                <Pagination.Next disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)} onClick={() => fetchNews(pagination.page + 1)} />
            </Pagination>
        </div>
    );
};

export default NewsList;
