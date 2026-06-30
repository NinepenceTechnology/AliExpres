import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  ChevronRight, 
  Star, 
  Heart, 
  Globe,
  Smartphone,
  Truck,
  ShieldCheck,
  MessageSquare,
  X,
  Send,
  Percent,
  Lock,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateProducts, Product, CATEGORIES } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
// @ts-ignore
import contentorImg from './assets/images/Contentor.png';
// @ts-ignore
import droneImg from './assets/images/Drone.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ALL_PRODUCTS = generateProducts(1005);

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(20);

  // Complaint States
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string, imageUrl?: string }[]>([
    { role: 'bot', text: 'Bem vindo / Welcome' },
    { role: 'bot', text: 'seleciona a Língua / Select Language' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [typingPreview, setTypingPreview] = useState<string | null>(null);
  const typingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTypingTimeouts = () => {
    typingTimeoutsRef.current.forEach(clearTimeout);
    typingTimeoutsRef.current = [];
    setTypingPreview(null);
  };

  const enqueueBotResponse = (
    finalText: string, 
    nextStep: number, 
    imageUrl?: string, 
    customOnComplete?: () => void
  ) => {
    clearAllTypingTimeouts();
    setIsTyping(true);
    setTypingPreview(null);

    // 0s to 3s: only bouncing dots (typingPreview = null)
    
    // at 3s: draft 35% of the text
    const t1 = setTimeout(() => {
      const partialText = finalText.slice(0, Math.round(finalText.length * 0.35));
      setTypingPreview(partialText || "Digitando...");
    }, 3000);

    // at 6s: draft 70% of the text
    const t2 = setTimeout(() => {
      const partialText = finalText.slice(0, Math.round(finalText.length * 0.7));
      setTypingPreview(partialText || "Digitando...");
    }, 6000);

    // at 9s: backspace/erasing starts! Change typingPreview to a very small slice
    const t3 = setTimeout(() => {
      setTypingPreview(finalText.slice(0, Math.min(finalText.length, 5)) || "Dig");
    }, 9000);

    // at 11s: completely erased (empty string)
    const t4 = setTimeout(() => {
      setTypingPreview("");
    }, 11000);

    // at 13s: bouncing dots only (typingPreview = null)
    const t5 = setTimeout(() => {
      setTypingPreview(null);
    }, 13000);

    // at 15s: deliver full final message
    const t6 = setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'bot', text: finalText, imageUrl }]);
      setChatStep(nextStep);
      setIsTyping(false);
      setTypingPreview(null);
      if (customOnComplete) {
        customOnComplete();
      }
    }, 15000);

    typingTimeoutsRef.current = [t1, t2, t3, t4, t5, t6];
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    scrollToBottom();
    // Fallback for transition delay
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [chatMessages, isTyping, isComplaintOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping || chatStep === 17) return;

    const userMsg = newMessage;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setNewMessage('');

    if (chatStep === 1) {
      // Name entered -> Ask for email
      enqueueBotResponse('Por favor, insira o seu e-mail:', 2);
    } else if (chatStep === 2) {
      // Email entered -> Ask for action (RASTREAMENTO / INFORMAÇÕES / RECLAMAÇÕES)
      enqueueBotResponse('O que deseja fazer? Selecione uma das opções abaixo:', 3);
    } else if (chatStep === 4) {
      // Product code entered -> Bot says "Aguarde..." and delivers tracking/ship info
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Aguarde...' }]);
      enqueueBotResponse(
        'Produto já está em Moçambique no Porto da Beira, O Navio MSC MIRA V já deixou o porto no dia 23 de Junho de 2026. Qual é a reclamação?', 
        5
      );
    } else if (chatStep === 5) {
      // Complaint entered -> Bot says "Aguarde." and explains damage
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Aguarde.' }]);
      enqueueBotResponse(
        'O contentor contendo o producto em questão foi danificado durante o manuseamento. Este está sobre investigação para auferir as responsabilidades sobre o mesmo e os danos aos produtos.', 
        6
      );
    } else if (chatStep === 6) {
      // User asks "por quanto tempo dura?" -> Bot answers about SGS/INTERTEK/insurance
      enqueueBotResponse(
        'Isso depende das entidades responsáveis (SGS e INTERTEK). Se as cargas tiverem danos, um seguro é acionado e o valor de compra é estornado.',
        7,
        undefined,
        () => {
          // Auto-proceed with the next requested final message
          enqueueBotResponse(
            'A estimativa da investigação é de uma a duas semanas, operando em dias úteis, peço que mantenha atenção constante no WhatsApp e e-mail. Entraremos em contacto. Vejo que esta encomenda está com prazo de entrega ultrapassado. Vamos marcar o seu caso como um caso de maior relevância.',
            7.5,
            undefined,
            () => {
              // Auto-proceed to confirm contacts
              enqueueBotResponse(
                'Confirme os contactos:\nWhatsapp 846348589\nemail: florindoninepence@gmail.com',
                8
              );
            }
          );
        }
      );
    } else if (chatStep === 8) {
      // User confirmed contacts. Start the final image sequence!
      enqueueBotResponse(
        'Aguarde temos imagens do contentor e do equipamento apenas aguardamos por laudo da inspecção.',
        8.2,
        undefined,
        () => {
          enqueueBotResponse(
            'Imagem do Contentor Danificado:',
            8.4,
            contentorImg,
            () => {
              enqueueBotResponse(
                'Imagem do Equipamento (Drone) Danificado:',
                8.6,
                droneImg,
                () => {
                  enqueueBotResponse(
                    'Porém com os danos do equipamento sugerimos preecher o documento depedido de extorno que irá receber no seu email: florindoninepence@gmail.com e o valor será extornado em 15 dias uteis a contar com a data de pedido de recompensa.',
                    8.8,
                    undefined,
                    () => {
                      enqueueBotResponse(
                        'Devido ao atraso pedimos sinceras desculpas e uma vez mais garanto que o seu caso será considerado de extrema urgência.',
                        9
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } else if (chatStep === 9) {
      enqueueBotResponse(
        'As imagens acima são feitas com o fundo desfocado para não comprometer informações de terceiros. Uma vez mais, pedimos sinceras desculpas e garantimos que pode continuar a importar via nosso website. O que aconteceu é apenas erro de manuseamento. Não exite em nos contactar.',
        15,
        undefined,
        () => {
          // "Deseja saber algo mais?" is automatically asked right after the previous message
          enqueueBotResponse(
            'Deseja saber algo mais?',
            16
          );
        }
      );
    } else if (chatStep === 11) {
      enqueueBotResponse(
        'Todas opções de envio são possíveis desde que haja o producto ainda em stock e as despesas de envio por conta do cliente.',
        12
      );
    } else if (chatStep === 12) {
      enqueueBotResponse(
        'Confirmo que temos algumas unidades. Iremos contactar o departamento de enmpacotamentos e envio, iremos fazer contacto por email para dar os detalhes de pagamentos de frete.',
        13
      );
    } else if (chatStep === 13) {
      enqueueBotResponse(
        'confrirma os contactos:\nWhatsapp: 846348589\nemail: florindoninepence@gmail.com',
        14
      );
    } else if (chatStep === 14) {
      enqueueBotResponse(
        'Todos dados serão enviados por email em até 1hora. Agradecemos por contactar e pedimos sinceras desculpas pelos transtornos causados',
        15,
        undefined,
        () => {
          // "Deseja saber algo mais?" is automatically asked right after the previous message
          enqueueBotResponse(
            'Deseja saber algo mais?',
            16
          );
        }
      );
    } else if (chatStep === 16) {
      enqueueBotResponse(
        'Atendimento encerrado. Obrigado por nos contactar!',
        17
      );
    }
  };

  const selectLanguage = (lang: string) => {
    if (isTyping) return;
    setChatMessages(prev => [...prev, { role: 'user', text: lang }]);
    enqueueBotResponse('Qual é o seu nome de usuário?', 1);
  };

  const selectAction = (action: string) => {
    if (isTyping) return;
    setChatMessages(prev => [...prev, { role: 'user', text: action }]);
    if (action === 'INFORMAÇÕES') {
      enqueueBotResponse('O que deseja saber?', 11);
    } else {
      enqueueBotResponse('Indique o código do produto:', 4);
    }
  };

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      setVisibleCount(prev => Math.min(prev + 20, filteredProducts.length));
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredProducts.length]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-[#F5F5F5] text-[12px] py-1 border-bottom border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span className="hover:text-ali-orange cursor-pointer">Vender no AliExpress</span>
            <span className="hover:text-ali-orange cursor-pointer" onClick={() => setIsComplaintOpen(true)}>Reclamações</span>
            <span className="hover:text-ali-orange cursor-pointer">Ajuda</span>
            <span className="hover:text-ali-orange cursor-pointer">Proteção do Comprador</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1 cursor-pointer hover:text-ali-orange">
              <Globe size={14} />
              <span>Português / BRL</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-ali-orange">
              <Smartphone size={14} />
              <span>Baixe o App</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <div 
            className="text-ali-orange text-3xl font-black tracking-tighter cursor-pointer flex-shrink-0"
            onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
          >
            AliExpress
          </div>

          {/* Search Bar */}
          <div className="flex-grow relative max-w-2xl">
            <input 
              type="text" 
              placeholder="Estou procurando por..."
              className="w-full border-2 border-ali-orange rounded-full py-2 px-6 pr-12 focus:outline-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-1 top-1 bottom-1 bg-ali-orange text-white rounded-full px-4 hover:bg-ali-orange-hover transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            <div 
              className="flex flex-col items-center cursor-pointer group md:hidden"
              onClick={() => setIsComplaintOpen(true)}
            >
              <MessageSquare size={24} className="group-hover:text-ali-orange" />
              <span className="text-[10px] group-hover:text-ali-orange">Reclamação</span>
            </div>
            <div className="hidden lg:flex flex-col items-center cursor-pointer group">
              <User size={24} className="group-hover:text-ali-orange" />
              <span className="text-[12px] group-hover:text-ali-orange">Minha Conta</span>
            </div>
            <div className="relative cursor-pointer group" onClick={() => setCartCount(c => c + 1)}>
              <ShoppingCart size={28} className="group-hover:text-ali-orange" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-ali-orange text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:block text-[12px] text-center group-hover:text-ali-orange">Carrinho</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Categories */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Menu size={20} /> Categorias
            </h2>
            <ul className="space-y-1">
              {CATEGORIES.map(cat => (
                <li 
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={cn(
                    "flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer transition-colors text-sm",
                    selectedCategory === cat ? "bg-ali-orange/10 text-ali-orange font-semibold" : "hover:bg-gray-100"
                  )}
                >
                  {cat}
                  <ChevronRight size={14} className={selectedCategory === cat ? "text-ali-orange" : "text-gray-400"} />
                </li>
              ))}
            </ul>
          </div>

          {/* Promo Card */}
          <div className="mt-6 bg-gradient-to-br from-ali-orange to-red-600 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-black text-2xl leading-tight">SUPER OFERTAS</h3>
              <p className="text-sm opacity-90 mt-2">Até 70% de desconto em itens selecionados!</p>
              <button className="mt-4 bg-white text-ali-orange font-bold py-2 px-4 rounded-full text-sm hover:scale-105 transition-transform">
                Ver Agora
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
              <ShoppingCart size={120} />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          {/* Mobile/Tablet Horizontal Categories */}
          <div className="md:hidden mb-6 overflow-x-auto scrollbar-none pb-1">
            <div className="flex gap-2 w-max">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold border transition-all shadow-sm",
                  !selectedCategory 
                    ? "bg-ali-orange border-ali-orange text-white" 
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                Todos os Produtos
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all shadow-sm",
                    selectedCategory === cat 
                      ? "bg-ali-orange border-ali-orange text-white" 
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {/* Hero Banner */}
          {!selectedCategory && searchQuery === '' && (
            <div className="mb-8 h-48 md:h-64 bg-gray-200 rounded-2xl overflow-hidden relative group">
              <img 
                src="https://picsum.photos/seed/ali-banner/1200/400" 
                alt="Banner" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/25 flex flex-col justify-center px-6 sm:px-12 text-white">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl sm:text-4xl md:text-6xl font-black italic tracking-tighter leading-tight sm:leading-none"
                >
                  BEM-VINDO AO <br/> ALIEXPRESS
                </motion.h1>
                <p className="mt-2 sm:mt-4 text-sm sm:text-lg font-medium">Onde a demonstração ganha vida.</p>
              </div>
            </div>
          )}

          {/* Filters/Status */}
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">
                {selectedCategory || (searchQuery ? `Resultados para "${searchQuery}"` : "Recomendados para você")}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Encontramos {filteredProducts.length} itens</p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence mode='popLayout'>
              {displayedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => setCartCount(c => c + 1)} 
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Loading State */}
          {visibleCount < filteredProducts.length && (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ali-orange"></div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f2f2f2] mt-auto border-t border-gray-200 pt-12 pb-8 text-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          {/* AliExpress Trust Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 mb-12 border-b border-gray-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white text-[#FF4747] rounded-xl shadow-sm">
                <Percent size={24} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-gray-900">Preços Competitivos</h5>
                <p className="text-xs text-gray-500 mt-1">Mais de 100 milhões de produtos com ótimos preços e descontos imperdíveis.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white text-[#FF4747] rounded-xl shadow-sm">
                <Truck size={24} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-gray-900">Entrega Internacional</h5>
                <p className="text-xs text-gray-500 mt-1">Envio expresso para Moçambique e mais de 200 países com código de rastreamento.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white text-[#FF4747] rounded-xl shadow-sm">
                <Lock size={24} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-gray-900">Pagamento Criptografado</h5>
                <p className="text-xs text-gray-500 mt-1">Transações protegidas por criptografia de ponta a ponta e total privacidade.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white text-[#FF4747] rounded-xl shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-gray-900">Garantia e Proteção</h5>
                <p className="text-xs text-gray-500 mt-1">Reembolso garantido em casos de mercadorias danificadas ou atrasos logísticos.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-sm text-gray-900 mb-4">Central de Ajuda</h4>
              <ul className="text-xs text-gray-500 space-y-2">
                <li className="hover:text-ali-orange cursor-pointer">Como comprar no AliExpress</li>
                <li className="hover:text-ali-orange cursor-pointer">Métodos de pagamento disponíveis</li>
                <li className="hover:text-ali-orange cursor-pointer">Guia de envio e fretes</li>
                <li className="hover:text-ali-orange cursor-pointer">Proteção de Compras do Consumidor</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 mb-4">Serviço ao Cliente</h4>
              <ul className="text-xs text-gray-500 space-y-2">
                <li className="hover:text-ali-orange cursor-pointer" onClick={() => setIsComplaintOpen(true)}>Reclamações e Suporte Direto</li>
                <li className="hover:text-ali-orange cursor-pointer">Políticas de reembolso rápido</li>
                <li className="hover:text-ali-orange cursor-pointer">Disputas contratuais e alfândega</li>
                <li className="hover:text-ali-orange cursor-pointer">Termos de uso do site oficial</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 mb-4">AliExpress Global</h4>
              <ul className="text-xs text-gray-500 space-y-2">
                <li className="hover:text-ali-orange cursor-pointer">AliExpress Moçambique</li>
                <li className="hover:text-ali-orange cursor-pointer">AliExpress Brasil</li>
                <li className="hover:text-ali-orange cursor-pointer">AliExpress Portugal</li>
                <li className="hover:text-ali-orange cursor-pointer">AliExpress Espanha</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 mb-4">Canais Digitais</h4>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-ali-orange hover:text-white cursor-pointer transition-colors shadow-sm">
                  <Globe size={16} />
                </div>
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-ali-orange hover:text-white cursor-pointer transition-colors shadow-sm">
                  <Smartphone size={16} />
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">Conecte-se com segurança aos servidores AliExpress para um acompanhamento detalhado.</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs text-gray-500 text-center md:text-left">
              <p>© 2026 AliExpress Moçambique. Todos os direitos reservados. Plataforma de Demonstração de Logística.</p>
              <p className="text-gray-400 mt-1">Conexão direta segura com o Porto da Beira & Porto de Singapura.</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-xs font-semibold text-gray-400 mr-2">Pagamento Seguro:</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 shadow-sm">M-PESA</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 shadow-sm">E-MOLA</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 shadow-sm">VISA</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 shadow-sm">MASTERCARD</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 shadow-sm">PAYPAL</span>
              <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 shadow-sm">BOLETO</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Complaint Modal */}
      <AnimatePresence>
        {isComplaintOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[600px] max-h-screen sm:max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-ali-orange p-4 text-white flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={24} />
                  <h2 className="font-bold text-lg">Reclamação e Reembolso</h2>
                </div>
                <button 
                  onClick={() => {
                    setIsComplaintOpen(false);
                    setChatStep(0);
                    clearAllTypingTimeouts();
                    setChatMessages([
                      { role: 'bot', text: 'Bem vindo / Welcome' },
                      { role: 'bot', text: 'seleciona a Língua / Select Language' }
                    ]);
                  }}
                  className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-grow flex flex-col overflow-hidden p-4 sm:p-6 min-h-0">
                {/* Scrollable chat section */}
                <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-1 sm:pr-2 min-h-0 scrollbar-thin">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl text-sm whitespace-pre-line flex flex-col gap-2 shadow-sm transition-all duration-200",
                        msg.role === 'user' 
                          ? "bg-ali-orange text-white self-end ml-auto rounded-tr-none" 
                          : "bg-gray-100 text-gray-800 self-start rounded-tl-none"
                      )}
                    >
                      {msg.text && <span>{msg.text}</span>}
                      {msg.imageUrl && (
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white mt-1">
                          <img 
                            src={msg.imageUrl} 
                            alt="Anexo" 
                            className="w-full h-auto object-contain max-h-[180px]"
                            referrerPolicy="no-referrer"
                            onLoad={() => {
                              if (chatEndRef.current) {
                                chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {typingPreview !== null && typingPreview !== "" && (
                    <div className="max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl text-sm whitespace-pre-line flex flex-col gap-2 shadow-sm transition-all duration-200 bg-gray-100 text-gray-800 self-start rounded-tl-none italic opacity-85">
                      <span>{typingPreview}</span>
                      <span className="text-[10px] text-gray-400 self-end">Digitando...</span>
                    </div>
                  )}
                  {isTyping && (
                    <div className="bg-gray-100 text-gray-800 self-start rounded-2xl rounded-tl-none p-3.5 text-sm flex gap-1.5 items-center w-fit shadow-sm">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                  {chatStep === 0 && chatMessages.length === 2 && !isTyping && (
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => selectLanguage('Português')}
                        className="bg-white border border-ali-orange text-ali-orange px-4 py-2 rounded-full text-xs font-semibold hover:bg-ali-orange hover:text-white transition-all shadow-sm"
                      >
                        Português
                      </button>
                      <button 
                        onClick={() => selectLanguage('English')}
                        className="bg-white border border-ali-orange text-ali-orange px-4 py-2 rounded-full text-xs font-semibold hover:bg-ali-orange hover:text-white transition-all shadow-sm"
                      >
                        English
                      </button>
                    </div>
                  )}
                  {chatStep === 3 && !isTyping && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button 
                        onClick={() => selectAction('RASTREAMENTO')}
                        className="bg-white border border-ali-orange text-ali-orange px-4 py-2 rounded-full text-xs hover:bg-ali-orange hover:text-white transition-all font-semibold shadow-sm"
                      >
                        RASTREAMENTO
                      </button>
                      <button 
                        onClick={() => selectAction('INFORMAÇÕES')}
                        className="bg-white border border-ali-orange text-ali-orange px-4 py-2 rounded-full text-xs hover:bg-ali-orange hover:text-white transition-all font-semibold shadow-sm"
                      >
                        INFORMAÇÕES
                      </button>
                      <button 
                        onClick={() => selectAction('RECLAMAÇÕES')}
                        className="bg-white border border-ali-orange text-ali-orange px-4 py-2 rounded-full text-xs hover:bg-ali-orange hover:text-white transition-all font-semibold shadow-sm"
                      >
                        RECLAMAÇÕES
                      </button>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-gray-100 flex-shrink-0">
                  <input 
                    type="text" 
                    className="flex-grow border border-gray-300 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-ali-orange disabled:bg-gray-50 text-sm"
                    placeholder={chatStep === 17 ? "Atendimento encerrado." : isTyping ? "Aguardando resposta..." : "Digite sua mensagem..."}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    disabled={(chatStep === 0 && chatMessages.length === 2) || chatStep === 3 || isTyping || chatStep === 17}
                  />
                  <button 
                    type="submit"
                    disabled={(chatStep === 0 && chatMessages.length === 2) || chatStep === 3 || isTyping || chatStep === 17}
                    className="bg-ali-orange text-white p-2.5 rounded-full hover:bg-ali-orange-hover transition-colors disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Complaint Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsComplaintOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[9999] bg-ali-orange text-white p-4 rounded-full shadow-[0_10px_40px_rgba(255,71,71,0.5)] flex items-center justify-center group cursor-pointer select-none transition-transform duration-200"
        style={{ 
          bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          right: 'max(1.5rem, env(safe-area-inset-right))'
        }}
      >
        <MessageSquare size={28} />
        <span className="max-w-0 group-hover:max-w-xs group-hover:ml-2 overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap font-bold text-sm">
          Reclamação
        </span>
      </motion.button>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  key?: React.Key;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col border border-transparent hover:border-ali-orange/20"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-ali-orange transition-colors">
          <Heart size={18} />
        </button>
        {product.isChoice && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Choice
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-ali-orange transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-yellow-400">
            <Star size={12} fill="currentColor" />
          </div>
          <span className="text-[11px] font-bold">{product.rating}</span>
          <span className="text-[11px] text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-black text-ali-orange">R$ {product.price.toFixed(2)}</span>
          <span className="text-[11px] text-gray-400 line-through">R$ {product.originalPrice.toFixed(2)}</span>
        </div>

        <div className="mt-1 flex flex-wrap gap-1">
          {product.isFreeShipping && (
            <span className="text-[10px] bg-green-50 text-green-600 px-1 rounded border border-green-100">Frete Grátis</span>
          )}
          <span className="text-[10px] text-gray-400">{product.sales}+ vendidos</span>
        </div>

        <div className="mt-auto pt-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-full bg-ali-orange text-white py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-ali-orange-hover"
          >
            Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
