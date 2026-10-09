# God's Eye View no Thiago Lab

Rota pública: `/gods-eye-view`. Aplicativo original compilado em
`/gods-eye-view/app/index.html`, com APIs isoladas em `/api/gods-eye-view/`.

Base: https://github.com/bilawalsidhu/gods-eye-view
Commit: `6be25595b16491ce01ffd8d81e66921f321ee200` (MIT).
Autoria original de Bilawal Sidhu e colaboradores; integração de Thiago Piola.
Licença e avisos de terceiros são preservados em `vendor/gods-eye-view/` e
disponibilizados junto ao aplicativo compilado.

## Build

`npm ci` seguido de `npm run build` compila primeiro o cliente Vite/Cesium
e depois o projeto Next.js existente. Não há servidor Vite em produção.
O código original é um submódulo público fixado no commit acima. A Vercel
obtém esse submódulo no checkout; o preparo aplica as adaptações antes do build.

Franca, Brasil e Mundo são atalhos de câmera. A busca, os controles visuais,
as camadas públicas e o diretor de cenas pertencem ao aplicativo original.
Voos usam exclusivamente adsb.lol em um raio de 250 milhas náuticas do centro
da câmera, com cache de 15 segundos e identificação de fonte e cobertura.
Não se consulta OpenSky, cuja licença padrão é não comercial.

Se o WebGL falhar na inicialização, o aplicativo abre automaticamente um mapa
Leaflet 2D com imagens Esri (OSM como alternativa), voos regionais, satélites
calculados por SGP4/CelesTrak e terremotos USGS. Os atalhos de câmera funcionam
nos dois modos. O globo 3D permanece como experiência principal.

## Limites desta edição

- Não expõe painel de credenciais, login OAuth/Codex, arquivos do servidor ou MCP.
- Não ativa endpoints pagos OpenAI/Google, AIS por WebSocket persistente,
  receptores locais de rádio/ADS-B ou configuração de câmeras sem revisão.
- Os dados TeleGeography CC BY-NC-SA e o pacote/caminho derivado Bhote Koshi
  CC BY-NC são removidos. As cenas de Nepal não são registradas.
- APIs indisponíveis retornam erro estruturado; não se fabricam dados.
- Caches de processo são temporários em funções Vercel; o app mantém as
  identificações e limitações de fonte fornecidas pelo projeto original.

Chaves públicas opcionais, restritas no provedor e com licença apropriada:
`GEV_PUBLIC_GOOGLE_MAPS_KEY`, `GEV_PUBLIC_CESIUM_ION_TOKEN`,
`GEV_PUBLIC_MAPILLARY_TOKEN`. Nenhuma chave é necessária para iniciar.
Não configurar tokens pessoais ou segredos em variáveis públicas.

Ao atualizar o código vendorizado, reaplicar as exclusões de dados,
registros e receitas restritas, a fonte de voos regional e as adaptações de
rotas. Testar carregamento WebGL, trabalhadores Cesium, modelos 3D, camadas,
atalhos e respostas dos provedores antes de publicar no mesmo projeto Vercel.
