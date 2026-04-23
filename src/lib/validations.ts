/**
 * Validações de campos do checkout — Mapa da Palavra
 * 
 * Funções puras, sem side effects. Usadas tanto no client quanto no server.
 */

/**
 * Valida CPF com dígito verificador
 * Aceita com ou sem formatação (123.456.789-09 ou 12345678909)
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;

  // Rejeitar CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

/**
 * Valida formato de e-mail
 */
export function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  // Regex simples mas robusto para validação de e-mail
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Valida telefone brasileiro (10-11 dígitos)
 * Aceita com ou sem formatação
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 11;
}

/**
 * Valida nome completo
 * Mínimo 3 caracteres, deve conter pelo menos um espaço (nome + sobrenome)
 */
export function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 3;
}

/**
 * Formata CPF: 12345678909 → 123.456.789-09
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
}

/**
 * Formata telefone: 11999998888 → (11) 99999-8888
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}

/**
 * Remove formatação do CPF para envio à API
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Remove formatação do telefone para envio à API
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Validação de CEP
 */
export function validateCEP(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.length === 8;
}

/**
 * Formata CEP: 12345678 → 12345-678
 */
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
}

/**
 * Remove formatação do CEP
 */
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, "");
}

/**
 * Validação completa do formulário de checkout.
 * Retorna objeto com erros por campo (vazio se tudo válido).
 */
export function validateCheckoutForm(data: {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  cidade: string;
  estado: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!validateName(data.name)) {
    errors.name = "Informe seu nome completo";
  }

  if (!validateEmail(data.email)) {
    errors.email = "Informe um e-mail válido";
  }

  if (!validatePhone(data.phone)) {
    errors.phone = "Informe um telefone válido com DDD";
  }

  if (!validateCPF(data.cpf)) {
    errors.cpf = "Informe um CPF válido";
  }

  if (!validateCEP(data.cep)) {
    errors.cep = "Informe um CEP válido";
  }

  if (!data.rua || data.rua.trim() === "") {
    errors.rua = "Informe a rua";
  }

  if (!data.numero || data.numero.trim() === "") {
    errors.numero = "Informe o número";
  }

  if (!data.cidade || data.cidade.trim() === "") {
    errors.cidade = "Informe a cidade";
  }

  if (!data.estado || data.estado.trim() === "") {
    errors.estado = "Informe o estado";
  }

  return errors;
}
