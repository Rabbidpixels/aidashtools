'use server'

// Completely isolated test - no imports at all
export async function simpleTest() {
  return { success: true, message: 'Simple test works!', timestamp: Date.now() }
}
