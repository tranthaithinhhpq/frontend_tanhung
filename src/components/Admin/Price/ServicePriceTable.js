import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Scrollbars from 'react-custom-scrollbars';
import '../../Admin/Doctor/Doctor.scss';

const ServicePriceTable = () => {
    const [servicePrices, setServicePrices] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        group: '',
        price: '',
        isSelectable: false,
        specialtyId: null
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchSpecialties = async () => {
        try {
            const res = await axios.get('/api/v1/specialty/read');
            if (res.EC === 0) {
                const options = res.DT.map(sp => ({ value: sp.id, label: sp.name }));
                setSpecialties(options);
            }
        } catch (err) {
            toast.error('Lỗi tải chuyên khoa');
        }
    };

    const fetchServicePrices = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/service-price/read?page=${currentPage}&limit=${limit}`);
            if (res.EC === 0) {
                setServicePrices(res.DT.rows || []); // an toàn hơn
                setTotalPage(res.DT.totalPages);
            }
        } catch (err) {
            toast.error('Lỗi tải bảng giá');
        }
    }, [currentPage, limit]);

    useEffect(() => {
        fetchSpecialties();
        fetchServicePrices();
    }, [fetchServicePrices]);

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleSave = async () => {
        const payload = {
            ...formData,
            specialtyId: formData.specialtyId?.value || null
        };

        try {
            if (isEditMode) {
                await axios.put(`/api/v1/service-price/${editId}`, payload);
                toast.success('Cập nhật thành công');
            } else {
                await axios.post('/api/v1/service-price', payload);
                toast.success('Thêm mới thành công');
            }
            setShowModal(false);
            fetchServicePrices();
        } catch (err) {
            toast.error('Lỗi lưu dữ liệu');
        }
    };

    const handleEdit = (item) => {
        setIsEditMode(true);
        setEditId(item.id);
        setFormData({
            name: item.name,
            group: item.group,
            price: item.price,
            isSelectable: item.isSelectable,
            specialtyId: specialties.length > 0
                ? specialties.find(s => s.value === item.specialtyId) || null
                : { value: item.specialtyId, label: '' }



        });
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/v1/service-price/${deleteId}`);
            toast.success('Xóa thành công');
            fetchServicePrices();
        } catch (err) {
            toast.error('Lỗi xóa dữ liệu');
        } finally {
            setShowConfirmModal(false);
        }
    };

    return (
        <div className="container py-4">
            <h4>Quản lý bảng giá dịch vụ</h4>

            <div className="text-start mb-3">
                <Button onClick={() => {
                    setShowModal(true);
                    setIsEditMode(false);
                    setFormData({ name: '', group: '', price: '', isSelectable: false, specialtyId: null });
                }}><i className="fa fa-plus-circle"></i> Thêm mới</Button>

            </div>

            <Scrollbars autoHeight autoHeightMax={400} autoHide>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Tên dịch vụ</th>
                            <th>Nhóm</th>
                            <th>Giá</th>
                            <th>Cho phép đặt</th>
                            <th>Chuyên khoa</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicePrices.length > 0 ? servicePrices.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.group}</td>
                                <td>{item.price}</td>
                                <td>{item.isSelectable ? 'Có' : 'Không'}</td>
                                <td>{item.Specialty?.name || item.specialtyId}</td>
                                <td>
                                    {/* <Button size="sm" onClick={() => handleEdit(item)}>Sửa</Button>{' '} */}
                                    <i
                                        className="fa fa-pencil edit"
                                        onClick={() => handleEdit(item)}
                                    ></i>
                                    <i className="fa fa-trash-o delete" size="sm" variant="danger" onClick={() => {
                                        setDeleteId(item.id);
                                        setShowConfirmModal(true);
                                    }}></i>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
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
                    <Modal.Title>{isEditMode ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên dịch vụ</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nhóm</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.group}
                            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Cho phép đặt lịch khám"
                            checked={formData.isSelectable}
                            onChange={(e) => setFormData({ ...formData, isSelectable: e.target.checked })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Chuyên khoa</Form.Label>
                        <Select
                            options={specialties}
                            value={formData.specialtyId}
                            onChange={(value) => setFormData({ ...formData, specialtyId: value })}
                            isClearable
                        />
                    </Form.Group>
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
                <Modal.Body>Bạn có chắc muốn xóa dịch vụ này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ServicePriceTable;
