import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "../../../setup/axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { Button, Card, Col, Row } from "react-bootstrap";
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const buildImageUrl = (rawPath) => {
    if (!rawPath) return "";
    return `${BACKEND_URL}${rawPath.replace(/^public[\\/]/, "/").replace(/\\/g, "/")}`;
};

const NewsEdit = () => {
    const { id } = useParams();
    const history = useHistory();

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");
    const [order, setOrder] = useState("");
    const [status, setStatus] = useState("draft");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState("");
    const [editorMode, setEditorMode] = useState("quill");
    const [previewMode, setPreviewMode] = useState(false);
    const quillRef = useRef(null);
    const [group, setGroup] = useState("news");

    useEffect(() => {
        fetchArticle();
    }, []);

    const fetchArticle = async () => {
        try {
            const res = await axios.get(`/api/v1/admin/news/edit/${id}`);
            console.log("📥 [DEBUG] API /news/:id response:", res);

            if (res.EC === 0) {
                const data = res.DT;
                setTitle(data.title);
                setContent(data.content);
                setStatus(data.status || "draft");
                setOrder(data.order || "");
                const currentGroup = data.category?.group || "news";
                setGroup(currentGroup);
                const catId = data.categoryId;
                await fetchCategories(catId, currentGroup);

                if (data.image) {
                    setPreviewImg(buildImageUrl(data.image));
                }
            } else {
                toast.error("Không tìm thấy bài viết");
            }
        } catch (error) {
            console.error("❌ Lỗi khi tải bài viết:", error);
            toast.error("Lỗi khi tải bài viết");
        }
    };


    const fetchCategories = async (catId, groupParam) => {
        try {
            console.log("🌐 [DEBUG] Fetching categories for group:", groupParam);

            const res = await axios.get(`/api/v1/news-categories?group=${groupParam}`);
            console.log("📥 [DEBUG] API /news-categories response:", res);

            if (res.EC === 0) {
                const options = res.DT.map(c => ({ value: c.id, label: c.name }));
                setCategories(options);

                const found = options.find(c => c.value === catId);
                console.log("🎯 Matched category =", found);
                if (found) setSelectedCategory(found);
                else setSelectedCategory(null);
            }
        } catch (error) {
            console.error("❌ Lỗi khi tải danh mục:", error);
            toast.error("Lỗi khi tải danh mục");
        }
    };


    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const handlePaste = async (e) => {
            const items = e.clipboardData?.items || [];
            for (let item of items) {
                if (item.type.includes("image")) {
                    const file = item.getAsFile();
                    await uploadAndInsertImage(file, quill);
                    e.preventDefault();
                }
            }
        };

        const handleDrop = async (e) => {
            e.preventDefault();
            const file = e.dataTransfer?.files?.[0];
            if (file?.type.includes("image")) {
                await uploadAndInsertImage(file, quill);
            }
        };

        const editor = quill.root;
        editor.addEventListener("paste", handlePaste);
        editor.addEventListener("drop", handleDrop);

        return () => {
            editor.removeEventListener("paste", handlePaste);
            editor.removeEventListener("drop", handleDrop);
        };
    }, []);

    const uploadAndInsertImage = async (file, quill) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await axios.post("/api/v1/admin/upload", formData);
            const imageUrl = buildImageUrl(res.path);
            const range = quill.getSelection();
            quill.insertEmbed(range?.index || 0, "image", imageUrl);
        } catch {
            toast.error("Tải ảnh thất bại");
        }
    };

    const handleUpdate = async () => {
        if (!title || !content || !selectedCategory) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("group", group);
        formData.append("order", order);
        formData.append("categoryId", selectedCategory.value);
        formData.append("status", status);
        if (image) formData.append("image", image);

        try {
            const res = await axios.put(`/api/v1/admin/news/edit/${id}`, formData);
            if (res.EC === 0) {
                toast.success("Cập nhật thành công");
                history.push("/admin/news");
            } else {
                toast.error(res.EM || "Lỗi khi cập nhật");
            }
        } catch {
            toast.error("Gửi dữ liệu thất bại");
        }
    };

    return (
        <div className="container my-4">
            <h3>Chỉnh sửa bài viết</h3>
            <Row>
                <Col md={previewMode ? 6 : 12}>
                    <div className="mb-3">
                        <label>Tiêu đề</label>
                        <input
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Thứ tự (Order)</label>
                        <input
                            className="form-control"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            placeholder="Nhập order, ví dụ: 1 hoặc featured"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Nhóm tin tức</label>
                        <select
                            className="form-control"
                            value={group}
                            onChange={(e) => {
                                const newGroup = e.target.value;
                                console.log("📤 User chọn nhóm:", newGroup);
                                setGroup(newGroup);
                                fetchCategories(null, newGroup);
                                setSelectedCategory(null);
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
                        />
                    </div>

                    <div className="mb-3">
                        <label>Trạng thái</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="draft">Nháp</option>
                            <option value="published">Công khai</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Ảnh đại diện</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => {
                                setImage(e.target.files[0]);
                                setPreviewImg(URL.createObjectURL(e.target.files[0]));
                            }}
                        />
                        {previewImg && (
                            <img src={previewImg} alt="preview" style={{ maxHeight: 150, marginTop: 10 }} />
                        )}
                    </div>

                    <CustomHtmlEditor
                        ref={quillRef}
                        value={content}
                        onChange={setContent}
                        theme="snow"
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ["bold", "italic", "underline", "strike"],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["link", "image"],
                                ["clean"],
                            ],
                        }}
                    />

                    <div className="mt-3">
                        <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? "Ẩn Preview" : "Xem trước"}
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Cập nhật
                        </Button>
                    </div>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{title || "(Tiêu đề)"}</h2>
                                <p><strong>Nhóm:</strong> {group === "news" ? "Tin tức" : "Thông tin thuốc"}</p>
                                <p><strong>Loại:</strong> {selectedCategory?.label || "Chưa chọn"}</p>
                                <p><strong>Trạng thái:</strong> {status === "draft" ? "Nháp" : "Công khai"}</p>
                                <p><strong>Order:</strong> {order || "Chưa đặt"}</p>
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

export default NewsEdit;
