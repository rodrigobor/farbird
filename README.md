# Documentação do Mini App Flappy Bird para Farcaster

## Visão Geral

Este mini app é uma versão do clássico jogo Flappy Bird integrado à plataforma Farcaster, com um sistema de pagamento por tentativa utilizando USDC na rede BASE. Para cada tentativa de jogo, o usuário precisa pagar 0,10 USDC, que são enviados para a carteira especificada.

## Estrutura do Projeto

```
flappy-bird-farcaster/
├── app/                      # Aplicação React
│   ├── public/               # Arquivos públicos
│   │   ├── index.html        # HTML principal com metatags do Farcaster
│   │   └── ...
│   ├── src/                  # Código fonte
│   │   ├── components/       # Componentes React
│   │   │   ├── Game.tsx      # Componente do jogo Flappy Bird
│   │   │   └── PaymentGateway.tsx # Componente de pagamento
│   │   ├── styles/           # Arquivos CSS
│   │   │   ├── Game.css      # Estilos do jogo
│   │   │   └── PaymentGateway.css # Estilos do gateway de pagamento
│   │   ├── App.tsx           # Componente principal
│   │   ├── App.css           # Estilos do App
│   │   └── ...
│   └── package.json          # Dependências e scripts
└── todo.md                   # Lista de tarefas do projeto
```

## Funcionalidades Principais

1. **Jogo Flappy Bird**: Implementação completa do jogo clássico com física e controles responsivos
2. **Sistema de Pagamento**: Integração com o SDK do Farcaster para pagamentos em USDC na rede BASE
3. **Tela de Splash**: Animação de carregamento ao iniciar o app
4. **Responsividade**: Interface adaptável para diferentes tamanhos de tela
5. **Integração Farcaster**: Uso do SDK para autenticação e pagamentos

## Fluxo de Pagamento

O fluxo de pagamento foi implementado utilizando o SDK do Farcaster, especificamente a função `sendToken`. Para cada tentativa de jogo, o usuário precisa pagar 0,10 USDC (100000 unidades, considerando 6 casas decimais) que são enviados para o endereço `0xC6E5e68492fb7D73955c4F80168552C638844409` na rede BASE.

### Detalhes Técnicos do Pagamento

- **Token USDC na BASE**: `eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Valor por tentativa**: 0,10 USDC (100000 unidades)
- **Endereço de recebimento**: `0xC6E5e68492fb7D73955c4F80168552C638844409`

## Instruções de Uso

### Pré-requisitos

- Node.js 16+ instalado
- Acesso à rede BASE através de uma carteira compatível
- USDC na rede BASE para pagamentos

### Instalação e Execução Local

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd flappy-bird-farcaster
   ```

2. Instale as dependências:
   ```bash
   cd app
   npm install
   ```

3. Execute o projeto localmente:
   ```bash
   npm start
   ```

4. Acesse o app em `http://localhost:3000`

### Deploy

Para fazer o deploy do mini app, recomendamos usar o Vercel ou Netlify:

1. Faça o build do projeto:
   ```bash
   npm run build
   ```

2. Faça o deploy da pasta `build` para o serviço de hospedagem de sua preferência.

3. Configure o arquivo `.well-known/farcaster.json` na raiz do seu domínio conforme a documentação do Farcaster.

## Configuração do Farcaster

### Manifesto (farcaster.json)

Crie um arquivo `farcaster.json` na pasta `.well-known` na raiz do seu domínio:

```json
{
  "frame": {
    "version": "1",
    "name": "Flappy Bird",
    "iconUrl": "https://seu-dominio.com/logo.png",
    "homeUrl": "https://seu-dominio.com/",
    "imageUrl": "https://seu-dominio.com/preview.png",
    "buttonTitle": "🎮 Jogar",
    "splashImageUrl": "https://seu-dominio.com/logo.png",
    "splashBackgroundColor": "#70c5ce",
    "requiredChains": [
      "eip155:8453"
    ],
    "requiredCapabilities": [
      "wallet.getEvmProvider",
      "actions.sendToken"
    ]
  }
}
```

### Embed para Compartilhamento

O embed para compartilhamento já está configurado no arquivo `index.html`. Ele permite que o mini app seja compartilhado em feeds do Farcaster.

## Personalização

### Modificando o Valor do Pagamento

Para alterar o valor do pagamento, edite a constante `AMOUNT` no arquivo `src/components/PaymentGateway.tsx`:

```typescript
// Valor em unidades mínimas (6 casas decimais para USDC)
// 100000 = 0,10 USDC
const AMOUNT = "100000";
```

### Alterando o Endereço de Recebimento

Para alterar o endereço que receberá os pagamentos, edite a constante `RECIPIENT_ADDRESS` no arquivo `src/components/PaymentGateway.tsx`:

```typescript
const RECIPIENT_ADDRESS = "0xSeuEnderecoAqui";
```

## Solução de Problemas

### O SDK do Farcaster não está disponível

Se o SDK do Farcaster não estiver disponível, verifique se o mini app está sendo executado dentro de um cliente Farcaster compatível. O SDK só funciona quando o app é aberto através de um cliente Farcaster.

### Erros de Pagamento

Se ocorrerem erros durante o pagamento, verifique:
1. Se o usuário tem USDC suficiente na rede BASE
2. Se a conexão com a rede BASE está funcionando corretamente
3. Se o usuário rejeitou a transação

## Recursos Adicionais

- [Documentação do Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [SDK do Farcaster](https://github.com/farcasterxyz/frames)
- [Documentação da Rede BASE](https://docs.base.org/)

## Suporte

Para suporte ou dúvidas sobre o mini app, entre em contato através de [seu-email@exemplo.com].
