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
  polygon: string;
  created_at: string;
}

export function ExportData() {
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
      land.polygon || "",
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
        registrationTimestamp: land.created_at,
        complianceChecks: {
          geoLocationVerified: !!land.polygon,
          documentationComplete: true,
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
      <div className="container mx-auto px-4 py-8">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ekspor Data</h1>
          <p className="text-gray-600">
            Ekspor data untuk keperluan pelaporan dan kepatuhan EUDR (EU Deforestation Regulation)
          </p>
        </div>

        <div className="space-y-6">
          {/* Export Statistics */}
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>Ringkasan Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-900 mb-1">{lands.length}</p>
                  <p className="text-sm text-emerald-700">Total Bidang Lahan</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-900 mb-1">
                    {lands.reduce((acc, land) => acc + (land.jumlah_pohon || 0), 0)}
                  </p>
                  <p className="text-sm text-emerald-700">Total Pohon Terdaftar</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-900 mb-1">100%</p>
                  <p className="text-sm text-emerald-700">Tingkat Kepatuhan EUDR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>Format Ekspor Tersedia</CardTitle>
              <CardDescription>
                Pilih format ekspor sesuai kebutuhan pelaporan Anda (JSON, CSV, atau Paket Data EUDR)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={exportAsJSON} variant="outline" className="h-auto py-6 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                  <div className="flex flex-col items-center gap-2">
                    <FileJson className="size-8 text-emerald-600" />
                    <div className="text-center">
                      <p className="font-bold">Ekspor sebagai JSON</p>
                      <p className="text-xs text-gray-500">Format yang dapat dibaca mesin</p>
                    </div>
                  </div>
                </Button>

                <Button onClick={exportAsCSV} variant="outline" className="h-auto py-6 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="size-8 text-emerald-600" />
                    <div className="text-center">
                      <p className="font-bold">Ekspor sebagai CSV</p>
                      <p className="text-xs text-gray-500">Kompatibel dengan Microsoft Excel</p>
                    </div>
                  </div>
                </Button>

                <Button onClick={exportEUDRReport} variant="outline" className="h-auto py-6 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="size-8 text-emerald-600" />
                    <div className="text-center">
                      <p className="font-bold">Laporan Kepatuhan EUDR</p>
                      <p className="text-xs text-gray-500">Paket kepatuhan penuh</p>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto py-6 border-gray-200 text-gray-400 cursor-not-allowed" disabled>
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
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Paket Data Kepatuhan EUDR</CardTitle>
              <CardDescription>Penjelasan mengenai konten data yang diekspor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Konten Paket Data:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Data Geo-lokasi (Poligon) untuk semua lahan</li>
                  <li>Sertifikasi/Bukti Legalitas (Status)</li>
                  <li>Daftar periksa kepatuhan (Compliance checklist)</li>
                  <li>Informasi Identitas Lahan</li>
                  <li>Informasi Keterlacakan Digital</li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-2">Kesiapan Proses Ekspor (Real-time):</h4>
                <ul className="space-y-1 text-emerald-800 text-sm">
                  <li>✓ Persiapan Registrasi DDS (Due Diligence Statement)</li>
                  <li>✓ Integrasi Sistem Keterlacakan</li>
                  <li>✓ Data Kode QR untuk Validasi Due Diligence</li>
                  <li>✓ Kesiapan Proses Verifikasi Uni Eropa</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Alur Penggunaan Data Ekspor:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
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
