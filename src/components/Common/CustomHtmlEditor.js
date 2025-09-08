import React, { useRef, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import './CustomHtmlEditor.scss';
import axios from "../../setup/axios";
import { Scrollbars } from 'react-custom-scrollbars';

const CustomHtmlEditor = ({ value, onChange }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const pdfInputRef = useRef(null);
    const isLocalChangeRef = useRef(false);

    const [showCodeModal, setShowCodeModal] = useState(false);
    const [htmlCode, setHtmlCode] = useState("");

    const [useOuterScroll, setUseOuterScroll] = useState(true);

    // --- thêm state ---
    const [showPasteModal, setShowPasteModal] = useState(false);
    const [allowTableScroll, setAllowTableScroll] = useState(true);

    // --- helpers ---
    const wrapTableForScroll = (table) => {
        const parent = table.parentElement;
        if (parent && parent.classList.contains("table-scroll-wrapper")) return;
        const wrapper = document.createElement("div");
        wrapper.className = "table-scroll-wrapper";
        parent.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    };

    const unwrapTableScroll = (table) => {
        const parent = table.parentElement;
        if (parent && parent.classList.contains("table-scroll-wrapper")) {
            parent.replaceWith(table);
        }
    };

    const formatTables = (useScroll) => {
        const editor = editorRef.current;
        const tables = editor.querySelectorAll("table");

        tables.forEach((table) => {
            table.style.borderCollapse = "collapse";
            table.style.width = "100%";
            table.border = "1";

            // chuyển dòng đầu thành thead nếu chưa có
            if (!table.querySelector("thead")) {
                const firstRow = table.querySelector("tr");
                if (firstRow) {
                    const headerCells = firstRow.querySelectorAll("td, th");
                    const thead = document.createElement("thead");
                    const headerRow = document.createElement("tr");
                    headerCells.forEach(cell => {
                        const th = document.createElement("th");
                        th.innerHTML = cell.innerHTML;
                        th.style.border = "1px solid #ccc";
                        th.style.padding = "8px";
                        th.style.whiteSpace = useScroll ? "nowrap" : "normal";
                        th.style.position = "sticky";
                        th.style.top = "0";
                        th.style.background = "#f9f9f9";
                        th.style.zIndex = "1";
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.insertBefore(thead, table.firstChild);
                    firstRow.remove();
                }
            }

            // định dạng td
            table.querySelectorAll("td").forEach(cell => {
                cell.style.border = "1px solid #ccc";
                cell.style.padding = "8px";
                cell.style.whiteSpace = useScroll ? "nowrap" : "normal";
            });

            // xử lý scroll wrapper
            if (useScroll) {
                table.classList.remove("no-scroll");
                wrapTableForScroll(table);
            } else {
                unwrapTableScroll(table);
                table.classList.add("no-scroll");
            }
        });

        isLocalChangeRef.current = true;
        onChange(editor.innerHTML);
    };

    // --- sửa useEffect nhận value ---
    useEffect(() => {
        if (!editorRef.current) return;
        // bỏ qua nếu thay đổi đến từ editor (tránh reset caret)
        if (isLocalChangeRef.current) {
            isLocalChangeRef.current = false;
            return;
        }
        if (typeof value === "string" && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
            // đặt caret về cuối thay vì đầu
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [value]);

    const [showTableModal, setShowTableModal] = useState(false);
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const [textColor, setTextColor] = useState("#000000");

    useEffect(() => {
        const editor = editorRef.current;
        const handlePaste = () => {
            setTimeout(() => {
                const hasTable = editor.querySelectorAll("table").length > 0;
                if (hasTable) {
                    setShowPasteModal(true); // hỏi người dùng
                } else {
                    // không có bảng thì thôi
                    isLocalChangeRef.current = true;
                    onChange(editor.innerHTML);
                }
            }, 0);
        };

        editor.addEventListener("paste", handlePaste);
        return () => editor.removeEventListener("paste", handlePaste);
    }, []);

    const execCommand = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        isLocalChangeRef.current = true;
        onChange(editorRef.current.innerHTML);
    };

    const insertImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post("/api/v1/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const imageUrl = `${BACKEND_URL}/${res.path}`;
            const img = document.createElement("img");
            img.src = imageUrl;
            img.style.maxWidth = "100%";
            img.style.display = "block";
            img.style.margin = "12px 0";
            img.style.cursor = "pointer";
            img.onclick = () => {
                const newWidth = prompt("Nhập chiều rộng (%) hoặc px", img.style.width || "100%");
                if (newWidth) img.style.width = newWidth;
                onChange(editorRef.current.innerHTML);
            };
            insertNodeAtCaret(img);
            setUseOuterScroll(false);          // 👈 tắt thanh cuộn editor
            isLocalChangeRef.current = true;
            onChange(editorRef.current.innerHTML);
        } catch (err) {
            console.error("❌ Upload ảnh lỗi:", err);
        }
    };

    const insertPDF = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post("/api/v1/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const pdfUrl = `${BACKEND_URL}/${res.path}`;
            const embed = document.createElement("embed");
            embed.src = pdfUrl;
            embed.type = "application/pdf";
            embed.style.display = "block";
            embed.style.width = "100%";
            embed.height = "600px";            // giữ khung xem PDF
            embed.style.margin = "12px 0";
            insertNodeAtCaret(embed);
            setUseOuterScroll(false);          // 👈 tắt thanh cuộn editor
            isLocalChangeRef.current = true;
            onChange(editorRef.current.innerHTML);
        } catch (err) {
            console.error("❌ Upload PDF lỗi:", err);
        }
    };

    const insertNodeAtCaret = (node) => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(node);
        range.setStartAfter(node);
        range.setEndAfter(node);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const generateTable = () => {
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.border = "1";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        for (let c = 0; c < cols; c++) {
            const th = document.createElement("th");
            th.style.padding = "8px";
            th.innerText = `Tiêu đề`;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        for (let r = 0; r < rows; r++) {
            const tr = document.createElement("tr");
            for (let c = 0; c < cols; c++) {
                const td = document.createElement("td");
                td.style.padding = "8px";
                td.innerText = "...";
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        insertNodeAtCaret(table);
        onChange(editorRef.current.innerHTML);
        setShowTableModal(false);
    };

    const addCaptionToLastImage = () => {
        const editor = editorRef.current;
        if (!editor) return;

        const images = editor.querySelectorAll('img');
        if (images.length === 0) {
            alert("Không tìm thấy ảnh nào để chú thích");
            return;
        }

        const lastImage = images[images.length - 1];
        const captionText = prompt("Nhập chú thích cho ảnh:");
        if (!captionText) return;

        const width = prompt("Nhập chiều rộng chú thích (vd: 100%, 300px):", lastImage.style.width || "100%");

        const caption = document.createElement("div");
        caption.innerText = captionText;
        caption.style.fontStyle = "italic";
        caption.style.fontSize = "14px";
        caption.style.textAlign = "center";
        caption.style.backgroundColor = "#f0f0f0";
        caption.style.padding = "4px 8px";
        caption.style.marginTop = "-8px";
        caption.style.width = width || "100%";
        caption.style.marginLeft = "auto";
        caption.style.marginRight = "auto";

        lastImage.insertAdjacentElement('afterend', caption);
        onChange(editor.innerHTML);
    };

    // --- trong mọi nơi gọi onChange từ editor, set cờ trước khi onChange ---
    const handleInput = () => {
        const editor = editorRef.current;
        const tables = editor.querySelectorAll("table");
        tables.forEach(table => {
            if (allowTableScroll) {
                if (!table.parentElement.classList.contains("table-scroll-wrapper")) {
                    wrapTableForScroll(table);
                }
                table.classList.remove("no-scroll");
            } else {
                unwrapTableScroll(table);
                table.classList.add("no-scroll");
            }
        });

        isLocalChangeRef.current = true;
        onChange(editor.innerHTML);
    };


    const alignLastImage = (align) => {
        const editor = editorRef.current;
        if (!editor) return;
        const images = editor.querySelectorAll("img");
        if (images.length === 0) {
            alert("Không tìm thấy ảnh nào để căn chỉnh");
            return;
        }

        const lastImage = images[images.length - 1];
        lastImage.style.display = align === "center" ? "block" : "inline-block";
        lastImage.style.marginLeft = align === "left" ? "0" : align === "center" ? "auto" : "auto";
        lastImage.style.marginRight = align === "right" ? "0" : align === "center" ? "auto" : "auto";
        lastImage.style.textAlign = align;

        const nextSibling = lastImage.nextElementSibling;
        if (nextSibling && nextSibling.innerText && nextSibling.style.fontStyle === "italic") {
            nextSibling.style.textAlign = align;
            nextSibling.style.marginLeft = align === "center" ? "auto" : "0";
            nextSibling.style.marginRight = align === "center" ? "auto" : "0";
        }

        onChange(editor.innerHTML);
    };

    return (
        <div className="mb-3 wysiwyg-wrapper">
            <div className="toolbar d-flex flex-wrap gap-2 mb-2">
                <Button size="sm" onClick={() => execCommand("bold")}>B</Button>
                <Button size="sm" onClick={() => execCommand("italic")}>I</Button>
                <Button size="sm" onClick={() => execCommand("underline")}>U</Button>
                <Button size="sm" onClick={() => execCommand("insertUnorderedList")}>Bullet</Button>
                <Button size="sm" onClick={() => execCommand("insertOrderedList")}>Number</Button>
                <Button size="sm" onClick={() => execCommand("justifyLeft")}>Trái</Button>
                <Button size="sm" onClick={() => execCommand("justifyCenter")}>Giữa</Button>
                <Button size="sm" onClick={() => execCommand("justifyRight")}>Phải</Button>
                <Button size="sm" onClick={() => execCommand("createLink", prompt("Link URL:"))}>Link</Button>
                <Button size="sm" onClick={() => fileInputRef.current.click()}>Ảnh</Button>
                <Button size="sm" onClick={() => pdfInputRef.current.click()}>PDF</Button>
                <Button size="sm" onClick={() => setShowTableModal(true)}>Bảng</Button>
                <div className="d-flex align-items-center gap-2">
                    <Form.Control type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} title="Chọn màu" style={{ width: '40px', height: '30px', padding: 0 }} />
                    <Form.Control type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} placeholder="#000000" style={{ width: '80px', height: '30px' }} />
                    <Button size="sm" onClick={() => execCommand("foreColor", textColor)}>Màu chữ</Button>
                </div>
                <Button size="sm" onClick={() => execCommand("fontSize", prompt("Nhập cỡ chữ (1-7):"))}>Cỡ chữ</Button>
                <Button size="sm" onClick={addCaptionToLastImage}>Chú thích ảnh</Button>
                <Button size="sm" onClick={() => alignLastImage("left")}>Ảnh trái</Button>
                <Button size="sm" onClick={() => alignLastImage("center")}>Ảnh giữa</Button>
                <Button size="sm" onClick={() => alignLastImage("right")}>Ảnh phải</Button>
                <Button size="sm" onClick={() => {
                    setHtmlCode(editorRef.current.innerHTML);
                    setShowCodeModal(true);
                }}>Code</Button>
            </div>

            <Scrollbars style={{ height: 400, width: '100%' }} autoHide>
                <div
                    ref={editorRef}
                    className="editor-area form-control"
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    style={{
                        minHeight: 300,
                        overflow: "visible",
                        textAlign: "left"
                    }}
                ></div>
            </Scrollbars>

            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => e.target.files[0] && insertImage(e.target.files[0])} />
            <input type="file" ref={pdfInputRef} style={{ display: "none" }} accept="application/pdf" onChange={(e) => e.target.files[0] && insertPDF(e.target.files[0])} />

            <Modal show={showTableModal} onHide={() => setShowTableModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Kẻ bảng tùy chỉnh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Số dòng</Form.Label>
                        <Form.Control type="number" min={1} value={rows} onChange={(e) => setRows(parseInt(e.target.value) || 1)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số cột</Form.Label>
                        <Form.Control type="number" min={1} value={cols} onChange={(e) => setCols(parseInt(e.target.value) || 1)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTableModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={generateTable}>Chèn bảng</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPasteModal} onHide={() => setShowPasteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Bạn đang muốn dùng bảng?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Khi dán nội dung có bảng, bạn muốn bật cuộn ngang để giữ nguyên bố cục?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowPasteModal(false);
                        setAllowTableScroll(false);
                        formatTables(false); // KHÔNG: bỏ thanh cuộn (xuống dòng)
                    }}>
                        Không
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setShowPasteModal(false);
                        setAllowTableScroll(true);
                        formatTables(true); // PHẢI: giữ logic + có thanh cuộn
                    }}>
                        Phải
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCodeModal} onHide={() => setShowCodeModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa HTML</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        as="textarea"
                        rows={15}
                        value={htmlCode}
                        onChange={(e) => setHtmlCode(e.target.value)}
                        style={{ fontFamily: "monospace" }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCodeModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (editorRef.current) {
                                editorRef.current.innerHTML = htmlCode;
                                isLocalChangeRef.current = true;
                                onChange(htmlCode);
                            }
                            setShowCodeModal(false);
                        }}
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomHtmlEditor;

