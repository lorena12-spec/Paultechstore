export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-200">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div><h3 className="text-xl font-bold">PaulTech Store</h3><p className="mt-3 text-sm text-slate-400">iPhones, iPads, Samsung and Google Pixel devices.</p></div>
        <div><h4 className="font-semibold">Contact</h4><p className="mt-3 text-sm">08086394208<br/>paultechstores@gmail.com</p></div>
        <div><h4 className="font-semibold">Visit us</h4><address className="mt-3 text-sm not-italic text-slate-300">Beside Zenith Bank, Alaba Phone Village, Alaba, Ojo, Lagos State.</address><a href="https://www.google.com/maps/search/?api=1&query=Beside%20Zenith%20Bank%2C%20Alaba%20Phone%20Village%2C%20Alaba%2C%20Ojo%2C%20Lagos%20State" target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold text-blue-300 hover:text-white">Get directions</a></div>
        <div><h4 className="font-semibold">Support</h4><p className="mt-3 text-sm text-slate-400">Nationwide delivery • Customer support • Secure checkout</p></div>
      </div>
      <div className="container pb-12"><h4 className="mb-3 font-semibold">Find PaulTech Store</h4><iframe title="PaulTech Store location map" src="https://www.google.com/maps?q=Beside%20Zenith%20Bank%2C%20Alaba%20Phone%20Village%2C%20Alaba%2C%20Ojo%2C%20Lagos%20State&output=embed" className="h-64 w-full rounded-xl border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">© 2026 PaulTech Store. All rights reserved.</div>
    </footer>
  );
}
