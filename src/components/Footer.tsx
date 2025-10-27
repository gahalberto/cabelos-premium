import Link from 'next/link';
import { FaInstagram, FaTiktok, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Grid Principal com 4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Coluna 1 - Institucional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">
              Institucional
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/sobre" 
                  className="text-gray-300 hover:text-white hover:opacity-80 transition-all duration-300 text-sm"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link 
                  href="/torne-se-expert" 
                  className="text-gray-300 hover:text-white hover:opacity-80 transition-all duration-300 text-sm"
                >
                  Seja um Expert
                </Link>
              </li>
              <li>
                <Link 
                  href="/contato" 
                  className="text-gray-300 hover:text-white hover:opacity-80 transition-all duration-300 text-sm"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/shop" 
                  className="text-gray-300 hover:text-white hover:opacity-80 transition-all duration-300 text-sm"
                >
                  Loja
                </Link>
              </li>
              <li>
                <Link 
                  href="/colecao" 
                  className="text-gray-300 hover:text-white hover:opacity-80 transition-all duration-300 text-sm"
                >
                  Coleção
                </Link>
              </li>
              <li>
                <Link 
                  href="/lancamento" 
                  className="text-gray-300 hover:text-white hover:opacity-80 transition-all duration-300 text-sm"
                >
                  Lançamentos
                </Link>
              </li>
              <li>
                <Link 
                  href="/torne-se-expert" 
                  className="text-gray-300 hover:text-white hover:opacity-80 transition-all duration-300 text-sm"
                >
                  Ser um Expert
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Onde Estamos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">
              Onde Estamos
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#8a7d5c] mt-1 flex-shrink-0" />
                <div>
                  <p>Rua Dr. Albuquerque Lins, 537</p>
                  <p>São Paulo / SP</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FaClock className="text-[#8a7d5c] mt-1 flex-shrink-0" />
                <div>
                  <p>Horário de atendimento:</p>
                  <p>Seg. a Sex. das 09h às 17h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaPhone className="text-[#8a7d5c] flex-shrink-0" />
                <a 
                  href="tel:+551138252050" 
                  className="hover:text-white hover:opacity-80 transition-all duration-300"
                >
                  (11) 3825-2050
                </a>
              </div>
            </div>
          </div>

          {/* Coluna 4 - Nossas Redes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">
              Nossas Redes
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Siga-nos nas redes sociais e fique por dentro de todas as novidades!
              </p>
              
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/cabelospremium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="Instagram"
                >
                  <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-3 rounded-lg hover:opacity-80 transition-all duration-300 transform group-hover:scale-110">
                    <FaInstagram className="text-white text-2xl" />
                  </div>
                </a>
                
                <a
                  href="https://tiktok.com/@cabelospremium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="TikTok"
                >
                  <div className="bg-black border-2 border-white p-3 rounded-lg hover:opacity-80 transition-all duration-300 transform group-hover:scale-110">
                    <FaTiktok className="text-white text-2xl" />
                  </div>
                </a>
              </div>
              
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">@cabelospremium</p>
                <p className="text-xs">Cabelos Premium Brasileiros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2025 Cabelos Premium. Todos os direitos reservados.
            </p>
            
            {/* Links de políticas */}
            <div className="flex gap-6 text-sm text-gray-400">
              <Link 
                href="/politica-privacidade" 
                className="hover:text-white hover:opacity-80 transition-all duration-300"
              >
                Política de Privacidade
              </Link>
              <Link 
                href="/termos-uso" 
                className="hover:text-white hover:opacity-80 transition-all duration-300"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
          
          {/* Desenvolvido por */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Desenvolvido com ❤️ para oferecer os melhores cabelos brasileiros
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
