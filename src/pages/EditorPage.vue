<template>
  <q-page class="editor-page">
    <!-- Barra de topo -->
    <div class="editor-topbar row items-center justify-between q-px-lg q-py-sm">
      <div class="row items-center q-gutter-sm">
        <q-btn flat round dense icon="arrow_back" color="primary" to="/practice" />
        <div>
          <div class="text-h6 text-weight-bold text-primary">Editor SQL Interativo</div>
          <div class="text-caption text-grey-6">SQLite rodando em WebAssembly · direto no navegador</div>
        </div>
      </div>

      <div class="row q-gutter-sm items-center">
        <q-chip v-if="store.isReady" color="positive" text-color="white" icon="check_circle" label="Banco Conectado" dense />
        <q-chip v-else color="grey-5" text-color="white" icon="hourglass_empty" label="Carregando..." dense />

        <q-btn outline color="warning" icon="refresh" label="Resetar Banco" dense @click="confirmReset" />
        <q-btn outline color="secondary" icon="download" label=".sqlite" dense @click="downloadDatabase" />
      </div>
    </div>

    <q-separator />

    <!-- Layout principal: Editor | Resultados -->
    <div class="row full-height" style="min-height: 0;">

      <!-- Painel Esquerdo: Monaco Editor -->
      <div class="col column no-wrap full-height">
        <!-- Toolbar do editor -->
        <div class="editor-toolbar row items-center justify-between q-px-md q-py-xs bg-grey-9">
          <div class="row items-center q-gutter-sm text-white">
            <q-icon name="code" size="xs" />
            <span class="text-caption text-weight-bold">SQL Editor</span>
            <q-badge color="teal" label="SQLite" />
          </div>
            <div class="row items-center q-gutter-xs text-grey-5 text-caption">
              <q-icon name="keyboard" size="xs" />
              <span>Ctrl + Enter para executar</span>
          </div>
        </div>

        <!-- Monaco Editor -->
        <div class="editor-monaco-wrapper">
          <vue-monaco-editor
            v-if="monacoReady"
            v-model:value="code"
            theme="vs-dark"
            language="sql"
            :options="editorOptions"
            style="width: 100%; height: 100%"
            @mount="handleEditorMount"
          />
        </div>

        <!-- Botões de ação -->
        <div class="editor-actions row items-center justify-between q-px-md q-py-sm bg-grey-2">
          <q-btn flat dense color="grey-7" icon="clear_all" label="Limpar" @click="clearEditor" />
          <q-btn
            color="primary"
            icon="play_arrow"
            label="Executar SQL"
            :loading="false"
            :disable="!store.isReady"
            class="q-px-lg"
            @click="runQuery"
          />
        </div>
      </div>

      <!-- Divider vertical -->
      <q-separator vertical />

      <!-- Painel Direito: Resultados -->
      <div class="col-4 column no-wrap full-height">
        <!-- Tabs -->
        <q-tabs
          v-model="tab"
          dense
          active-color="primary"
          indicator-color="primary"
          class="text-grey-7 bg-grey-1"
          align="justify"
        >
          <q-tab name="results" icon="table_chart" label="Resultados" />
          <q-tab name="schema" icon="account_tree" label="Tabelas" />
          <q-tab name="history" icon="history" label="Histórico" />
        </q-tabs>

        <q-separator />

        <!-- Conteúdo das tabs -->
        <div class="editor-results-content flex-grow">
          <q-tab-panels v-model="tab" class="full-height flex-grow" style="background: transparent; overflow: hidden">

            <!-- ABA: RESULTADOS -->
            <q-tab-panel name="results" class="q-pa-none column full-height" style="overflow: hidden">
              <!-- Erro -->
              <div v-if="store.lastError" class="q-pa-md">
                <q-banner rounded class="bg-red-1 text-negative">
                  <template #avatar>
                    <q-icon name="error_outline" color="negative" />
                  </template>
                  <div class="text-weight-bold text-caption q-mb-xs">Erro SQL:</div>
                  <div class="font-mono text-caption">{{ store.lastError }}</div>
                </q-banner>
              </div>

              <!-- Tabela de resultados -->
              <div v-else-if="store.lastResult && formattedRows.length > 0" class="flex-grow overflow-auto">
                <q-table
                  :rows="formattedRows"
                  :columns="formattedColumns"
                  row-key="_idx"
                  flat
                  dense
                  square
                  :pagination="{ rowsPerPage: 15 }"
                  class="font-mono results-table"
                />
              </div>

              <!-- Comando executado sem retorno de dados -->
              <div
                v-else-if="store.lastResult && formattedRows.length === 0 && !store.lastError"
                class="flex-grow flex flex-center text-center q-pa-md"
              >
                <div>
                  <q-icon name="check_circle_outline" size="3em" color="positive" />
                  <div class="text-subtitle2 text-grey-7 q-mt-sm">Comando executado com sucesso!</div>
                  <div class="text-caption text-grey-5">Nenhuma linha retornada (INSERT / UPDATE / DELETE / CREATE).</div>
                </div>
              </div>

              <!-- Estado inicial (nada executado ainda) -->
              <div v-else class="flex-grow flex flex-center text-center q-pa-md">
                <div>
                  <q-icon name="play_circle_outline" size="4em" color="grey-4" />
                  <div class="text-subtitle2 text-grey-6 q-mt-md">Aguardando execução</div>
                  <p class="text-caption text-grey-5">
                    Escreva uma query e clique em <strong>Executar SQL</strong> ou use <strong>Ctrl + Enter</strong>.
                  </p>
                </div>
              </div>

              <!-- Rodapé com contagem -->
              <div v-if="store.lastResult && !store.lastError" class="results-footer row justify-between items-center q-px-md q-py-xs bg-grey-1 text-caption text-grey-6">
                <span>Última execução concluída</span>
                <span><strong>{{ formattedRows.length }}</strong> linha(s) retornada(s)</span>
              </div>
            </q-tab-panel>

            <!-- ABA: ESQUEMA -->
            <q-tab-panel name="schema" class="q-pa-md">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-md">Tabelas no Banco de Dados</div>

              <q-list bordered separator rounded>
                <q-expansion-item
                  v-for="table in schemaTables"
                  :key="table.name"
                  :icon="table.icon"
                  :label="table.label"
                  group="schema"
                  header-class="text-weight-bold"
                  expand-separator
                >
                  <q-card flat>
                    <q-card-section class="q-pa-sm">
                      <table class="schema-table full-width text-caption font-mono">
                        <thead>
                          <tr class="bg-grey-2">
                            <th>Coluna</th>
                            <th>Tipo</th>
                            <th>Observação</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="col in table.columns" :key="col.name">
                            <td>{{ col.name }}</td>
                            <td class="text-secondary">{{ col.type }}</td>
                            <td class="text-grey-6">{{ col.note }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </q-card-section>

                    <q-card-actions class="q-px-sm">
                      <q-btn flat dense size="sm" color="primary" :label="`SELECT * FROM ${table.name};`" @click="useSnippet(`SELECT * FROM ${table.name};`)" />
                    </q-card-actions>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-tab-panel>

            <!-- ABA: HISTÓRICO -->
            <q-tab-panel name="history" class="column q-pa-md no-wrap" style="gap: 16px;">
              <div class="row justify-between items-center q-mb-md">
                <div class="text-subtitle2 text-weight-bold text-primary">Histórico de Execuções</div>
                <q-btn flat dense size="sm" color="grey-7" icon="delete_sweep" label="Limpar" @click="store.clearHistory()" />
              </div>

              <div v-if="store.queryHistory.length === 0" class="text-center q-pa-lg text-grey-5">
                <q-icon name="history" size="2em" class="q-mb-sm" />
                <div class="text-caption">Nenhuma query executada ainda.</div>
              </div>

              <q-list v-else bordered separator class="rounded-borders" style="overflow-y: auto">
                <q-item
                  v-for="(h, idx) in store.queryHistory"
                  :key="idx"
                  clickable
                  class="q-py-sm"
                  @click="useSnippet(h.query)"
                >
                  <q-item-section avatar>
                    <q-icon
                      :name="h.hadError ? 'cancel' : 'check_circle'"
                      :color="h.hadError ? 'negative' : 'positive'"
                      size="sm"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="font-mono text-caption text-grey-9 ellipsis">
                      {{ h.query }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-5">{{ formatTime(h.executedAt) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn flat round dense icon="edit_note" color="grey-5" size="xs" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { useDatabaseStore } from 'src/stores/database-store'

const $q = useQuasar()
const store = useDatabaseStore()

const code = ref('-- Bem-vindo ao SQLearn!\n-- Escreva uma consulta SQL abaixo e pressione Ctrl+Enter ou clique em Executar.\n\nSELECT * FROM products;')
const tab = ref('results')
const editorRef = ref(null)
const monacoReady = ref(false)

const editorOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
  wordWrap: 'on',
  lineNumbers: 'on',
  renderLineHighlight: 'line',
  scrollBeyondLastLine: false,
  padding: { top: 12, bottom: 12 },
}

onMounted(async () => {
  // Inicializa o banco em loading
  if (!store.isReady) {
    $q.loading.show({ message: 'Carregando SQLite WebAssembly...' })
    await store.initialize()
    $q.loading.hide()
  }
  // Aguarda o next tick para garantir que o container está no DOM
  await nextTick()
  monacoReady.value = true
})

onUnmounted(() => {
  // Remove o listener de resize do Monaco ao sair da página
  if (editorRef.value && editorRef.value._cleanup) {
    window.removeEventListener('resize', editorRef.value._cleanup)
  }
})

// Formata colunas e linhas para o q-table
const formattedColumns = computed(() => {
  if (!store.lastResult) return []
  return store.lastResult.columns.map((col) => ({
    name: col,
    label: col.toUpperCase(),
    field: col,
    align: 'left',
    sortable: true,
    style: 'max-width: 200px; overflow: hidden; text-overflow: ellipsis',
  }))
})

const formattedRows = computed(() => {
  if (!store.lastResult || !store.lastResult.rows) return []
  const { columns, rows } = store.lastResult
  return rows.map((row, rowIdx) => {
    const obj = { _idx: rowIdx }
    columns.forEach((col, i) => { obj[col] = row[i] })
    return obj
  })
})

// Informações do schema para a aba "Tabelas"
const schemaTables = [
  {
    name: 'products',
    label: 'products — Produtos',
    icon: 'shopping_bag',
    columns: [
      { name: 'id', type: 'INTEGER PRIMARY KEY', note: 'Auto-incrementado' },
      { name: 'name', type: 'TEXT', note: 'Nome do produto' },
      { name: 'category', type: 'TEXT', note: 'Categoria' },
      { name: 'price', type: 'REAL', note: 'Preço unitário' },
      { name: 'stock', type: 'INTEGER', note: 'Quantidade em estoque' },
    ],
  },
  {
    name: 'orders',
    label: 'orders — Pedidos',
    icon: 'receipt_long',
    columns: [
      { name: 'id', type: 'INTEGER PRIMARY KEY', note: 'Auto-incrementado' },
      { name: 'product_id', type: 'INTEGER', note: 'FK → products.id' },
      { name: 'quantity', type: 'INTEGER', note: 'Quantidade comprada' },
      { name: 'total', type: 'REAL', note: 'Valor total' },
      { name: 'ordered_at', type: 'DATETIME', note: 'Data do pedido' },
    ],
  },
]

function handleEditorMount(editor, monaco) {
  editorRef.value = editor

  // Atalho Ctrl + Enter para executar a query
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
    () => runQuery()
  )

  // Força relayout ao redimensionar janela ou mudar zoom do browser
  // automaticLayout usa ResizeObserver que não dispara em mudança de zoom
  const onResize = () => editor.layout()
  window.addEventListener('resize', onResize)

  // Guarda a função de cleanup para remover no onUnmounted
  editorRef.value._cleanup = onResize
}

