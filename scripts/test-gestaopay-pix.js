/**
 * Script de teste — Chamada real à API GestãoPay para mapear campos PIX
 * 
 * Uso:
 *   node scripts/test-gestaopay-pix.js
 * 
 * Pré-requisitos:
 *   Configurar as variáveis GESTAOPAY_PUBLIC_KEY e GESTAOPAY_SECRET_KEY abaixo.
 * 
 * Objetivo:
 *   Resolver DP-1: Descobrir os nomes exatos dos campos PIX retornados na resposta
 *   (QR Code, copia-e-cola, expiração).
 */

// ============================================================
// ⚠️  PREENCHA SUAS CREDENCIAIS AQUI (ou use variáveis de ambiente)
// ============================================================
const PUBLIC_KEY = process.env.GESTAOPAY_PUBLIC_KEY || "";
const SECRET_KEY = process.env.GESTAOPAY_SECRET_KEY || "";
// ============================================================

const API_URL = "https://api.gestaopayments.com/v1/payment-transaction/create";

// Payload mínimo válido para gerar uma cobrança PIX de teste
// Valor: R$ 1,00 (100 centavos) — menor valor possível para teste
const payload = {
  amount: 100,
  payment_method: "pix",
  postback_url: "https://webhook.site/test-diario-biblico",
  customer: {
    name: "Teste API Diario Biblico",
    email: "teste@teste.com",
    phone: "11999999999",
    document: {
      number: "12345678909", // CPF de teste (validação aritmética: 123.456.789-09)
      type: "cpf"
    }
  },
  items: [
    {
      title: "Teste - Diário Bíblico",
      unit_price: 100,
      quantity: 1,
      tangible: true
    }
  ],
  pix: {
    expires_in_days: 1
  },
  metadata: {
    provider_name: "Saints Label",
    test: true,
    purpose: "API field discovery"
  }
};

