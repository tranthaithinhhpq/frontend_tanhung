// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useHistory } from "react-router-dom";
// import axios from "../../../setup/axios";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import Select from "react-select";
// import { Button, Card, Col, Row } from "react-bootstrap";
// import "react-quill/dist/quill.snow.css";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

// const NewsEdit = () => {
//     const { id } = useParams();
//     const history = useHistory();

//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [status, setStatus] = useState("draft");
//     const [categoryId, setCategoryId] = useState(null);
//     const [categories, setCategories] = useState([]);

//     const [image, setImage] = useState(null);
//     const [previewImg, setPreviewImg] = useState("");
//     const [editorMode, setEditorMode] = useState("quill");
//     const [previewMode, setPreviewMode] = useState(false);

//     const quillRef = useRef(null);

//     useEffect(() => {
//         fetchArticle();
//         fetchCategories();
//     }, []);

//     const fetchArticle = async () => {
//         try {
//             const res = await axios.get(`/api/v1/admin/news/${id}`);
//             if (res.EC === 0) {
//                 const data = res.DT;
//                 setTitle(data.title);
//                 setContent(data.content);
//                 setStatus(data.status || "draft");
//                 setCategoryId(data.categoryId);
//                 if (data.image) {
//                     setPreviewImg(`${BACKEND_URL}/${data.image}`);
//                 }
//             } else {
//                 toast.error("Không tìm thấy bài viết");
//             }
//         } catch (err) {
//             toast.error("Lỗi khi tải dữ liệu bài viết");
//         }
//     };

//     const fetchCategories = async () => {
//         try {
//             const res = await axios.get("/api/v1/news-categories");
//             if (res.EC === 0) {
//                 const options = res.DT.map(c => ({ value: c.id, label: c.name }));
//                 setCategories(options);
//                 const found = options.find(c => c.value === categoryId);
//                 if (found) setSelectedCategory(found);
//             }
//         } catch {
//             toast.error("Lỗi khi tải danh mục");
//         }
//     };

//     const [selectedCategory, setSelectedCategory] = useState(null);

//     useEffect(() => {
//         const quill = quillRef.current?.getEditor();
//         if (!quill) return;

//         const handlePaste = async (e) => {
//             const items = e.clipboardData?.items || [];
//             for (let item of items) {
//                 if (item.type.includes("image")) {
//                     const file = item.getAsFile();
//                     await uploadAndInsertImage(file, quill);
//                     e.preventDefault();
//                 }
//             }
//         };

//         const handleDrop = async (e) => {
//             e.preventDefault();
//             const file = e.dataTransfer?.files?.[0];
//             if (file?.type.includes("image")) {
//                 await uploadAndInsertImage(file, quill);
//             }
//         };

//         const editor = quill.root;
//         editor.addEventListener("paste", handlePaste);
//         editor.addEventListener("drop", handleDrop);

//         return () => {
//             editor.removeEventListener("paste", handlePaste);
//             editor.removeEventListener("drop", handleDrop);
//         };
//     }, []);

//     const uploadAndInsertImage = async (file, quill) => {
//         const formData = new FormData();
//         formData.append("image", file);
//         try {
//             const res = await axios.post("/api/v1/upload", formData);
//             const imageUrl = `${BACKEND_URL}/${res.path}`;
//             const range = quill.getSelection();
//             quill.insertEmbed(range?.index || 0, "image", imageUrl);
//         } catch {
//             toast.error("Upload ảnh thất bại");
//         }
//     };

//     const handleUpdate = async () => {
//         if (!title || !content || !selectedCategory) {
//             toast.error("Vui lòng nhập đầy đủ");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("content", content);
//         formData.append("categoryId", selectedCategory.value);
//         formData.append("status", status);
//         if (image) formData.append("image", image);

//         try {
//             const res = await axios.put(`/api/v1/news/${id}`, formData);
//             if (res.EC === 0) {
//                 toast.success("Cập nhật thành công");
//                 history.push("/admin/news");
//             } else {
//                 toast.error(res.EM || "Lỗi cập nhật");
//             }
//         } catch (err) {
//             toast.error("Lỗi gửi dữ liệu");
//         }
//     };

//     return (
//         <div className="container my-4">
//             <h3>Chỉnh sửa bài viết</h3>
//             <Row>
//                 <Col md={previewMode ? 6 : 12}>
//                     <div className="mb-3">
//                         <label>Tiêu đề</label>
//                         <input
//                             className="form-control"
//                             value={title}
//                             onChange={e => setTitle(e.target.value)}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label>Loại tin tức</label>
//                         <Select
//                             options={categories}
//                             value={selectedCategory}
//                             onChange={setSelectedCategory}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label>Trạng thái</label>
//                         <select
//                             className="form-control"
//                             value={status}
//                             onChange={e => setStatus(e.target.value)}
//                         >
//                             <option value="draft">Nháp</option>
//                             <option value="published">Công khai</option>
//                         </select>
//                     </div>

//                     <div className="mb-3">
//                         <label>Ảnh đại diện</label>
//                         <input
//                             type="file"
//                             className="form-control"
//                             onChange={e => {
//                                 setImage(e.target.files[0]);
//                                 setPreviewImg(URL.createObjectURL(e.target.files[0]));
//                             }}
//                         />
//                         {previewImg && (
//                             <img src={previewImg} alt="preview" style={{ maxHeight: 150, marginTop: 10 }} />
//                         )}
//                     </div>

