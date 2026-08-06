import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Trees, QrCode, Eye, Leaf, Maximize } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import { toast } from "sonner";

interface Land {
  id: string;
  nama_lahan: string;
  lokasi: string;
  luas: number;
  jumlah_pohon: number;
  polygon: any;
  created_at: string;
  foto?: string;
  tanggal_panen?: string;
  jenis_komoditas?: string;
  nama_ilmiah?: string;
  dokumen_legalitas?: string;
  bebas_deforestasi?: boolean;
}

interface LandListProps {
  onBack?: () => void;
}

export function LandList({ onBack }: LandListProps = {}) {
  const { session } = useAuth();
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from("lahan")
          .select("*")
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLands(data || []);
      } catch (error: any) {
        toast.error(`Gagal memuat data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, [session]);

  return (
    <div className="dark container mx-auto px-4 py-8 text-white">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Leaf className="size-8 text-emerald-400 hidden md:block" />
          <div>
            <h1 className="text-3xl font-bold text-white">Database Lahan</h1>
            <p className="text-white/70">Daftar lahan yang telah teregistrasi</p>
          </div>
        </div>
        <Link to="/dashboard/add-land">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">
            <MapPin className="size-4 mr-2" />
            Tambah Lahan Baru
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-white/70">Memuat data lahan...</p>
          </CardContent>
        </Card>
      ) : lands.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
          <CardContent className="py-12 text-center">
            <MapPin className="size-12 mx-auto mb-4 text-emerald-400/50" />
            <h3 className="text-xl mb-2 font-medium text-white">Belum Ada Lahan Terdaftar</h3>
            <p className="text-white/70 mb-6">Mulai dengan menambahkan lahan pertama Anda</p>
            {!onBack && (
              <Link to="/dashboard/add-land">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">Tambah Lahan</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <Card key={land.id} className="hover:shadow-2xl transition-shadow bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-start gap-2">
                      <span className="text-emerald-400">{land.nama_lahan}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 text-white/70">{land.lokasi}</CardDescription>
                  </div>
                  {land.foto ? (
                    <img src={land.foto} alt="Foto Lahan" className="w-16 h-16 object-cover rounded-md border border-white/10 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded-md border border-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="size-6 text-white/30" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  {land.polygon && (
                    <div className="flex items-start gap-2 text-white/70">
                      <MapPin className="size-4 mt-0.5" />
                      <span className="line-clamp-1" title={JSON.stringify(land.polygon)}>
                        Poligon: {Array.isArray(land.polygon) ? `${land.polygon.length} Titik Koordinat` : 'Data Tersedia'}
                      </span>
                    </div>
                  )}
                  {land.jenis_komoditas && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Leaf className="size-4" />
                      <span>Komoditas: {land.jenis_komoditas}</span>
                    </div>
                  )}
                  {land.luas != null && (
                    <div className="text-white/70 flex items-center gap-2">
                       <Maximize className="size-4" />
                       Luas: {land.luas} hektar
                    </div>
                  )}
                  {land.jumlah_pohon != null && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Trees className="size-4" />
                      <span>Estimasi pohon: {land.jumlah_pohon}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-2">
                  <Link to={`/dashboard/land/${land.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent" size="sm">
                      <Eye className="size-4 mr-2" />
                      Lihat Detail
                    </Button>
                  </Link>
                  <Link to={`/dashboard/land/${land.id}/qr`} className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0" size="sm">
                      <QrCode className="size-4 mr-2" />
                      Kode QR
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}