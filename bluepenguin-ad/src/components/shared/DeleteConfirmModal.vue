<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title?: string;
  itemName?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:isOpen', value: boolean): void;
}>();

const confirmationText = ref('');
const EXPECTED_TEXT = 'delete';

const canConfirm = computed(() => {
  return confirmationText.value.trim().toLowerCase() === EXPECTED_TEXT;
});

const handleCancel = () => {
  confirmationText.value = '';
  emit('cancel');
  emit('update:isOpen', false);
};

const handleConfirm = () => {
  if (canConfirm.value) {
    emit('confirm');
    confirmationText.value = '';
    emit('update:isOpen', false);
  }
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content card">
      <div class="modal-header">
        <h3>{{ title || 'Confirm Deletion' }}</h3>
        <button class="btn-icon close-btn" @click="handleCancel">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>
      
      <div class="modal-body mt-4">
        <div class="warning-alert p-3 mb-4 rounded flex align-start gap-3">
          <span class="material-icons-outlined text-danger">warning</span>
          <div>
            <strong>Unexpected bad things will happen if you don't read this!</strong>
            <p class="m-0 mt-1 text-sm">This action cannot be undone. This will permanently delete the <strong>{{ itemName || 'item' }}</strong> and remove all associated data.</p>
          </div>
        </div>
        
        <p class="mb-2 text-sm text-main">
          Please type <strong>{{ EXPECTED_TEXT }}</strong> to confirm.
        </p>
        
        <input 
          type="text" 
          v-model="confirmationText" 
          class="form-input w-full" 
          :placeholder="EXPECTED_TEXT"
          @keyup.enter="handleConfirm"
        />
      </div>
      
      <div class="modal-footer mt-6 flex justify-end gap-3">
        <button class="btn btn-outline" @click="handleCancel">Cancel</button>
        <button 
          class="btn btn-danger" 
          :disabled="!canConfirm"
          @click="handleConfirm"
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: var(--radius-md, 8px);
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main, #111827);
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-muted, #6b7280);
}

.warning-alert {
  background-color: #fff1f2;
  border: 1px solid #fecdd3;
  color: #be123c;
}

.text-danger {
  color: #e11d48;
}

.m-0 { margin: 0; }
.mt-1 { margin-top: 4px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 16px; }
.mt-6 { margin-top: 24px; }
.p-3 { padding: 12px; }
.rounded { border-radius: var(--radius-sm, 6px); }
.flex { display: flex; }
.align-start { align-items: flex-start; }
.gap-3 { gap: 12px; }
.justify-end { justify-content: flex-end; }
.w-full { width: 100%; box-sizing: border-box; }

.text-sm { font-size: 14px; }
.text-main { color: var(--text-main, #111827); }

.form-input {
  border: 1px solid var(--border-color, #d1d5db);
  padding: 10px 12px;
  border-radius: var(--radius-sm, 6px);
  font-size: 14px;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary-color, #2563eb);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm, 6px);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--border-color, #d1d5db);
  color: var(--text-main, #374151);
}

.btn-outline:hover {
  background-color: #f3f4f6;
}

.btn-danger {
  background-color: var(--danger-color, #dc2626);
  border: 1px solid var(--danger-color, #dc2626);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

.btn-danger:disabled {
  background-color: #fca5a5;
  border-color: #fca5a5;
  cursor: not-allowed;
}
</style>
