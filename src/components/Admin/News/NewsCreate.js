
// src/components/Admin/NewsFormHtmlOnly.js
import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "../../../setup/axios";
import { toast } from "react-toastify";
import { Card, Button, Row, Col } from "react-bootstrap";
import CustomHtmlEditor from "../../Common/CustomHtmlEditor";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const NewsCreate = ({ editData }) => {
    const [title, setTitle] = useState(editData?.title || "");
    const [content, setContent] = useState(editData?.content || "");
    const [previewMode, setPreviewMode] = useState(false);
    const [group, setGroup] = useState(editData?.NewsCategory?.group || "news");

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [status, setStatus] = useState(editData?.status || "draft");
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState(editData?.image ? `${BACKEND_URL}/${editData.image}` : "");

    // ✅ Fetch danh mục khi group thay đổi hoặc lần đầu load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`/api/v1/news-categories?group=${group}`);
                if (res.EC === 0) {
                    const options = res.DT.map(c => ({ value: c.id, label: c.name }));
                    setCategories(options);

                    if (editData?.categoryId && group === editData?.NewsCategory?.group) {
                        const matched = options.find(o => o.value === editData.categoryId);
                        setSelectedCategory(matched || null);
                    } else {
                        setSelectedCategory(null); // reset khi đổi group
                    }
                }
            } catch {
                toast.error("Lỗi tải loại tin tức");
            }
        };

        fetchCategories();
    }, [group]);

    const handleSubmit = async () => {
        if (!title || !content || !selectedCategory) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("categoryId", selectedCategory.value);
        formData.append("status", status);
        formData.append("group", group); // ✅ thêm group
        if (image) formData.append("image", image);

        try {
            const res = editData
                ? await axios.put(`/api/v1/admin/edit/${editData.id}`, formData)
                : await axios.post("/api/v1/admin/news/create", formData);


            res.EC === 0
                ? toast.success(res.EM || "Lưu bài viết thành công")
                : toast.error(res.EM || "Lưu thất bại");

        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi gửi dữ liệu");
        }
    };

    return (
        <div className="container my-4">
            <h3>{editData ? "Sửa bài viết" : "Tạo bài viết"}</h3>
            <Row>
                <Col md={previewMode ? 6 : 12}>
                    <div className="mb-3">
                        <label>Tiêu đề</label>
                        <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label>Nhóm</label>
                        <select
                            className="form-control"
                            value={group}
                            onChange={e => {
                                const selected = e.target.value;
                                setGroup(selected);
                                setSelectedCategory(null); // ✅ reset loại tin khi đổi nhóm
                            }}
                        >
                            <option value="news">Tin tức</option>
                            <option value="medicine">Thông tin thuốc</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Loại tin tức</label>
                        <Select
                            options={categories}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="Chọn loại tin"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Trạng thái</label>
                        <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="draft">Nháp</option>
                            <option value="published">Công khai</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Ảnh đại diện</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={e => {
                                setImage(e.target.files[0]);
                                setPreviewImg(URL.createObjectURL(e.target.files[0]));
                            }}
                        />
                        {previewImg && <img src={previewImg} alt="preview" style={{ maxHeight: 150, marginTop: 10 }} />}
                    </div>

                    <CustomHtmlEditor value={content} onChange={setContent} />

                    <div className="mt-3">
                        <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>
                            {previewMode ? "Ẩn Preview" : "Fast Preview"}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {editData ? "Cập nhật" : "Đăng bài"}
                        </Button>
                    </div>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{title || "(Tiêu đề xem trước)"}</h2>
                                <p><strong>Nhóm:</strong> {group === "medicine" ? "Thông tin thuốc" : "Tin tức"}</p>
                                <p><strong>Loại tin tức:</strong> {selectedCategory?.label || "(Chưa chọn)"}</p>
                                <p><strong>Trạng thái:</strong> {status === "draft" ? "Nháp" : "Công khai"}</p>
                                {previewImg && (
                                    <img
                                        src={previewImg}
                                        alt="preview"
                                        style={{ maxWidth: "100%", marginBottom: 10 }}
                                    />
                                )}
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default NewsCreate;
