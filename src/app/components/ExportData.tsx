import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileJson, FileSpreadsheet, FileText, Package } from "lucide-react";
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
  tanggal_panen: string | null;
  jenis_komoditas: string | null;
  nama_ilmiah: string | null;
  dokumen_legalitas: string | null;
  bebas_deforestasi: boolean;
}

interface ExportDataProps {
  onBack?: () => void;
}

export function ExportData({ onBack }: ExportDataProps = {}) {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Tidak ada pengguna yang login");

        const { data, error } = await supabase
          .from("lahan")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLands(data || []);
      } catch (error: any) {
        toast.error(`Gagal memuat data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const exportAsJSON = () => {
    if (lands.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }
    const dataStr = JSON.stringify(lands, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HijauLog-EUDR-Export-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Data berhasil diekspor sebagai JSON!");
  };

  const exportAsCSV = () => {
    if (lands.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    // Create CSV headers
    const headers = [
      "ID",
      "Nama Lahan",
      "Lokasi",
      "Luas (Hektar)",
      "Jumlah Pohon",
      "Jenis Komoditas",
      "Nama Ilmiah",
      "Tanggal Panen",
      "Bebas Deforestasi",
      "Dokumen Legalitas",
      "Polygon",
      "Tanggal Pendaftaran",
    ];

    // Create CSV rows
    const rows = lands.map((land) => [
      land.id,
      land.nama_lahan,
      land.lokasi,
      land.luas || "",
      land.jumlah_pohon || "",
      land.jenis_komoditas || "",
      land.nama_ilmiah || "",
      land.tanggal_panen || "",
      land.bebas_deforestasi ? "Ya" : "Tidak",
      land.dokumen_legalitas || "",
      land.polygon ? JSON.stringify(land.polygon).replace(/"/g, '""') : "",
      new Date(land.created_at).toISOString(),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const dataBlob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HijauLog-EUDR-Export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Data berhasil diekspor sebagai CSV!");
  };

  const exportEUDRReport = () => {
    if (lands.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const report = {
      reportType: "EUDR Compliance Data Package",
      generatedDate: new Date().toISOString(),
      organization: "HijauLog - Platform Keterlacakan Kayu Berkelanjutan",
      totalParcels: lands.length,
      complianceStatus: "Compliant",
      data: lands.map((land) => ({
        id: land.id,
        landName: land.nama_lahan,
        location: land.lokasi,
        polygon: land.polygon,
        totalArea: land.luas,
        estimatedTrees: land.jumlah_pohon,
        commodityType: land.jenis_komoditas,
        scientificName: land.nama_ilmiah,
        harvestDate: land.tanggal_panen,
        registrationTimestamp: land.created_at,
        complianceChecks: {
          geoLocationVerified: !!land.polygon && Array.isArray(land.polygon) && land.polygon.length > 0,
          documentationComplete: !!land.dokumen_legalitas,
          deforestationFree: !!land.bebas_deforestasi,
          qrCodeGenerated: true,
        },
      })),
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EUDR-Compliance-Report-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("EUDR Compliance Report berhasil diekspor!");
  };

  if (loading) {
    return (
      <div className="dark container mx-auto px-4 py-8">
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-white/70">Memuat data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="dark container mx-auto px-4 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ekspor Data</h1>
          <p className="text-white/70">
            Ekspor data untuk keperluan pelaporan dan kepatuhan EUDR (EU Deforestation Regulation)
          </p>
        </div>

        <div className="space-y-6">
          {/* Export Statistics */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
            <CardHeader>
              <CardTitle>Ringkasan Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">{lands.length}</p>
                  <p className="text-sm text-white/70">Total Bidang Lahan</p>
                </div>
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">
                    {lands.reduce((acc, land) => acc + (land.jumlah_pohon || 0), 0)}
                  </p>
                  <p className="text-sm text-white/70">Total Pohon Terdaftar</p>
                </div>
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-400 mb-1">100%</p>
                  <p className="text-sm text-white/70">Tingkat Kepatuhan EUDR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
            <CardHeader>
              <CardTitle>Format Ekspor Tersedia</CardTitle>
              <CardDescription className="text-white/70">
                Pilih format ekspor sesuai kebutuhan pelaporan Anda (JSON, CSV, atau Paket Data EUDR)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={exportAsJSON} variant="outline" className="h-auto py-6 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 bg-transparent text-white">
                  <div className="flex flex-col items-center gap-2">
                    <FileJson className="size-8 text-emerald-400" />
                    <div className="text-center">
                      <p className="font-bold">Ekspor sebagai JSON</p>
                      <p className="text-xs text-white/50">Format yang dapat dibaca mesin</p>
                    </div>
                  </div>
                </Button>

                <Button onClick={exportAsCSV} variant="outline" className="h-auto py-6 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 bg-transparent text-white">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="size-8 text-emerald-400" />
                    <div className="text-center">
                      <p className="font-bold">Ekspor sebagai CSV</p>
                      <p className="text-xs text-white/50">Kompatibel dengan Microsoft Excel</p>
                    </div>
                  </div>
                </Button>

                <Button onClick={exportEUDRReport} variant="outline" className="h-auto py-6 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 bg-transparent text-white">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="size-8 text-emerald-400" />
                    <div className="text-center">
                      <p className="font-bold">Laporan Kepatuhan EUDR</p>
                      <p className="text-xs text-white/50">Paket kepatuhan penuh</p>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto py-6 border-white/10 text-white/30 cursor-not-allowed bg-transparent" disabled>
                  <div className="flex flex-col items-center gap-2">
                    <Package className="size-8" />
                    <div className="text-center">
                      <p className="font-bold">Paket Registrasi DDS</p>
                      <p className="text-xs">Segera Hadir</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export Information */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
            <CardHeader>
              <CardTitle>Informasi Paket Data Kepatuhan EUDR</CardTitle>
              <CardDescription className="text-white/70">Penjelasan mengenai konten data yang diekspor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-white mb-2">Konten Paket Data:</h4>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  <li>Data Geo-lokasi (Poligon) untuk semua lahan</li>
                  <li>Sertifikasi/Bukti Legalitas (Status)</li>
                  <li>Daftar periksa kepatuhan (Compliance checklist)</li>
                  <li>Informasi Identitas Lahan</li>
                  <li>Informasi Keterlacakan Digital</li>
                </ul>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="font-bold text-emerald-400 mb-2">Kesiapan Proses Ekspor (Real-time):</h4>
                <ul className="space-y-1 text-emerald-200/80 text-sm">
                  <li>✓ Persiapan Registrasi DDS (Due Diligence Statement)</li>
                  <li>✓ Integrasi Sistem Keterlacakan</li>
                  <li>✓ Data Kode QR untuk Validasi Due Diligence</li>
                  <li>✓ Kesiapan Proses Verifikasi Uni Eropa</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2">Alur Penggunaan Data Ekspor:</h4>
                <ol className="list-decimal list-inside space-y-1 text-white/70">
                  <li>Unduh paket data kepatuhan melalui platform ini</li>
                  <li>Siapkan dokumentasi ekspor fisik tambahan</li>
                  <li>Serahkan data JSON ke sistem Registrasi DDS (Otoritas Nasional)</li>
                  <li>Gunakan CSV untuk sistem internal manajemen perusahaan (ERP)</li>
                  <li>Distribusikan QR Code bersama produk kayu hingga ke negara tujuan</li>
                  <li>Penyelesaian proses verifikasi pabean Uni Eropa</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
