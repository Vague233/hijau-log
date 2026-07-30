import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Download, Printer, Info, QrCode } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";

interface Land {
  id: string;
  nama_lahan: string;
  lokasi: string;
  luas: number;
  jumlah_pohon: number;
  polygon: string;
  created_at: string;
}

export function QRCodeView() {
  const { id } = useParams();
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLand = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("lahan")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setLand(data);
      } catch (error: any) {
        toast.error(`Gagal memuat detail lahan: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLand();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat detail lahan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!land) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="py-12 text-center">
            <p>Data lahan tidak ditemukan</p>
            <Link to="/dashboard/lands">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Kembali ke Daftar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate QR data - contains traceability information
  const qrData = JSON.stringify({
    id: land.id,
    type: "EUDR-Compliance",
    nama_lahan: land.nama_lahan,
    lokasi: land.lokasi,
    luas: land.luas,
    jumlah_pohon: land.jumlah_pohon,
    polygon: land.polygon,
    created_at: land.created_at,
    verificationUrl: `${window.location.origin}/verify/${land.id}`,
  });

  const handleDownloadPNG = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1024;
    canvas.height = 1024;

    // Draw white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.download = `QR-${land.nama_lahan.replace(/\s+/g, "-")}-${land.id}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          toast.success("QR Code downloaded successfully!");
        }
      });
    };

    img.src = url;
  };

  const handleDownloadSVG = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement("a");
    link.download = `QR-${land.nama_lahan.replace(/\s+/g, "-")}-${land.id}.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
    toast.success("QR Code SVG downloaded successfully!");
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <Link to={`/dashboard/land/${id}`}>
            <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <ArrowLeft className="size-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex-1 flex items-center gap-2">
            <QrCode className="size-8 text-emerald-600 hidden sm:block" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Code Lahan</h1>
              <p className="text-gray-600">{land.nama_lahan}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Display */}
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>QR Code Sistem Keterlacakan</CardTitle>
              <CardDescription>
                Scan untuk verifikasi data EUDR compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                id="qr-print-area"
                ref={qrRef}
                className="bg-white p-8 rounded-lg border-2 border-emerald-100 flex items-center justify-center shadow-inner"
              >
                <QRCodeSVG
                  value={qrData}
                  size={300}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "",
                    height: 0,
                    width: 0,
                    excavate: true,
                  }}
                />
              </div>

              <div className="space-y-2">
                <Button onClick={handleDownloadPNG} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Download className="size-4 mr-2" />
                  Download as PNG
                </Button>
                <Button onClick={handleDownloadSVG} variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Download className="size-4 mr-2" />
                  Download as SVG
                </Button>
                <Button onClick={handlePrint} variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Printer className="size-4 mr-2" />
                  Print QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Information */}
          <div className="space-y-6">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle>Data yang Terkandung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>ID Lahan Unik</li>
                    <li>Nama & Lokasi Lahan</li>
                    <li>Data Geo-lokasi / Poligon</li>
                    <li>Luas & Estimasi Jumlah Pohon</li>
                    <li>Waktu Pendaftaran Sistem</li>
                    <li>URL Verifikasi Validitas</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex gap-2">
                    <Info className="size-5 text-emerald-600 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-emerald-900 mb-1">EUDR Compliance</p>
                      <p className="text-emerald-800">
                        QR Code ini memenuhi standar EU Deforestation Regulation untuk
                        keterlacakan (traceability) komoditas yang bebas deforestasi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">Spesifikasi QR Code:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Format: SVG/PNG (Vektor Resolusi Tinggi)</li>
                    <li>• Koreksi Kesalahan: Tinggi (Level H - 30%)</li>
                    <li>• Rekomendasi Ukuran Cetak: Min. 3x3 cm</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle>Preview Data Mentah (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-64 border border-gray-200">
                  {JSON.stringify(JSON.parse(qrData), null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #qr-print-area, #qr-print-area * {
            visibility: visible;
          }
          #qr-print-area {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
