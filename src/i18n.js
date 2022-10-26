import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = import.meta.globEager('./locales/*.json')
  const messages = {}
  for (const key in locales) {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        const locale = matched[1]
        messages[locale] = locales[key].default;
      }
    }
  
  return messages
}

export default new VueI18n({
  locale: import.meta.env.VITE_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  //locale: "fr",
})
