// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import axios from '../../../setup/axios';
// import ReactPaginate from 'react-paginate';
// import '../../Admin/Doctor/Doctor.scss';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

// const DeviceGallery = () => {
//     const [devices, setDevices] = useState([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const itemsPerPage = 8; // số thiết bị mỗi trang
//     const history = useHistory();

//     useEffect(() => {
//         const fetchDevices = async () => {
//             try {
//                 const res = await axios.get('/api/v1/client/device');
//                 if (res.EC === 0) {
//                     setDevices(res.DT);
//                 }
//             } catch (err) {
//                 console.error('Error fetching devices:', err);
//             }
//         };

//         fetchDevices();
//     }, []);

//     const offset = currentPage * itemsPerPage;
//     const currentItems = devices.slice(offset, offset + itemsPerPage);
//     const pageCount = Math.ceil(devices.length / itemsPerPage);

//     const handlePageClick = ({ selected }) => {
//         setCurrentPage(selected);
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth' // cuộn mượt
//         });
//     };

//     return (
//         <div className="container py-4">
//             <h2 className="mb-4">Danh sách trang thiết bị</h2>
//             <Row>
//                 {currentItems.map((device) => (
//                     <Col md={3} key={device.id} className="mb-4">
//                         <Card
//                             className="h-100 shadow-sm cursor-pointer"
//                             onClick={() => history.push(`/device/${device.id}`)}
//                         >
//                             <Card.Img
//                                 variant="top"
//                                 src={`${BACKEND_URL}${device.image}`}
//                                 style={{ aspectRatio: '3 / 2', objectFit: 'cover' }}
//                             />
//                             <Card.Body>
//                                 <Card.Title>{device.name}</Card.Title>
//                                 <Card.Text>{device.category}</Card.Text>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 ))}
//             </Row>

//             <div className="d-flex justify-content-center mt-4">
//                 <ReactPaginate
//                     previousLabel={"←"}
//                     nextLabel={"→"}
//                     breakLabel={"..."}
//                     pageCount={pageCount}
//                     marginPagesDisplayed={2}
//                     pageRangeDisplayed={3}
//                     onPageChange={handlePageClick}
//                     containerClassName={"pagination"}
//                     pageClassName={"page-item"}
//                     pageLinkClassName={"page-link"}
//                     previousClassName={"page-item"}
//                     previousLinkClassName={"page-link"}
//                     nextClassName={"page-item"}
//                     nextLinkClassName={"page-link"}
//                     breakClassName={"page-item"}
//                     breakLinkClassName={"page-link"}
//                     activeClassName={"active"}
//                 />
//             </div>
//         </div>
//     );
// };

// export default DeviceGallery;


import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from '../../../setup/axios';
import ReactPaginate from 'react-paginate';
import '../../Admin/Doctor/Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const DeviceGallery = () => {
    const [devices, setDevices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // ReactPaginate bắt đầu từ 0
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 8;
    const history = useHistory();

    const fetchDevices = async (page = 1, limit = itemsPerPage) => {
        try {
            const res = await axios.get(`/api/v1/client/device?page=${page}&limit=${limit}`);
            if (res.EC === 0) {
                setDevices(res.DT.data);          // danh sách thiết bị trang hiện tại
                setTotalPages(res.DT.totalPages); // tổng số trang từ backend
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            console.error('Error fetching devices:', err);
        }
    };

    useEffect(() => {
        fetchDevices(currentPage + 1); // backend bắt đầu từ 1
    }, [currentPage]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Danh sách trang thiết bị</h2>
            <Row>
                {devices.map((device) => (
                    <Col md={3} key={device.id} className="mb-4">
                        <Card
                            className="h-100 shadow-sm cursor-pointer"
                            onClick={() => history.push(`/device/${device.id}`)}
                        >
                            <Card.Img
                                variant="top"
                                src={`${BACKEND_URL}${device.image}`}
                                style={{ aspectRatio: '3 / 2', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{device.name}</Card.Title>
                                <Card.Text>{device.category}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <ReactPaginate
                        previousLabel={"←"}
                        nextLabel={"→"}
                        breakLabel={"..."}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                        forcePage={currentPage} // đồng bộ trang hiện tại
                    />
                </div>
            )}
        </div>
    );
};

export default DeviceGallery;
