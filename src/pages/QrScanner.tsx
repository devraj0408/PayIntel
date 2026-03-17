import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { QrCode, Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/components/AnalysisResult";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { api, type DetectResponse } from "@/lib/api";
import jsQR from "jsqr";

export default function QrScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectResponse | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const decodeQrFromImage = (file: File) => {
    setError("");
    setResult(null);
    setExtractedData(null);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Could not process image.");
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setExtractedData(code.data);
          analyzeQr(code.data);
        } else {
          setError("No QR code found in the uploaded image. Please try a clearer image.");
        }
      };
      img.onerror = () => setError("Failed to load image.");
      img.src = reader.result as string;
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeQr = async (data: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.scanQr(data);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to analyze QR data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) decodeQrFromImage(file);
  };

  const clearUpload = () => {
    setPreview(null);
    setExtractedData(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold flex items-center gap-3">
          <QrCode className="h-6 w-6 text-risk-medium" />
          QR Payment Scanner
        </h1>
        <p className="text-muted-foreground text-[15px] mt-1">
          Upload a QR code image to check for fraud before paying.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="card-surface space-y-4">
          <span className="label-caps">Upload QR Code</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />

          {!preview ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-border hover:border-foreground/30 bg-secondary/20 min-h-[250px] flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload a QR code image
              </p>
              <p className="text-xs text-muted-foreground/60">
                PNG, JPG, or JPEG
              </p>
            </button>
          ) : (
            <div className="relative rounded-lg overflow-hidden bg-secondary/30 min-h-[250px] flex items-center justify-center">
              <img
                src={preview}
                alt="Uploaded QR Code"
                className="max-h-[250px] object-contain"
              />
              <button
                onClick={clearUpload}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {preview ? "Upload Different Image" : "Upload QR Code"}
          </Button>
        </div>

        {/* Extracted Data Section */}
        <div className="card-surface space-y-4">
          <span className="label-caps">Extracted QR Data</span>
          {extractedData ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Data successfully extracted from QR code:
              </p>
              <div className="p-3 rounded-lg bg-secondary/50 font-mono text-sm break-all">
                {extractedData}
              </div>
              <Button
                onClick={() => analyzeQr(extractedData)}
                disabled={loading}
                className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
              >
                Re-analyze QR Data
              </Button>
            </div>
          ) : (
            <div className="min-h-[250px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <QrCode className="h-10 w-10" />
              <p className="text-sm">Upload a QR code to extract data</p>
            </div>
          )}
        </div>
      </div>

      {loading && <ScanningAnimation />}
      {error && (
        <div className="card-surface border-risk-high/30 text-risk-high text-sm">{error}</div>
      )}
      {result && <AnalysisResult result={result} />}
    </div>
  );
}
