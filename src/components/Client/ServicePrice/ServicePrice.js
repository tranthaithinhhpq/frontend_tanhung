import React, { useEffect, useState, useCallback } from 'react';
import { Table, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const ClientServicePriceTable = () => {
    const [data, setData] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [specialtyFilter, setSpecialtyFilter] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit] = useState(10);

    const fetchSpecialties = async () => {
        try {
            const res = await axios.get('/api/v1/specialty/read');
            if (res.EC === 0) {
                const options = res.DT.map(sp => ({ value: sp.id, label: sp.name }));
                setSpecialties(options);
            }
        } catch {
            toast.error("Lỗi khi tải chuyên khoa");
        }
    };

    const fetchData = useCallback(async () => {
        let url = `/api/v1/serviceprice?page=${currentPage}&limit=${limit}`;
        if (specialtyFilter?.value) url += `&specialtyId=${specialtyFilter.value}`;
        if (searchText) url += `&q=${searchText}`;

        try {
            const res = await axios.get(url);
            if (res.EC === 0) {
                setData(res.DT.rows || []);
                setTotalPages(res.DT.totalPages);
            }
        } catch {
            toast.error("Lỗi khi tải dữ liệu");
        }
    }, [currentPage, limit, specialtyFilter, searchText]);

    useEffect(() => {
        fetchSpecialties();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1); // reset về page đầu
    };

    const handleSpecialtyChange = (value) => {
        setSpecialtyFilter(value);
        setCurrentPage(1); // reset về page đầu
    };

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-4">Bảng giá dịch vụ</h4>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm tên dịch vụ..."
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col md={6}>
                    <Select
                        options={specialties}
                        value={specialtyFilter}
                        onChange={handleSpecialtyChange}
                        isClearable
                        placeholder="Lọc theo chuyên khoa"
                    />
                </Col>
            </Row>
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <Table bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Tên dịch vụ</th>
                            <th>Giá thường</th>
                            <th>Giá BHYT</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.price.toLocaleString()}đ</td>
                                <td>{item.priceInsurance ? `${item.priceInsurance.toLocaleString()}đ` : '-'}</td>

                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center">Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {totalPages > 1 && (
                <ReactPaginate
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageCount={totalPages}
                    forcePage={currentPage - 1}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    previousLabel="<"
                    containerClassName="pagination justify-content-center mt-3"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                />
            )}
        </div>
    );
};

export default ClientServicePriceTable;

