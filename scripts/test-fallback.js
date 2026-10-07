"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var i18n_1 = require("../src/lib/i18n");
var t = (0, i18n_1.getTranslation)('en');
console.log('With fallback:', t('admin.tab_bookings', 'Bokningar'));
console.log('Missing key fallback:', t('does_not_exist', 'FallbackVal'));
