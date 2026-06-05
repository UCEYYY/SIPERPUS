// frontend/src/test/setup.js
// File setup: import hal yang dibutuhkan semua test
import { config } from '@vue/test-utils'

// Suppress Vue warnings selama testing (opsional)
config.global.config.warnHandler = () => {}
