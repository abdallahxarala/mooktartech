const fs = require('fs').promises;
const path = require('path');

/**
 * Génère du contenu optimisé pour chaque réseau social
 */
async function generateSocialMediaContent() {
  console.log('📱 [SOCIAL] Génération contenu réseaux sociaux...');
  
  const productsPath = path.join(process.cwd(), 'data', 'extracted-products.json');
  const productsJSON = await fs.readFile(productsPath, 'utf-8');
  const products = JSON.parse(productsJSON);
  
  const socialContent = {};
  
  for (const product of products) {
    socialContent[product.id] = {
      // FACEBOOK
      facebook: {
        post: generateFacebookPost(product),
        imageSpecs: '1200x630px',
        hashtags: generateHashtags(product, 5)
      },
      
      // INSTAGRAM
      instagram: {
        caption: generateInstagramCaption(product),
        imageSpecs: '1080x1080px',
        hashtags: generateHashtags(product, 30),
        story: generateInstagramStory(product)
      },
      
      // TWITTER/X
      twitter: {
        tweet: generateTwitterPost(product),
        imageSpecs: '1200x675px',
        hashtags: generateHashtags(product, 3)
      },
      
      // LINKEDIN
      linkedin: {
        post: generateLinkedInPost(product),
        imageSpecs: '1200x627px',
        hashtags: generateHashtags(product, 3)
      },
      
      // WHATSAPP BUSINESS
      whatsapp: {
        message: generateWhatsAppMessage(product),
        catalogEntry: {
          title: product.name,
          description: product.shortDescription,
          price: product.price,
          currency: 'XOF',
          url: `https://xaralasolutions.com/fr/products/${product.id}`
        }
      }
    };
  }
  
  // Sauvegarder
  const outputPath = path.join(process.cwd(), 'data', 'social-media-content.json');
  await fs.writeFile(outputPath, JSON.stringify(socialContent, null, 2), 'utf-8');
  
  console.log('✅ [SOCIAL] Contenu généré pour', products.length, 'produits');
  console.log('📁 [SOCIAL] Fichier:', outputPath);
  
  return socialContent;
}

function generateFacebookPost(product) {
  return `🎉 NOUVEAU CHEZ XARALA SOLUTIONS ! 🎉

${product.name} - ${product.brand}

${product.shortDescription}

💡 CARACTÉRISTIQUES PRINCIPALES:
${product.features.slice(0, 5).map(f => `✅ ${f}`).join('\n')}

💰 PRIX: ${product.price.toLocaleString()} ${product.priceUnit}
📦 EN STOCK: ${product.stock} unité(s)

🔗 Plus d'infos: https://xaralasolutions.com/fr/products/${product.id}

📞 Contactez-nous:
- WhatsApp: +221 77 539 81 39
- Tel: +221 33 823 23 26
- Email: contact@xaralasolutions.com

#XaralaSolutions #Dakar #Senegal`;
}

function generateInstagramCaption(product) {
  return `✨ ${product.name.toUpperCase()} ✨

${product.shortDescription}

🎯 POURQUOI LE CHOISIR ?
${product.features.slice(0, 4).map((f, i) => `${i + 1}. ${f}`).join('\n')}

💰 ${product.price.toLocaleString()} ${product.priceUnit}
📍 Dakar, Sénégal
🚚 Livraison 24-48h

👉 Lien dans la bio ou DM pour plus d'infos !

#XaralaSolutions`;
}

function generateInstagramStory(product) {
  return {
    slide1: {
      type: 'product-image',
      text: `NOUVEAU !\n${product.name}`,
      cta: 'Swipe Up ↑'
    },
    slide2: {
      type: 'features',
      title: 'Caractéristiques',
      features: product.features.slice(0, 3)
    },
    slide3: {
      type: 'price',
      price: product.price,
      currency: product.priceUnit,
      cta: 'DM pour commander'
    }
  };
}

function generateTwitterPost(product) {
  return `🚀 ${product.name}

${product.shortDescription}

💎 Top features:
${product.features.slice(0, 3).map(f => `• ${f}`).join('\n')}

💰 ${product.price.toLocaleString()} FCFA
📦 En stock à Dakar

🔗 https://xaralasolutions.com/fr/products/${product.id}`;
}

function generateLinkedInPost(product) {
  return `🎯 Optimisez votre émission de cartes d'identification avec ${product.name}

${product.description}

📊 CARACTÉRISTIQUES TECHNIQUES:
${product.features.slice(0, 6).map(f => `▪️ ${f}`).join('\n')}

🏢 APPLICATIONS:
${product.applications.slice(0, 4).map(a => `• ${a}`).join('\n')}

💼 Solution professionnelle adaptée aux entreprises, administrations et établissements d'enseignement au Sénégal.

📞 Demandez une démonstration: +221 77 539 81 39

#BtoB #Solutions #Identification #Dakar #Sénégal`;
}

function generateWhatsAppMessage(product) {
  return `👋 Bonjour !

Je vous présente *${product.name}* de ${product.brand}

${product.shortDescription}

*Caractéristiques principales:*
${product.features.slice(0, 5).map(f => `✅ ${f}`).join('\n')}

*Prix:* ${product.price.toLocaleString()} ${product.priceUnit}
*Stock disponible:* ${product.stock} unité(s)

📦 *Livraison rapide 24-48h à Dakar*

Pour plus d'informations ou pour passer commande:
🔗 https://xaralasolutions.com/fr/products/${product.id}

Ou répondez directement à ce message ! 😊`;
}

function generateHashtags(product, maxCount) {
  const allHashtags = [
    ...product.tags.map(t => `#${t.replace(/\s+/g, '')}`),
    '#Senegal',
    '#Dakar',
    '#XaralaSolutions',
    '#Imprimante',
    '#Badges',
    '#CartesIdentite',
    '#Solutions',
    '#Technologie',
    '#Business',
    '#Entreprise',
    '#Professionnel',
    `#${product.brand}`,
    `#${product.category}`
  ];
  
  // Dédupliquer et limiter
  const uniqueHashtags = [...new Set(allHashtags)];
  return uniqueHashtags.slice(0, maxCount).join(' ');
}

// Exécuter
generateSocialMediaContent().then(() => {
  console.log('✅ [SOCIAL] Génération terminée !');
});
