import { Type } from "@google/genai";

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  sales: number;
  image: string;
  category: string;
  isChoice: boolean;
  isFreeShipping: boolean;
}

export const CATEGORIES = [
  "Eletrônicos",
  "Moda Feminina",
  "Moda Masculina",
  "Casa e Jardim",
  "Brinquedos e Hobbies",
  "Esportes e Lazer",
  "Beleza e Saúde",
  "Automóveis",
  "Ferramentas",
  "Joias e Relógios"
];

interface ProductTemplate {
  title: string;
  category: string;
  image: string;
  minPrice: number;
  maxPrice: number;
}

const PRODUCT_TEMPLATES: ProductTemplate[] = [
  // Eletrônicos
  {
    title: "Fone de Ouvido Bluetooth Sem Fio Inteligente Pro",
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&fit=crop",
    minPrice: 45.90,
    maxPrice: 189.00
  },
  {
    title: "Smartphone Android 5G Desbloqueado Versão Global",
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&fit=crop",
    minPrice: 899.00,
    maxPrice: 2499.00
  },
  {
    title: "Teclado Mecânico Gamer Retroiluminado RGB Switch Azul",
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80&fit=crop",
    minPrice: 120.00,
    maxPrice: 350.00
  },
  {
    title: "Mouse Gamer Ergonômico RGB 12000 DPI com Fio",
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80&fit=crop",
    minPrice: 35.00,
    maxPrice: 99.90
  },
  {
    title: "Câmera Digital Compacta Mirrorless Vídeo 4K Ultra HD",
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80&fit=crop",
    minPrice: 650.00,
    maxPrice: 1800.00
  },

  // Moda Feminina
  {
    title: "Bolsa de Ombro Feminina de Couro Sintético Macio Vintage",
    category: "Moda Feminina",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80&fit=crop",
    minPrice: 69.90,
    maxPrice: 199.00
  },
  {
    title: "Vestido de Verão Estampado Floral com Decote em V Casual",
    category: "Moda Feminina",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80&fit=crop",
    minPrice: 49.90,
    maxPrice: 129.90
  },
  {
    title: "Casaco Cardigan Feminino de Tricô Grosso Inverno",
    category: "Moda Feminina",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80&fit=crop",
    minPrice: 89.90,
    maxPrice: 249.00
  },

  // Moda Masculina
  {
    title: "Mochila Impermeável Masculina com Carregador USB Anti-Roubo",
    category: "Moda Masculina",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&fit=crop",
    minPrice: 75.00,
    maxPrice: 179.90
  },
  {
    title: "Camisa Polo Masculina Slim Fit Algodão Respirável",
    category: "Moda Masculina",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80&fit=crop",
    minPrice: 39.90,
    maxPrice: 95.00
  },
  {
    title: "Jaqueta Corta Vento Masculina Impermeável com Capuz",
    category: "Moda Masculina",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80&fit=crop",
    minPrice: 99.00,
    maxPrice: 289.00
  },

  // Casa e Jardim
  {
    title: "Lâmpada Inteligente LED RGB Wi-Fi Compatível Alexa/Google",
    category: "Casa e Jardim",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&q=80&fit=crop",
    minPrice: 29.90,
    maxPrice: 69.90
  },
  {
    title: "Garrafa Térmica de Aço Inoxidável Parede Dupla 500ml",
    category: "Casa e Jardim",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&fit=crop",
    minPrice: 45.00,
    maxPrice: 99.00
  },
  {
    title: "Almofada Decorativa Confortável Texturizada para Sofá",
    category: "Casa e Jardim",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80&fit=crop",
    minPrice: 25.00,
    maxPrice: 79.90
  },

  // Brinquedos e Hobbies
  {
    title: "Drone Quadcopter com Câmera Dual HD e Retorno por GPS",
    category: "Brinquedos e Hobbies",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80&fit=crop",
    minPrice: 199.00,
    maxPrice: 850.00
  },
  {
    title: "Cubo Mágico Profissional Super Deslizante Magnético",
    category: "Brinquedos e Hobbies",
    image: "https://images.unsplash.com/photo-1591951425328-48c1fe2114af?w=400&q=80&fit=crop",
    minPrice: 15.00,
    maxPrice: 45.00
  },
  {
    title: "Mini Blocos de Montar Nave Espacial de Engenharia",
    category: "Brinquedos e Hobbies",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80&fit=crop",
    minPrice: 45.00,
    maxPrice: 180.00
  },

  // Esportes e Lazer
  {
    title: "Tênis Esportivo Masculino Confortável Corrida Amortecimento",
    category: "Esportes e Lazer",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&fit=crop",
    minPrice: 120.00,
    maxPrice: 399.00
  },
  {
    title: "Garrafa de Água Esportiva Squeeze com Alça Livre de BPA",
    category: "Esportes e Lazer",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80&fit=crop",
    minPrice: 18.90,
    maxPrice: 49.90
  },
  {
    title: "Tapete de Yoga Antiderrapante Alta Densidade com Bolsa",
    category: "Esportes e Lazer",
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&q=80&fit=crop",
    minPrice: 65.00,
    maxPrice: 149.00
  },

  // Beleza e Saúde
  {
    title: "Kit de Maquiagem Completo Paleta de Sombras Professional",
    category: "Beleza e Saúde",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80&fit=crop",
    minPrice: 89.00,
    maxPrice: 220.00
  },
  {
    title: "Massageador Facial Elétrico Terapia de Luz Anti-Envelhecimento",
    category: "Beleza e Saúde",
    image: "https://images.unsplash.com/photo-1519735797-402bae54e4b3?w=400&q=80&fit=crop",
    minPrice: 55.00,
    maxPrice: 199.00
  },
  {
    title: "Secador de Cabelo Iônico de Alta Potência com Difusor",
    category: "Beleza e Saúde",
    image: "https://images.unsplash.com/photo-1522337360788-8b13edd793be?w=400&q=80&fit=crop",
    minPrice: 110.00,
    maxPrice: 349.00
  },

  // Automóveis
  {
    title: "Mini Aspirador de Pó Portátil Alta Sucção Sem Fio para Carro",
    category: "Automóveis",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&q=80&fit=crop",
    minPrice: 59.90,
    maxPrice: 145.00
  },
  {
    title: "Carregador Celular Veicular Rápido USB-C 45W Turbo",
    category: "Automóveis",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80&fit=crop",
    minPrice: 24.90,
    maxPrice: 65.00
  },
  {
    title: "Suporte de Celular por Gravidade para Saída de Ar Carro",
    category: "Automóveis",
    image: "https://images.unsplash.com/photo-1506521781823-d2209b5254bf?w=400&q=80&fit=crop",
    minPrice: 15.00,
    maxPrice: 49.90
  },

  // Ferramentas
  {
    title: "Jogo de Chaves de Fenda Multiuso de Precisão Cr-V 115 em 1",
    category: "Ferramentas",
    image: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=400&q=80&fit=crop",
    minPrice: 45.00,
    maxPrice: 119.00
  },
  {
    title: "Trena Métrica Emborrachada Profissional Trava Automática 5m",
    category: "Ferramentas",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&q=80&fit=crop",
    minPrice: 19.90,
    maxPrice: 45.00
  },
  {
    title: "Lanterna Tática T6 LED Recarregável Ultra Brilhante USB",
    category: "Ferramentas",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80&fit=crop",
    minPrice: 35.00,
    maxPrice: 89.90
  },

  // Joias e Relógios
  {
    title: "Relógio de Quartzo Masculino Luxo Pulseira de Couro",
    category: "Joias e Relógios",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&fit=crop",
    minPrice: 79.90,
    maxPrice: 299.00
  },
  {
    title: "Colar Pingente Ponto de Luz Prata de Lei 925",
    category: "Joias e Relógios",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80&fit=crop",
    minPrice: 39.90,
    maxPrice: 120.00
  },
  {
    title: "Anel Elegante Ajustável Minimalista Prateado",
    category: "Joias e Relógios",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80&fit=crop",
    minPrice: 19.90,
    maxPrice: 59.90
  }
];

export function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= count; i++) {
    // Select a template deterministically or pseudo-randomly to guarantee matching metadata
    const templateIndex = (i - 1) % PRODUCT_TEMPLATES.length;
    const template = PRODUCT_TEMPLATES[templateIndex];
    
    const price = parseFloat((Math.random() * (template.maxPrice - template.minPrice) + template.minPrice).toFixed(2));
    const originalPrice = parseFloat((price * (1.1 + Math.random() * 0.4)).toFixed(2));
    
    products.push({
      id: `prod-${i}`,
      title: `${template.title} #${1000 + i}`,
      price,
      originalPrice,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
      reviews: Math.floor(Math.random() * 4500 + 50),
      sales: Math.floor(Math.random() * 8000 + 100),
      image: template.image,
      category: template.category,
      isChoice: Math.random() > 0.7,
      isFreeShipping: Math.random() > 0.3
    });
  }
  return products;
}

