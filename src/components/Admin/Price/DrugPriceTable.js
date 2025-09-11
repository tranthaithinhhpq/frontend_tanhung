import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Scrollbars from 'react-custom-scrollbars';
import * as XLSX from 'xlsx';


const DrugPriceTable = () => {
    const [drugs, setDrugs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(20);
    const [totalPage, setTotalPage] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        activeIngredient: '',
        concentration: '',
        unit: '',
        price: '',
        insurancePrice: ''
    });

    const handleExcelImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet); // [{...}]

                let successCount = 0;
                let errorCount = 0;

                for (const row of rows) {
                    const payload = {
                        code: row.code?.toString().trim() || '',
                        name: row.name?.toString().trim() || '',
                        activeIngredient: row.activeIngredient?.toString().trim() || '',
                        concentration: row.concentration?.toString().trim() || '',
                        unit: row.unit?.toString().trim() || '',
                        price: Number(row.price || 0.1),
                        insurancePrice: Number(row.insurancePrice || 0.1)

                    };

                    // Kiểm tra bắt buộc
                    if (!payload.name || !payload.price || !payload.insurancePrice) {
                        console.warn('Bỏ qua dòng thiếu dữ liệu:', payload);
                        errorCount++;
                        continue;
                    }

                    try {
                        await axios.post('/api/v1/admin/medicine/create', payload);
                        successCount++;
                    } catch (err) {
                        console.error('Lỗi tạo thuốc:', err);
                        errorCount++;
                    }
                }

                toast.success(`Đã import ${successCount} dòng thành công, bỏ qua ${errorCount} dòng lỗi.`);
                fetchDrugs();
            } catch (err) {
                console.error('Lỗi đọc file:', err);
                toast.error('Lỗi đọc file Excel');
            } finally {
                setLoading(false); // ⬅️ đóng modal chờ
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchDrugs = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/admin/medicine/read?page=${currentPage}&limit=${limit}&q=${searchText}`);
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
                await axios.put(`/api/v1/admin/medicine/update/${editId}`, formData);
                toast.success('Cập nhật thành công');
            } else {
                await axios.post('/api/v1/admin/medicine/create', formData);
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
            await axios.delete(`/api/v1/admin/medicine/delete/${deleteId}`);
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
                <div className="d-flex gap-2">
                    <Button onClick={() => {
                        setShowModal(true);
                        setIsEditMode(false);
                        setFormData({ code: '', name: '', activeIngredient: '', concentration: '', unit: '', price: '', insurancePrice: '' });
                    }}>
                        + Thêm thuốc
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

                    <Button variant="info" onClick={() => setShowGuideModal(true)}>
                        ❓ Hướng dẫn Import
                    </Button>
                </div>
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
                                <td>{item.price === 0.1 ? 0 : (item.price || 0).toLocaleString()}</td>
                                <td>{item.insurancePrice === 0.1 ? 0 : (item.insurancePrice || 0).toLocaleString()}</td>

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

            {/* Modal Hướng dẫn */}
            <Modal show={showGuideModal} onHide={() => setShowGuideModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Hướng dẫn sử dụng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>📌 Cách import bảng giá dịch vụ</h5>
                    <p>👉 Lưu ý:</p>
                    <ul>
                        <li>File Excel cần có các cột <code>code, name, activeIngredient, concentration, unit, price, insurancePrice</code></li>
                        <li>Ghi đúng chính tả, viết hoa, viết thường</li>
                    </ul>
                    <p>👉 Chú thích:</p>
                    <ul>
                        <li>code: Mã thuốc</li>
                        <li>name: Tên thuốc</li>
                        <li>activeIngredient: Hoạt chất</li>
                        <li>concentration: Hàm lượng</li>
                        <li>unit: Đơn vị</li>
                        <li>price: Giá</li>
                        <li>insurancePrice: Giá BHYT</li>


                    </ul>
                    <p>📊 Ví dụ file Excel:</p>

                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>code</th>
                                <th>name</th>
                                <th>activeIngredient</th>
                                <th>concentration</th>
                                <th>unit</th>
                                <th>price</th>
                                <th>insurancePrice</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CA153</td>
                                <td>Calci clorid 500mg/5ml (Vĩnh Phúc) </td>
                                <td>Calci clorid</td>
                                <td>500mg/5ml</td>
                                <td>Ống</td>
                                <td>1386</td>
                                <td>1008</td>

                            </tr>
                            <tr>
                                <td>HE09</td>
                                <td>Heparin Injection BP 25000IU/5ml</td>
                                <td>Heparin (natri)</td>
                                <td>25,000UI/5ml</td>
                                <td>Lọ</td>
                                <td>214988</td>
                                <td>105300</td>

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

export default DrugPriceTable;
