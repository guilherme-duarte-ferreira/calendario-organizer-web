
# Documentação do Sistema Calendario

## Versão 1.0.0

Este documento apresenta a documentação do sistema Calendario, incluindo a estrutura de implementação e um checklist dos requisitos implementados e pendentes.

## Checklist de Implementação

### RF01: Cabeçalho
- [x] 1.1. Exibir "Calendário" com ícone de calendário à esquerda.
- [x] 1.2. Botão "Criar Quadro" com ícone "+" e cor destacada (azul), criando quadro diretamente.
- [x] 1.3. Barra de pesquisa com:
  - [x] Filtragem dinâmica (em tempo real) de quadros, blocos, planilhas, cartões e palavras-chave.
  - [x] Dropdown com prévia de resultados (títulos ou trechos).
  - [x] Filtros opcionais via ícone de funil (por quadro, planilha).
- [x] 1.4. Não exibir ícone de perfil (sem suporte a usuários).

### RF02: Barra Lateral
- [x] 2.1. Não incluir seção de usuário.
- [x] 2.2. Botão "Calendário" com ícone, exibindo calendário interativo na área de trabalho.
- [x] 2.3. Botão "Recolher Barra Lateral" com ícone de seta:
  - [x] Localizado no topo da barra lateral, abaixo do botão "Calendário".
  - [x] Recolhe a barra lateral, exibindo apenas ícones dos botões.
  - [x] Expande ao clicar novamente, restaurando a visualização completa.
  - [x] Área de trabalho se ajusta automaticamente ao recolher/expandir.
- [x] 2.4. Pop-up de configurações com abas:
  - [x] **Aparência Geral**: Alteração de wallpaper e tema claro/escuro.
  - [x] **Área de Trabalho**: Orientação da rolagem, tamanhos padrão.
  - [x] **Comportamento de Planilhas**: Edição, exportação, importação.
  - [x] Parâmetro "Ajuste Automático de Blocos à Planilha".
- [x] 2.5. Seção "Quadros":
  - [x] Lista de quadros com botão "+" para "Novo Quadro".
  - [x] Cada quadro com hover e menu de opções (renomear, arquivar, etc).
  - [x] Pastas para organizar quadros.
  - [x] Estrutura em árvore para visualização.

### RF03: Área de Trabalho
- [x] 3.1. Gerenciamento de blocos:
  - [x] Adicionar/editar/remover blocos com nome personalizável.
  - [x] Arrastar e soltar para reorganização.
  - [x] Arquivamento (visualização opcional).
  - [x] Três botões: "Inserir Arquivo", "Criar Cartão Novo", "Criar Planilha".
  - [x] Opção de inserir texto Markdown ou tabela Markdown.
- [x] 3.2. Gerenciamento de cartões:
  - [x] Criar cartões com título, descrição, checklist e status.
  - [x] Arquivar/excluir cartões.
  - [x] Arrastar para reordenar ou mover entre blocos.
  - [x] Menu de contexto com opções.
  - [x] Anexar arquivos.
  - [x] Tela de configuração com botões.
- [x] 3.3. Gerenciamento de planilhas:
  - [x] Criar/importar planilhas via Markdown.
  - [x] Colunas personalizáveis.
  - [x] Edição em tempo real.
  - [x] Adicionar/remover colunas/linhas.
  - [x] Menu de contexto.
  - [x] Tela de configuração.
- [x] 3.4. Barra de scroll:
  - [x] Restrita à área de trabalho.
  - [x] Ajuste dinâmico (horizontal/vertical).
  - [x] Modos de rolagem configuráveis.
- [x] 3.5. Clicar e arrastar com prévia visual.
- [ ] 3.6. Arrastar múltiplos itens com Ctrl+clique (parcialmente implementado).
- [x] 3.7. Inserir arquivo com visualização apropriada.
- [x] 3.8. Configurar papel de parede.

### RF04: Área de Arquivos
- [x] 4.1. Armazenar itens arquivados.
- [x] 4.2. Arquivamento de quadros inteiros.
- [x] 4.3. Seção "Arquivos" na barra lateral com opções de restaurar, excluir e filtrar.

### RF05: Configurações
- [x] 5.1. Pop-up de configurações com várias opções.
- [x] 5.2. Exportação/importação JSON.
- [x] 5.3. Histórico de versões.

### RF06: Salvamento
- [x] 6.1. Salvar dados em JSON.
- [x] 6.2. Compactação e validação do JSON.
- [x] 6.3. Histórico de versões para reversão.

### RF07: Suporte a Markdown
- [x] 7.1. Importação de planilhas via Markdown.
- [x] 7.2. Blocos de anotações com Markdown.
- [x] 7.3. Opção para criar tabelas via Markdown.

### RNF08: Interface Responsiva e Intuitiva
- [x] 8.1. Design responsivo com TailwindCSS.
- [x] 8.2. Pesquisa dinâmica.
- [x] 8.3. Salvamento eficiente.
- [x] 8.4. Suporte a wallpapers.
- [x] 8.5. Lazy loading para quadros grandes.
- [x] 8.6. Renderização de Markdown.

## Funcionalidades Pendentes ou Em Desenvolvimento

1. **Arrastar múltiplos itens (parcialmente implementado)**:
   - A funcionalidade de selecionar múltiplos itens com Ctrl+clique ainda precisa ser aprimorada.

2. **Melhorias na Interface de Usuário**:
   - Aprimorar a experiência do usuário em telas menores.
   - Adicionar mais feedback visual durante operações de arraste.

3. **Otimização de Desempenho**:
   - Melhorar a performance ao lidar com grande número de quadros/blocos.

## Estrutura do Projeto

### Diretórios Principais
- `/src`: Código-fonte da aplicação
  - `/components`: Componentes React
  - `/contexts`: Contextos React para gerenciamento de estado
  - `/hooks`: Hooks personalizados
  - `/pages`: Páginas da aplicação
  - `/types`: Definições de tipos TypeScript
  - `/utils`: Funções utilitárias

### Componentes Principais
- `Header.tsx`: Cabeçalho da aplicação com barra de pesquisa e botões
- `Sidebar.tsx`: Barra lateral com navegação e controles
- `WorkArea.tsx`: Área principal de trabalho
- `BlockComponent.tsx`: Componente de bloco
- `CardItem.tsx`: Componente de cartão
- `SpreadsheetItem.tsx`: Componente de planilha
- `MarkdownItem.tsx`: Componente de nota Markdown
- `FileItemComponent.tsx`: Componente para arquivos

### Contextos
- `CalendarioContext.tsx`: Gerencia o estado global da aplicação

### Hooks
- `use-drag-drop.tsx`: Hook para funcionalidade de arrastar e soltar

### Utilidades
- `storage.ts`: Funções para salvar e recuperar dados
- `markdown.ts`: Funções para processamento de Markdown

## Tecnologias Utilizadas

- **Frontend**: React com TypeScript
- **Estilização**: TailwindCSS
- **Componentes de UI**: shadcn/ui
- **Armazenamento**: LocalStorage para persistência de dados
- **Markdown**: react-markdown para renderização

## Conclusão

O sistema Calendario está implementado com a maioria das funcionalidades requisitadas. Existem alguns pontos de melhoria e funcionalidades pendentes que continuarão sendo desenvolvidos nas próximas versões.

Para qualquer dúvida ou sugestão, entre em contato com a equipe de desenvolvimento.
