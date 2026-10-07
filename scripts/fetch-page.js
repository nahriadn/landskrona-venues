fetch('https://landskrona-venues-11a14piwc-nahriadn.vercel.app/admin', {
  headers: { 'Cookie': 'lang=en' }
})
.then(res => res.text())
.then(html => {
  console.log("Has Bookings:", html.includes("Bookings"));
  console.log("Has Bokningar:", html.includes("Bokningar"));
  // Next.js injects page props into a script tag
  const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
  if (match) {
    match.forEach(m => {
      if (m.includes('Bokningar') || m.includes('Bookings')) {
        console.log("FOUND IN SCRIPT TAG:", m.substring(0, 150) + "...");
      }
    });
  }
})
.catch(err => console.error(err));
