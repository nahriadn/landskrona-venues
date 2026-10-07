"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var i18n_1 = require("../src/lib/i18n");
var t = (0, i18n_1.getTranslation)('en');
console.log('EN translations keys:', Object.keys(i18n_1.translations.en).filter(function (k) { return k.startsWith('admin.tab'); }));
console.log('Result of t("admin.tab_bookings"):', t('admin.tab_bookings'));
