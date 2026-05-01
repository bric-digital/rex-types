#!/usr/bin/env node

/**
 * Build script to bundle webmunk-history modules for browser testing
 * Uses esbuild to create browser-compatible bundles
 */

import * as esbuild from 'esbuild'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const srcDir = join(__dirname, '../src')
const outputDir = join(__dirname, '../build')

// Ensure output directory exists
await mkdir(outputDir, { recursive: true })

const modules = [
  {
    name: 'service-worker',
    input: join(srcDir, 'service-worker.ts'),
    output: join(outputDir, '../extension/js/serviceWorker/bundle.js')
  }, {
    name: 'extension',
    input: join(srcDir, 'extension.ts'),
    output: join(outputDir, '../extension/js/extension/bundle.js')
  }, {
    name: 'browser',
    input: join(srcDir, 'browser.ts'),
    output: join(outputDir, '../extension/js/browser/bundle.js')
  }
]

try {
  for (const module of modules) {
    await esbuild.build({
      entryPoints: [module.input],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2021',
      outfile: module.output,
      sourcemap: true,
      // Bundle all dependencies - chrome APIs will be provided by test environment
      resolveExtensions: ['.mts', '.ts', '.js', '.mjs'],
      mainFields: ['module', 'main'],
      conditions: ['import', 'module', 'default'],
      // Define globals
      define: {
        'chrome': 'globalThis.chrome'
      },
      loader: {
        '.woff': 'file',
        '.woff2': 'file',
        '.ttf': 'file',
        '.eot': 'file',
        '.svg': 'file',
      }
    })

    console.log(`✅ ${module.name} bundle created: ${module.output}`)
  }

  console.log('\n✅ All bundles created successfully')
  console.log('   You can now run: npm test')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
