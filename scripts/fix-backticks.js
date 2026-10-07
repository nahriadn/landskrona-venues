const fs = require('fs');

let login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
login = login.replace(/cookiesList\.set\('user_name',.*/, "cookiesList.set('user_name', data.first_name + ' ' + data.last_name, { path: '/' });");
fs.writeFileSync('src/app/login/page.tsx', login);

let register = fs.readFileSync('src/app/register/page.tsx', 'utf8');
register = register.replace(/cookiesList\.set\('user_name',.*/, "cookiesList.set('user_name', firstName + ' ' + lastName, { path: '/' });");
fs.writeFileSync('src/app/register/page.tsx', register);
