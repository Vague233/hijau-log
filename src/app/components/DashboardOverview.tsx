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
        <div className="h-32 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
          <div className="h-40 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
          <div className="h-40 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner - Enhanced Glassmorphism */}
      <div className="relative overflow-hidden p-8 md:p-10 bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl group">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/30 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-900/40 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-5 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
              <span className="size-1.5 rounded-full bg-emerald-400"></span>
              SaaS Traceability Workspace
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-medium text-white mb-4 tracking-tight drop-shadow-md">
              Ringkasan Kepatuhan EUDR
            </h1>
            <p className="text-sm md:text-base text-white/60 font-outfit max-w-2xl leading-relaxed">
              Pantau statistik geolokasi bidang lahan, jumlah pohon terdaftar, dan pemenuhan regulasi uji tuntas secara real-time untuk memastikan komoditas Anda siap ekspor.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <Link to="/dashboard/add-land" className="w-full sm:w-auto">
              <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-6 text-sm font-outfit tracking-wide shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all border border-emerald-400/20">
                <PlusCircle className="size-4 mr-2.5" />
                Tambah Lahan
              </Button>
            </Link>
            <Link to="/dashboard/export" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 border-white/10 text-white hover:bg-white/10 hover:border-white/20 bg-black/20 backdrop-blur-md rounded-2xl px-6 text-sm font-outfit tracking-wide transition-all shadow-xl">
                <FileSpreadsheet className="size-4 mr-2.5 text-emerald-400" />
                Laporan EUDR
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Onboarding Wizard Checklist */}
      {compliancePercentage < 100 && (
        <Card className="bg-black/20 backdrop-blur-2xl border-white/10 text-white shadow-2xl rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>
          <CardHeader className="pb-5 pt-7 px-8 border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="size-4 text-emerald-400" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-emerald-400 font-semibold">Panduan Mulai Cepat</span>
                </div>
                <CardTitle className="text-2xl font-serif font-medium">Alur Persiapan Ekspor (EUDR)</CardTitle>
                <CardDescription className="text-white/60 text-sm mt-2 font-outfit max-w-2xl">
                  Selesaikan 3 langkah di bawah ini untuk memastikan produk hasil lahan Anda tersertifikasi dan lolos uji tuntas EUDR.
                </CardDescription>
              </div>
              <div className="shrink-0 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">Progres Anda</span>
                  <span className="text-sm font-outfit font-medium text-emerald-400">
                    {lands.length === 0 ? "0 / 3 Langkah" : compliantLandsCount < lands.length ? "2 / 3 Langkah" : "3 / 3 Langkah"}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-emerald-400 font-serif font-bold text-lg">
                    {lands.length === 0 ? "0" : compliantLandsCount < lands.length ? "2" : "3"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`relative p-6 rounded-[1.5rem] border transition-all duration-500 overflow-hidden group ${lands.length > 0 ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                {lands.length > 0 && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`size-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm ${lands.length > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                    1
                  </div>
                  {lands.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="size-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
                      Perlu Tindakan
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-medium text-lg text-white mb-2 relative z-10">Tambah Bidang Lahan</h4>
                <p className="text-sm text-white/50 font-outfit leading-relaxed mb-6 relative z-10">
                  Registrasikan lokasi kebun, luas area, dan pemetaan poligon geolokasi yang akurat.
                </p>
                <Link to="/dashboard/add-land" className="relative z-10 block">
                  <Button className={`w-full rounded-xl h-10 text-sm font-outfit transition-all ${lands.length > 0 ? 'bg-white/5 hover:bg-white/10 text-white/80' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]'}`}>
                    {lands.length > 0 ? 'Kelola Lahan' : 'Mulai Sekarang'} <ArrowRight className="size-3.5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className={`relative p-6 rounded-[1.5rem] border transition-all duration-500 overflow-hidden group ${compliantLandsCount > 0 ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                {compliantLandsCount > 0 && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`size-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm ${compliantLandsCount > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                    2
                  </div>
                  {compliantLandsCount === lands.length && lands.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="size-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
                      Perlu Perhatian
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-medium text-lg text-white mb-2 relative z-10">Lengkapi Sertifikasi</h4>
                <p className="text-sm text-white/50 font-outfit leading-relaxed mb-6 relative z-10">
                  Unggah dokumen legal (SHM/SKT) dan berikan pernyataan deklarasi bebas deforestasi.
                </p>
                <Link to="/dashboard/lands" className="relative z-10 block">
                  <Button variant="outline" className={`w-full rounded-xl h-10 text-sm font-outfit border-white/10 bg-transparent transition-all ${compliantLandsCount === lands.length && lands.length > 0 ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10'}`}>
                    Cek Database Lahan <ChevronRight className="size-3.5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className={`relative p-6 rounded-[1.5rem] border transition-all duration-500 overflow-hidden group ${compliancePercentage === 100 && lands.length > 0 ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                {compliancePercentage === 100 && lands.length > 0 && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`size-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm ${compliancePercentage === 100 && lands.length > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                    3
                  </div>
                  {compliancePercentage === 100 && lands.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="size-3.5" /> Siap Ekspor
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest bg-white/5 text-white/40 px-3 py-1.5 rounded-full border border-white/10">
                      Belum Siap
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-medium text-lg text-white mb-2 relative z-10">Generate Berkas DDS</h4>
                <p className="text-sm text-white/50 font-outfit leading-relaxed mb-6 relative z-10">
                  Unduh berkas Due Diligence Statement (DDS) & ekspor data geolokasi format JSON/CSV.
                </p>
                <Link to="/dashboard/export" className="relative z-10 block">
                  <Button variant="outline" className={`w-full rounded-xl h-10 text-sm font-outfit border-white/10 bg-transparent transition-all ${compliancePercentage === 100 && lands.length > 0 ? 'text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                    Buka Fitur Ekspor <FileCheck className="size-3.5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3 Metric Tiles - High Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/20 backdrop-blur-2xl border-white/10 shadow-2xl text-white rounded-[2rem] overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-7">
            <CardTitle className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/50">
              Total Bidang Lahan
            </CardTitle>
            <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl text-emerald-400 border border-white/10">
              <MapPin className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-6 relative z-10">
            <div className="text-4xl md:text-5xl font-serif font-medium text-white mb-2 drop-shadow-sm">{lands.length}</div>
            <p className="text-sm text-white/50 font-outfit flex items-center gap-2">
              Total Area: <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{totalArea.toFixed(2)} Ha</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-2xl border-white/10 shadow-2xl text-white rounded-[2rem] overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-7">
            <CardTitle className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/50">
              Estimasi Pohon
            </CardTitle>
            <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl text-emerald-400 border border-white/10">
              <Trees className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-6 relative z-10">
            <div className="text-4xl md:text-5xl font-serif font-medium text-white mb-2 drop-shadow-sm">{totalTrees.toLocaleString("id-ID")}</div>
            <p className="text-sm text-white/50 font-outfit">
              Tercatat dalam sistem traceability
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-2xl border-white/10 shadow-2xl text-white rounded-[2rem] overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-7">
            <CardTitle className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/50">
              Tingkat Kepatuhan
            </CardTitle>
            <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl text-emerald-400 border border-white/10">
              <ShieldCheck className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-6 relative z-10">
            <div className={`text-4xl md:text-5xl font-serif font-medium mb-2 drop-shadow-sm ${compliancePercentage === 100 ? 'text-emerald-400' : compliancePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {compliancePercentage}%
            </div>
            <p className="text-sm text-white/50 font-outfit">
              {compliantLandsCount} dari {lands.length} lahan terverifikasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lands Table */}
      <Card className="bg-black/20 backdrop-blur-2xl border-white/10 shadow-2xl text-white rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 border-b border-white/5">
          <div>
            <CardTitle className="font-serif text-2xl font-medium mb-1">Database Lahan Terbaru</CardTitle>
            <CardDescription className="text-white/50 text-sm font-outfit">
              5 bidang lahan terakhir yang didaftarkan ke sistem
            </CardDescription>
          </div>
          <Link to="/dashboard/lands">
            <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-sm font-outfit rounded-xl px-5 h-10">
              Lihat Seluruh Data <ChevronRight className="size-4 ml-1.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentLands.length === 0 ? (
            <div className="text-center py-16 px-6 text-white/50 font-outfit">
              <div className="p-5 bg-white/5 backdrop-blur-md rounded-3xl w-fit mx-auto text-emerald-400 border border-white/10 mb-6 shadow-inner">
                <Trees className="size-10 opacity-80" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Belum Ada Data Lahan</h3>
              <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-6">
                Tambahkan lahan pertama Anda untuk mulai memantau kepatuhan EUDR dan menyimpan koordinat poligon.
              </p>
              <Link to="/dashboard/add-land">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 h-11 text-sm shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] transition-all">
                  <PlusCircle className="size-4 mr-2" /> Registrasi Lahan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-white/40 border-b border-white/5">
                  <tr>
                    <th className="py-4 px-8 font-medium">Nama Lahan</th>
                    <th className="py-4 px-6 font-medium">Lokasi</th>
                    <th className="py-4 px-6 font-medium">Komoditas</th>
                    <th className="py-4 px-6 font-medium">Luas (Ha)</th>
                    <th className="py-4 px-6 font-medium">Status EUDR</th>
                    <th className="py-4 px-8 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-outfit text-sm">
                  {recentLands.map((land) => {
                    const compliant = isLandCompliant(land);
                    return (
                      <tr key={land.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-8 font-medium text-white/90">
                          {land.nama_lahan}
                        </td>
                        <td className="py-4 px-6 text-white/60">
                          <span className="flex items-center gap-2">
                            <MapPin className="size-3.5 text-emerald-500 opacity-70" />
                            {land.lokasi}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white/60">
                          {land.jenis_komoditas || "-"}
                        </td>
                        <td className="py-4 px-6 font-mono text-emerald-400/90">
                          {land.luas.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          {compliant ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="size-3.5" /> Compliant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <AlertTriangle className="size-3.5" /> Non-Compliant
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-8 text-right">
                          <Link to={`/dashboard/land/${land.id}`}>
                            <Button size="sm" variant="ghost" className="h-9 rounded-xl px-4 text-xs font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                              Detail <ExternalLink className="size-3.5 ml-1.5 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
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
