import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
    e2e: {
        baseUrl: 'http://vite_preview:4173',
        setupNodeEvents(on, config) {
            on('file:preprocessor', vitePreprocessor(config))
        },
        video: true,
        screenshotOnRunFailure: true,
    },
})