import React, { useMemo, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#434453',
    borderStyle: 'dashed',
    backgroundColor: '#202028',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function GeneralDragAndDrop(props) {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        const files = acceptedFiles.map(file => (
            <li key={file.path}>
                {file.path} - {file.size} bytes
            </li>
        ));

        setFiles(files);

        acceptedFiles.map(file => {
            props.setFile(file);
        })

    }, []);

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles,
    } = useDropzone({ maxFiles: 1, multiple: false, onDrop });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <div className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drop a file here or click to upload</p>
                <em>(You can upload only 1 file here)</em>
                <div className='drag-and-drop-image'></div>
            </div>
            <aside>
                {
                    files.length > 0 &&
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <h4 style={{ marginBottom: "0px", }}>Selected File</h4>
                        <ul>{files}</ul>
                    </div>
                }
            </aside>
        </div>
    );
}

export default GeneralDragAndDrop;