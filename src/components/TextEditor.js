import React, { useCallback, useMemo } from "react";
import ReactQuill from "react-quill";
import { Upload } from "upload-js";

function TextEditor(props) {
  const { description, onChange, handleImage } = props;
  const quillRef = React.useRef();

  const apiPostNewsImage = useCallback(async (quill, position, e) => {
    const upload = new Upload({
      apiKey: process.env.REACT_APP_UPLOAD_API,
    });
    const uploadFile = upload.createFileInputHandler({
      onUploaded: ({ fileUrl, fileId }) => {
        console.log(`File uploaded! ${fileUrl}`);

        // Remove placeholder image
        quill.deleteText(position, 1);

        // Insert uploaded image
        quill.insertEmbed(position, "image", fileUrl);
        quill.setSelection(position + 1);
      },
    });

    uploadFile(e);
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async (e) => {
      const file = input.files[0];
      let formData = new FormData();
      formData.append("file", file);
      const quill = quillRef.current.getEditor();
      quill.focus();

      let range = quill.getSelection();
      let position = range ? range.index : 0;

      await apiPostNewsImage(quill, position, e);
    };
  }, [apiPostNewsImage]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            { header: "1" },
            { header: "2" },
            { header: [3, 4, 5, 6] },
            { font: [] },
          ],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["clean"],
          ["code-block"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler]
  );

  return (
    <ReactQuill
      ref={quillRef}
      className="react-quill"
      value={description}
      onChange={onChange}
      placeholder="Add your description here"
      modules={handleImage ? modules : {}}
    />
  );
}

export default TextEditor;
