import { useState, useRef } from "react";
import ImagePreview from "./ImagePreview";
import toast from "react-hot-toast";
import TextType from "./TextType/TextType";
import { Folder, FolderOpen } from "lucide-react";

const ImageConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [quality, setQuality] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const formats = ["jpg", "png", "webp", "ico"];

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      toast.error("File yang dipilih bukan gambar!");
      return;
    }

    const filePromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file: file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((newFiles) => {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} gambar berhasil ditambahkan!`);
    });
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
  };

  const convertSingleImage = (fileData) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let mimeType;
        let qualityValue = quality / 100;

        switch (selectedFormat) {
          case "jpg":
            mimeType = "image/jpeg";
            break;
          case "png":
            mimeType = "image/png";
            qualityValue = undefined;
            break;
          case "webp":
            mimeType = "image/webp";
            break;
          case "ico":
            canvas.width = 256;
            canvas.height = 256;
            ctx.drawImage(img, 0, 0, 256, 256);
            mimeType = "image/png";
            qualityValue = undefined;
            break;
        }

        canvas.toBlob(
          (blob) => {
            // Ambil nama file tanpa extension
            const lastDotIndex = fileData.name.lastIndexOf(".");
            const nameWithoutExt =
              lastDotIndex > 0
                ? fileData.name.substring(0, lastDotIndex)
                : fileData.name;

            resolve({ blob, fileName: nameWithoutExt });
          },
          mimeType,
          qualityValue
        );
      };
      img.onerror = reject;
      img.src = fileData.preview;
    });
  };

  const handleConvertAll = async () => {
    if (selectedFiles.length === 0 || !selectedFormat) return;

    setIsLoading(true);

    const toastId = toast.loading(
      `Mengkonversi ${selectedFiles.length} gambar...`
    );

    try {
      const conversions = selectedFiles.map((fileData) =>
        convertSingleImage(fileData)
      );
      const results = await Promise.all(conversions);

      results.forEach((result) => {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${result.fileName}.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      setIsLoading(false);
      toast.success(`${results.length} gambar berhasil dikonversi!`, {
        id: toastId,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengkonversi gambar", {
        id: toastId,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-sky-900 p-5 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 max-w-3xl w-full shadow-2xl">
        <h1 className="text-3xl font-bold text-sky-600 text-center mb-3">
          <TextType
            text={["Dfaalt Convert", "Konverter Gambar"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Konversi gambar ke JPG, PNG, WEBP, atau ICO dengan mudah
        </p>

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-4 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
            ${
              isDragging
                ? "border-sky-700 bg-sky-50 scale-105"
                : "border-sky-600 bg-sky-50 hover:bg-sky-100"
            }`}
        >
          <div className="mb-5 flex justify-center">
            {isDragging ? (
              <FolderOpen
                className="h-16 w-16 text-sky-600"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            ) : (
              <Folder
                className="h-16 w-16 text-sky-600"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Klik atau Drag & Drop gambar di sini
          </h3>
          <p className="text-gray-600">Mendukung: JPG, PNG, WEBP, ICO, HEIF</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            multiple
            className="hidden"
          />
        </div>

        {/* Preview Component */}
        <ImagePreview
          selectedFiles={selectedFiles}
          removeFile={removeFile}
          clearAll={clearAll}
        />

        {/* Format Selection */}
        <div className="mt-8">
          <label className="block text-center text-lg font-semibold mb-4">
            Pilih Format Output:
          </label>
          <div className="flex gap-3 justify-center flex-wrap">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-6 py-3 rounded-full cursor-pointer font-semibold transition-all
                  ${
                    selectedFormat === format
                      ? "bg-sky-600 text-white shadow-lg scale-105"
                      : "bg-white text-sky-600 border-2 border-sky-600 hover:bg-sky-600 hover:text-white"
                  }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Control */}
        {selectedFormat && ["jpg", "webp"].includes(selectedFormat) && (
          <div className="mt-8">
            <label className="block font-semibold mb-3">Kualitas:</label>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full"
            />
            <div className="text-center text-sky-600 font-semibold mt-2">
              {quality}%
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-block w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Mengkonversi...</p>
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvertAll}
          disabled={selectedFiles.length === 0 || !selectedFormat}
          className="w-full mt-8 py-4 bg-gradient-to-r from-sky-600 cursor-pointer to-sky-800 text-white rounded-full text-xl font-semibold
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Konversi {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}
          Gambar
        </button>

        {/* Info */}
        <div className="mt-8 p-5 bg-sky-50 rounded-xl text-center">
          <h3 className="font-semibold text-sky-600 mb-2">ℹ️ Informasi</h3>
          <p className="text-sm text-gray-600">
            Konversi dilakukan di browser Anda. File tidak diunggah ke server
            manapun.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Catatan:</strong> Format HEIF memiliki dukungan terbatas di
            browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
