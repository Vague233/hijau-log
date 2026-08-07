import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Trees, 
  PlusCircle, 
  FileSpreadsheet, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Compass,
  ArrowRight,
  FileCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
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
  jenis_komoditas?: string;
  nama_ilmiah?: string;
  dokumen_legalitas?: string;
  bebas_deforestasi?: boolean;
}

export function DashboardOverview() {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const { data, error } = await supabase
          .from("lahan")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLands(data || []);
      } catch (err: any) {
        console.error("Error fetching lands for overview:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const totalTrees = lands.reduce((acc, land) => acc + (land.jumlah_pohon || 0), 0);
  const totalArea = lands.reduce((acc, land) => acc + (land.luas || 0), 0);
  const compliantLandsCount = lands.filter(isLandCompliant).length;
  const compliancePercentage = lands.length > 0 ? Math.round((compliantLandsCount / lands.length) * 100) : 0;

  const recentLands = lands.slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-32 bg-white/5 backdrop-blur-[40px] rounded-[2rem] border border-white/10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-white/5 backdrop-blur-[40px] rounded-[2rem] border border-white/10"></div>
          <div className="h-40 bg-white/5 backdrop-blur-[40px] rounded-[2rem] border border-white/10"></div>
          <div className="h-40 bg-white/5 backdrop-blur-[40px] rounded-[2rem] border border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner - Pure Neutral Glassmorphism */}
      <div className="relative overflow-hidden p-8 md:p-12 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] text-white font-semibold mb-6 shadow-lg backdrop-blur-md">
              SaaS Traceability Workspace
            </span>
            {/* Switched to thick, bold sans-serif */}
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-5 tracking-tight">
              Ringkasan Kepatuhan.
            </h1>
            <p className="text-sm md:text-base text-white/60 font-outfit max-w-2xl leading-relaxed">
              Pantau statistik geolokasi bidang lahan, jumlah pohon terdaftar, dan pemenuhan regulasi uji tuntas secara real-time untuk memastikan komoditas Anda siap ekspor.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <Link to="/dashboard/add-land" className="w-full sm:w-auto">
              <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl px-6 text-sm font-sans tracking-wide shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all">
                <PlusCircle className="size-4 mr-2.5" />
                Tambah Lahan
              </Button>
            </Link>
            <Link to="/dashboard/export" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10 hover:border-white/30 bg-white/5 backdrop-blur-md rounded-2xl px-6 text-sm font-sans tracking-wide transition-all shadow-xl">
                <FileSpreadsheet className="size-4 mr-2.5 opacity-70" />
                Laporan EUDR
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Onboarding Wizard Checklist */}
      {compliancePercentage < 100 && (
        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 text-white shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pb-6 pt-8 px-8 border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="size-4 text-white/70" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/70 font-semibold">Panduan Mulai Cepat</span>
                </div>
                <CardTitle className="text-3xl font-sans font-bold tracking-tight">Alur Persiapan Ekspor</CardTitle>
                <CardDescription className="text-white/50 text-sm mt-2 font-outfit max-w-2xl">
                  Selesaikan 3 langkah di bawah ini untuk memastikan produk hasil lahan Anda tersertifikasi dan lolos uji tuntas EUDR.
                </CardDescription>
              </div>
              <div className="shrink-0 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Progres Anda</span>
                  <span className="text-base font-sans font-bold text-white">
                    {lands.length === 0 ? "0 / 3 Langkah" : compliantLandsCount < lands.length ? "2 / 3 Langkah" : "3 / 3 Langkah"}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <span className="text-white font-sans font-bold text-xl">
                    {lands.length === 0 ? "0" : compliantLandsCount < lands.length ? "2" : "3"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden group ${lands.length > 0 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`size-12 rounded-2xl flex items-center justify-center font-sans font-bold text-lg ${lands.length > 0 ? 'bg-white text-black' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                    1
                  </div>
                  {lands.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-500 text-black font-semibold px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="size-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20">
                      Perlu Tindakan
                    </span>
                  )}
                </div>
                <h4 className="font-sans font-bold text-xl text-white mb-3 relative z-10">Tambah Lahan</h4>
                <p className="text-sm text-white/50 font-outfit leading-relaxed mb-8 relative z-10">
                  Registrasikan lokasi kebun, luas area, dan pemetaan poligon geolokasi yang akurat.
                </p>
                <Link to="/dashboard/add-land" className="relative z-10 block">
                  <Button className={`w-full rounded-2xl h-12 text-sm font-sans font-semibold transition-all ${lands.length > 0 ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-black'}`}>
                    {lands.length > 0 ? 'Kelola Lahan' : 'Mulai Sekarang'} <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className={`relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden group ${compliantLandsCount > 0 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`size-12 rounded-2xl flex items-center justify-center font-sans font-bold text-lg ${compliantLandsCount > 0 ? 'bg-white text-black' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                    2
                  </div>
                  {compliantLandsCount === lands.length && lands.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-500 text-black font-semibold px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="size-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20">
                      Perlu Perhatian
                    </span>
                  )}
                </div>
                <h4 className="font-sans font-bold text-xl text-white mb-3 relative z-10">Lengkapi Sertifikasi</h4>
                <p className="text-sm text-white/50 font-outfit leading-relaxed mb-8 relative z-10">
                  Unggah dokumen legal (SHM/SKT) dan berikan pernyataan deklarasi bebas deforestasi.
                </p>
                <Link to="/dashboard/lands" className="relative z-10 block">
                  <Button variant="outline" className={`w-full rounded-2xl h-12 text-sm font-sans font-semibold border-white/10 bg-transparent transition-all ${compliantLandsCount === lands.length && lands.length > 0 ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-white border-white/30 hover:bg-white/10'}`}>
                    Cek Database <ChevronRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className={`relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden group ${compliancePercentage === 100 && lands.length > 0 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`size-12 rounded-2xl flex items-center justify-center font-sans font-bold text-lg ${compliancePercentage === 100 && lands.length > 0 ? 'bg-white text-black' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                    3
                  </div>
                  {compliancePercentage === 100 && lands.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-500 text-black font-semibold px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="size-3.5" /> Siap Ekspor
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest bg-white/5 text-white/40 px-3 py-1.5 rounded-full border border-white/10">
                      Belum Siap
                    </span>
                  )}
                </div>
                <h4 className="font-sans font-bold text-xl text-white mb-3 relative z-10">Generate Berkas DDS</h4>
                <p className="text-sm text-white/50 font-outfit leading-relaxed mb-8 relative z-10">
                  Unduh berkas Due Diligence Statement (DDS) & ekspor data geolokasi format JSON/CSV.
                </p>
                <Link to="/dashboard/export" className="relative z-10 block">
                  <Button variant="outline" className={`w-full rounded-2xl h-12 text-sm font-sans font-semibold border-white/10 bg-transparent transition-all ${compliancePercentage === 100 && lands.length > 0 ? 'text-white border-white/30 hover:bg-white/10' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                    Buka Fitur <FileCheck className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3 Metric Tiles - Neutral Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl text-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-8 px-8 border-b border-white/5">
            <CardTitle className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/50">
              Total Bidang Lahan
            </CardTitle>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10">
              <MapPin className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-6">
            <div className="text-5xl md:text-6xl font-sans font-bold text-white mb-3 tracking-tight">{lands.length}</div>
            <p className="text-sm text-white/50 font-outfit flex items-center gap-2">
              Total Area: <span className="text-white font-mono bg-white/10 px-2.5 py-1 rounded-md border border-white/10">{totalArea.toFixed(2)} Ha</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl text-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-8 px-8 border-b border-white/5">
            <CardTitle className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/50">
              Estimasi Pohon
            </CardTitle>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10">
              <Trees className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-6">
            <div className="text-5xl md:text-6xl font-sans font-bold text-white mb-3 tracking-tight">{totalTrees.toLocaleString("id-ID")}</div>
            <p className="text-sm text-white/50 font-outfit">
              Tercatat dalam sistem traceability
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl text-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-8 px-8 border-b border-white/5">
            <CardTitle className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/50">
              Tingkat Kepatuhan
            </CardTitle>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10">
              <ShieldCheck className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-6">
            <div className={`text-5xl md:text-6xl font-sans font-bold tracking-tight mb-3 ${compliancePercentage === 100 ? 'text-emerald-400' : compliancePercentage >= 50 ? 'text-white' : 'text-rose-400'}`}>
              {compliancePercentage}%
            </div>
            <p className="text-sm text-white/50 font-outfit">
              {compliantLandsCount} dari {lands.length} lahan terverifikasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lands Table */}
      <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl text-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 border-b border-white/5">
          <div>
            <CardTitle className="font-sans text-3xl font-bold tracking-tight mb-2">Database Lahan</CardTitle>
            <CardDescription className="text-white/50 text-sm font-outfit">
              5 bidang lahan terakhir yang didaftarkan ke sistem
            </CardDescription>
          </div>
          <Link to="/dashboard/lands">
            <Button variant="ghost" className="text-white hover:text-black hover:bg-white text-sm font-sans font-semibold rounded-2xl px-6 h-12 transition-all">
              Lihat Seluruh Data <ChevronRight className="size-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentLands.length === 0 ? (
            <div className="text-center py-20 px-6 text-white/50 font-outfit">
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl w-fit mx-auto text-white border border-white/10 mb-8 shadow-inner">
                <Trees className="size-12 opacity-50" />
              </div>
              <h3 className="text-2xl font-sans font-bold text-white mb-3 tracking-tight">Belum Ada Data Lahan</h3>
              <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-8">
                Tambahkan lahan pertama Anda untuk mulai memantau kepatuhan EUDR dan menyimpan koordinat poligon.
              </p>
              <Link to="/dashboard/add-land">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl px-8 h-12 text-sm transition-all shadow-lg">
                  <PlusCircle className="size-4 mr-2.5" /> Registrasi Lahan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-white/40 border-b border-white/10">
                  <tr>
                    <th className="py-5 px-8 font-medium">Nama Lahan</th>
                    <th className="py-5 px-6 font-medium">Lokasi</th>
                    <th className="py-5 px-6 font-medium">Komoditas</th>
                    <th className="py-5 px-6 font-medium">Luas (Ha)</th>
                    <th className="py-5 px-6 font-medium">Status EUDR</th>
                    <th className="py-5 px-8 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-outfit text-sm">
                  {recentLands.map((land) => {
                    const compliant = isLandCompliant(land);
                    return (
                      <tr key={land.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-5 px-8 font-medium text-white/90">
                          {land.nama_lahan}
                        </td>
                        <td className="py-5 px-6 text-white/60">
                          <span className="flex items-center gap-2">
                            <MapPin className="size-3.5 opacity-50" />
                            {land.lokasi}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-white/60">
                          {land.jenis_komoditas || "-"}
                        </td>
                        <td className="py-5 px-6 font-mono text-white/80">
                          {land.luas.toFixed(2)}
                        </td>
                        <td className="py-5 px-6">
                          {compliant ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-500 text-black">
                              <CheckCircle2 className="size-3.5" /> Compliant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20">
                              <AlertTriangle className="size-3.5" /> Non-Compliant
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-8 text-right">
                          <Link to={`/dashboard/land/${land.id}`}>
                            <Button size="sm" variant="ghost" className="h-10 rounded-xl px-4 text-xs font-semibold text-white/50 hover:text-black hover:bg-white transition-all">
                              Detail <ExternalLink className="size-3.5 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
