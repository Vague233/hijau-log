import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin, Target, ShieldCheck, Globe, Leaf } from "lucide-react";
import { Link } from "react-router";

const teamMembers = [
  {
    name: "Ni Wayan Saci Rani",
    role: "Kepala Teknologi",
    image:
      "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMGJ1c2luZXNzJTIwb21hbWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMzM3MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Ketut Bayu Cipta Nugraha",
    role: "Insinyur Sistem",
    image:
      "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzEyNzYyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Danar",
    role: "Manajer Produk",
    image:
      "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMGJ1c2luZXNzJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMzM3MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const features = [
  {
    icon: MapPin,
    title: "Pemetaan Poligon Presisi",
    description:
      "Merekam titik koordinat dan poligon lahan secara presisi sesuai dengan standar regulasi EUDR (European Union Deforestation Regulation).",
  },
  {
    icon: ShieldCheck,
    title: "Verifikasi Bebas Deforestasi",
    description:
      "Sistem analisis otomatis untuk memastikan komoditas diproduksi di lahan yang terbukti tidak mengalami deforestasi sejak batas waktu 31 Desember 2020.",
  },
  {
    icon: Target,
    title: "Traceability End-to-End",
    description:
      "Pelacakan komoditas kayu secara menyeluruh dari titik asal lahan (hulu) hingga ke pelabuhan ekspor (hilir) dengan teknologi SHA-256 fingerprint.",
  },
  {
    icon: Leaf,
    title: "Kepatuhan Pasar Eropa",
    description:
      "Membantu eksportir dan petani lokal memenuhi Due Diligence Statement (DDS) agar produk dapat menembus pasar Uni Eropa tanpa kendala.",
  },
];

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="size-4" />
              <span>EUDR Compliance Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
              Pastikan Ekspor Kayu Anda <span className="text-emerald-600">Lolos Regulasi EUDR</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              HijauLog menyediakan infrastruktur Geo-Tagging dan ketertelusuran spasial untuk menjamin produk kayu Anda bebas deforestasi dan legal secara hukum.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
                Mulai Gratis
              </Link>
              <Link to="/login" className="px-8 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fitur Kunci EUDR</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Kami merancang platform ini secara spesifik untuk menjawab tantangan regulasi anti-deforestasi Eropa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center size-14 bg-emerald-100 text-emerald-600 rounded-2xl mb-6">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="mb-3 font-bold text-lg text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tim Pengembang</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Didorong oleh inovasi, tim dari Universitas Telkom berkolaborasi membangun ekosistem traceability yang transformatif untuk kehutanan Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-5 overflow-hidden rounded-2xl aspect-square shadow-sm">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="mb-1 font-bold text-slate-900 text-lg">{member.name}</h3>
                <p className="text-sm font-medium text-emerald-600">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Siap Mengamankan Rantai Pasok Anda?
          </h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
            Bergabunglah dengan platform HijauLog hari ini dan rasakan kemudahan mengurus uji tuntas (Due Diligence) EUDR secara otomatis.
          </p>
          <Link to="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2">
            Mulai Sekarang <Globe className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}