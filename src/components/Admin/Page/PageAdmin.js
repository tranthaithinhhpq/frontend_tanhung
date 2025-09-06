import React, { useEffect, useState } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const PageAdmin = () => {
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(null); // bản ghi hiện tại khi xoá
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const history = useHistory();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

    useEffect(() => {
        fetchPages();
    }, [page, limit]);

    const fetchPages = async () => {
        try {
            const res = await axios.get(`/api/v1/admin/page/read?page=${page}&limit=${limit}`);
            if (res.EC === 0) {
                setPages(res.DT.rows || []);
                setTotalPages(res.DT.totalPages);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error("Lỗi kết nối server");
        }
    };

    const handlePageClick = (event) => {
        setPage(event.selected + 1);
    };

    const handleDelete = async () => {
        if (!currentPage) return;
        try {
            const res = await axios.delete(`/api/v1/admin/page/delete/${currentPage.id}`);
            if (res.EC === 0) {
                toast.success("Xóa thành công!");
                fetchPages();
            } else {
                toast.error(res.EM || "Xóa thất bại");
            }
        } catch (err) {
            toast.error("Lỗi khi xoá dữ liệu");
        } finally {
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="container py-4">
            <h3>Quản lý các trang</h3>
            <Button className="mb-3" onClick={() => history.push('/admin/page-new')}>+ Thêm mới</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>Slug</th>
                        <th>Tiêu đề</th>
                        <th>Youtube ID</th>
                        <th>Trạng thái</th>
                        <th>Thuộc trang</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {pages && pages.length > 0 ? (
                        pages.map((item, index) => (
                            <tr key={item.id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>
                                    <img
                                        src={`${BACKEND_URL}${item.image}`}
                                        alt="page"
                                        style={{ width: 60, height: 40, objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{item.slug}</td>
                                <td>{item.title}</td>
                                <td>{item.videoYoutubeId}</td>
                                <td>{item.status ? 'Hiển thị' : 'Ẩn'}</td>
                                <td>{item.section}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => history.push(`/admin/page/edit/${item.id}`)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                            setCurrentPage(item);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <ReactPaginate
                    previousLabel="<"
                    nextLabel=">"
                    breakLabel="..."
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    activeClassName="active"
                    forcePage={page - 1}
                />
            )}

            {/* Modal xoá */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xoá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xoá trang: <strong>{currentPage?.title}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PageAdmin;
