import React, { useRef, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import './CustomHtmlEditor.scss';
import axios from "../../setup/axios";


const CustomHtmlEditor = ({ value, onChange }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showTableModal, setShowTableModal] = useState(false);
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const pdfInputRef = useRef(null);

    // useEffect(() => {
    //     if (editorRef.current && editorRef.current.innerHTML !== value) {
    //         editorRef.current.innerHTML = value;
    //     }
    // }, []); // chỉ set innerHTML 1 lần khi mounted

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]); // Cập nhật mỗi khi prop value thay đổi

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
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
            embed.width = "100%";
            embed.height = "600px";
            embed.style.margin = "12px 0";

            insertNodeAtCaret(embed);
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
        // đặt lại con trỏ sau node mới
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

    const handleInput = () => {
        onChange(editorRef.current.innerHTML);
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
            </div>

            <div
                ref={editorRef}
                className="editor-area form-control"
                contentEditable
                suppressContentEditableWarning={true}
                onInput={handleInput}
                style={{ minHeight: 300, overflowY: "auto", textAlign: "left" }}
            ></div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files[0]) insertImage(e.target.files[0]);
                }}
            />

            <input
                type="file"
                ref={pdfInputRef}
                style={{ display: "none" }}
                accept="application/pdf"
                onChange={(e) => {
                    if (e.target.files[0]) insertPDF(e.target.files[0]);
                }}
            />

            <Modal show={showTableModal} onHide={() => setShowTableModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Kẻ bảng tùy chỉnh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Số dòng</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            value={rows}
                            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Số cột</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            value={cols}
                            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTableModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={generateTable}>Chèn bảng</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomHtmlEditor;


