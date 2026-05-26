import { ref } from 'vue';

export function useApi() {
  const isLoading = ref(false);
  const error = ref(null);

  async function execute(apiFn, ...args) {
    isLoading.value = true;
    error.value = null;
    try {
      return await apiFn(...args);
    } catch (e) {
      error.value = e.response?.data?.message || e.response?.data?.errors?.[0]?.message || e.message || 'Terjadi kesalahan yang tidak diketahui';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError() { error.value = null; }

  return { isLoading, error, execute, clearError };
}