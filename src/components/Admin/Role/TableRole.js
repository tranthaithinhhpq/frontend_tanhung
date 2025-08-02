import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { fetchAllRole, deleteRole } from '../../../services/roleService';
import { toast } from "react-toastify";
import { updateRole } from '../../../services/roleService';



const TableRole = forwardRef((props, ref) => {
    const [listRoles, setListRoles] = useState([]);
    const [editRole, setEditRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editUrl, setEditUrl] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    useEffect(() => {
        getAllRoles();
    }, []);

    useImperativeHandle(ref, () => ({
        fetListRolesAgain() {
            getAllRoles();
        }
    }));

    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC == 0) {
            setListRoles(data.DT);
        } else {
            toast.error(data.EM);
        }
    }

    const handleDeleteRole = async (role) => {
        let data = await deleteRole(role);
        if (data && +data.EC === 0) {
            toast.success(data.EM);
            await getAllRoles();
        }
    };

    const handleEditClick = (role) => {
        setEditRole(role);
        setEditUrl(role.url);
        setEditDesc(role.description);
        setShowModal(true);
    };

    const handleSaveUpdate = async () => {
        if (!editUrl.trim()) {
            toast.error("URL không được để trống!");
            return;
        }

        const updated = {
            id: editRole.id,
            url: editUrl.trim(),
            description: editDesc.trim(),

        };
        console.log("check update: ", updated);

        const res = await updateRole(updated);
        if (res && res.EC === 0) {
            toast.success("Cập nhật thành công");
            setShowModal(false);
            await getAllRoles();
        } else {
            toast.error(res.EM || "Lỗi khi cập nhật");
        }
    };

    const confirmDelete = async () => {
        if (!roleToDelete) return;

        let data = await deleteRole(roleToDelete);
        if (data && +data.EC === 0) {
            toast.success(data.EM);
            await getAllRoles();
        } else {
            toast.error(data.EM || "Lỗi khi xóa role");
        }

        setShowDeleteModal(false);
        setRoleToDelete(null);
    };


    return (
        <>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">URL</th>
                        <th scope="col">Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listRoles && listRoles.length > 0 ?
                        <>
                            {listRoles.map((item, index) => {
                                return (
                                    <tr key={`row-${index}`}>
                                        <td>{item.id}</td>
                                        <td>{item.url}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <span
                                                title="Delete"
                                                className="delete"
                                                onClick={() => {
                                                    setRoleToDelete(item);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <i className="fa fa-trash-o"></i>
                                            </span>

                                            <span
                                                title="Edit"
                                                className="mx-2 edit"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                <i className="fa fa-pencil"></i>
                                            </span>

                                        </td>


                                    </tr>
                                );
                            })}
                        </>
                        : <>
                            <tr><td colSpan={4}>Not found roles</td></tr>
                        </>

                    }
                </tbody>
            </table>
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cập nhật Role ID: {editRole?.id}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-2">
                                    <label>URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                <button className="btn btn-primary" onClick={handleSaveUpdate}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">Xác nhận xóa</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa Role <strong>ID: {roleToDelete?.id}</strong> không?</p>
                                <p className="text-muted">URL: {roleToDelete?.url}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                                <button className="btn btn-danger" onClick={confirmDelete}>Xác nhận xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

});

export default TableRole;