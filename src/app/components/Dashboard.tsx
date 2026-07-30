import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trees, MapPin, QrCode, FileText, TrendingUp, Package, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

export function Dashboard() {
  const { session } = useAuth();
  const [totalLands, setTotalLands] = useState<number>(0);
  const [totalTrees, setTotalTrees] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user) return;
      
      const { count: landCount } = await supabase
        .from("lahan")
        .select("*", { count: "exact", head: true })
        .eq('user_id', session.user.id);
        
      setTotalLands(landCount || 0);

      const { data: lands } = await supabase
        .from("lahan")
        .select("jumlah_pohon")
        .eq('user_id', session.user.id);

      if (lands) {
        const trees = lands.reduce((acc, curr) => acc + (curr.jumlah_pohon || 0), 0);
        setTotalTrees(trees);
      }
    };

    fetchStats();
  }, [session]);

  const stats = [
    {
      title: "Total Lahan Terdaftar",
      value: totalLands.toString(),
      icon: MapPin,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Pohon Teregistrasi",
      value: totalTrees.toString(),
      icon: Trees,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      title: "Kode QR Dibuat",
      value: totalLands.toString(), // Simplified for now
      icon: QrCode,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Kepatuhan EUDR",
      value: "100%",
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  const recentActivities = [
    { id: 1, action: "Autentikasi berhasil", location: "Sistem HijauLog", time: "Baru saja" },
    { id: 2, action: "Kesiapan kepatuhan EUDR", location: "Status: Hijau", time: "Hari ini" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 font-bold text-gray-900 flex items-center gap-2">
          <Leaf className="text-emerald-600 size-8" />
          EUDR Compliance Dashboard
        </h1>
        <p className="text-gray-600">Sistem Geo-Tagging Traceability untuk Kepatuhan EUDR</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-emerald-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 border-emerald-100">
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses cepat ke fungsi utama sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/add-land">
              <Button className="w-full h-24 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
                <MapPin className="size-6" />
                <span>Tambah Lahan/Pohon</span>
              </Button>
            </Link>
            <Link to="/dashboard/lands">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                <Trees className="size-6" />
                <span>Lihat Semua Lahan</span>
              </Button>
            </Link>
            <Link to="/dashboard/export">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                <Package className="size-6" />
                <span>Ekspor Data (DDS)</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Flow Diagram */}
        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle>Alur Kepatuhan EUDR</CardTitle>
            <CardDescription>Alur sistem traceability geo-tagging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 text-sm">1</div>
                <div className="flex-1 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-medium">Registrasi Lahan & Geo-Tagging</p>
                  <p className="text-xs text-gray-600">Input data lahan & koordinat GPS (Poligon)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-teal-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 text-sm">2</div>
                <div className="flex-1 p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm font-medium">Pembuatan Kode QR</p>
                  <p className="text-xs text-gray-600">Generate QR dengan data traceability</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 text-sm">3</div>
                <div className="flex-1 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">Ekspor & Registrasi DDS</p>
                  <p className="text-xs text-gray-600">Persiapkan paket data kepatuhan Due Diligence Statement</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-lime-600 text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 text-sm">4</div>
                <div className="flex-1 p-3 bg-lime-50 rounded-lg">
                  <p className="text-sm font-medium">Verifikasi EU</p>
                  <p className="text-xs text-gray-600">Submit untuk kepatuhan EUDR di pelabuhan tujuan</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas terbaru dalam sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 border-emerald-100">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                    <TrendingUp className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.location}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}