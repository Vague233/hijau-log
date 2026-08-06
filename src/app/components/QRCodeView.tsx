import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Printer, Info, QrCode } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";

interface Land {
  id: string;
  nama_lahan: string;
  lokasi: string;
  luas: number;
  jumlah_pohon: number;
  polygon: any;
  created_at: string;
  tanggal_panen?: string;
  jenis_komoditas?: string;
  nama_ilmiah?: string;
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
      <div className="min-h-screen bg-black flex items-center justify-center font-sans relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop" 
            alt="Nature Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 w-full max-w-md p-6">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
              <p className="text-white/70 font-outfit">Memuat detail QR Code...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!land) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
          <CardContent className="py-12 text-center">
            <p className="text-white/90 mb-6 font-outfit text-lg">Data lahan tidak ditemukan</p>
            <Link to="/dashboard/lands">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 transition-colors">Kembali ke Database</Button>
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
    jenis_komoditas: land.jenis_komoditas,
    nama_ilmiah: land.nama_ilmiah,
    tanggal_panen: land.tanggal_panen,
    polygon: land.polygon,
    created_at: land.created_at,
    verificationUrl: `${window.location.origin}/verify/${land.id}`,
  });

  const handleDownloadPNG = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1024;
    canvas.height = 1024;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.download = `QR-${land.nama_lahan.replace(/\s+/g, "-")}-${land.id}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          toast.success("QR Code PNG berhasil diunduh!");
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
    toast.success("QR Code SVG berhasil diunduh!");
  };

  const handlePrint = () => {
    window.print();
    toast.success("Membuka dialog cetak...");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        {/* Header Title Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-md hidden sm:flex">
              <QrCode className="size-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">
                Kode QR Keterlacakan
              </h1>
              <p className="text-white/60 font-outfit text-sm">
                Bidang Lahan: <span className="text-emerald-400 font-medium">{land.nama_lahan}</span> ({land.lokasi})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Display */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">QR Code Kepatuhan EUDR</CardTitle>
                <CardDescription className="text-white/60 font-outfit">
                  Pindai untuk memverifikasi data jejak keterlacakan produk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  id="qr-print-area"
                  ref={qrRef}
                  className="bg-white p-8 rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl"
                >
                  <QRCodeSVG
                    value={qrData}
                    size={280}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={handleDownloadPNG} 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-5 font-medium shadow-lg shadow-emerald-900/50 transition-all duration-300"
                  >
                    <Download className="size-4 mr-2" />
                    Unduh Gambar PNG
                  </Button>
                  <Button 
                    onClick={handleDownloadSVG} 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full py-5 transition-all duration-300"
                  >
                    <Download className="size-4 mr-2" />
                    Unduh Vektor SVG
                  </Button>
                  <Button 
                    onClick={handlePrint} 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full py-5 transition-all duration-300"
                  >
                    <Printer className="size-4 mr-2" />
                    Cetak Kode QR
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Information */}
            <div className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Kedudukan Hukum Kode QR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs font-outfit text-white/80">
                  <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-200">
                    <p className="font-semibold mb-1 text-emerald-300">Self-Declaration Operator Verification Link:</p>
                    <p className="leading-relaxed text-[11px]">
                      Kode QR ini berisi enkripsi data geolokasi & tautan verifikasi publik atas Deklarasi Uji Tuntas (DDS) Mandiri Operator. Digunakan oleh importir Uni Eropa dan Bea Cukai untuk memvalidasi keabsahan koordinat lahan secara digital.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Data yang Terkandung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm font-outfit">
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>ID Lahan Unik Terverifikasi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Nama & Lokasi Administratif</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Data Poligon Geolokasi Presisi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Komoditas & Spesies Latin Resmi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Luas & Estimasi Populasi Pohon</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>URL Verifikasi Validitas Publik</span>
                    </li>
                  </ul>

                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div className="flex gap-3">
                      <Info className="size-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <p className="font-bold text-emerald-300 mb-1">Standar EUDR Compliance</p>
                        <p className="text-emerald-100/80">
                          QR Code ini memuat seluruh parameter *traceability* yang disyaratkan oleh regulasi Uni Eropa (EUDR) untuk komoditas bebas deforestasi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <h4 className="font-serif text-sm font-bold text-white">Spesifikasi Kode QR:</h4>
                    <ul className="space-y-1 text-xs text-white/60">
                      <li>• Format: SVG/PNG (Vektor Resolusi Tinggi 1024px)</li>
                      <li>• Koreksi Kesalahan: Level H (Toleransi Kerusakan 30%)</li>
                      <li>• Rekomendasi Cetak: Minimal 3x3 cm</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Preview Data Mentah (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-black/60 text-emerald-300 p-4 rounded-xl overflow-auto max-h-52 border border-white/10 font-mono shadow-inner">
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
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
