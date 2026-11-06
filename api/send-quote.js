// Route API Serverless pour l'envoi de devis via Resend
// Compatible Vercel, Netlify Functions et Node.js

function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Accepte uniquement les requêtes POST
  if (!req || req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Format JSON invalide dans le corps de la requête.' });
      }
    }

    const { name, phone, city, email, formula, preferredDate, timeOfDay, notes } = body || {};

    const cleanName = (typeof name === 'string' ? name.trim() : '');
    const cleanPhone = (typeof phone === 'string' ? phone.trim() : '');
    const cleanCity = (typeof city === 'string' ? city.trim() : '');
    const cleanEmail = (typeof email === 'string' ? email.trim() : '');
    const cleanFormula = (typeof formula === 'string' ? formula.trim() : 'Non spécifiée');
    const cleanNotes = (typeof notes === 'string' ? notes.trim() : '');

    // Validation des champs indispensables
    if (!cleanName || !cleanPhone || !cleanCity) {
      return res.status(400).json({ error: 'Nom, téléphone et commune sont obligatoires.' });
    }

    const apiKey = process.env.RESEND_API_KEY;

    // Formatage défensif de la date d'intervention
    let dateFormatted = 'Non précisée';
    if (preferredDate && typeof preferredDate === 'string') {
      try {
        const parts = preferredDate.split('-');
        if (parts.length === 3) {
          dateFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else {
          dateFormatted = preferredDate;
        }
      } catch {
        dateFormatted = preferredDate;
      }
    }

    const slotLabel = (typeof timeOfDay === 'string' && timeOfDay.length > 0)
      ? timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
      : 'Matin';

    // Si la clé API n'est pas encore renseignée (ex. environnement de test local)
    if (!apiKey) {
      console.warn('[NEQQUA API] RESEND_API_KEY non configurée. Simulation de réception :');
      console.log({ cleanName, cleanPhone, cleanCity, cleanEmail, cleanFormula, dateFormatted, slotLabel, cleanNotes });
      return res.status(200).json({
        success: true,
        simulated: true,
        message: 'Demande reçue en mode simulation (clé RESEND_API_KEY non renseignée).',
      });
    }

    // Protection anti-XSS intégrale sur les champs injectés dans l'e-mail HTML
    const safeName = escapeHtml(cleanName);
    const safePhone = escapeHtml(cleanPhone);
    const safeCity = escapeHtml(cleanCity);
    const safeEmail = escapeHtml(cleanEmail);
    const safeFormula = escapeHtml(cleanFormula);
    const safeDate = escapeHtml(dateFormatted);
    const safeSlot = escapeHtml(slotLabel);
    const safeNotes = cleanNotes ? escapeHtml(cleanNotes).replace(/\n/g, '<br>') : '<em>Aucune précision complémentaire fournie.</em>';

    // Construction de l'e-mail au format HTML propre et professionnel
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); }
          .header { background: #080C14; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: 0.05em; color: #ffffff; }
          .header p { margin: 0; font-size: 13px; color: #0284c7; text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em; }
          .content { padding: 28px 24px; }
          .badge-urgent { display: inline-block; background: #dbeafe; color: #0369a1; padding: 6px 14px; border-radius: 999px; font-weight: 700; font-size: 12px; text-transform: uppercase; margin-bottom: 20px; }
          .table-info { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .table-info td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .table-info td.label { font-weight: 700; color: #64748b; width: 38%; }
          .table-info td.value { font-weight: 600; color: #0f172a; }
          .phone-link { color: #0284c7; font-weight: 800; text-decoration: none; font-size: 16px; }
          .notes-box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 4px; font-size: 14px; color: #334155; line-height: 1.5; margin-bottom: 20px; }
          .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>NEQQUA NETTOYAGE</h1>
            <p>Nouvelle Demande de Devis en Ligne</p>
          </div>
          <div class="content">
            <span class="badge-urgent">⏱️ Réponse garantie sous 2h</span>
            
            <table class="table-info">
              <tr>
                <td class="label">👤 Nom du client :</td>
                <td class="value">${safeName}</td>
              </tr>
              <tr>
                <td class="label">📞 Téléphone :</td>
                <td class="value"><a href="tel:${safePhone}" class="phone-link">${safePhone}</a></td>
              </tr>
              <tr>
                <td class="label">📍 Commune en Essonne :</td>
                <td class="value"><strong>${safeCity}</strong></td>
              </tr>
              <tr>
                <td class="label">✉️ Adresse e-mail :</td>
                <td class="value">${safeEmail ? `<a href="mailto:${safeEmail}">${safeEmail}</a>` : 'Non renseignée'}</td>
              </tr>
              <tr>
                <td class="label">🏷️ Formule choisie :</td>
                <td class="value"><strong>${safeFormula}</strong></td>
              </tr>
              <tr>
                <td class="label">📅 Date souhaitée :</td>
                <td class="value"><strong>${safeDate}</strong> (${safeSlot})</td>
              </tr>
            </table>

            <h3 style="font-size: 14px; color: #0f172a; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Détail de la demande :</h3>
            <div class="notes-box">
              ${safeNotes}
            </div>
          </div>
          <div class="footer">
            Cet e-mail a été généré automatiquement depuis le site web de NEQQUA NETTOYAGE.
          </div>
        </div>
      </body>
      </html>
    `;

    // Appel sécurisé à l'API Resend avec timeout et parsing JSON défensif
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NEQQUA Devis <onboarding@resend.dev>',
        to: ['contact.neqqua@gmail.com'],
        reply_to: cleanEmail || undefined,
        subject: `🔔 Devis NEQQUA : ${safeName} — ${safeCity} (${safeDate})`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error('[Resend Error]', resendData);
      return res.status(resendResponse.status || 500).json({
        error: resendData?.message || 'Erreur lors de la transmission par Resend.',
      });
    }

    return res.status(200).json({ success: true, id: resendData?.id || null });
  } catch (err) {
    console.error('[Server Error]', err);
    return res.status(500).json({ error: err?.message || 'Erreur interne du serveur.' });
  }
}
