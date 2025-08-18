import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import axios from '../../../setup/axios';
import ReactPaginate from 'react-paginate';
import { useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
// (Đặt cạnh các import khác)
import Select from 'react-select';



const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const NewsTable = () => {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit] = useState(5);
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const categoryOptions = categories.map(c => ({
        value: c.id,
        label: c.name
    }));

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const res = await axios.get('/api/v1/newscategory/list');
            // Kỳ vọng res có dạng { EC: 0, DT: [...] }
            if (res.EC === 0) {
                setCategories(res.DT || []);
            } else {
                toast.error(res.EM || 'Không tải được danh mục');
            }
        } catch (e) {
            console.error('Load categories failed', e);
            toast.error('Lỗi tải danh mục');
        } finally {
            setLoadingCategories(false);
        }
    };

    // Gọi 1 lần khi mount
    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const openDeleteModal = (article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedArticle(null);
        setShowModal(false);
    };

    const confirmDelete = async () => {
        try {
            const res = await axios.delete(`/api/v1/admin/news/delete/${selectedArticle.id}`);
            if (res.EC === 0) {
                toast.success('Xóa thành công');
                fetchArticles();
            } else {
                toast.error("Lỗi khi tải dữ liệu");
                console.error(res.EM);
            }
        } catch (err) {
            console.error("Lỗi xóa bài viết", err);
        }
        closeDeleteModal();
    };

    const handleChangeCategory = (option) => {
        setSelectedCategory(option); // useEffect ở Block 6 sẽ tự fetch lại
    };

    const clearCategory = () => {
        setSelectedCategory(null); // cũng sẽ tự fetch lại
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchArticles(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    useEffect(() => {
        fetchArticles(currentPage);
    }, [currentPage]);

    // (Đặt trong component NewsTable) — thay thế hàm fetchArticles cũ
    const fetchArticles = async (page = currentPage) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (selectedCategory?.value) {
                params.set('categoryId', selectedCategory.value);
            }

            const res = await axios.get(`/api/v1/admin/news/paginate?${params.toString()}`);
            if (res.EC === 0) {
                setArticles(res.DT.articles);
                setTotalPage(res.DT.totalPages);
            } else {
                toast.error(res.EM || 'Lỗi khi tải dữ liệu');
            }
        } catch (e) {
            console.error('Fetch failed', e);
            toast.error('Lỗi khi tải dữ liệu');
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    return (
        <div className="container mt-4">
            <h3>Danh sách tin tức</h3>
            <Button className="mb-3" onClick={() => history.push('/admin/news/create')}>
                <i className="fa fa-plus-circle"></i> Thêm mới
            </Button>

            <div className="d-flex align-items-center mb-3 gap-2">
                <div style={{ minWidth: 260 }}>
                    <Select
                        isClearable
                        isLoading={loadingCategories}
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={handleChangeCategory}
                        placeholder="Lọc theo danh mục..."
                        noOptionsMessage={() => 'Không có dữ liệu'}
                    />
                </div>

                <Button variant="outline-secondary" onClick={clearCategory}>
                    Xóa lọc
                </Button>
            </div>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ảnh</th>
                        <th>Tiêu đề</th>
                        <th>Trạng thái</th>
                        <th>Nhóm</th>
                        <th>Danh mục</th>
                        <th>Thứ tự</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center">Không có dữ liệu</td>
                        </tr>
                    ) : (
                        articles.map((item, idx) => (
                            <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>
                                    <img src={`${BACKEND_URL}${item.image}`} alt="news" style={{ width: 100 }} />
                                </td>
                                <td>{item.title}</td>

                                {/* ✅ fix status string */}
                                <td>{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</td>
                                <td>{item.category?.group || 'N/A'}</td>
                                <td>{item.category?.name || 'N/A'}</td>
                                {/* ✅ hiển thị tag */}
                                <td>{item.order || 0}</td>
                                <td>
                                    <i
                                        variant="warning"
                                        className="fa fa-pencil edit"
                                        onClick={() => history.push(`/admin/news/edit/${item.id}`)}
                                    ></i>
                                    <i
                                        variant="danger"
                                        className="fa fa-trash-o delete"
                                        onClick={() => openDeleteModal(item)}
                                    ></i>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {totalPage > 1 && (
                <ReactPaginate
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="< Prev"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination justify-content-center"
                    activeClassName="active"
                    forcePage={currentPage - 1}
                />
            )}
            <Modal show={showModal} onHide={closeDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xóa bài viết: <strong>{selectedArticle?.title}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>Hủy</Button>
                    <Button variant="danger" onClick={confirmDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default NewsTable;
