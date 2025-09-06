import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Scrollbars from 'react-custom-scrollbars';
import '../../Admin/Doctor/Doctor.scss';
import * as XLSX from 'xlsx';

const ServicePriceTable = () => {

    // 1) STATE trước
    const [servicePrices, setServicePrices] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [allGroups, setAllGroups] = useState([]);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        names: [],
        groups: [],
        specialty: null,
    });

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        group: '',
        price: '',
        priceInsurance: '',
        isSelectable: false,
        specialtyId: null
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // 2) Options dựa trên servicePrices
    const nameOptions = useMemo(() => {
        const set = new Set(servicePrices.map(s => s.name).filter(Boolean));
        return Array.from(set).map(n => ({ value: n, label: n }));
    }, [servicePrices]);

    const groupOptions = useMemo(() => {
        const set = new Set(servicePrices.map(s => s.group).filter(Boolean));
        return Array.from(set).map(g => ({ value: g, label: g }));
    }, [servicePrices]);

    // 3) Lọc
    const filteredServicePrices = useMemo(() => {
        return servicePrices.filter(item => {
            const passName =
                filters.names.length === 0 ||
                filters.names.some(n => n.value === item.name);

            const passGroup =
                filters.groups.length === 0 ||
                filters.groups.some(g => g.value === item.group);

            const passSpecialty =
                !filters.specialty ||
                item.specialtyId === filters.specialty.value;

            return passName && passGroup && passSpecialty;
        });
    }, [servicePrices, filters]);

    // 4) Phân trang dựa trên danh sách đã lọc
    const pageCount = useMemo(() => {
        return Math.ceil((filteredServicePrices.length || 0) / limit);
    }, [filteredServicePrices, limit]);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return filteredServicePrices.slice(start, start + limit);
    }, [filteredServicePrices, currentPage, limit]);

    const fetchSpecialties = async () => {
        try {
            const res = await axios.get('/api/v1/admin/specialty/read');
            if (res.EC === 0) {
                const options = res.DT.map(sp => ({ value: sp.id, label: sp.name }));
                setSpecialties(options);
            }
        } catch (err) {
            toast.error('Lỗi tải chuyên khoa');
        }
    };


    const fetchAllGroups = async () => {
        try {
            // Gọi API để lấy tất cả nhóm
            const res = await axios.get('/api/v1/service-price/groups');
            if (res.EC === 0) {
                const options = res.DT.map(group => ({ value: group, label: group }));
                console.log("options ", options);
                setAllGroups(options); // Lưu vào state
            }
        } catch (err) {
            toast.error('Lỗi tải danh sách nhóm');
        }
    };




    const fetchServicePrices = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
            });

            // Thêm categoryId vào params nếu có
            if (filters.groups.length > 0) {
                params.set('group', filters.groups.map(g => g.value).join(','));
            }
            if (filters.specialty?.value) {
                params.set('specialtyId', filters.specialty.value);
            }

            const res = await axios.get(`/api/v1/admin/service-price/read?${params.toString()}`);
            if (res.EC === 0) {
                setServicePrices(res.DT.rows || []);
                setTotalPage(res.DT.totalPages);
            } else {
                toast.error('Lỗi tải dữ liệu');
            }
        } catch (err) {
            toast.error('Lỗi tải bảng giá');
        }
    }, [currentPage, limit, filters]);


    const handleExcelImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(worksheet); // [{ name, group, price, priceInsurance, specialtyId }]

                let successCount = 0;
                let skipCount = 0;

                for (const [index, row] of rows.entries()) {
                    const name = row.name?.toString().trim();
                    const group = row.group?.toString().trim() || '';
                    const price = parseFloat(row.price);
                    const priceInsurance = parseFloat(row.priceInsurance) || 0.1;
                    console.log("priceInsurance", priceInsurance)
                    const isSelectable = false;
                    const specialtyId = row.specialtyId ? parseInt(row.specialtyId, 10) : null;

                    if (!name || isNaN(price) || isNaN(priceInsurance)) {
                        toast.error(`Dòng ${index + 2} thiếu thông tin bắt buộc (name, price, priceInsurance).`);
                        skipCount++;
                        continue;
                    }

                    await axios.post('/api/v1/admin/service-price/create', {
                        name,
                        group,
                        price,
                        priceInsurance,
                        isSelectable,
                        specialtyId
                    });

                    successCount++;
                }

                toast.success(`Đã import ${successCount} dòng thành công, bỏ qua ${skipCount} dòng lỗi.`);
                fetchServicePrices(); // Cập nhật danh sách
            } catch (err) {
                console.error(err);
                toast.error("Lỗi import file Excel");
            } finally {
                setLoading(false); // ⬅️ đóng modal chờ
            }
        };

        reader.readAsArrayBuffer(file);
    };

    useEffect(() => {
        fetchAllGroups();  // Fetch all groups khi component load
        // fetchServicePrices();  // Lấy dữ liệu bảng giá dịch vụ
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);


    useEffect(() => {
        fetchSpecialties();
        fetchServicePrices();
    }, [fetchServicePrices]);

    useEffect(() => {
        fetchServicePrices();  // Gọi lại API khi bộ lọc thay đổi
    }, [filters, currentPage]);

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1); // Thay đổi trang, gọi lại API dựa trên trang mới
    };

    const handleSave = async () => {
        const payload = {
            ...formData,
            specialtyId: formData.specialtyId?.value || null
        };

        try {
            if (isEditMode) {
                await axios.put(`/api/v1/admin/service-price/update/${editId}`, payload);
                toast.success('Cập nhật thành công');
            } else {
                await axios.post('/api/v1/admin/service-price/create', payload);
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
            priceInsurance: item.priceInsurance || '',
            isSelectable: item.isSelectable,
            specialtyId: specialties.length > 0
                ? specialties.find(s => s.value === item.specialtyId) || null
                : { value: item.specialtyId, label: '' }
        });
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/v1/admin/service-price/delete/${deleteId}`);
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

            <div className="d-flex gap-2 mb-3">
                <Button onClick={() => {
                    setShowModal(true);
                    setIsEditMode(false);
                    setFormData({ name: '', group: '', price: '', isSelectable: false, specialtyId: null });
                }}>
                    <i className="fa fa-plus-circle"></i> Thêm mới
                </Button>

                <Button variant="secondary" onClick={() => document.getElementById('excel-input').click()}>
                    📥 Import Excel
                </Button>

                <input
                    type="file"
                    id="excel-input"
                    accept=".xlsx,.xls"
                    onChange={handleExcelImport}
                    style={{ display: 'none' }}
                />

                {/* ✅ Nút hướng dẫn */}
                <Button variant="info" onClick={() => setShowGuideModal(true)}>
                    ❓ Hướng dẫn Import
                </Button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-3">
                <div style={{ minWidth: 240, flex: 1 }}>
                    <label className="form-label mb-1">Lọc theo tên</label>
                    <Select
                        options={nameOptions}
                        value={filters.names}
                        onChange={(vals) => setFilters(prev => ({ ...prev, names: vals || [] }))}
                        isMulti
                        isClearable
                        placeholder="Chọn tên dịch vụ..."
                    />
                </div>

                <div style={{ minWidth: 220, flex: 1 }}>
                    <label className="form-label mb-1">Lọc theo nhóm</label>
                    <Select
                        options={allGroups}  // Dùng allGroups thay vì groupOptions
                        value={filters.groups}
                        onChange={(vals) => setFilters(prev => {
                            const newFilters = { ...prev, groups: vals || [] };
                            console.log("Updated filters:", newFilters);  // Kiểm tra giá trị filters
                            return newFilters;
                        })}
                        isMulti
                        isClearable
                        placeholder="Chọn nhóm..."
                    />

                </div>

                <div style={{ minWidth: 240, flex: 1 }}>
                    <label className="form-label mb-1">Lọc theo chuyên khoa</label>
                    <Select
                        options={specialties}
                        value={filters.specialty}
                        onChange={(val) => setFilters(prev => ({ ...prev, specialty: val }))}
                        isClearable
                        placeholder="Chọn chuyên khoa..."
                    />
                </div>
            </div>


            <Scrollbars autoHeight autoHeightMax={400} autoHide>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Tên dịch vụ</th>
                            <th>Nhóm</th>
                            <th>Giá</th>
                            <th>Giá bảo hiểm</th>
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
                                <td>{item.price.toLocaleString()}</td>
                                <td>{item.priceInsurance === 0.1 ? 0 : (item.priceInsurance || 0).toLocaleString()}</td>
                                <td>{item.isSelectable ? 'Có' : 'Không'}</td>
                                <td>{item.Specialty}</td>
                                <td>
                                    <i className="fa fa-pencil edit" onClick={() => handleEdit(item)}></i>
                                    <i className="fa fa-trash-o delete" onClick={() => {
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
                        <Form.Label>Giá bảo hiểm</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.priceInsurance}
                            onChange={(e) => setFormData({ ...formData, priceInsurance: e.target.value })}
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

            {/* Modal Hướng dẫn */}
            <Modal show={showGuideModal} onHide={() => setShowGuideModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Hướng dẫn sử dụng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>📌 Cách import bảng giá dịch vụ</h5>
                    <p>👉 Lưu ý:</p>
                    <ul>
                        <li>File Excel cần có các cột <code>name, group, price, priceInsurance</code></li>
                        <li>Ghi đúng chính tả, viết hoa, viết thường</li>

                    </ul>
                    <p>👉 Chú thích:</p>
                    <ul>
                        <li>name: Tên dịch vụ</li>
                        <li>group: Nhóm</li>
                        <li>price: Giá</li>
                        <li>priceInsurance: Giá bảo hiểm</li>


                    </ul>
                    <p>📊 Ví dụ file Excel:</p>

                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>group</th>
                                <th>price</th>
                                <th>priceInsurance</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Khám da liễu</td>
                                <td>CK</td>
                                <td>1000000</td>
                                <td>32000</td>

                            </tr>
                            <tr>
                                <td>Khám mắt</td>
                                <td>CK</td>
                                <td>1000000</td>
                                <td>32000</td>

                            </tr>
                        </tbody>
                    </Table>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowGuideModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={loading} backdrop="static" keyboard={false} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status" className="mb-2" />
                    <p>⏳ Đang xử lý file Excel, vui lòng chờ...</p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ServicePriceTable;
