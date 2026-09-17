'use client'

import { useFormState, useFormStatus } from 'react-dom'
import Script from 'next/script'
import { votar, type VotarState } from '@/lib/actions/votar'

const initialState: VotarState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-dorado hover:bg-dorado2 text-marino font-bold py-3 rounded-lg transition disabled:opacity-50"
    >
      {pending ? 'Enviando...' : 'Votar'}
    </button>
  )
}

interface Restaurant {
  id: string
  nombre: string
}

export default function VotoForm({ restaurants }: { restaurants: Restaurant[] }) {
  const [state, formAction] = useFormState(votar, initialState)

  if (state.status === 'ok') {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-4">🎉</p>
        <p className="text-marino font-semibold text-lg">{state.message}</p>
      </div>
    )
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Restaurante</label>
          <select
            name="restaurant_id"
            required
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-celeste bg-white"
          >
            <option value="" disabled>
              Seleccioná un restaurante
            </option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-marino mb-1">Nombre</label>
          <input
            name="nombre"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-celeste"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-marino mb-1">Teléfono</label>
          <input
            name="telefono"
            type="tel"
            placeholder="11 1234 5678"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-celeste"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-marino mb-1">Mail</label>
          <input
            name="mail"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-celeste"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-marino">
          <input type="checkbox" name="consentimiento" required className="mt-1" />
          <span>
            Acepto el tratamiento de mis datos personales de acuerdo a la Ley 25.326.
          </span>
        </label>

        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />

        {state.status === 'error' && (
          <p className="text-rojo text-sm text-center">{state.message}</p>
        )}

        <SubmitButton />
      </form>
    </>
  )
}
