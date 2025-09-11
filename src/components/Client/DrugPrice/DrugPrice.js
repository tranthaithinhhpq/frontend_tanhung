import React, { useEffect, useState, useCallback } from 'react';
import { Table, Form, Row, Col } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const DrugPrice = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit] = useState(20);

    const fetchData = useCallback(async () => {
        let url = `/api/v1/client/medicine?page=${currentPage}&limit=${limit}`;
        if (searchText) url += `&q=${searchText}`;

        try {
            const res = await axios.get(url);
            if (res.EC === 0) {
                setData(res.DT.rows || []);
                setTotalPages(res.DT.totalPages);
            }
        } catch {
            toast.error("Lỗi khi tải dữ liệu thuốc");
        }
    }, [currentPage, limit, searchText]);

    useEffect(() => {
        fetchData();

        window.scrollTo({
            top: 0,
            behavior: 'smooth' // mượt mà
        });


    }, [fetchData]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-4">Bảng giá thuốc</h4>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm tên thuốc..."
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                </Col>
            </Row>

            <Table bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Mã</th>
                        <th>Tên</th>
                        <th>Hoạt chất</th>
                        <th>Hàm lượng</th>
                        <th>Đơn vị</th>
                        <th>Giá thường</th>
                        <th>Giá BHYT</th>
                        <th>Mức chênh lệch</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map(item => (
                        <tr key={item.id}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.activeIngredient}</td>
                            <td>{item.concentration}</td>
                            <td>{item.unit}</td>


                            <td>
                                {item.price === 0.1
                                    ? '0 VND'
                                    : item.price
                                        ? `${item.price.toLocaleString()} VND`
                                        : '-'}
                            </td>



                            <td>
                                {item.insurancePrice === 0.1
                                    ? '0 VND'
                                    : item.insurancePrice
                                        ? `${item.insurancePrice.toLocaleString()} VND`
                                        : '-'}
                            </td>
                            <td>
                                {item.insurancePrice
                                    ? `${Math.round(item.price - item.insurancePrice).toLocaleString()} VND`
                                    : '-'}
                            </td>


                        </tr>
                    )) : (
                        <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
                    )}
                </tbody>
            </Table>

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

export default DrugPrice;