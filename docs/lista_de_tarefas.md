
# Planejamento de Implementação do Sistema "Calendário" em 5 Fases

## STATUS ATUAL DO PROJETO - FASE 3 (Parte 2)

### ✅ CONCLUÍDO (80% da Fase 3)

#### Modal de Edição de Cartões (`CardDialog.tsx`):
- ✅ Modal dinâmico que cresce conforme o conteúdo
- ✅ Rolagem na tela principal (não no modal)
- ✅ Barra lateral integrada ao modal
- ✅ Capa no cabeçalho do modal (cores e imagens)
- ✅ Campo de descrição expandido (200px mínimo)
- ✅ Popups que ultrapassam limites do modal
- ✅ Botão "No bloco [nome]" clicável para localização
- ✅ Seção de atividades com "Mostrar/Ocultar Detalhes"
- ✅ Comentários com hover para editar/excluir

#### Funcionalidades de Barra Lateral:
- ✅ Popup de Etiquetas (busca, criação, aplicação)
- ✅ Popup de Datas (início, entrega, lembrete)
- ✅ Popup de Capa (cores predefinidas, personalizadas, remoção)
- ✅ Popup de Mover (quadro, bloco, posição)
- ✅ Localização do cartão implementada

#### Sistema de Notificações:
- ✅ Sino movido para cabeçalho principal
- ✅ Notificações com badge de quantidade
- ✅ Notificações destacadas até serem lidas
- ✅ Clique abre contexto (modal do cartão)

#### Capas:
- ✅ Capa no cabeçalho do modal
- ✅ Capa nos cartões da área de trabalho
- ✅ Suporte a cores e imagens
- ✅ Cores predefinidas e personalizadas

#### Checklist - NOVA IMPLEMENTAÇÃO:
- ✅ Popup reformulado para criação de checklists
- ✅ Campo de texto com botão "Adicionar" e Enter
- ✅ Visão geral com porcentagens e contagem
- ✅ Lista de checklists existentes com exclusão
- ✅ Fechamento da telinha ao clicar fora

### 🔄 EM ANDAMENTO (20% restante)

#### Checklist no Modal - Pendente:
- ⏳ Exibição de checklists no modal principal
- ⏳ Adição de itens com botão "Adicionar Item"
- ⏳ Menu de contexto nos itens (Renomear, Excluir, Marcar)
- ⏳ Menu de contexto no título do checklist
- ⏳ Reordenação via arrastar e soltar
- ⏳ Barra de progresso individual por checklist

#### Modal de Planilhas - Pendente:
- ⏳ Aplicar mesmas funcionalidades do modal de cartões
- ⏳ Barra lateral idêntica
- ⏳ Capas em planilhas

---

## Fase 1: Fundação do Sistema e Interface Principal

**Objetivo:** Estabelecer a estrutura base da aplicação, incluindo o layout principal, navegação essencial e as primeiras funcionalidades de criação de conteúdo.

**Detalhes da Implementação:**

1.  **Configuração Inicial do Projeto:**
    * Estruturar o frontend com HTML, CSS, JavaScript e TailwindCSS.
    * Definir a arquitetura básica do backend RESTful (a tecnologia específica pode ser escolhida, ex: Node.js, Python, Java), com endpoints iniciais para quadros (ex: `/api/boards`).
    * Implementar a função `generateId()` para IDs únicos.
    * Implementar a função `checkRequiredFields()` para validação.
    * Implementar a função básica `saveData()` para localStorage inicialmente, com estrutura para futura integração com backend.

2.  **Desenvolvimento do Cabeçalho (RF01 - Parcial):**
    * Exibir o nome "Calendário" com ícone de calendário à esquerda (RF01.1).
    * Implementar o botão "Criar Quadro" com ícone "+" e cor destacada. Funcionalidade: cria um novo quadro diretamente (RF01.2).
    * Garantir que não haja ícone de foto de perfil (RF01.4).

3.  **Desenvolvimento da Barra Lateral (RF02 - Parcial):**
    * Garantir que não haja seção de usuário (RF02.1).
    * Implementar o botão "Recolher Barra Lateral" com ícone de seta (esquerda/direita) no topo, abaixo do futuro botão "Calendário". Funcionalidade: recolher/expandir a barra lateral, ajustando a área de trabalho automaticamente (RF02.3).
    * Criar a estrutura da seção "Quadros" (RF02.5 - Parcial):
        * Listagem inicial de quadros (vazia ou com dados de exemplo).
        * Botão "+" para criar "Novo Quadro" (deve funcionar em conjunto com RF01.2).

4.  **Estrutura da Área de Trabalho (RF03 - Parcial):**
    * Definir a área principal onde os quadros e seus conteúdos serão exibidos.
    * Implementar a barra de scroll restrita à área de trabalho com ajuste dinâmico inicial (vertical/horizontal) (RF03.4).
    * Configurar a rolagem horizontal como padrão para a área de trabalho, permitindo que blocos cresçam horizontalmente e o espaço inicial seja adaptável à tela do cliente (mínimo: tamanho total da tela) (parte de RF03.4).

5.  **Sistema de Salvamento Inicial (RF06 - Parcial):**
    * Implementar o salvamento básico de dados dos quadros em formato JSON localmente (localStorage). Foco em salvar a estrutura dos quadros criados (RF06.1 - Parcial, salvando todos os dados em um único JSON por enquanto ou estrutura para múltiplos arquivos).
    * Implementar a validação básica do JSON ao carregar (RF06.2 - Parcial).

6.  **Interface Responsiva Inicial (RNF08 - Parcial):**
    * Aplicar TailwindCSS para garantir que a estrutura básica (cabeçalho, barra lateral, área de trabalho) seja responsiva desde o início (RNF08.1).

## Fase 2: Gerenciamento de Quadros, Pastas e Blocos

**Objetivo:** Implementar funcionalidades completas para criação, organização e manipulação de quadros, pastas e blocos, que são os contêineres principais de conteúdo.

## Fase 3: Implementação de Cartões Simples e Planilhas (Funcionalidades Essenciais)

**Objetivo:** Desenvolver cartões simples e planilhas com funcionalidades básicas de criação, edição e organização, incluindo suporte a Markdown e modals de edição avançada com funcionalidades estilo Excel.

### PRÓXIMAS TAREFAS PRIORITÁRIAS:

1. **Completar Checklist no Modal Principal**
2. **Aplicar funcionalidades ao Modal de Planilhas**
3. **Implementar comentários com Markdown**
4. **Finalizar reordenação via arrastar e soltar**
5. **Testes e refinamentos**

### CRONOGRAMA ESTIMADO:
- **Fase 3 Parte 2**: 90% concluída
- **Restante da Fase 3**: 1-2 sessões de trabalho
- **Início Fase 4**: Próxima semana

### FEEDBACK DO USUÁRIO IMPLEMENTADO:
✅ Modal dinâmico sem rolagem interna
✅ Popups ultrapassam limites do modal
✅ Capa no cabeçalho e cartões
✅ Sino no cabeçalho principal
✅ Barra lateral integrada
✅ Localização do cartão clicável
✅ Checklist popup reformulado

O projeto está progredindo muito bem! Estamos na reta final da Fase 3 com a maioria das funcionalidades principais já implementadas.
