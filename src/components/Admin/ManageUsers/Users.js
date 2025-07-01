import React, { useCallback, useEffect, useState } from "react";
import './Users.scss';
import { fetchAllUser, deleteUser } from "../../../services/userService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalDelete from "./ModalDelete";
import ModalUser from "./ModalUser";
import Scrollbars from 'react-custom-scrollbars';

const Users = () => {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPage, setTotalPage] = useState(0);

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetchAllUser(currentPage, currentLimit);
            if (response && response.EC === 0) {
                setTotalPage(response.DT.totalPages);
                if (response.DT.totalPages > 0 && response.DT.users.length === 0) {
                    setCurrentPage(+response.DT.totalPages);
                    await fetchAllUser(+response.DT.totalPages, currentLimit);
                }
                if (response.DT.totalPages > 0 && response.DT.users.length > 0) {
                    setListUsers(response.DT.users);
                }
            } else {
                toast.error("Failed to fetch users.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("An error occurred while fetching users.");
        }
    }, [currentPage, currentLimit]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteUser = (user) => {
        setDataModal(user);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModal({});
    };

    const confirmDeleteUser = async () => {
        try {
            const res = await deleteUser(dataModal.id);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                const pageAfterDelete = listUsers.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                setCurrentPage(pageAfterDelete);
                await fetchUsers();
                setIsShowModalDelete(false);
            } else {
                toast.error(res.EM || 'Delete failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred while deleting user.');
        }
    };

    const onHideModalUser = async () => {
        setIsShowModalUser(false);
        setDataModalUser({});
        await fetchUsers();
    };

    const handleEditUser = (user) => {
        setActionModalUser("UPDATE");
        setDataModalUser(user);
        setIsShowModalUser(true);
    };

    const handleRefresh = async () => {
        await fetchUsers();
    };

    return (
        <>
            <div className="container">
                <div className="manage-users-container">
                    <div className="user-header">
                        <div className="title mt-3">
                            <h3>Manage Users</h3>
                        </div>
                        <div className="actions my-3">
                            <button className="btn btn-success refresh me-2" onClick={handleRefresh}>
                                <i className="fa fa-refresh"></i> Refresh
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setIsShowModalUser(true);
                                setActionModalUser("CREATE");
                            }}>
                                <i className="fa fa-plus-circle"></i> Add new user
                            </button>
                        </div>
                    </div>

                    <div className="user-body">
                        <Scrollbars autoHeight autoHeightMax={400} autoHide>
                            <table className="table table-bordered table-hover">
                                <thead className="sticky-header">
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Id</th>
                                        <th scope="col">Image</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Group</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUsers && listUsers.length > 0 ? (
                                        listUsers.map((item, index) => (
                                            <tr key={`row-${index}`}>
                                                <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                <td>{item.id}</td>
                                                <td>
                                                    {item.image
                                                        ? <img src={`http://localhost:8080${item.image}`}
                                                            alt="user"
                                                            style={{ width: 40, height: 40, objectFit: 'cover' }} />
                                                        : 'N/A'}
                                                </td>
                                                <td>{item.email}</td>
                                                <td>{item.username}</td>
                                                <td>{item.Group ? item.Group.name : ""}</td>
                                                <td>
                                                    <i className="fa fa-pencil edit" onClick={() => handleEditUser(item)}></i>
                                                    <i className="fa fa-trash-o delete" onClick={() => handleDeleteUser(item)}></i>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">Not found users</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Scrollbars>
                    </div>
                </div>

                <div className="user-footer">
                    <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={4}
                        pageCount={totalPage}
                        previousLabel="< previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                        forcePage={+currentPage - 1}
                    />
                </div>
            </div>

            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDeleteUser={confirmDeleteUser}
                dataModal={dataModal}
            />
            <ModalUser
                onHide={onHideModalUser}
                show={isShowModalUser}
                action={actionModalUser}
                dataModalUser={dataModalUser}
            />
        </>
    );
};

export default Users;
