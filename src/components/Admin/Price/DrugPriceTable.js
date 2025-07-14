import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Scrollbars from 'react-custom-scrollbars';

const DrugPriceTable = () => {
    const [drugs, setDrugs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [searchText, setSearchText] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        activeIngredient: '',
        concentration: '',
        unit: '',
        price: '',
        insurancePrice: ''
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchDrugs = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/medicine?page=${currentPage}&limit=${limit}&q=${searchText}`);
            if (res.EC === 0) {
                setDrugs(res.DT.rows || []);
                setTotalPage(res.DT.totalPages);
            }
        } catch (err) {
            toast.error('Lỗi tải danh sách thuốc');
        }
    }, [currentPage, limit, searchText]);

    useEffect(() => {
        fetchDrugs();
    }, [fetchDrugs]);

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleSave = async () => {
        try {
            if (isEditMode) {
                await axios.put(`/api/v1/medicine/${editId}`, formData);
                toast.success('Cập nhật thành công');
            } else {
                await axios.post('/api/v1/medicine', formData);
                toast.success('Thêm mới thành công');
            }
            setShowModal(false);
            fetchDrugs();
        } catch (err) {
            toast.error('Lỗi lưu dữ liệu');
        }
    };

    const handleEdit = (item) => {
        setIsEditMode(true);
        setEditId(item.id);
        setFormData(item);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/v1/medicine/${deleteId}`);
            toast.success('Xóa thành công');
            fetchDrugs();
        } catch (err) {
            toast.error('Lỗi xóa dữ liệu');
        } finally {
            setShowConfirmModal(false);
        }
    };

    return (
        <div className="container py-4">
            <h4>Quản lý bảng giá thuốc</h4>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <Button onClick={() => {
                    setShowModal(true);
                    setIsEditMode(false);
                    setFormData({ code: '', name: '', activeIngredient: '', concentration: '', unit: '', price: '', insurancePrice: '' });
                }}>+ Thêm thuốc</Button>
                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm tên thuốc"
                    value={searchText}
                    onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
                    style={{ maxWidth: '300px' }}
                />
            </div>

            <Scrollbars autoHeight autoHeightMax={400} autoHide>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Mã thuốc</th>
                            <th>Tên thuốc</th>
                            <th>Hoạt chất</th>
                            <th>Hàm lượng</th>
                            <th>Đơn vị</th>
                            <th>Giá</th>
                            <th>Giá BHYT</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drugs.length > 0 ? drugs.map(item => (
                            <tr key={item.id}>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td>{item.activeIngredient}</td>
                                <td>{item.concentration}</td>
                                <td>{item.unit}</td>
                                <td>{item.price}</td>
                                <td>{item.insurancePrice}</td>
                                <td>
                                    <i className="fa fa-pencil edit" onClick={() => handleEdit(item)}></i>
                                    <i className="fa fa-trash-o delete" onClick={() => {
                                        setDeleteId(item.id);
                                        setShowConfirmModal(true);
                                    }}></i>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="8" className="text-center">Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </Table>
            </Scrollbars>

            {totalPage > 0 && (
                <ReactPaginate
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageCount={totalPage}
                    forcePage={currentPage - 1}
                    previousLabel="<"
                    containerClassName="pagination justify-content-center mt-3"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                />
            )}

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {['code', 'name', 'activeIngredient', 'concentration', 'unit', 'price', 'insurancePrice'].map(field => (
                        <Form.Group className="mb-3" key={field}>
                            <Form.Label>{field}</Form.Label>
                            <Form.Control
                                type={['price', 'insurancePrice'].includes(field) ? 'number' : 'text'}
                                value={formData[field] || ''}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            />
                        </Form.Group>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Confirm Delete */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa thuốc này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DrugPriceTable;
