
# CHECKLIST FASE 3 - Sistema Calendário

## FASE 3 - PARTE 1 ✅ CONCLUÍDA

### Modais de Edição Avançada
- [x] **BaseDialog.tsx**: Componente base reutilizável
- [x] **CardDialog.tsx**: Modal completo para edição de cartões
- [x] **SpreadsheetDialog.tsx**: Editor estilo Excel para planilhas

### Funcionalidades Base dos Modais
- [x] Layout responsivo de duas colunas (principal + barra lateral)
- [x] Redimensionamento dinâmico baseado no conteúdo
- [x] Maximização/restauração do modal
- [x] Botões de ação na barra superior (Salvar, Arquivar, Excluir)

### Sistema de Barra Lateral
- [x] Botões de ação organizados verticalmente
- [x] Ícones consistentes com Lucide React
- [x] Popups integrados para cada funcionalidade

---

## FASE 3 - PARTE 2 ✅ 90% CONCLUÍDA

### Modal de Edição de Cartões (`CardDialog.tsx`)

#### Layout e Estrutura
- [x] Modal dinâmico que cresce conforme o conteúdo
- [x] Rolagem na tela principal (não no modal)
- [x] Barra lateral integrada ao modal
- [x] Campo de descrição expandido (200px mínimo)
- [x] Seção de atividades com "Mostrar/Ocultar Detalhes"

#### Capa
- [x] Capa no cabeçalho do modal (cores e imagens)
- [x] Capa nos cartões da área de trabalho
- [x] Suporte a cores predefinidas e personalizadas
- [x] Opção de remoção da capa

#### Barra Lateral (Ações)
- [x] **Popup de Etiquetas**
  - [x] Busca de etiquetas existentes
  - [x] Criação de novas etiquetas
  - [x] Aplicação/remoção de etiquetas
  - [x] Seletor de cores
  - [x] ✅ Comportamento correto de fechamento

- [x] **Popup de Checklist**
  - [x] Campo de texto para criar checklist
  - [x] Botão "Adicionar" + tecla Enter
  - [x] Visão geral com porcentagens
  - [x] Lista de checklists existentes
  - [x] Opção de exclusão de checklists
  - [x] ✅ Fechamento ao clicar fora
  - [x] ✅ Exibição no modal principal
  - [x] ✅ Adição de itens individuais
  - [x] ✅ Menu de contexto para itens
  - [x] ✅ Barra de progresso

- [x] **Popup de Datas**
  - [x] Data de início
  - [x] Data de entrega
  - [x] Data de lembrete
  - [x] Calendário integrado
  - [x] ✅ Comportamento correto de fechamento

- [x] **Popup de Capa**
  - [x] Cores predefinidas
  - [x] Seletor de cor personalizada
  - [x] Upload de imagem
  - [x] Opção de remoção
  - [x] ✅ Comportamento correto de fechamento

- [x] **Popup de Mover**
  - [x] Seleção de quadro
  - [x] Seleção de bloco
  - [x] Seleção de posição
  - [x] ✅ Comportamento correto de fechamento

- [x] **Localização do Cartão**
  - [x] Botão "No bloco [nome]" clicável
  - [x] Popup com informações de localização
  - [x] Opção para mover cartão

#### Sistema de Controle de Foco ✅
- [x] **Controle de pop-ups exclusivo**
  - [x] Estado `activePopup` para controlar foco
  - [x] Função `closeActivePopup()` para fechar apenas a telinha
  - [x] Função `handleModalClose()` com verificação de pop-up ativo
  - [x] Uso de `stopPropagation()` em botões da barra lateral

- [x] **Comportamento de Fechamento Correto**
  - [x] Clique fora da telinha: fecha apenas a telinha
  - [x] Clique fora do modal: fecha modal apenas se nenhuma telinha estiver aberta
  - [x] Ações na telinha (Adicionar, Salvar): fecham a telinha
  - [x] Consistência entre todos os pop-ups

#### Funcionalidades Internas
- [x] **Checklist Completo**
  - [x] Barra de progresso com porcentagem
  - [x] Campo para adicionar novos itens
  - [x] Checkbox para marcar/desmarcar
  - [x] Menu de contexto nos itens (Excluir)
  - [x] Integração com checklists criados via popup

- [x] **Anexos**
  - [x] Upload de arquivos
  - [x] Miniaturas para imagens
  - [x] Remoção de anexos
  - [x] Suporte a múltiplos tipos de arquivo

- [x] **Descrição com Markdown**
  - [x] Barra de ferramentas de formatação
  - [x] Botões: Negrito, Itálico, Lista, Link, Imagem
  - [x] Campo de texto expandido (min 200px)

- [x] **Comentários e Atividade**
  - [x] Campo para novos comentários
  - [x] Seção "Mostrar/Ocultar Detalhes"
  - [x] Histórico de atividades

#### Popups Avançados
- [x] Popups que ultrapassam limites do modal
- [x] Posicionamento correto (absolute/fixed)
- [x] Z-index adequado para sobreposição
- [x] ✅ Fechamento correto sem afetar o modal

### Sistema de Notificações
- [x] Sino movido para cabeçalho principal
- [x] Badge com quantidade de notificações
- [x] Notificações destacadas até serem lidas
- [x] Clique abre contexto (modal do cartão)

### Modal de Planilhas (`SpreadsheetDialog.tsx`)
- [x] Estrutura base implementada
- [x] Barra de ferramentas estilo Excel
- [x] Edição de células em tempo real
- [x] Adição/remoção de linhas e colunas
- [x] Importação de tabelas Markdown
- [x] Capas em planilhas (SpreadsheetItem)
- [ ] **Sistema de controle de foco dos pop-ups** ⏳
- [ ] **Barra lateral idêntica ao CardDialog** ⏳

---

## PENDÊNCIAS FASE 3 - PARTE 2 (10% restante)

### Modal de Planilhas - Refinamentos ⏳
- [ ] Aplicar sistema `activePopup` no SpreadsheetDialog
- [ ] Implementar barra lateral com pop-ups
- [ ] Adicionar funcionalidades de etiquetas, datas, etc.

### Sistema de Notificações Avançado ⏳
- [ ] Notificações em tempo real
- [ ] Filtros por tipo de notificação
- [ ] Histórico completo de notificações

### Comentários com Markdown ⏳
- [ ] Editor Markdown nos comentários
- [ ] Preview em tempo real
- [ ] Anexos em comentários

### Reordenação via Arrastar e Soltar ⏳
- [ ] Drag & drop para itens de checklist
- [ ] Reordenação de anexos
- [ ] Drag & drop entre blocos

---

## STATUS ATUAL
**✅ FASE 3 - PARTE 2: 90% CONCLUÍDA**

### Principais Conquistas:
1. ✅ Sistema de controle de foco implementado corretamente
2. ✅ Checklist completo funcionando no modal
3. ✅ Capas exibindo nos cartões da área de trabalho
4. ✅ Pop-ups com comportamento correto de fechamento
5. ✅ Barra lateral completa no CardDialog

### Próximos Passos:
1. Finalizar sistema de pop-ups no SpreadsheetDialog
2. Implementar notificações avançadas
3. Adicionar comentários com Markdown
4. Implementar drag & drop

**Estimativa para conclusão da Fase 3: 1 sessão de trabalho**
