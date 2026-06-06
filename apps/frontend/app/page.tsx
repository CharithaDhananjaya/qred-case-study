import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-qred-light flex justify-center items-center px-6">
      <div className="w-full max-w-[430px] flex flex-col items-center text-center gap-8">

        <Image
          src="/qred-logo.png"
          alt="Qred"
          width={100}
          height={40}
          className="object-contain"
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-qred-dark tracking-tight">
            Business finance,<br />simplified.
          </h1>
          <p className="text-sm text-qred-dark/60 leading-relaxed">
            Manage your Qred credit card, track transactions,
            and stay on top of your invoices — all in one place.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full bg-qred-dark text-qred-light text-sm font-semibold rounded-2xl py-4 text-center"
        >
          Go to dashboard
        </Link>

      </div>
    </main>
  )
}
