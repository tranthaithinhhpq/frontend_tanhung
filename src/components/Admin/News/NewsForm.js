import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import axios from "../../../setup/axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, Button, Row, Col } from "react-bootstrap";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const NewsForm = ({ editData }) => {
    const [title, setTitle] = useState(editData?.title || "");
    const [content, setContent] = useState(editData?.content || "");
    const [editorMode, setEditorMode] = useState("quill");
    const [previewMode, setPreviewMode] = useState(false);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [status, setStatus] = useState(editData?.status || "draft");
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState(editData?.image ? `${BACKEND_URL}/${editData.image}` : "");

    const quillRef = useRef(null);

    useEffect(() => {
        axios.get("/api/v1/news-categories").then(res => {
            if (res.EC === 0) {
                const opts = res.DT.map(c => ({ value: c.id, label: c.name }));
                setCategories(opts);
                if (editData?.categoryId) {
                    setSelectedCategory(opts.find(o => o.value === editData.categoryId));
                }
            }
        }).catch(() => toast.error("Lỗi tải loại tin tức"));
    }, [editData]);

    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const handlePaste = async (e) => {
            const clipboardData = e.clipboardData;
            if (clipboardData?.items) {
                for (let item of clipboardData.items) {
                    if (item.type.includes("image")) {
                        const file = item.getAsFile();
                        await uploadAndInsertImage(file, quill);
                        e.preventDefault();
                    }
                }
            }
        };

        const handleDrop = async (e) => {
            e.preventDefault();
            const file = e.dataTransfer?.files?.[0];
            if (file?.type?.includes("image")) {
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
            const res = await axios.post("/api/v1/upload", formData);
            const imageUrl = `${BACKEND_URL}/${res.path}`;
            const range = quill.getSelection();

            console.log("res ", res);
            console.log("imageUrl ", imageUrl);
            console.log("range ", range);

            quill.insertEmbed(range?.index || 0, "image", imageUrl);
            // quill.insertEmbed(range.index, "image", imageUrl);
        } catch (err) {
            toast.error("Upload ảnh thất bại");
        }
    };

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
        if (image) formData.append("image", image);

        try {
            const res = editData
                ? await axios.put(`/api/v1/news/${editData.id}`, formData)
                : await axios.post("/api/v1/news", formData);

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
                        <label>Loại tin tức</label>
                        <Select options={categories} value={selectedCategory} onChange={setSelectedCategory} />
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

                    <div className="mb-3">
                        <Button variant={editorMode === "quill" ? "primary" : "outline-primary"} className="me-2" onClick={() => setEditorMode("quill")}>React Quill</Button>
                        <Button variant={editorMode === "html" ? "primary" : "outline-primary"} onClick={() => setEditorMode("html")}>HTML</Button>
                    </div>

                    {editorMode === "quill" ? (
                        <ReactQuill
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
                                    ["clean"]
                                ]
                            }}
                        />
                    ) : (
                        <textarea className="form-control" rows={10} value={content} onChange={e => setContent(e.target.value)} placeholder="Nhập mã HTML..." />
                    )}

                    <div className="mt-3">
                        <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>{previewMode ? "Ẩn Preview" : "Preview"}</Button>
                        <Button variant="primary" onClick={handleSubmit}>{editData ? "Cập nhật" : "Đăng bài"}</Button>
                    </div>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{title || "(Tiêu đề xem trước)"}</h2>
                                <p><strong>Loại tin tức:</strong> {selectedCategory?.label || "(Chưa chọn)"}</p>
                                <p><strong>Trạng thái:</strong> {status === "draft" ? "Nháp" : "Công khai"}</p>
                                {previewImg && <img src={previewImg} alt="preview" style={{ maxWidth: "100%", marginBottom: 10 }} />}
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default NewsForm;
