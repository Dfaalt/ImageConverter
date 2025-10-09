const ImagePreview = ({ selectedFiles, removeFile, clearAll }) => {
  if (selectedFiles.length === 0) return null;

  // Single image preview
  if (selectedFiles.length === 1) {
    return (
      <div className="mt-8 text-center">
        <div className="relative inline-block group">
          <img
            src={selectedFiles[0].preview}
            alt="Preview"
            className="max-w-full max-h-96 rounded-xl shadow-lg"
          />
          <button
            onClick={() => removeFile(0)}
            className="absolute top-4 cursor-pointer right-4 bg-red-500 text-white w-10 h-10 rounded-full 
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 
              flex items-center justify-center text-xl font-bold shadow-lg"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 text-gray-600 text-sm">
          <strong>{selectedFiles[0].name}</strong>
          <br />
          Ukuran: {(selectedFiles[0].size / 1024).toFixed(2)} KB
        </div>
      </div>
    );
  }

  // Multiple images preview (grid)
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {selectedFiles.length} Gambar Dipilih
        </h3>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Hapus Semua
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {selectedFiles.map((fileData, index) => (
          <div key={index} className="relative group">
            <img
              src={fileData.preview}
              alt={fileData.name}
              className="w-full h-32 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              ✕
            </button>
            <div className="mt-2 text-xs text-gray-600 truncate">
              {fileData.name}
            </div>
            <div className="text-xs text-gray-500">
              {(fileData.size / 1024).toFixed(2)} KB
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
