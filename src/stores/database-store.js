import { defineStore, acceptHMRUpdate } from 'pinia'
import schemaSQL from 'src/database/schema.sql?raw'
// ?url diz ao Vite para resolver o caminho correto do arquivo WASM
// independente de hash de build, base path ou ambiente (dev/prod)
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

const STORAGE_KEY = 'sqlearn-db'

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    isReady: false,
    isLoading: false,
    lastResult: null,   // { columns: [], rows: [] }
    lastError: null,
    queryHistory: [],   // array de { query, result, hadError, executedAt }
    // O banco de dados bruto sql.js não deve ficar na reatividade profunda para evitar proxy overhead
    dbInstance: null
  }),

  actions: {
    async initialize() {
      if (this.isReady) return
      this.isLoading = true

      try {
        // Importa sql.js dinamicamente para não bloquear o carregamento inicial da app.
        // O fallback cobre diferenças de CJS interop dependendo do modo do Vite (dev/build).
        const sqlMod = await import('sql.js')
        const initSqlJs = sqlMod.default ?? sqlMod

        const SQL = await initSqlJs({
          // Vite resolve o caminho correto via import ?url acima
          locateFile: (file) => file.endsWith('.wasm') ? sqlWasmUrl : file,
        })

        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          // Restaura banco existente do localStorage
          const binary = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0))
          this.dbInstance = new SQL.Database(binary)
        } else {
          // Cria banco novo e aplica o schema completo
          this.dbInstance = new SQL.Database()
          this.dbInstance.run(schemaSQL)
          this.persist()
        }

        this.isReady = true
      } catch (err) {
        console.error('[DatabaseStore] Falha ao inicializar sql.js:', err)
        this.lastError = err.message
      } finally {
        this.isLoading = false
      }
    },

    executeQuery(sql) {
      if (!this.dbInstance) {
        this.lastError = 'Banco de dados não inicializado.'
        return
      }

      this.lastError = null
      this.lastResult = null

      const entry = {
        query: sql.trim(),
        result: null,
        hadError: false,
        executedAt: new Date().toISOString(),
      }

      try {
        const results = this.dbInstance.exec(sql)

        if (results.length > 0) {
          const { columns, values } = results[results.length - 1]
          this.lastResult = {
            columns,
            rows: values,
          }
          entry.result = this.lastResult
        } else {
          // INSERT / UPDATE / DELETE / CREATE — sem retorno de linhas
          this.lastResult = {
            columns: ['Resultado'],
            rows: [['Comando executado com sucesso.']],
          }
          entry.result = this.lastResult
        }

        // Persiste após escritas (INSERT, UPDATE, DELETE, CREATE)
        const isDML = /^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(sql)
        if (isDML) this.persist()
      } catch (err) {
        this.lastError = err.message
        entry.hadError = true
      }

      this.queryHistory.unshift(entry)
      return { result: this.lastResult, error: this.lastError }
    },

    persist() {
      if (!this.dbInstance) return
      try {
        const data = this.dbInstance.export()
        const base64 = btoa(String.fromCharCode(...data))
        localStorage.setItem(STORAGE_KEY, base64)
      } catch (err) {
        console.error('[DatabaseStore] Falha ao persistir:', err)
      }
    },

    resetDatabase() {
      localStorage.removeItem(STORAGE_KEY)
      this.isReady = false
      this.dbInstance = null
      this.lastResult = null
      this.lastError = null
      this.queryHistory = []
      return this.initialize()
    },

    exportDatabase() {
      if (!this.dbInstance) return null
      const data = this.dbInstance.export()
      return new Blob([data], { type: 'application/octet-stream' })
    },

    clearHistory() {
      this.queryHistory = []
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDatabaseStore, import.meta.hot))
}
