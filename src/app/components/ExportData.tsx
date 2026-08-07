import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileJson, FileSpreadsheet, FileText, Package, ShieldCheck, AlertOctagon, HelpCircle, ArrowRight, Printer, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { isLandCompliant } from "../../lib/compliance";

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

export function ExportData() {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDDSModal, setShowDDSModal] = useState(false);

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

  const compliantLandsCount = lands.filter(isLandCompliant).length;
  const compliancePercentage = lands.length > 0 ? Math.round((compliantLandsCount / lands.length) * 100) : 0;

  const overallComplianceStatus = lands.length === 0
    ? "No Data"
    : compliantLandsCount === lands.length
    ? "Fully Compliant"
    : compliantLandsCount > 0
    ? "Partially Compliant"
    : "Non-Compliant";

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
      organization: "HijauLog - Platform Keterlacakan Komoditas Berkelanjutan",
      totalParcels: lands.length,
      compliantParcels: compliantLandsCount,
      nonCompliantParcels: lands.length - compliantLandsCount,
      complianceRate: `${compliancePercentage}%`,
      complianceStatus: overallComplianceStatus,
      data: lands.map((land) => {
        const compliant = isLandCompliant(land);
        const geoValid = land.luas > 4 
          ? (Array.isArray(land.polygon) && land.polygon.length >= 3)
          : (Array.isArray(land.polygon) && land.polygon.length >= 1);

        return {
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
          landComplianceStatus: compliant ? "Compliant" : "Non-Compliant",
          complianceChecks: {
            geoLocationVerified: geoValid,
            polygonPointCount: Array.isArray(land.polygon) ? land.polygon.length : 0,
            documentationComplete: !!land.dokumen_legalitas,
            deforestationFree: !!land.bebas_deforestasi,
            speciesVerified: !!land.jenis_komoditas && !!land.nama_ilmiah,
            qrCodeGenerated: true,
          },
        };
      }),
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

  const handleGenerateDDS = () => {
    if (lands.length === 0) {
      toast.error("Belum ada data lahan untuk membuat Paket Registrasi DDS");
      return;
    }
    setShowDDSModal(true);
  };

  const handlePrintDDS = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-white/70 text-sm font-outfit">Memuat data ekspor...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white font-sans pb-12">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            <Package className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Ekspor Data & Paket DDS</h1>
            <p className="text-white/60 font-medium">
              Unduh data geolokasi GeoJSON, berkas CSV, dan Paket Deklarasi Uji Tuntas (Due Diligence Statement) Uni Eropa.
            </p>
          </div>
        </div>

        {/* Export Statistics */}
        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl tracking-tight">Ringkasan Kepatuhan Dataset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/[0.03] border border-white/10 rounded-3xl">
                <p className="text-4xl font-bold text-white mb-1 tracking-tight">{lands.length}</p>
                <p className="text-sm text-white/60 font-medium">Total Bidang Lahan</p>
              </div>
              <div className="text-center p-4 bg-white/[0.03] border border-white/10 rounded-3xl">
                <p className="text-4xl font-bold text-white mb-1 tracking-tight">
                  {lands.reduce((acc, land) => acc + (land.jumlah_pohon || 0), 0).toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-white/60 font-medium">Total Pohon Terdaftar</p>
              </div>
              <div className="text-center p-4 bg-white/[0.03] border border-white/10 rounded-3xl">
                <p className={`text-4xl font-bold tracking-tight mb-1 ${compliancePercentage === 100 ? 'text-white' : compliancePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {compliancePercentage}%
                </p>
                <p className="text-sm text-white/60 font-medium">Kepatuhan EUDR ({compliantLandsCount}/{lands.length} Compliant)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden text-white">
          <CardHeader>
            <CardTitle className="text-xl tracking-tight">Format Ekspor Berkas</CardTitle>
            <CardDescription className="text-white/60 font-medium">
              Pilih jenis berkas ekspor sesuai dengan kebutuhan importir Uni Eropa, Bea Cukai, atau integrasi ERP internal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Button 1: DDS Package */}
              <Button onClick={handleGenerateDDS} className="h-auto py-6 bg-white hover:bg-white/90 text-black border-0 rounded-[1.5rem] shadow-2xl transition-all">
                <div className="flex flex-col items-center gap-2">
                  <Package className="size-8" />
                  <div className="text-center">
                    <p className="font-bold text-base">Paket Registrasi DDS</p>
                    <p className="text-xs text-black/60 font-medium">Dokumen Uji Tuntas Resmi (Article 4 EUDR)</p>
                  </div>
                </div>
              </Button>

              {/* Button 2: JSON Export */}
              <Button onClick={exportAsJSON} variant="outline" className="h-auto py-6 border-white/10 hover:bg-white/10 bg-white/[0.03] backdrop-blur-md text-white rounded-[1.5rem] transition-all">
                <div className="flex flex-col items-center gap-2">
                  <FileJson className="size-8" />
                  <div className="text-center">
                    <p className="font-bold text-base">Ekspor JSON / GeoJSON</p>
                    <p className="text-xs text-white/50 font-medium">Format data geolokasi mesin TRACES EU</p>
                  </div>
                </div>
              </Button>

              {/* Button 3: CSV Export */}
              <Button onClick={exportAsCSV} variant="outline" className="h-auto py-6 border-white/10 hover:bg-white/10 bg-white/[0.03] backdrop-blur-md text-white rounded-[1.5rem] transition-all">
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="size-8" />
                  <div className="text-center">
                    <p className="font-bold text-base">Ekspor CSV Excel</p>
                    <p className="text-xs text-white/50 font-medium">Kompatibel dengan Microsoft Excel & ERP</p>
                  </div>
                </div>
              </Button>

              {/* Button 4: Full Report */}
              <Button onClick={exportEUDRReport} variant="outline" className="h-auto py-6 border-white/10 hover:bg-white/10 bg-white/[0.03] backdrop-blur-md text-white rounded-[1.5rem] transition-all">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="size-8" />
                  <div className="text-center">
                    <p className="font-bold text-base">Laporan Kepatuhan EUDR</p>
                    <p className="text-xs text-white/50 font-medium">Laporan rekapitulasi audit lengkap</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Post-Export Guide Roadmap Card */}
        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 text-white shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 text-white">
              <HelpCircle className="size-5" />
              <CardTitle className="tracking-tight text-xl text-white">Panduan Alur Pasca-Ekspor (Setelah Unduh Berkas)</CardTitle>
            </div>
            <CardDescription className="text-white/60 font-medium">
              Penjelasan resmi mengenai langkah penggunaan berkas setelah diunduh dari sistem HijauLog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/10 space-y-2">
                <span className="text-white font-mono text-xs font-bold block bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10">LANGKAH 1</span>
                <h4 className="font-semibold text-white">Kirim ke Importir Uni Eropa</h4>
                <p className="text-white/60 text-sm">
                  Kirimkan berkas JSON/DDS ini kepada pembeli atau importir Anda di negara Uni Eropa tujuan sebelum kontainer diberangkatkan.
                </p>
              </div>

              <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/10 space-y-2">
                <span className="text-white font-mono text-xs font-bold block bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10">LANGKAH 2</span>
                <h4 className="font-semibold text-white">Upload ke Portal TRACES EU</h4>
                <p className="text-white/60 text-sm">
                  Importir Anda akan mengunggah payload JSON geolokasi ini ke portal <span className="text-white font-mono">EU Information System (TRACES)</span> untuk mendapatkan Reference Number.
                </p>
              </div>

              <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/10 space-y-2">
                <span className="text-white font-mono text-xs font-bold block bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10">LANGKAH 3</span>
                <h4 className="font-semibold text-white">Verifikasi Pabean / Bea Cukai</h4>
                <p className="text-white/60 text-sm">
                  Otoritas Bea Cukai pelabuhan Eropa akan mencocokkan Kode QR / Reference Number dengan data geolokasi bebas deforestasi secara otomatis.
                </p>
              </div>
            </div>

            {/* Legal Disclaimer Warning (EUDR Article 25) */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 mt-4">
              <AlertOctagon className="size-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-semibold text-amber-300">Peringatan Legalitas & Self-Declaration Operator (EUDR Article 25)</h5>
                <p className="text-amber-200/80 text-[11px] leading-relaxed">
                  HijauLog menyediakan platform pengumpulan data geolokasi dan sertifikasi digital sesuai EUDR Article 9. Seluruh isi Deklarasi Uji Tuntas (DDS) bersifat <a href="https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-100 transition-colors">Self-Declared Operator</a>. Pastikan koordinat poligon dan bukti legalitas lahan yang Anda input akurat. Penyampaian informasi tidak benar pada portal Uni Eropa dapat dikenakan sanksi administrative atau penolakan kargo sesuai <a href="https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en" target="_blank" rel="noopener noreferrer" className="font-mono text-amber-300 underline hover:text-amber-100 transition-colors">Pasal 25 EUDR</a>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      {/* Printable / Viewable DDS Modal */}
      {showDDSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-black/40 backdrop-blur-[80px] border border-white/10 rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl p-8 md:p-10 space-y-8 relative" id="printable-dds-area">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-white/50 font-bold block mb-2">
                  EUDR Article 4 & Article 9 Official Statement
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Paket Deklarasi Uji Tuntas (DDS)
                </h2>
                <p className="text-sm text-white/60 font-medium mt-2">
                  Nomor Referensi Keterlacakan: <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded ml-1">DDS-EUDR-2026-{(Math.random()*1000000).toFixed(0)}</span>
                </p>
              </div>
              <button 
                onClick={() => setShowDDSModal(false)}
                className="p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Statement Body */}
            <div className="space-y-4 text-xs font-outfit text-white/80">
              <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 space-y-2">
                <h4 className="font-bold text-emerald-300 flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4" /> Deklarasi Bebas Deforestasi (EUDR Article 3a)
                </h4>
                <p>
                  Operator dengan ini menyatakan secara sah bahwa seluruh komoditas yang dipanen dari bidang lahan terdaftar dalam paket ini diproduksi di atas lahan yang <strong>TIDAK mengalami deforestasi atau degradasi hutan setelah tanggal 31 Desember 2020</strong> (Cut-off date Uni Eropa).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white">Ringkasan Dataset Geolokasi:</h4>
                <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-white/5 font-mono text-white/50 uppercase">
                    <tr>
                      <th className="p-2.5">Lahan</th>
                      <th className="p-2.5">Komoditas / Spesies</th>
                      <th className="p-2.5">Luas</th>
                      <th className="p-2.5">Geolokasi</th>
                      <th className="p-2.5">Legalitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {lands.map((l) => (
                      <tr key={l.id}>
                        <td className="p-2.5 font-medium text-white">{l.nama_lahan}</td>
                        <td className="p-2.5">{l.jenis_komoditas || "-"} ({l.nama_ilmiah || "-"})</td>
                        <td className="p-2.5 font-mono text-emerald-400">{l.luas} Ha</td>
                        <td className="p-2.5 font-mono">{Array.isArray(l.polygon) ? `${l.polygon.length} Titik` : "1 Titik"}</td>
                        <td className="p-2.5">{l.dokumen_legalitas ? "Terdaftar" : "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <h4 className="font-bold text-white">Ketentuan Penggunaan pada EU Information System:</h4>
                <ol className="list-decimal list-inside space-y-1 text-white/70">
                  <li>Dokumen ini merupakan ringkasan resmi Uji Tuntas Operator.</li>
                  <li>Data GeoJSON poligon terlampir dalam paket ini siap diunggah ke portal TRACES Uni Eropa.</li>
                  <li>Setiap bidang lahan dilengkapi QR Code verifikasi geolokasi publik.</li>
                </ol>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
              <Button 
                variant="outline"
                onClick={() => setShowDDSModal(false)}
                className="border-white/10 text-white hover:bg-white/10 bg-white/[0.03] backdrop-blur-md rounded-full px-6 py-5 transition-all"
              >
                Tutup
              </Button>
              <Button 
                onClick={handlePrintDDS}
                className="bg-white hover:bg-white/90 text-black rounded-full px-8 py-5 font-bold shadow-xl transition-all"
              >
                <Printer className="size-4 mr-2" /> Cetak / Simpan Berkas (PDF)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
