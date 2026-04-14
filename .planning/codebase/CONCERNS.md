# Concerns

## Performance Gráfica (Leitor)
- Ferramentas como `react-pageflip` e `react-zoom-pan-pinch` lidando com dezenas de imagens WebP injetadas virtualmente podem explodir gargalos de VRAM em dispositivos móveis caso não haja implementações fortes no pre-caching e unmount de páginas distantes (Lazy Loading / Virtualização).

## Firebase Cold Starts / Quotas
- Gerir Firebase exige cuidado se o hosting e DB forem bater limites gratuitos em caso de grande consumo da banda de leitura (egressing bytes transfer). É importante que os assets passem sempre por conversão WebP, mas ainda precisam de estratégia de CDN caching (`vite-plugin-pwa` é relevante aqui).

## Automação de Infraestrutura
- O processo `converter-hqs` pressupõe presenças locais como o GhostScript. Rodar num pipeline de CI futuramente pode gerar quebra sem container docker específico que instale dependências do kernel C para essas bibliotecas PDF.
