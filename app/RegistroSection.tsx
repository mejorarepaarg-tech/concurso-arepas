const FORMULARIOS = [
  {
    label: 'Anotá tu restaurante',
    descripcion: 'Sumá tu local al concurso y competí por el título de Mejor Arepa de Argentina.',
    url: 'https://forms.gle/AYSjwJ8878pCLsxx7',
  },
  {
    label: 'Soy emprendedor',
    descripcion: 'Todavía no tenés local propio pero querés participar igual.',
    url: 'https://forms.gle/Y8hNAj6ipk5ahf7j7',
  },
] as const

export default function RegistroSection() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {FORMULARIOS.map((f) => (
        <a
          key={f.url}
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-crema rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition"
        >
          <h3 className="text-marino font-bold text-xl">{f.label}</h3>
          <p className="text-gray-600 mt-3 flex-1">{f.descripcion}</p>
          <span className="mt-6 inline-block bg-dorado hover:bg-dorado2 text-marino font-bold px-8 py-3 rounded-full transition">
            Anotarme
          </span>
        </a>
      ))}
    </div>
  )
}