function runQuery() {
  if (!code.value.trim() || !store.isReady) return
  store.executeQuery(code.value)
  tab.value = 'results'
}

function clearEditor() {
  code.value = ''
}

function useSnippet(sql) {
  code.value = sql
  tab.value = 'results'
}

function confirmReset() {
  $q.dialog({
    title: 'Resetar Banco de Dados',
    message: 'Isso irá apagar todas as alterações e recriar as tabelas padrão. Deseja continuar?',
    cancel: { flat: true, label: 'Cancelar' },
    ok: { color: 'warning', label: 'Resetar' },
    persistent: true,
  }).onOk(async () => {
    $q.loading.show({ message: 'Redefinindo banco...' })
    await store.resetDatabase()
    $q.loading.hide()
    $q.notify({ type: 'positive', message: 'Banco redefinido com sucesso!' })
  })
}

function downloadDatabase() {
  const blob = store.exportDatabase()
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sqlearn.sqlite'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  $q.notify({ type: 'positive', message: 'Banco exportado como sqlearn.sqlite' })
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString()
}
</script>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px); /* desconta o q-header se existir */
  overflow: hidden;
}

.editor-topbar {
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  min-height: 56px;
}

.editor-main {
  flex: 1;
  min-height: 0; /* permite que filhos flex encolham abaixo do tamanho do conteúdo */
  overflow: hidden;
  display: flex;
}

.editor-left-panel {
  height: 100%;
  flex: 1;
}

.editor-toolbar {
  flex-shrink: 0;
  min-height: 36px;
}

.editor-monaco-wrapper {
  flex: 1;         /* ocupa o espaço restante disponível no flex pai */
  min-height: 0;   /* quebra o loop: sem isso, height: 100% cria dependência circular */
  overflow: hidden;
  background: #1e1e1e;
}

.editor-actions {
  flex-shrink: 0;
  border-top: 1px solid #ddd;
}

.editor-right-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fafafa;
}

.editor-results-content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.results-footer {
  flex-shrink: 0;
  border-top: 1px solid #e0e0e0;
}

.results-table {
  font-size: 12px;
}

.font-mono {
  font-family: 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
}

.schema-table {
  border-collapse: collapse;
  width: 100%;
}

.schema-table th,
.schema-table td {
  text-align: left;
  padding: 5px 8px;
  border: 1px solid #e0e0e0;
}

.schema-table th {
  font-weight: 600;
}
</style>
