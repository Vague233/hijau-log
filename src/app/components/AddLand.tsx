import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { MapPin, Upload, Leaf, FileText, CheckCircle2, RotateCcw, Undo2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import { MapContainer, TileLayer, Polygon as LeafletPolygon, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon paths
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


interface AddLandProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

// Komponen Pembantu untuk Menggerakkan Kamera Peta (FlyTo)
function MapController({ targetLocation }: { targetLocation: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (targetLocation) {
      map.flyTo(targetLocation, 17, { animate: true, duration: 1.5 });
    }
  }, [targetLocation, map]);
  return null;
}

// Komponen Pembantu untuk Menggambar Poligon di Leaflet
function PolygonDrawer({ polygonCoords, setPolygonCoords }: { polygonCoords: [number, number][], setPolygonCoords: (p: [number, number][]) => void }) {
  useMapEvents({
    click(e) {
      const newPolygon = [...polygonCoords, [e.latlng.lat, e.latlng.lng] as [number, number]];
      setPolygonCoords(newPolygon);
    },
  });

  return polygonCoords.length > 0 ? <LeafletPolygon positions={polygonCoords} pathOptions={{ color: '#34d399', weight: 3, fillColor: '#34d399', fillOpacity: 0.2 }} /> : null;
}

export function AddLand({ onBack, onSuccess }: AddLandProps = {}) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_lahan: "",
    lokasi: "",
    luas: "",
    jumlah_pohon: "",
    tanggal_panen: "",
    jenis_komoditas: "",
    nama_ilmiah: "",
    bebas_deforestasi: false,
    notes: "",
  });

  // State untuk Foto Lahan
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // State untuk Dokumen Legalitas
  const legalDocRef = useRef<HTMLInputElement>(null);
  const [legalDoc, setLegalDoc] = useState<File | null>(null);
  const [legalDocPreviewUrl, setLegalDocPreviewUrl] = useState<string>("");

  // State untuk Poligon Peta & GPS Interaktif
  const [polygonCoords, setPolygonCoords] = useState<[number, number][]>([]);
  const [pendingLocation, setPendingLocation] = useState<[number, number] | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null);
  const defaultCenter: [number, number] = [-0.7893, 113.9213];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleLegalDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setLegalDoc(selectedFile);
      // Jika gambar, buat preview, jika PDF tidak perlu preview (hanya nama file)
      if (selectedFile.type.startsWith('image/')) {
        setLegalDocPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setLegalDocPreviewUrl("pdf"); // Penanda bahwa ini file non-image
      }
    }
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      toast.info("Mengambil titik lokasi GPS Anda...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoord: [number, number] = [position.coords.latitude, position.coords.longitude];
          setPendingLocation(newCoord);
          setFlyToTarget(newCoord);
          toast.success("Lokasi ditemukan! Tinjau posisi pada peta lalu klik 'Simpan Titik'.");
        },
        (error) => {
          toast.error("Tidak dapat mengambil lokasi. Pastikan izin GPS aktif.");
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error("Geolocation tidak didukung oleh browser Anda.");
    }
  };

  const confirmPendingLocation = () => {
    if (pendingLocation) {
      setPolygonCoords(prev => [...prev, pendingLocation]);
      setPendingLocation(null);
      toast.success("Titik lokasi berhasil ditambahkan ke poligon!");
    }
  };

  const cancelPendingLocation = () => {
    setPendingLocation(null);
  };

  const handleUndo = () => {
    if (polygonCoords.length > 0) {
      setPolygonCoords(prev => prev.slice(0, -1));
      toast.info("Titik terakhir berhasil dihapus.");
    }
  };

  const clearPolygon = () => {
    setPolygonCoords([]);
    setPendingLocation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Sesi tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!formData.bebas_deforestasi) {
      toast.error("Anda harus menyetujui pernyataan bebas deforestasi (Cut-off Date 31 Des 2020).");
      return;
    }

    if (polygonCoords.length < 3 && parseFloat(formData.luas) > 4) {
      toast.warning("Lahan di atas 4 Hektar sangat disarankan untuk memiliki minimal 3 titik poligon.");
      // Tapi kita tetap izinkan lanjut jika mereka memaksa
    }

    setLoading(true);

    let fotoUrl = null;
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("lahan_photos").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("lahan_photos").getPublicUrl(filePath);
        fotoUrl = publicUrlData.publicUrl;
      } catch (err: any) {
        toast.error(`Gagal mengunggah foto: ${err.message}`);
        setLoading(false);
        return;
      }
    }

    let legalDocUrl = null;
    if (legalDoc) {
      try {
        const fileExt = legalDoc.name.split('.').pop();
        const fileName = `legal_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("legal_documents").upload(filePath, legalDoc);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("legal_documents").getPublicUrl(filePath);
        legalDocUrl = publicUrlData.publicUrl;
      } catch (err: any) {
        toast.error(`Gagal mengunggah dokumen legalitas: ${err.message}`);
        setLoading(false);
        return;
      }
    }

    // Persiapkan data poligon, jika kurang dari 3 titik (misal 1 titik), EUDR memperbolehkan untuk < 4ha.
    // Kita simpan saja array koordinatnya.
    const finalPolygonData = polygonCoords.length > 0 ? polygonCoords : null;

    const { error } = await supabase.from("lahan").insert([
      {
        user_id: session.user.id,
        nama_lahan: formData.nama_lahan,
        lokasi: formData.lokasi,
        luas: parseFloat(formData.luas) || 0,
        jumlah_pohon: parseInt(formData.jumlah_pohon) || 0,
        tanggal_panen: formData.tanggal_panen || null,
        jenis_komoditas: formData.jenis_komoditas,
        nama_ilmiah: formData.nama_ilmiah,
        dokumen_legalitas: legalDocUrl,
        bebas_deforestasi: formData.bebas_deforestasi,
        polygon: finalPolygonData,
        foto: fotoUrl,
      },
    ]);

    if (error) {
      toast.error(`Gagal mendaftarkan lahan: ${error.message}`);
      setLoading(false);
    } else {
      toast.success("Lahan berhasil didaftarkan secara penuh (Kepatuhan EUDR)!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard/lands");
      }
    }
  };

  return (
    <div className="dark container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Leaf className="size-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Tambah Lahan / Registrasi Pohon
            </h1>
            <p className="text-white/70">
              Input data lahan secara komprehensif untuk Kepatuhan EUDR Penuh
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Part 1: Land Information */}
          <Card className="mb-6 bg-white/5 backdrop-blur-lg border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle>
                1. Informasi Lahan & Komoditas
              </CardTitle>
              <CardDescription>
                Informasi administratif dan detail komoditas yang dipanen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_lahan">Nama Lahan *</Label>
                  <Input
                    id="nama_lahan"
                    name="nama_lahan"
                    placeholder="e.g., Kebun Sawit A"
                    value={formData.nama_lahan}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lokasi">Lokasi (Kabupaten/Desa) *</Label>
                  <Input
                    id="lokasi"
                    name="lokasi"
                    placeholder="e.g., Kabupaten/Kota"
                    value={formData.lokasi}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="luas">Luas Area (Hektar) *</Label>
                  <Input
                    id="luas"
                    name="luas"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.5"
                    value={formData.luas}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jumlah_pohon">Estimasi Jumlah Pohon *</Label>
                  <Input
                    id="jumlah_pohon"
                    name="jumlah_pohon"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.jumlah_pohon}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="jenis_komoditas">Jenis Komoditas (Umum) *</Label>
                  <Input
                    id="jenis_komoditas"
                    name="jenis_komoditas"
                    placeholder="e.g., Kayu Jati, Karet"
                    value={formData.jenis_komoditas}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_ilmiah">Nama Ilmiah (Spesies) *</Label>
                  <Input
                    id="nama_ilmiah"
                    name="nama_ilmiah"
                    placeholder="e.g., Tectona grandis"
                    value={formData.nama_ilmiah}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 italic font-mono text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_panen">Tanggal / Waktu Panen *</Label>
                  <Input
                    id="tanggal_panen"
                    name="tanggal_panen"
                    type="date"
                    value={formData.tanggal_panen}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Part 2: Geo-Tagging Map */}
          <Card className="mb-6 bg-white/5 backdrop-blur-lg border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>2. Geo-Tagging & Poligon Lahan</span>
                <span className="text-xs font-normal px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">EUDR Geolocation</span>
              </CardTitle>
              <CardDescription>
                Wajib poligon (klik lebih dari 3 titik batas lahan pada peta) untuk lahan {'>'} 4 Ha. Untuk {`<`} 4 Ha, 1 titik lokasi diperbolehkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="rounded-xl overflow-hidden border border-white/20 relative z-10" style={{ height: '380px' }}>
                <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  />
                  <MapController targetLocation={flyToTarget} />
                  <PolygonDrawer polygonCoords={polygonCoords} setPolygonCoords={setPolygonCoords} />
                  
                  {/* Titik Lokasi Sementara yang Belum Dikonfirmasi */}
                  {pendingLocation && (
                    <CircleMarker 
                      center={pendingLocation} 
                      radius={10} 
                      pathOptions={{ color: '#fbbf24', fillColor: '#f59e0b', fillOpacity: 0.9, weight: 3 }} 
                    />
                  )}

                  {/* Titik-Titik Poligon yang Sudah Tersimpan */}
                  {polygonCoords.map((coord, idx) => (
                    <CircleMarker 
                      key={idx} 
                      center={coord} 
                      radius={5} 
                      pathOptions={{ color: '#10b981', fillColor: '#34d399', fillOpacity: 1, weight: 2 }} 
                    />
                  ))}
                </MapContainer>
                
                {/* Floating Confirmation Bar untuk Titik GPS */}
                {pendingLocation && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-black/85 backdrop-blur-md border border-amber-500/50 px-4 py-2 rounded-xl flex items-center gap-3 shadow-2xl text-xs">
                    <span className="text-amber-300 font-medium flex items-center gap-1.5">
                      <MapPin className="size-4 animate-bounce text-amber-400" /> Tambahkan titik GPS ini?
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={confirmPendingLocation}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-3 text-xs border-0"
                    >
                      <Check className="size-3 mr-1" /> Simpan Titik
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={cancelPendingLocation}
                      className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs"
                    >
                      <X className="size-3 mr-1" /> Batal
                    </Button>
                  </div>
                )}

                {/* Map Control Buttons */}
                <div className="absolute bottom-4 left-4 z-[400] flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={handleDetectLocation}
                    className="bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white shadow-lg"
                    size="sm"
                  >
                    <MapPin className="size-4 mr-2 text-emerald-400" />
                    Deteksi Lokasi Saya
                  </Button>

                  <Button
                    type="button"
                    onClick={handleUndo}
                    disabled={polygonCoords.length === 0}
                    className="bg-black/75 hover:bg-black/90 disabled:opacity-40 backdrop-blur-md border border-white/20 text-white shadow-lg"
                    size="sm"
                  >
                    <Undo2 className="size-4 mr-2 text-amber-400" />
                    Undo Titik
                  </Button>

                  <Button
                    type="button"
                    onClick={clearPolygon}
                    disabled={polygonCoords.length === 0}
                    className="bg-red-500/60 hover:bg-red-500/80 disabled:opacity-40 backdrop-blur-md border border-red-500/20 text-white shadow-lg"
                    size="sm"
                  >
                    <RotateCcw className="size-4 mr-2" />
                    Reset Poligon
                  </Button>
                </div>

                <div className="absolute top-4 right-4 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono">
                  Titik Tersimpan: <span className="text-emerald-400 font-bold">{polygonCoords.length}</span>
                </div>
              </div>

              {polygonCoords.length > 0 && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg max-h-32 overflow-y-auto font-mono text-xs text-white/60">
                  {JSON.stringify(polygonCoords)}
                </div>
              )}

            </CardContent>
          </Card>

          {/* Part 3: Kepatuhan EUDR */}
          <Card className="mb-6 bg-white/5 backdrop-blur-lg border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>3. Kepatuhan & Legalitas</span>
                <span className="text-xs font-normal px-2 py-1 bg-amber-500/20 text-amber-400 rounded">Mandatory EUDR</span>
              </CardTitle>
              <CardDescription>
                Unggah dokumen legalitas (SHM/HGU/SKT) dan deklarasi bebas deforestasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Legal Doc Upload */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <FileText className="size-4 text-emerald-400" />
                    Bukti Legalitas Lahan *
                  </Label>
                  <input 
                    type="file" 
                    ref={legalDocRef} 
                    onChange={handleLegalDocChange} 
                    accept="image/*,.pdf" 
                    className="hidden" 
                  />
                  {!legalDoc ? (
                    <div 
                      onClick={() => legalDocRef.current?.click()}
                      className="border-2 border-dashed border-emerald-500/30 rounded-lg p-6 text-center hover:bg-emerald-500/10 transition-colors cursor-pointer bg-white/5"
                    >
                      <Upload className="size-8 mx-auto mb-2 text-emerald-400/70" />
                      <p className="text-sm font-medium text-emerald-100">Unggah SHM / SKT / HGU</p>
                      <p className="text-xs text-white/40 mt-1">Format: PDF, JPG, PNG (Maks 5MB)</p>
                    </div>
                  ) : (
                    <div className="relative border border-emerald-500/30 rounded-lg p-4 bg-emerald-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="size-8 text-emerald-400 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-bold text-white truncate">{legalDoc.name}</p>
                          <p className="text-xs text-emerald-200">Siap diunggah</p>
                        </div>
                      </div>
                      <Button 
                        type="button" variant="ghost" size="sm" 
                        onClick={() => { setLegalDoc(null); setLegalDocPreviewUrl(""); if (legalDocRef.current) legalDocRef.current.value = ""; }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </div>

                {/* Optional Photo Upload */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-white/70">
                    <Upload className="size-4" />
                    Foto Lahan (Opsional)
                  </Label>
                  <input 
                    type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" 
                  />
                  {!previewUrl ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-white/70">Klik untuk mengunggah foto</p>
                    </div>
                  ) : (
                    <div className="relative border border-white/20 rounded-lg overflow-hidden group h-[120px]">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" variant="destructive" size="sm" 
                          onClick={() => { setFile(null); setPreviewUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        >
                          Hapus Foto
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Deforestation Declaration */}
              <div className="mt-6 p-4 border border-amber-500/30 bg-amber-500/10 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-1">
                    <input 
                      type="checkbox" 
                      name="bebas_deforestasi"
                      checked={formData.bebas_deforestasi}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-amber-500/50 bg-black/50 text-amber-500 focus:ring-amber-500/50 cursor-pointer"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-amber-400 mb-1 flex items-center gap-2">
                      Deklarasi Bebas Deforestasi (EUDR Pasal 3a)
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Saya secara sadar dan bertanggung jawab menyatakan bahwa lahan tempat komoditas ini diproduksi <strong>tidak mengalami deforestasi</strong> atau degradasi hutan yang terjadi setelah batas waktu (Cut-off Date) <strong>31 Desember 2020</strong>. Segala bentuk pemalsuan data dapat berakibat pada diskualifikasi pasar ekspor.
                    </p>
                  </div>
                </label>
              </div>

            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="mb-6 bg-white/5 backdrop-blur-lg border-white/10 text-white shadow-xl">
            <CardContent className="pt-6">
              <Label className="mb-2 block">Catatan Tambahan (Opsional)</Label>
              <Textarea
                name="notes"
                placeholder="Catatan lainnya terkait lokasi atau proses panen..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-6 text-lg" disabled={loading}>
              {loading ? "Menyimpan ke Database..." : "Simpan & Verifikasi Kepatuhan"}
            </Button>
            {onBack ? (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent py-6"
              >
                Batal
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent py-6"
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}