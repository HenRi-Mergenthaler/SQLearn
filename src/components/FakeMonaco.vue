<template>
  <div class="monaco-morph-card shadow-15">
    <!-- Topbar do mockup do Monaco -->
    <div class="monaco-header row items-center justify-between q-px-md q-py-sm">
      <div class="row items-center q-gutter-xs">
        <span class="header-dot red"></span>
        <span class="header-dot yellow"></span>
        <span class="header-dot green"></span>
        <q-icon name="code" color="grey-4" size="xs" class="q-ml-sm" />
        <span class="text-caption text-grey-4 text-weight-bold font-mono">{{ title }}</span>
      </div>
      <span class="text-caption text-grey-5 font-mono">{{ statusText }}</span>
    </div>

    <!-- Área de Código -->
    <div class="monaco-body q-pa-lg font-mono">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'query.sql'
  },
  statusText: {
    type: String,
    default: 'Executando...'
  }
})
</script>

<style lang="scss">
/* Usamos regras globais limitadas a .monaco-morph-card para que o syntax highlighting funcione nos slots passados de fora */
.monaco-morph-card {
  width: 550px;
  max-width: 90vw;
  background: #1e1e1e;
  border-radius: 16px !important;
  border: 1px solid #333;
  color: #d4d4d4;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.monaco-header {
  background: #252526;
  border-bottom: 1px solid #2d2d2d;
  height: 40px;
  user-select: none;
}

.header-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;

  &.red { background: #ff5f56; }
  &.yellow { background: #ffbd2e; }
  &.green { background: #27c93f; }
}

.monaco-body {
  color: #d4d4d4;
  font-size: 15px;
  min-height: 220px;
}

.code-line {
  line-height: 1.6;
}

.line-number {
  width: 24px;
  display: inline-block;
  user-select: none;
}

/* Syntax Highlighting Tokens */
.token-keyword {
  color: #569cd6;
  font-weight: 500;
}

.token-identifier {
  color: #4fc1ff;
}

.token-column {
  color: #9cdcfe;
}

.token-operator {
  color: #d4d4d4;
}

.token-value {
  color: #b5cea8;
}

.token-string {
  color: #ce9178;
}

/* Cursor Piscando */
.cursor-blink {
  color: #569cd6;
  font-weight: bold;
  animation: blink-cursor 1s step-end infinite;
}

@keyframes blink-cursor {
  from, to { color: transparent; }
  50% { color: #569cd6; }
}

.font-mono {
  font-family: 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
}
</style>
