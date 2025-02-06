import Link from "next/link";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#020B1C] border-t-2 border-indigo-950 text-white p-6 text-center pt-10">
      <div className="container mx-auto">
        <h2 className="text-lg font-bold flex items-center justify-center gap-2">
          <span className="text-pink-500 text-2xl"></span> InMemorian
        </h2>
        <p className="mt-2 text-gray-400">
          Eternizar as pessoas mais queridas
        </p>
        <p className="mt-2 text-gray-500 text-sm">Copyright &copy; 2025 - Todos os direitos reservados</p>
        
        <div className="mt-4 text-center flex justify-center items-center">
          <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-md text-sm">
            <img
                      src="/images/yossi.png"
                      alt="Gabriel Alberto"
              className="rounded-full w-8 h-8"
            />
            Feito por Gabriel Alberto
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <FaGithub className="text-xl cursor-pointer" />
          <FaLinkedin className="text-xl cursor-pointer" />
          <FaInstagram className="text-xl cursor-pointer" />
        </div>

        <div className="mt-6">
          <h3 className="text-gray-400 font-semibold">LEGAL</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href={`/terms-of-use`}>
                Termos de uso
              </Link>
            </li>
            <li>
            <Link href={`/privacy-policy`}>
              Termos de privacidade
              </Link>
              </li>
            <li>CNPJ: 58.426.096/0001</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
