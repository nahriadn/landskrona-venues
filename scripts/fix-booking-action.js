const fs = require('fs');

let content = fs.readFileSync('src/components/BookingWidget.tsx', 'utf8');

// Replace the action and add error handling
content = content.replace(
  `action: 'book',
          venueId,`,
  `action: 'confirm',
          venueId,`
);

content = content.replace(
  `if (res.ok) {
        setSuccessMessage(\`\${t("widget.success" as any)} \${selectedSlot}!\`);
        setStep(4); // Success step
      }
    } catch (err) {`,
  `if (res.ok) {
        setSuccessMessage(\`\${t("widget.success" as any)} \${selectedSlot}!\`);
        setStep(4); // Success step
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to book');
      }
    } catch (err: any) {
      setCustomAlert(err.message || (lang === 'en' ? 'Booking failed.' : 'Bokningen misslyckades.'));`
);

fs.writeFileSync('src/components/BookingWidget.tsx', content);
