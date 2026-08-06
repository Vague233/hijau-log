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
  HelpCircle,
  ArrowRight,
  FileCheck,
  Globe,
  Compass
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
        <div className="h-24 bg-white/5 rounded-2xl border border-white/10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-950/40 via-black/40 to-emerald-950/20 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold block mb-1">
            SaaS Traceability Workspace
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
            Ringkasan Kepatuhan EUDR
          </h1>
          <p className="text-sm text-white/70 font-outfit max-w-xl">
            Pantau statistik geolokasi bidang lahan, jumlah pohon terdaftar, dan pemenuhan regulasi uji tuntas secara real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/add-land">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 text-sm shadow-lg shadow-emerald-950/50">
              <PlusCircle className="size-4 mr-2" />
              Tambah Lahan
            </Button>
          </Link>
          <Link to="/dashboard/export">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full px-5 text-sm">
              <FileSpreadsheet className="size-4 mr-2 text-emerald-400" />
              Laporan EUDR
            </Button>
          </Link>
        </div>
      </div>

      {/* Onboarding Wizard Checklist (for new users or when compliance < 100%) */}
      {compliancePercentage < 100 && (
        <Card className="bg-gradient-to-r from-emerald-900/30 via-white/5 to-black/40 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <Compass className="size-5" />
                <span className="text-xs font-mono uppercase tracking-widest font-semibold">Panduan Mulai Cepat Eksportir</span>
              </div>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                Progres: {lands.length === 0 ? "0/3 Langkah" : compliantLandsCount < lands.length ? "2/3 Langkah" : "3/3 Langkah"}
              </span>
            </div>
            <CardTitle className="text-xl font-serif mt-1">Alur Persiapan Ekspor Uni Eropa (EUDR)</CardTitle>
            <CardDescription className="text-white/70 text-xs">
              Ikuti 3 langkah mudah di bawah ini untuk memastikan produk hasil lahan Anda lolos uji tuntas EUDR sebelum dikirim ke Eropa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-2xl border transition-all ${lands.length > 0 ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="size-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">1</span>
                  {lands.length > 0 ? (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Selesai
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Perlu Tindakan</span>
                  )}
                </div>
                <h4 className="font-semibold text-sm text-white mb-1">Tambah Bidang Lahan</h4>
                <p className="text-xs text-white/60 mb-3">Registrasikan lokasi kebun, luas hektar, dan pemetaan poligon geolokasi.</p>
                <Link to="/dashboard/add-land">
                  <Button size="sm" className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                    Tambah Lahan <ArrowRight className="size-3 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className={`p-4 rounded-2xl border transition-all ${compliantLandsCount > 0 ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="size-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">2</span>
                  {compliantLandsCount === lands.length && lands.length > 0 ? (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Selesai
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Perlu Perhatian</span>
                  )}
                </div>
                <h4 className="font-semibold text-sm text-white mb-1">Lengkapi Sertifikasi Legalitas</h4>
                <p className="text-xs text-white/60 mb-3">Unggah dokumen legal (SHM/SKT) & nyatakan deklarasi bebas deforestasi.</p>
                <Link to="/dashboard/lands">
                  <Button size="sm" variant="outline" className="w-full text-xs border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl">
                    Cek Database Lahan <ChevronRight className="size-3 ml-1 text-emerald-400" />
                  </Button>
                </Link>
              </div>

              <div className={`p-4 rounded-2xl border transition-all ${compliancePercentage === 100 ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="size-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">3</span>
                  {compliancePercentage === 100 ? (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Siap Ekspor
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-white/10 text-white/50 px-2 py-0.5 rounded-full">Belum Siap</span>
                  )}
                </div>
                <h4 className="font-semibold text-sm text-white mb-1">Generate Berkas DDS & QR Code</h4>
                <p className="text-xs text-white/60 mb-3">Unduh berkas Due Diligence Statement (DDS) & ekspor format JSON/CSV EUDR.</p>
                <Link to="/dashboard/export">
                  <Button size="sm" variant="outline" className="w-full text-xs border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl">
                    Buka Fitur Ekspor <FileCheck className="size-3 ml-1 text-emerald-400" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-outfit font-medium text-white/70">
              Total Bidang Lahan
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Trees className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-serif">{lands.length}</div>
            <p className="text-xs text-white/50 mt-1 font-outfit">
              Total Luas: <span className="text-emerald-400 font-mono font-medium">{totalArea.toFixed(2)} Ha</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-outfit font-medium text-white/70">
              Estimasi Pohon Terdaftar
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Trees className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-serif">{totalTrees.toLocaleString("id-ID")}</div>
            <p className="text-xs text-white/50 mt-1 font-outfit">
              Tercatat dalam sistem keterlacakan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-outfit font-medium text-white/70">
              Tingkat Kepatuhan EUDR
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold font-serif ${compliancePercentage === 100 ? 'text-emerald-400' : compliancePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {compliancePercentage}%
            </div>
            <p className="text-xs text-white/50 mt-1 font-outfit">
              {compliantLandsCount} dari {lands.length} lahan memenuhi standar EUDR
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lands Table */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-serif text-xl">Database Lahan Terbaru</CardTitle>
            <CardDescription className="text-white/60 text-xs font-outfit">
              5 bidang lahan yang paling baru terdaftar di platform
            </CardDescription>
          </div>
          <Link to="/dashboard/lands">
            <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-white/5 text-xs">
              Lihat Semua <ChevronRight className="size-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLands.length === 0 ? (
            <div className="text-center py-12 text-white/50 text-sm font-outfit space-y-3">
              <div className="p-4 bg-white/5 rounded-full w-fit mx-auto text-emerald-400 border border-white/10">
                <Trees className="size-8" />
              </div>
              <p className="text-white/80 font-medium">Belum ada lahan terdaftar</p>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Silakan tambahkan lahan pertama Anda untuk memulai pengumpulan koordinat geolokasi dan sertifikasi uji tuntas EUDR.
              </p>
              <Link to="/dashboard/add-land" className="inline-block mt-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 text-xs">
                  <PlusCircle className="size-4 mr-2" /> Tambah Lahan Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-mono uppercase text-white/40 border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Nama Lahan</th>
                    <th className="py-3 px-4">Lokasi</th>
                    <th className="py-3 px-4">Komoditas</th>
                    <th className="py-3 px-4">Luas (Ha)</th>
                    <th className="py-3 px-4">Status EUDR</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-outfit">
                  {recentLands.map((land) => {
                    const compliant = isLandCompliant(land);
                    return (
                      <tr key={land.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">
                          {land.nama_lahan}
                        </td>
                        <td className="py-3.5 px-4 text-white/70">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-emerald-400" />
                            {land.lokasi}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white/80">
                          {land.jenis_komoditas || "-"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400">
                          {land.luas} Ha
                        </td>
                        <td className="py-3.5 px-4">
                          {compliant ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="size-3" /> Compliant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <AlertTriangle className="size-3" /> Non-Compliant
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link to={`/dashboard/land/${land.id}`}>
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs text-white/80 hover:text-white hover:bg-white/10">
                              Detail <ExternalLink className="size-3 ml-1 text-emerald-400" />
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