async function testGestaoPayPix() {
  console.log("=".repeat(70));
  console.log("🔍 TESTE DE CHAMADA À API GESTAOPAY — CRIAÇÃO DE PIX");
  console.log("=".repeat(70));
  console.log();

  // Validar credenciais
  if (PUBLIC_KEY.includes("COLE_SUA") || SECRET_KEY.includes("COLE_SUA")) {
    console.error("❌ ERRO: Credenciais não configuradas!");
    console.error("   Edite o arquivo e preencha PUBLIC_KEY e SECRET_KEY");
    console.error("   Ou execute com variáveis de ambiente:");
    console.error("   GESTAOPAY_PUBLIC_KEY=pk_... GESTAOPAY_SECRET_KEY=sk_... node scripts/test-gestaopay-pix.js");
    process.exit(1);
  }

  const credentials = Buffer.from(`${PUBLIC_KEY}:${SECRET_KEY}`).toString("base64");

  console.log("📤 Enviando requisição...");
  console.log(`   URL: ${API_URL}`);
  console.log(`   Método: POST`);
  console.log(`   Valor: R$ ${(payload.amount / 100).toFixed(2)}`);
  console.log();
  console.log("📦 Payload enviado:");
  console.log(JSON.stringify(payload, null, 2));
  console.log();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const statusCode = response.status;
    const responseHeaders = Object.fromEntries(response.headers.entries());
    
    let responseBody;
    const responseText = await response.text();
    
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }

    console.log("=".repeat(70));
    console.log("📥 RESPOSTA RECEBIDA");
    console.log("=".repeat(70));
    console.log();
    console.log(`   HTTP Status: ${statusCode}`);
    console.log();
    console.log("📋 Headers da resposta:");
    console.log(JSON.stringify(responseHeaders, null, 2));
    console.log();
    console.log("📋 Body da resposta (COMPLETO):");
    console.log(JSON.stringify(responseBody, null, 2));
    console.log();

    // Análise específica dos campos PIX
    if (statusCode === 200 && responseBody) {
      console.log("=".repeat(70));
      console.log("🔍 ANÁLISE DOS CAMPOS PIX");
      console.log("=".repeat(70));
      console.log();

      // Se a resposta for um array (data: [...])
      const data = responseBody.data?.[0] || responseBody.data || responseBody;
      
      // Buscar todos os campos que parecem ser relacionados a PIX/QR Code
      const pixRelatedKeys = [];
      
      function findPixFields(obj, prefix = "") {
        if (!obj || typeof obj !== "object") return;
        
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          const lowerKey = key.toLowerCase();
          
          // Campos potencialmente relacionados a PIX
          if (
            lowerKey.includes("pix") ||
            lowerKey.includes("qr") ||
            lowerKey.includes("code") ||
            lowerKey.includes("copy") ||
            lowerKey.includes("paste") ||
            lowerKey.includes("emv") ||
            lowerKey.includes("brcode") ||
            lowerKey.includes("expir") ||
            lowerKey.includes("image") ||
            lowerKey.includes("url") ||
            lowerKey.includes("base64") ||
            lowerKey.includes("barcode") ||
            lowerKey.includes("key") ||
            lowerKey.includes("txid")
          ) {
            pixRelatedKeys.push({ key: fullKey, value: truncateValue(value) });
          }
          
          // Recursar em objetos aninhados
          if (typeof value === "object" && value !== null) {
            findPixFields(value, fullKey);
          }
        }
      }

      function truncateValue(value) {
        if (typeof value === "string" && value.length > 100) {
          return value.substring(0, 100) + `... [${value.length} chars total]`;
        }
        return value;
      }

      findPixFields(data);

      if (pixRelatedKeys.length > 0) {
        console.log("✅ Campos PIX/QR Code encontrados:");
        console.log();
        for (const { key, value } of pixRelatedKeys) {
          console.log(`   📌 ${key}: ${JSON.stringify(value)}`);
        }
      } else {
        console.log("⚠️  Nenhum campo PIX/QR Code identificado automaticamente.");
        console.log("   Analise o body completo acima para encontrar os campos.");
      }

      // Listar todos os campos de primeiro nível
      console.log();
      console.log("📊 Todos os campos de primeiro nível na resposta:");
      const topLevel = responseBody.data?.[0] || responseBody.data || responseBody;
      if (typeof topLevel === "object") {
        for (const [key, value] of Object.entries(topLevel)) {
          const type = Array.isArray(value) ? "array" : typeof value;
          const display = type === "object" || type === "array" 
            ? `[${type}]` 
            : truncateValue(value);
          console.log(`   ${key} (${type}): ${JSON.stringify(display)}`);
        }
      }

    } else if (statusCode !== 200) {
      console.log("❌ Requisição falhou!");
      console.log("   Verifique suas credenciais e o payload.");
      
      if (statusCode === 401) {
        console.log("   💡 Dica: Erro 401 = credenciais inválidas. Verifique PUBLIC_KEY e SECRET_KEY.");
      } else if (statusCode === 400) {
        console.log("   💡 Dica: Erro 400 = validação. Veja os detalhes no body acima.");
        console.log();
        console.log("📊 Formato do erro 400 (resolve DP-4):");
        console.log(JSON.stringify(responseBody, null, 2));
      }
    }

    // Salvar resposta completa em arquivo
    const outputPath = "scripts/gestaopay-response.json";
    const outputData = {
      timestamp: new Date().toISOString(),
      request: {
        url: API_URL,
        method: "POST",
        payload: payload
      },
      response: {
        statusCode: statusCode,
        headers: responseHeaders,
        body: responseBody
      }
    };
    
    const fs = require("fs");
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), "utf-8");
    console.log();
    console.log(`💾 Resposta completa salva em: ${outputPath}`);

  } catch (error) {
    console.error("❌ Erro de rede:", error.message);
    console.error("   Verifique sua conexão com a internet.");
    console.error("   Detalhes:", error);
  }

  console.log();
  console.log("=".repeat(70));
  console.log("FIM DO TESTE");
  console.log("=".repeat(70));
}

// Executar
testGestaoPayPix();
