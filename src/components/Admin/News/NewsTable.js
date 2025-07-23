import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from '../../../setup/axios';
import ReactPaginate from 'react-paginate';
import { useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const NewsTable = () => {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit] = useState(5);
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

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
            const res = await axios.delete(`/api/v1/news/${selectedArticle.id}`);
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

    useEffect(() => {
        fetchArticles();
    }, [currentPage]);

    const fetchArticles = async () => {
        try {
            const res = await axios.get(`/api/v1/news/paginate?page=${currentPage}&limit=${limit}`);
            console.log("res: ", res);
            if (res.EC === 0) {
                setArticles(res.DT.articles);
                setTotalPage(res.DT.totalPages);
                console.log("DATA:", res.DT.articles);
            }
        } catch (e) {
            console.error('Fetch failed', e);
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
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tiêu đề</th>
                        <th>Ảnh</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center">Không có dữ liệu</td>
                        </tr>
                    ) : (
                        articles.map((item, idx) => (
                            <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>{item.title}</td>
                                <td>
                                    <img src={`${BACKEND_URL}${item.image}`} alt="news" style={{ width: 100 }} />
                                </td>
                                <td>{item.status ? 'Hiển thị' : 'Ẩn'}</td>
                                <td>
                                    <i variant="warning" className="fa fa-pencil edit" onClick={() => history.push(`/admin/news/edit/${item.id}`)}></i>
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
