const teamMembers = [
  {
    id: 1,
    name: "Gökhan Özdemir",
    role: "Proje Yöneticisi",
    image:
      "https://ui-avatars.com/api/?name=Gokhan+Ozdemir&background=0f766e&color=ffffff",
    bio: "Genel proje akışını, öncelikleri ve teslim tarihlerini takip eder.",
  },
  {
    id: 2,
    name: "Doğuş Erkıvaç",
    role: "Full Stack Developer",
    image:
      "https://ui-avatars.com/api/?name=Dogus+Erkivac&background=1f2937&color=ffffff",
    bio: "Hem frontend hem backend tarafında geliştirici olarak görev alır.",
  },
];

function Team() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-xs text-emerald-600 font-medium">Ekip</p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Proje Ekibi
        </h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl">
          Bu sayfa, Bandage demo projesi için oluşturulan basit ekip
          yapısını gösterir. Roller gerçek projelerde değişebilir.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
            >
              <div className="flex flex-col items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-5">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <h2 className="text-sm md:text-base font-semibold text-gray-900">
                    {member.name}
                  </h2>
                  <p className="text-xs font-medium text-emerald-600">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-500">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Team;

