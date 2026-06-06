import Image from 'next/image'

function HamburgerIcon() {
  return (
    <div className="flex flex-col gap-[5px] cursor-pointer p-1">
      <div className="w-5 h-0.5 bg-qred-dark rounded-full" />
      <div className="w-5 h-0.5 bg-qred-dark rounded-full" />
      <div className="w-3.5 h-0.5 bg-qred-dark rounded-full" />
    </div>
  )
}

export function Header() {
  return (
    <div className="flex items-center justify-between py-3">
      <Image
        src="/qred-logo.png"
        alt="Qred"
        width={40}
        height={40}
        className="rounded-lg"
      />
      <HamburgerIcon />
    </div>
  )
}
