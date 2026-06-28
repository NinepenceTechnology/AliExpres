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

const ADJECTIVES = ["Premium", "Ultra", "Smart", "Pro", "Vintage", "Moderno", "Portátil", "Sem Fio", "Elegante", "Resistente"];
const NOUNS = ["Fone de Ouvido", "Relógio", "Smartphone", "Mochila", "Lâmpada LED", "Teclado", "Mouse Gamer", "Câmera", "Drone", "Garrafa Térmica"];

export function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const price = parseFloat((Math.random() * 500 + 5).toFixed(2));
    const originalPrice = parseFloat((price * (1 + Math.random() * 0.5)).toFixed(2));
    
    products.push({
      id: `prod-${i}`,
      title: `${adj} ${noun} ${i}`,
      price,
      originalPrice,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
      reviews: Math.floor(Math.random() * 5000),
      sales: Math.floor(Math.random() * 10000),
      image: `https://picsum.photos/seed/ali-${i}/400/400`,
      category,
      isChoice: Math.random() > 0.7,
      isFreeShipping: Math.random() > 0.4
    });
  }
  return products;
}
