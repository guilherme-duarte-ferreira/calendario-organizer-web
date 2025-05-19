
# Documentação - Fase 2: Gerenciamento de Quadros, Pastas e Blocos

## Visão Geral

Esta documentação detalha a implementação da Fase 2 do sistema "Calendário", focada no gerenciamento de quadros, pastas e blocos. Também inclui correções do feedback da Fase 1, como o comportamento dos blocos que agora crescem dinamicamente conforme o conteúdo é adicionado, sem criar barras de rolagem internas.

## Correções de Comportamento

### Correção do comportamento dos blocos:
- Blocos agora crescem dinamicamente conforme o conteúdo é adicionado
- Removida a altura máxima fixa e a barra de rolagem interna
- Comportamento agora similar ao Trello original

## Checklist de Requisitos da Fase 2

### 🔄 Em Implementação: RF01: Cabeçalho (Funcionalidade)
- 🔄 1.2. Funcionalidade completa do Botão "Criar Quadro"

### 🔄 Em Implementação: RF02: Barra Lateral (Seção "Quadros" Completa)
- 🔄 2.5. Seção "Quadros":
  - 🔄 Funcionalidade completa do botão "+" para "Novo Quadro"
  - 🔄 Hover funcional para quadros
  - 🔄 Ícone de três pontos com opções: "Renomear", "Deletar"
  - 🔄 Sistema de Pastas para organizar quadros

### 🔄 Em Implementação: RF03: Área de Trabalho (Gerenciamento de Blocos)
- 🔄 3.1. Gerenciamento de blocos:
  - ✅ Adição de blocos com nome personalizável
  - ✅ Edição de nomes de blocos
  - ✅ Remoção de blocos
  - 🔄 Arrastar e soltar para reorganização (parcialmente implementado)
  - ✅ Botões "Inserir Arquivo", "Criar Cartão", "Criar Planilha" abaixo do bloco
  - ✅ Opções nos três pontinhos: "Inserir texto em Markdown", "Criar Tabela via Markdown"
- 🔄 3.6. Prévia visual ao arrastar blocos

### 🔄 Em Implementação: RF06: Salvamento (Quadros, Pastas, Blocos)
- 🔄 6.1. Salvar dados de pastas em JSON
- ✅ 6.1. Salvar dados de blocos em JSON
- 🔄 6.1. Implementar salvamento de cada quadro em JSON separado

## Implementações Completas

- ✅ Correção do comportamento dos blocos, que agora crescem dinamicamente
- ✅ Implementação completa de criação, edição e exclusão de blocos
- ✅ Implementação das opções "Inserir texto Markdown" e "Criar Tabela via Markdown"
- ✅ Criação básica de cartões, planilhas e notas Markdown
- ✅ Implementação da visualização de conteúdo Markdown usando react-markdown

## Próximos Passos

1. Completar a funcionalidade de pastas para organizar quadros
2. Implementar o sistema de arrastar e soltar para reorganização de blocos
3. Adicionar opção de "Fixar" quadros/pastas no topo
4. Implementar o salvamento de cada quadro em JSON separado
5. Desenvolver a funcionalidade completa do botão "Criar Quadro"

## Estrutura de Arquivos Atualizada

Os principais arquivos modificados ou criados nesta fase foram:

```
src/
├── components/
│   ├── workspace/
│   │   ├── BlockComponent.tsx    # Componente de blocos (modificado)
│   │   ├── CardItem.tsx          # Componente de cartões (corrigido)
│   │   ├── MarkdownItem.tsx      # Componente de notas markdown (corrigido)
│   │   └── FileItemComponent.tsx # Componente de arquivos (existente)
│
├── contexts/
│   └── CalendarioContext.tsx     # Contexto global atualizado
│
└── types/
    └── calendario.ts             # Definições de tipos
```

## Tecnologias e Ferramentas

- React com TypeScript
- TailwindCSS para estilização
- shadcn/ui para componentes de interface
- Lucide React para ícones
- React Markdown para renderização de conteúdo Markdown
- localStorage para persistência de dados

## Conclusão

A implementação da Fase 2 avança significativamente na funcionalidade do sistema, corrigindo o comportamento dos blocos e ampliando as capacidades de gerenciamento. As próximas etapas focarão em completar o sistema de pastas e arrastar e soltar, além de refinar as funcionalidades já implementadas.
