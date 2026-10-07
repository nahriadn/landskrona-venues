"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var i18n_1 = require("./src/lib/i18n");
console.log('EN from dict:', i18n_1.translations.en['admin.tab_bookings']);
var t = (0, i18n_1.getTranslation)('en');
console.log('t(en):', t('admin.tab_bookings'));