//                     <div className="mb-3">
//                         <Button
//                             variant={editorMode === "quill" ? "primary" : "outline-primary"}
//                             className="me-2"
//                             onClick={() => setEditorMode("quill")}
//                         >
//                             Quill Editor
//                         </Button>
//                         <Button
//                             variant={editorMode === "html" ? "primary" : "outline-primary"}
//                             onClick={() => setEditorMode("html")}
//                         >
//                             HTML
//                         </Button>
//                     </div>

//                     {editorMode === "quill" ? (
//                         <ReactQuill
//                             ref={quillRef}
//                             value={content}
//                             onChange={setContent}
//                             theme="snow"
//                             modules={{
//                                 toolbar: [
//                                     [{ header: [1, 2, 3, false] }],
//                                     ["bold", "italic", "underline", "strike"],
//                                     [{ list: "ordered" }, { list: "bullet" }],
//                                     ["link", "image"],
//                                     ["clean"]
//                                 ]
//                             }}
//                         />
//                     ) : (
//                         <textarea
//                             className="form-control"
//                             rows={10}
//                             value={content}
//                             onChange={e => setContent(e.target.value)}
//                             placeholder="Nhập mã HTML..."
//                         />
//                     )}

//                     <div className="mt-3">
//                         <Button
//                             variant="secondary"
//                             className="me-2"
//                             onClick={() => setPreviewMode(!previewMode)}
//                         >
//                             {previewMode ? "Ẩn Preview" : "Xem trước"}
//                         </Button>
//                         <Button variant="primary" onClick={handleUpdate}>
//                             Cập nhật
//                         </Button>
//                     </div>
//                 </Col>

//                 {previewMode && (
//                     <Col md={6}>
//                         <Card className="h-100 overflow-auto">
//                             <Card.Body>
//                                 <h2>{title || "(Tiêu đề)"}</h2>
//                                 <p><strong>Loại:</strong> {selectedCategory?.label || "Chưa chọn"}</p>
//                                 <p><strong>Trạng thái:</strong> {status === "draft" ? "Nháp" : "Công khai"}</p>
//                                 {previewImg && <img src={previewImg} alt="preview" style={{ maxWidth: "100%" }} />}
//                                 <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 )}
//             </Row>
//         </div>
//     );
// };

// export default NewsEdit;



import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "../../../setup/axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import Select from "react-select";
import { Button, Card, Col, Row } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

// Chuẩn hóa đường dẫn ảnh
const buildImageUrl = (rawPath) => {
    if (!rawPath) return "";
    return `${BACKEND_URL}${rawPath.replace(/^public[\\/]/, "/").replace(/\\/g, "/")}`;
};

const NewsEdit = () => {
    const { id } = useParams();
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState("");
    const [editorMode, setEditorMode] = useState("quill");
    const [previewMode, setPreviewMode] = useState(false);
    const quillRef = useRef(null);

    useEffect(() => {
        fetchArticle();
        fetchCategories();
    }, []);

    // Lấy thông tin bài viết
    const fetchArticle = async () => {
        try {
            const res = await axios.get(`/api/v1/admin/news/${id}`);
            if (res.EC === 0) {
                const data = res.DT;
                setTitle(data.title);
                setContent(data.content);
                setStatus(data.status || "draft");
                setSelectedCategory({ value: data.categoryId, label: data.categoryName || "..." });

                if (data.image) {
                    setPreviewImg(buildImageUrl(data.image));
                }
            } else {
                toast.error("Không tìm thấy bài viết");
            }
        } catch {
            toast.error("Lỗi khi tải bài viết");
        }
    };

    // Lấy danh mục
    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/v1/news-categories");
            if (res.EC === 0) {
                const options = res.DT.map(c => ({ value: c.id, label: c.name }));
                setCategories(options);

                // Nếu category đã có từ bài viết thì gán lại (đảm bảo khớp option object)
                if (selectedCategory) {
                    const found = options.find(opt => opt.value === selectedCategory.value);
                    if (found) setSelectedCategory(found);
                }
            }
        } catch {
            toast.error("Không thể tải danh mục");
        }
    };

    // Xử lý dán / kéo thả ảnh
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
            const res = await axios.post("/api/v1/upload", formData);
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
        formData.append("categoryId", selectedCategory.value);
        formData.append("status", status);
        if (image) formData.append("image", image);

        try {
            const res = await axios.put(`/api/v1/news/${id}`, formData);
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

                    <div className="mb-3">
                        <Button
                            variant={editorMode === "quill" ? "primary" : "outline-primary"}
                            className="me-2"
                            onClick={() => setEditorMode("quill")}
                        >
                            Quill Editor
                        </Button>
                        <Button
                            variant={editorMode === "html" ? "primary" : "outline-primary"}
                            onClick={() => setEditorMode("html")}
                        >
                            HTML
                        </Button>
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
                                    ["clean"],
                                ],
                            }}
                        />
                    ) : (
                        <textarea
                            className="form-control"
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập mã HTML..."
                        />
                    )}

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
                                <p><strong>Loại:</strong> {selectedCategory?.label || "Chưa chọn"}</p>
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

export default NewsEdit;
