
# Documentação da Fase 2 - Calendario

## Objetivo

A Fase 2 do projeto Calendario tem como objetivo principal implementar funcionalidades completas para a criação, organização e manipulação de quadros, pastas e blocos, estabelecendo a base do sistema de gerenciamento visual semelhante ao Trello.

## Visão Geral das Funcionalidades

### RF01: Cabeçalho (Funcionalidade)
- Implementação completa do botão "Criar Quadro", que cria um novo quadro vazio (sem blocos pré-definidos) e o adiciona à lista de quadros na barra lateral.

### RF02: Barra Lateral (Seção "Quadros" Completa)
- Botão "+" para criar novos quadros com funcionalidade completa (adiciona à lista e salva).
- Cada quadro na lista possui:
  - Feedback visual ao passar o mouse (hover).
  - Ícone de três pontos com opções: "Renomear", "Deletar" e "Arquivar".
  - Funcionalidade de renomear e deletar quadros com confirmação.
- Implementação de pastas para organização:
  - Criação, renomeação e exclusão de pastas.
  - Visualização em árvore (expandir/recolher) para pastas.
  - Interface para arrastar quadros/pastas para reordenação.

### RF03: Área de Trabalho (Gerenciamento de Blocos)
- Gerenciamento completo de blocos:
  - Adicionar blocos com nome personalizável.
  - Editar nome de blocos.
  - Remover blocos com confirmação.
  - Interface visual para arrastar e soltar blocos.
- Implementação dos três botões em cada bloco:
  - "Criar Cartão Novo"
  - "Criar Planilha"
  - "Inserir Arquivo"
- Opções nos três pontinhos do bloco:
  - "Inserir texto em Markdown"
  - "Criar Tabela via Markdown"
- Prévia visual ao arrastar blocos (contorno/sombra).

### RF06: Salvamento (Quadros, Pastas, Blocos)
- Implementação do sistema de salvamento em JSON:
  - Salvar dados de pastas (estrutura e conteúdo).
  - Salvar dados de blocos (nomes, ordem, quadro ao qual pertencem).
  - Salvar cada quadro no localStorage com gerenciamento de arquivados.

## Estado da Implementação

| Requisito | Status | Observações |
|-----------|--------|-------------|
| RF01: Cabeçalho | ✅ Completo | Botão "Criar Quadro" funcionando corretamente |
| RF02: Barra Lateral | ⚠️ Parcial | Falta implementar drag & drop entre pastas |
| RF03: Gerenciamento de Blocos | ⚠️ Parcial | Falta drag & drop de blocos e prévia visual |
| RF06: Salvamento | ✅ Completo | Implementado via localStorage |

## Desafios e Próximos Passos

Os principais desafios da Fase 2 incluem:

1. **Arrastar e soltar (drag & drop)**: Implementar a funcionalidade completa para mover blocos e reorganizar quadros/pastas.
2. **Crescimento dinâmico dos blocos**: Aperfeiçoar o redimensionamento dos blocos para se adaptar ao conteúdo.
3. **Visualização em árvore**: Finalizar a implementação da hierarquia de pastas com suporte completo à visualização em árvore.

Para mais detalhes sobre cada funcionalidade, consulte os documentos específicos:

- [Fase2_Quadros.md](./Fase2_Quadros.md) - Detalhes sobre quadros e pastas
- [Fase2_Blocos.md](./Fase2_Blocos.md) - Informações sobre blocos e seus itens
- [Fase2_Salvamento.md](./Fase2_Salvamento.md) - Detalhes sobre o sistema de persistência
